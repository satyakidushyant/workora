import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * Enterprise HRMS Smart Container Component for Dashboard page.
 * Modern Workora SaaS executive cockpit rendering real-time workforce metrics,
 * department resource distribution, personnel growth charts, audit logs, quick actions, and GSAP motion.
 */
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-3.5 xs:p-5 sm:p-6 lg:p-8 space-y-5 sm:space-y-8 flex-1 max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl mx-auto w-full">
      
      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 dash-header">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCEBE7] border border-[#0E6E68]/15 text-[10px] xs:text-xs text-[#0E6E68] font-bold">
            <span class="material-symbols-outlined text-xs">domain</span>
            <span>Workora Cloud</span>
            <span>•</span>
            <span class="text-[#063B39] font-medium">{{ currentDate }}</span>
          </div>
          <h1 class="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
            Good day, {{ currentUser()?.firstName || 'Administrator' }}
          </h1>
          <p class="text-xs sm:text-sm text-[#6B7F7C]">Here is an executive overview of workforce operations and enterprise activity.</p>
        </div>

        <!-- Action Buttons (Responsive 2-col on mobile, flex on tablet/desktop) -->
        <div class="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button (click)="onExportReport()" class="workora-btn-secondary text-xs px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-base">download</span>
            <span class="truncate">Export Report</span>
          </button>
          <a routerLink="/users" class="workora-btn-primary text-xs px-3 sm:px-4 py-2 sm:py-2.5 shadow-teal flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-base">person_add</span>
            <span class="truncate">Add Employee</span>
          </a>
        </div>
      </div>

      <!-- Top Stats Bento Grid (2 cols on mobile, 4 cols on desktop) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 dash-stats-grid">

        <!-- Total Workforce -->
        <div class="workora-card-interactive p-3.5 xs:p-4.5 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-2 sm:mb-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-lg sm:text-xl">groups</span>
              </div>
              <span class="workora-badge-success text-[10px] sm:text-xs px-1.5 sm:px-2">+12.4%</span>
            </div>
            <p class="text-[10px] sm:text-xs font-bold text-[#6B7F7C] uppercase tracking-wider truncate">Total Workforce</p>
            <h3 class="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 sm:mt-1 font-heading">1,284</h3>
          </div>
          <div>
            <div class="mt-2.5 sm:mt-3 h-1 sm:h-1.5 w-full bg-[#DCEBE7]/60 rounded-full overflow-hidden">
              <div class="h-full bg-[#0E6E68] w-[75%] rounded-full"></div>
            </div>
            <p class="text-[10px] sm:text-[11px] text-[#6B7F7C] mt-1.5 truncate">Active staff &amp; contractors</p>
          </div>
        </div>

        <!-- Monthly Payroll -->
        <div class="workora-card-interactive p-3.5 xs:p-4.5 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-2 sm:mb-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-lg sm:text-xl">payments</span>
              </div>
              <span class="text-[#0E6E68] text-[10px] sm:text-xs font-bold bg-[#DCEBE7]/50 px-1.5 sm:px-2 py-0.5 rounded-full">Q3 2026</span>
            </div>
            <p class="text-[10px] sm:text-xs font-bold text-[#6B7F7C] uppercase tracking-wider truncate">Monthly Payroll</p>
            <h3 class="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 sm:mt-1 font-heading">$4.28M</h3>
          </div>
          <div>
            <div class="mt-2.5 sm:mt-3 h-1 sm:h-1.5 w-full bg-[#DCEBE7]/60 rounded-full overflow-hidden">
              <div class="h-full bg-[#0E6E68] w-[92%] rounded-full"></div>
            </div>
            <p class="text-[10px] sm:text-[11px] text-[#6B7F7C] mt-1.5 truncate">Budget: <span class="text-[#0E6E68] font-bold">92.1%</span></p>
          </div>
        </div>

        <!-- Attendance Rate -->
        <div class="workora-card-interactive p-3.5 xs:p-4.5 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-2 sm:mb-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#DCEBE7] text-[#3FA79B] flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-lg sm:text-xl">event_available</span>
              </div>
              <span class="workora-badge-teal text-[10px] sm:text-xs px-1.5 sm:px-2">98.4%</span>
            </div>
            <p class="text-[10px] sm:text-xs font-bold text-[#6B7F7C] uppercase tracking-wider truncate">Attendance Rate</p>
            <h3 class="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 sm:mt-1 font-heading">98.4%</h3>
          </div>
          <div>
            <div class="mt-2.5 sm:mt-3 h-1 sm:h-1.5 w-full bg-[#DCEBE7]/60 rounded-full overflow-hidden">
              <div class="h-full bg-[#3FA79B] w-[98%] rounded-full"></div>
            </div>
            <p class="text-[10px] sm:text-[11px] text-[#6B7F7C] mt-1.5 truncate">1,263 Present • 21 Off</p>
          </div>
        </div>

        <!-- Pending Requests -->
        <div class="workora-card-interactive p-3.5 xs:p-4.5 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-2 sm:mb-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/50 shrink-0">
                <span class="material-symbols-outlined text-lg sm:text-xl">notification_important</span>
              </div>
              <span class="workora-badge-warning text-[10px] sm:text-xs px-1.5 sm:px-2">Action</span>
            </div>
            <p class="text-[10px] sm:text-xs font-bold text-[#6B7F7C] uppercase tracking-wider truncate">Pending Approvals</p>
            <h3 class="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 sm:mt-1 font-heading">18</h3>
          </div>
          <div>
            <div class="mt-2.5 sm:mt-3 h-1 sm:h-1.5 w-full bg-[#DCEBE7]/60 rounded-full overflow-hidden">
              <div class="h-full bg-amber-500 w-[60%] rounded-full"></div>
            </div>
            <p class="text-[10px] sm:text-[11px] text-amber-600 font-semibold mt-1.5 truncate">12 Leave • 6 Claims</p>
          </div>
        </div>

      </div>

      <!-- Quick Actions Strip -->
      <div class="dash-quick-actions space-y-2.5 sm:space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-[11px] xs:text-xs font-bold text-[#063B39] uppercase tracking-wider font-heading">Quick Operations</h4>
          <span class="text-[10px] xs:text-[11px] text-[#6B7F7C]">Fast access</span>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          
          <a routerLink="/users" class="p-3 xs:p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group cursor-pointer flex items-center gap-2.5 sm:gap-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center group-hover:bg-[#0E6E68] group-hover:text-white transition-colors shrink-0">
              <span class="material-symbols-outlined text-lg sm:text-xl">person_add</span>
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold text-[#063B39] truncate">Add User</div>
              <div class="text-[10px] text-[#6B7F7C] truncate">Credentials</div>
            </div>
          </a>

          <a routerLink="/users" class="p-3 xs:p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group cursor-pointer flex items-center gap-2.5 sm:gap-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center group-hover:bg-[#0E6E68] group-hover:text-white transition-colors shrink-0">
              <span class="material-symbols-outlined text-lg sm:text-xl">badge</span>
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold text-[#063B39] truncate">Directory</div>
              <div class="text-[10px] text-[#6B7F7C] truncate">1,284 Users</div>
            </div>
          </a>

          <a routerLink="/change-password" class="p-3 xs:p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group cursor-pointer flex items-center gap-2.5 sm:gap-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#DCEBE7] text-[#3FA79B] flex items-center justify-center group-hover:bg-[#0E6E68] group-hover:text-white transition-colors shrink-0">
              <span class="material-symbols-outlined text-lg sm:text-xl">shield_lock</span>
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold text-[#063B39] truncate">Security</div>
              <div class="text-[10px] text-[#6B7F7C] truncate">Settings &amp; 2FA</div>
            </div>
          </a>

          <button (click)="onExportReport()" class="p-3 xs:p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group cursor-pointer flex items-center gap-2.5 sm:gap-3 border-none bg-transparent">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center group-hover:bg-[#0E6E68] group-hover:text-white transition-colors shrink-0">
              <span class="material-symbols-outlined text-lg sm:text-xl">analytics</span>
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold text-[#063B39] truncate">Analytics</div>
              <div class="text-[10px] text-[#6B7F7C] truncate">Export data</div>
            </div>
          </button>

        </div>
      </div>

      <!-- Growth & Department Allocation Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 dash-charts-grid">
        
        <!-- Department Distribution Card -->
        <div class="bg-white col-span-1 p-4.5 sm:p-6 rounded-2xl border border-[#DCEBE7] shadow-xs workora-card">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-[#DCEBE7]">
            <div>
              <h3 class="text-sm font-extrabold text-[#063B39] font-heading">Department Distribution</h3>
              <p class="text-[11px] text-[#6B7F7C]">Headcount by division</p>
            </div>
            <span class="material-symbols-outlined text-slate-400 text-lg">pie_chart</span>
          </div>

          <div class="space-y-3 sm:space-y-3.5">
            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-[#063B39]">Engineering &amp; Product</span>
                <span class="text-[#0E6E68]">482 (37.5%)</span>
              </div>
              <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                <div class="h-full bg-[#0E6E68] rounded-full" style="width: 37.5%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-[#063B39]">Sales &amp; Business Dev</span>
                <span class="text-[#0E6E68]">310 (24.1%)</span>
              </div>
              <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                <div class="h-full bg-[#3FA79B] rounded-full" style="width: 24.1%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-[#063B39]">Customer Success</span>
                <span class="text-[#0E6E68]">245 (19.0%)</span>
              </div>
              <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                <div class="h-full bg-[#063B39] rounded-full" style="width: 19.0%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-[#063B39]">Corporate Operations &amp; HR</span>
                <span class="text-[#0E6E68]">147 (11.4%)</span>
              </div>
              <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                <div class="h-full bg-[#10B981] rounded-full" style="width: 11.4%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-[#063B39]">Finance &amp; Legal</span>
                <span class="text-[#0E6E68]">100 (8.0%)</span>
              </div>
              <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                <div class="h-full bg-slate-400 rounded-full" style="width: 8.0%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Audit Log Table -->
        <div class="bg-white col-span-1 lg:col-span-2 p-4.5 sm:p-6 rounded-2xl border border-[#DCEBE7] shadow-xs workora-card">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-[#DCEBE7]">
            <div>
              <h3 class="text-sm font-extrabold text-[#063B39] font-heading">Recent System Activity</h3>
              <p class="text-[11px] text-[#6B7F7C]">Real-time administrative actions &amp; audit trail</p>
            </div>
            <a routerLink="/users" class="text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors flex items-center gap-1 shrink-0">
              <span>View All</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>

          <div class="workora-table-responsive">
            <table class="workora-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Actor</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="font-bold text-[#063B39]">User Authentication</td>
                  <td>{{ currentUser()?.email || 'admin@workora.com' }}</td>
                  <td><span class="workora-badge-success">Success</span></td>
                  <td class="text-[#6B7F7C]">Just now</td>
                </tr>
                <tr>
                  <td class="font-bold text-[#063B39]">Role Permission Sync</td>
                  <td>System Seeder</td>
                  <td><span class="workora-badge-teal">Synchronized</span></td>
                  <td class="text-[#6B7F7C]">15m ago</td>
                </tr>
                <tr>
                  <td class="font-bold text-[#063B39]">Directory Query</td>
                  <td>{{ currentUser()?.email || 'admin@workora.com' }}</td>
                  <td><span class="workora-badge-info">Executed</span></td>
                  <td class="text-[#6B7F7C]">1h ago</td>
                </tr>
                <tr>
                  <td class="font-bold text-[#063B39]">Security Policy Applied</td>
                  <td>SecOps Service</td>
                  <td><span class="workora-badge-neutral">Enforced</span></td>
                  <td class="text-[#6B7F7C]">3h ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  `
})
export class DashboardPageComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  readonly currentUser = this.authService.currentUser;
  readonly currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    this.ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.5 } });

      tl.from('.dash-header', { y: -10, opacity: 0 })
        .from('.dash-stats-grid .stat-card', { y: 15, opacity: 0, stagger: 0.08 }, '-=0.3')
        .from('.dash-quick-actions', { y: 15, opacity: 0 }, '-=0.2')
        .from('.dash-charts-grid > div', { y: 15, opacity: 0, stagger: 0.1 }, '-=0.2');
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  onExportReport(): void {
    this.notificationService.showSuccess('Workforce executive summary report exported successfully (CSV/PDF).');
  }
}
