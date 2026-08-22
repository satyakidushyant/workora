import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';

/**
 * Enterprise HRMS Smart Container Component for Dashboard page.
 * Modern Workora SaaS executive cockpit rendering real-time workforce metrics,
 * department resource distribution, personnel growth charts, audit logs, and GSAP motion.
 */
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 lg:p-8 space-y-8 flex-1 max-w-7xl mx-auto w-full">
      
      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 dash-header">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
            Welcome back, {{ currentUser()?.firstName || 'Administrator' }}
          </h1>
          <p class="text-xs sm:text-sm text-[#6B7F7C] mt-0.5">Here is what is happening across your workforce today.</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="onNewReport()" class="workora-btn-primary px-4 py-2.5 text-xs">
            <span class="material-symbols-outlined text-base">add</span>
            <span>New Report</span>
          </button>
        </div>
      </div>

      <!-- Top Stats Bento Grid (4 Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 dash-stats-grid">

        <!-- Total Workforce -->
        <div class="workora-card-interactive p-6 rounded-2xl bg-white border border-[#DCEBE7] shadow-sm stat-card">
          <div class="flex justify-between items-start mb-3">
            <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">groups</span>
            </div>
            <span class="workora-badge-success">+12%</span>
          </div>
          <p class="text-xs font-bold text-[#6B7F7C] uppercase tracking-wider">Total Workforce</p>
          <h3 class="text-2xl font-extrabold text-[#063B39] mt-1 font-heading">1,284</h3>
          <div class="mt-3 h-1.5 w-full bg-[#DCEBE7]/60 rounded-full overflow-hidden">
            <div class="h-full bg-[#0E6E68] w-[75%] rounded-full"></div>
          </div>
        </div>

        <!-- Monthly Payroll -->
        <div class="workora-card-interactive p-6 rounded-2xl bg-white border border-[#DCEBE7] shadow-sm stat-card">
          <div class="flex justify-between items-start mb-3">
            <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">payments</span>
            </div>
            <span class="text-[#6B7F7C] text-xs font-semibold">Aug 2026</span>
          </div>
          <p class="text-xs font-bold text-[#6B7F7C] uppercase tracking-wider">Monthly Payroll</p>
          <h3 class="text-2xl font-extrabold text-[#063B39] mt-1 font-heading">$4.2M</h3>
          <p class="text-xs text-[#6B7F7C] mt-2">Budget Utilization: <span class="text-[#0E6E68] font-bold">92%</span></p>
        </div>

        <!-- Attendance Rate -->
        <div class="workora-card-interactive p-6 rounded-2xl bg-white border border-[#DCEBE7] shadow-sm stat-card">
          <div class="flex justify-between items-start mb-3">
            <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#3FA79B] flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">event_available</span>
            </div>
            <span class="workora-badge-teal">Stable</span>
          </div>
          <p class="text-xs font-bold text-[#6B7F7C] uppercase tracking-wider">Attendance Rate</p>
          <h3 class="text-2xl font-extrabold text-[#063B39] mt-1 font-heading">98.4%</h3>
          <p class="text-xs text-[#6B7F7C] mt-2">2,794 Present • 32 Remote</p>
        </div>

        <!-- Pending Requests -->
        <div class="workora-card-interactive p-6 rounded-2xl bg-white border border-[#DCEBE7] shadow-sm stat-card">
          <div class="flex justify-between items-start mb-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">notification_important</span>
            </div>
            <span class="bg-amber-50 border border-amber-200/80 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">ACTION REQUIRED</span>
          </div>
          <p class="text-xs font-bold text-[#6B7F7C] uppercase tracking-wider">Pending Requests</p>
          <h3 class="text-2xl font-extrabold text-[#063B39] mt-1 font-heading">24</h3>
          <p class="text-xs text-amber-600 font-semibold mt-2">12 Overdue Approvals</p>
        </div>

      </div>

      <!-- Growth & Allocation Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 dash-charts-grid">
        
        <!-- Personnel Growth Chart -->
        <div class="bg-white col-span-2 p-6 sm:p-8 rounded-2xl border border-[#DCEBE7] shadow-sm workora-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h4 class="text-lg font-bold text-[#063B39] font-heading">Personnel Growth</h4>
              <p class="text-xs text-[#6B7F7C] mt-0.5">Annual projections vs. actual hiring rates</p>
            </div>
            <div class="flex gap-2">
              <button 
                (click)="onFilterQuarter('Q1')" 
                [ngClass]="selectedQuarter() === 'Q1' ? 'bg-[#0E6E68] text-white shadow-xs' : 'bg-[#F4F8F7] text-slate-600 hover:bg-[#DCEBE7]/50'" 
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-none"
              >
                Q1
              </button>
              <button 
                (click)="onFilterQuarter('Q2')" 
                [ngClass]="selectedQuarter() === 'Q2' ? 'bg-[#0E6E68] text-white shadow-xs' : 'bg-[#F4F8F7] text-slate-600 hover:bg-[#DCEBE7]/50'" 
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-none"
              >
                Q2
              </button>
            </div>
          </div>
          
          <!-- Visual Bar Chart Representation -->
          <div class="relative h-56 flex items-end gap-4 px-2 pt-4">
            <div class="flex-1 flex flex-col items-center gap-2">
              <div class="w-full bg-[#DCEBE7] hover:bg-[#0E6E68] rounded-t-lg h-[45%] transition-all cursor-pointer"></div>
              <span class="text-[10px] text-[#6B7F7C] font-bold">JAN</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2">
              <div class="w-full bg-[#DCEBE7] hover:bg-[#0E6E68] rounded-t-lg h-[60%] transition-all cursor-pointer"></div>
              <span class="text-[10px] text-[#6B7F7C] font-bold">FEB</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2">
              <div class="w-full bg-[#DCEBE7] hover:bg-[#0E6E68] rounded-t-lg h-[55%] transition-all cursor-pointer"></div>
              <span class="text-[10px] text-[#6B7F7C] font-bold">MAR</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2">
              <div class="w-full bg-[#3FA79B]/60 hover:bg-[#0E6E68] rounded-t-lg h-[75%] transition-all cursor-pointer"></div>
              <span class="text-[10px] text-[#6B7F7C] font-bold">APR</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2">
              <div class="w-full bg-[#3FA79B] hover:bg-[#0E6E68] rounded-t-lg h-[88%] transition-all cursor-pointer"></div>
              <span class="text-[10px] text-[#6B7F7C] font-bold">MAY</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2">
              <div class="w-full bg-[#0E6E68] rounded-t-lg h-[95%] transition-all cursor-pointer"></div>
              <span class="text-[10px] text-[#6B7F7C] font-bold">JUN</span>
            </div>
          </div>
        </div>

        <!-- Department Allocation -->
        <div class="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCEBE7] shadow-sm flex flex-col justify-between workora-card">
          <div>
            <h4 class="text-lg font-bold text-[#063B39] font-heading">Department Allocation</h4>
            <p class="text-xs text-[#6B7F7C] mt-0.5 mb-6">Resource spend per division</p>
            
            <div class="flex items-center justify-center my-4">
              <div class="w-36 h-36 rounded-full border-8 border-[#DCEBE7]/60 flex items-center justify-center relative">
                <div class="absolute inset-0 rounded-full border-8 border-t-[#063B39] border-r-[#0E6E68] border-b-[#3FA79B] border-l-transparent rotate-45"></div>
                <div class="text-center">
                  <span class="text-2xl font-extrabold text-[#063B39] block font-heading">64%</span>
                  <span class="text-[9px] text-[#6B7F7C] uppercase tracking-widest font-bold">Utilization</span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2 text-xs pt-4 border-t border-[#DCEBE7]">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-[#063B39]"></div>
                <span class="text-slate-700 font-medium">Engineering</span>
              </div>
              <span class="text-[#063B39] font-bold">42%</span>
            </div>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-[#0E6E68]"></div>
                <span class="text-slate-700 font-medium">Sales &amp; Marketing</span>
              </div>
              <span class="text-[#063B39] font-bold">31%</span>
            </div>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-[#3FA79B]"></div>
                <span class="text-slate-700 font-medium">Operations</span>
              </div>
              <span class="text-[#063B39] font-bold">27%</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Executive Audit Log -->
      <div class="bg-white rounded-2xl border border-[#DCEBE7] shadow-sm overflow-hidden workora-card">
        <div class="p-6 border-b border-[#DCEBE7] flex justify-between items-center">
          <div>
            <h4 class="text-lg font-bold text-[#063B39] font-heading">Executive Audit Log</h4>
            <p class="text-xs text-[#6B7F7C] mt-0.5">Real-time system events and operational changes</p>
          </div>
          <button (click)="onViewFullHistory()" class="text-[#0E6E68] font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer border-none bg-transparent">
            <span>View Full History</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div class="divide-y divide-[#DCEBE7]/70 text-xs">
          <!-- Item 1 -->
          <div class="px-6 py-3.5 flex items-center justify-between hover:bg-[#DCEBE7]/20 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-base">person_add</span>
              </div>
              <div>
                <p class="text-slate-800 text-xs font-semibold">New Employee Onboarded: <span class="text-[#0E6E68] font-bold">Sarah Jenkins</span></p>
                <p class="text-[#6B7F7C] text-[11px]">Senior Product Designer • Creative Division</p>
              </div>
            </div>
            <span class="text-[#6B7F7C] text-[10px] font-bold uppercase tracking-wider">2 MINS AGO</span>
          </div>

          <!-- Item 2 -->
          <div class="px-6 py-3.5 flex items-center justify-between hover:bg-[#DCEBE7]/20 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#DCEBE7] text-[#3FA79B] flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-base">security</span>
              </div>
              <div>
                <p class="text-slate-800 text-xs font-semibold">Security Audit Completed: <span class="text-[#0E6E68] font-bold">Node-04</span></p>
                <p class="text-[#6B7F7C] text-[11px]">All compliance protocols verified</p>
              </div>
            </div>
            <span class="text-[#6B7F7C] text-[10px] font-bold uppercase tracking-wider">45 MINS AGO</span>
          </div>

          <!-- Item 3 -->
          <div class="px-6 py-3.5 flex items-center justify-between hover:bg-[#DCEBE7]/20 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-base">verified</span>
              </div>
              <div>
                <p class="text-slate-800 text-xs font-semibold">Payroll Batch Approved: <span class="text-emerald-700 font-bold">#4812</span></p>
                <p class="text-[#6B7F7C] text-[11px]">Direct deposit instructions dispatched</p>
              </div>
            </div>
            <span class="text-[#6B7F7C] text-[10px] font-bold uppercase tracking-wider">2 HOURS AGO</span>
          </div>
        </div>
      </div>

    </div>
  `
})
export class DashboardPageComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly authService: AuthService = inject(AuthService) as AuthService;

  private ctx?: gsap.Context;

  readonly currentUser = this.authService.currentUser;
  readonly selectedQuarter = signal<'Q1' | 'Q2'>('Q2');

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ctx = gsap.context(() => {
      gsap.from('.dash-header', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      });

      gsap.from('.dash-stats-grid .stat-card', {
        y: 25,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.1
      });

      gsap.from('.dash-charts-grid > *', {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.25
      });
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  onFilterQuarter(q: 'Q1' | 'Q2'): void {
    this.selectedQuarter.set(q);
  }

  onNewReport(): void {
    console.log('Generating executive report...');
  }

  onViewFullHistory(): void {
    console.log('Viewing full audit history log...');
  }
}
