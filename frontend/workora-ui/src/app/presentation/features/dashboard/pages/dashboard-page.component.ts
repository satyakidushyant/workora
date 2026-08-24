import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * Humanized Workora Dashboard Workspace Component.
 * Features a friendly daily greeting, focus items needing attention,
 * live team availability radar, payroll readiness indicators, and quick operations.
 */
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-3.5 xs:p-5 sm:p-6 lg:p-8 space-y-5 sm:space-y-8 flex-1 max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl mx-auto w-full">
      
      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 dash-header">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCEBE7] text-[11px] text-[#0E6E68] font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Workspace Sync</span>
            <span>•</span>
            <span class="text-[#063B39] font-semibold">{{ currentDate }}</span>
          </div>
          <h1 class="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
            Good {{ greetingTime }}, {{ currentUser()?.firstName || 'there' }} 👋
          </h1>
          <p class="text-xs sm:text-sm text-slate-600">Here is what is happening across your team today.</p>
        </div>

        <!-- Header Action Buttons -->
        <div class="flex items-center gap-2.5 w-full sm:w-auto">
          <button (click)="onExportReport()" class="workora-btn-secondary text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial">
            <span class="material-symbols-outlined text-base">download</span>
            <span>Export Summary</span>
          </button>
          <a routerLink="/users" class="workora-btn-primary text-xs px-4 sm:px-5 py-2 sm:py-2.5 shadow-md flex items-center justify-center gap-1.5 flex-1 sm:flex-initial">
            <span class="material-symbols-outlined text-base">person_add</span>
            <span>Add Team Member</span>
          </a>
        </div>
      </div>

      <!-- Today's Focus Action Banners (Human-centric alerts) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 dash-focus-grid">
        
        <!-- Leave Requests to Review -->
        <div class="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl">event_available</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-[#063B39]">2 Leave Requests</h4>
              <p class="text-[11px] text-slate-500">Maya Chen &amp; David Kalu</p>
            </div>
          </div>
          <button (click)="onQuickReviewLeave()" class="px-3 py-1.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shrink-0">
            Review
          </button>
        </div>

        <!-- Payroll Readiness -->
        <div class="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl">payments</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-[#063B39]">Aug 31 Payroll Run</h4>
              <p class="text-[11px] text-emerald-700 font-semibold">100% Tax Compliant</p>
            </div>
          </div>
          <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 shrink-0">
            Ready
          </span>
        </div>

        <!-- New Hire Onboarding -->
        <div class="bg-white p-4 rounded-2xl border border-[#DCEBE7] shadow-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl">celebration</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-[#063B39]">1 New Hire Onboarding</h4>
              <p class="text-[11px] text-slate-500">Starting next Monday</p>
            </div>
          </div>
          <a routerLink="/users" class="px-3 py-1.5 bg-[#DCEBE7] hover:bg-[#0E6E68] hover:text-white text-[#063B39] text-[11px] font-bold rounded-lg transition-colors cursor-pointer shrink-0">
            View
          </a>
        </div>

      </div>

      <!-- Top Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 dash-stats-grid">

        <!-- Total Team -->
        <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-2 sm:mb-3">
              <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-lg">groups</span>
              </div>
              <span class="workora-badge-success text-[10px] sm:text-xs">+4 this month</span>
            </div>
            <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total Team</p>
            <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">183</h3>
          </div>
          <div>
            <div class="mt-3 h-1.5 w-full bg-[#DCEBE7]/60 rounded-full overflow-hidden">
              <div class="h-full bg-[#0E6E68] w-[88%] rounded-full"></div>
            </div>
            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-1.5">172 Full-time • 11 Contractors</p>
          </div>
        </div>

        <!-- Today's Attendance -->
        <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-2 sm:mb-3">
              <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#3FA79B] flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-lg">schedule</span>
              </div>
              <span class="workora-badge-teal text-[10px] sm:text-xs">98.4%</span>
            </div>
            <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Attendance</p>
            <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">180 / 183</h3>
          </div>
          <div>
            <div class="mt-3 h-1.5 w-full bg-[#DCEBE7]/60 rounded-full overflow-hidden">
              <div class="h-full bg-[#3FA79B] w-[98%] rounded-full"></div>
            </div>
            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-1.5">142 In Office • 38 Remote</p>
          </div>
        </div>

        <!-- Monthly Payroll -->
        <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-2 sm:mb-3">
              <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-lg">account_balance_wallet</span>
              </div>
              <span class="text-[#0E6E68] text-[10px] sm:text-xs font-bold bg-[#DCEBE7]/50 px-2 py-0.5 rounded-full">August</span>
            </div>
            <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Payroll Disbursement</p>
            <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">&#36;184,250</h3>
          </div>
          <div>
            <div class="mt-3 h-1.5 w-full bg-[#DCEBE7]/60 rounded-full overflow-hidden">
              <div class="h-full bg-[#0E6E68] w-[100%] rounded-full"></div>
            </div>
            <p class="text-[10px] sm:text-[11px] text-emerald-600 font-semibold mt-1.5">Direct deposit ready</p>
          </div>
        </div>

        <!-- Happiness / Satisfaction -->
        <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-2 sm:mb-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-lg">sentiment_very_satisfied</span>
              </div>
              <span class="workora-badge-success text-[10px] sm:text-xs">4.9 / 5.0</span>
            </div>
            <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Team Sentiment</p>
            <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">High Morale</h3>
          </div>
          <div>
            <div class="mt-3 h-1.5 w-full bg-[#DCEBE7]/60 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 w-[96%] rounded-full"></div>
            </div>
            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-1.5">Based on weekly 1-on-1 pulses</p>
          </div>
        </div>

      </div>

      <!-- Team Availability Radar & Quick Links -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 dash-charts-grid">
        
        <!-- Department Headcount Distribution -->
        <div class="bg-white col-span-1 p-5 sm:p-6 rounded-3xl border border-[#DCEBE7] shadow-xs workora-card space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#DCEBE7]">
            <div>
              <h3 class="text-sm font-extrabold text-[#063B39] font-heading">Team Breakdown</h3>
              <p class="text-[11px] text-slate-500">183 people across 5 teams</p>
            </div>
            <span class="material-symbols-outlined text-[#0E6E68] text-xl">pie_chart</span>
          </div>

          <div class="space-y-3">
            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-[#063B39]">Product &amp; Engineering</span>
                <span class="text-[#0E6E68]">76 (41.5%)</span>
              </div>
              <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                <div class="h-full bg-[#0E6E68] rounded-full" style="width: 41.5%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-[#063B39]">Design &amp; Creative</span>
                <span class="text-[#0E6E68]">32 (17.5%)</span>
              </div>
              <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                <div class="h-full bg-[#3FA79B] rounded-full" style="width: 17.5%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-[#063B39]">Growth &amp; Marketing</span>
                <span class="text-[#0E6E68]">28 (15.3%)</span>
              </div>
              <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                <div class="h-full bg-[#063B39] rounded-full" style="width: 15.3%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-[#063B39]">Customer Experience</span>
                <span class="text-[#0E6E68]">31 (16.9%)</span>
              </div>
              <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full" style="width: 16.9%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-[#063B39]">People &amp; Operations</span>
                <span class="text-[#0E6E68]">16 (8.8%)</span>
              </div>
              <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                <div class="h-full bg-slate-400 rounded-full" style="width: 8.8%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Human Activity Stream -->
        <div class="bg-white col-span-1 lg:col-span-2 p-5 sm:p-6 rounded-3xl border border-[#DCEBE7] shadow-xs workora-card space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#DCEBE7]">
            <div>
              <h3 class="text-sm font-extrabold text-[#063B39] font-heading">Recent Team Activity</h3>
              <p class="text-[11px] text-slate-500">Live operational updates and requests</p>
            </div>
            <a routerLink="/users" class="text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors flex items-center gap-1">
              <span>View User Directory</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>

          <div class="workora-table-responsive">
            <table class="workora-table">
              <thead>
                <tr>
                  <th>Person / Event</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-full bg-[#0E6E68] text-white font-bold text-[10px] flex items-center justify-center">MC</div>
                      <div>
                        <div class="font-bold text-[#063B39] text-xs">Maya Chen</div>
                        <div class="text-[10px] text-slate-500">Requested 5 days vacation leave</div>
                      </div>
                    </div>
                  </td>
                  <td>Engineering</td>
                  <td><span class="workora-badge-warning">Pending Review</span></td>
                  <td class="text-slate-500 text-xs">10m ago</td>
                </tr>
                <tr>
                  <td>
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-full bg-[#3FA79B] text-white font-bold text-[10px] flex items-center justify-center">DK</div>
                      <div>
                        <div class="font-bold text-[#063B39] text-xs">David Kalu</div>
                        <div class="text-[10px] text-slate-500">Completed digital tax onboarding packet</div>
                      </div>
                    </div>
                  </td>
                  <td>Design</td>
                  <td><span class="workora-badge-success">Completed</span></td>
                  <td class="text-slate-500 text-xs">42m ago</td>
                </tr>
                <tr>
                  <td>
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-full bg-[#063B39] text-white font-bold text-[10px] flex items-center justify-center">AR</div>
                      <div>
                        <div class="font-bold text-[#063B39] text-xs">Alex Rivera</div>
                        <div class="text-[10px] text-slate-500">Clocked in via mobile geofence</div>
                      </div>
                    </div>
                  </td>
                  <td>Growth</td>
                  <td><span class="workora-badge-teal">Present</span></td>
                  <td class="text-slate-500 text-xs">1h ago</td>
                </tr>
                <tr>
                  <td>
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-full bg-slate-600 text-white font-bold text-[10px] flex items-center justify-center">SYS</div>
                      <div>
                        <div class="font-bold text-[#063B39] text-xs">Workora Payroll Bot</div>
                        <div class="text-[10px] text-slate-500">Generated August direct deposit files</div>
                      </div>
                    </div>
                  </td>
                  <td>Finance</td>
                  <td><span class="workora-badge-success">Ready</span></td>
                  <td class="text-slate-500 text-xs">3h ago</td>
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
  
  readonly greetingTime = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  })();

  readonly currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
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
        .from('.dash-focus-grid > div', { y: 15, opacity: 0, stagger: 0.08 }, '-=0.2')
        .from('.dash-stats-grid .stat-card', { y: 15, opacity: 0, stagger: 0.08 }, '-=0.3')
        .from('.dash-charts-grid > div', { y: 15, opacity: 0, stagger: 0.1 }, '-=0.2');
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  onQuickReviewLeave(): void {
    this.notificationService.showInfo('Opened PTO review drawer for Maya Chen (5 days requested).');
  }

  onExportReport(): void {
    this.notificationService.showSuccess('Workforce executive summary exported to CSV & PDF.');
  }
}
