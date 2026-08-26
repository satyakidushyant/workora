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
          <p class="text-xs sm:text-sm text-slate-600">
            @if (authService.hasRole('SuperAdmin')) {
              Platform Oversight &amp; Multi-Tenant Operations Center.
            } @else if (authService.hasRole('HRAdmin')) {
              Here is what is happening across your company workforce today.
            } @else if (authService.hasRole('FinanceManager')) {
              Company Payroll, Statutory Remittances, and Expense Claims overview.
            } @else if (authService.hasRole('Manager')) {
              Here is your direct team availability and task velocity overview.
            } @else {
              Welcome to your personal employee self-service workspace.
            }
          </p>
        </div>

        <!-- Header Action Buttons (Role-Tailored) -->
        <div class="flex items-center gap-2.5 w-full sm:w-auto">
          @if (authService.hasRole('SuperAdmin')) {
            <a routerLink="/superadmin" class="workora-btn-primary text-xs px-4 sm:px-5 py-2 sm:py-2.5 shadow-md flex items-center justify-center gap-1.5 flex-1 sm:flex-initial">
              <span class="material-symbols-outlined text-base">domain_add</span>
              <span>Manage Tenants</span>
            </a>
          } @else if (authService.hasRole('HRAdmin')) {
            <button (click)="onExportReport()" class="workora-btn-secondary text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial">
              <span class="material-symbols-outlined text-base">download</span>
              <span>Export Summary</span>
            </button>
            <a routerLink="/employees" class="workora-btn-primary text-xs px-4 sm:px-5 py-2 sm:py-2.5 shadow-md flex items-center justify-center gap-1.5 flex-1 sm:flex-initial">
              <span class="material-symbols-outlined text-base">person_add</span>
              <span>Add Employee</span>
            </a>
          } @else if (authService.hasRole('FinanceManager')) {
            <a routerLink="/payroll" class="workora-btn-primary text-xs px-4 sm:px-5 py-2 sm:py-2.5 shadow-md flex items-center justify-center gap-1.5 flex-1 sm:flex-initial">
              <span class="material-symbols-outlined text-base">payments</span>
              <span>Run Payroll</span>
            </a>
          } @else if (authService.hasRole('Manager')) {
            <a routerLink="/leave" class="workora-btn-secondary text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial">
              <span class="material-symbols-outlined text-base">fact_check</span>
              <span>Review Leaves</span>
            </a>
            <a routerLink="/tasks" class="workora-btn-primary text-xs px-4 sm:px-5 py-2 sm:py-2.5 shadow-md flex items-center justify-center gap-1.5 flex-1 sm:flex-initial">
              <span class="material-symbols-outlined text-base">add_task</span>
              <span>Assign Task</span>
            </a>
          } @else {
            <a routerLink="/leave" class="workora-btn-primary text-xs px-4 sm:px-5 py-2 sm:py-2.5 shadow-md flex items-center justify-center gap-1.5 flex-1 sm:flex-initial">
              <span class="material-symbols-outlined text-base">beach_access</span>
              <span>Apply for Leave</span>
            </a>
          }
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- VIEW 1: SUPERADMIN PLATFORM DASHBOARD                                    -->
      <!-- ========================================================================= -->
      @if (authService.hasRole('SuperAdmin')) {
        <!-- Focus Alerts for SuperAdmin -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 dash-focus-grid">
          <div class="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-xl">corporate_fare</span>
              </div>
              <div>
                <h4 class="text-xs font-bold text-[#063B39]">3 Active Tenant Orgs</h4>
                <p class="text-[11px] text-slate-500">Acme Corp, Nexus, Vertex</p>
              </div>
            </div>
            <a routerLink="/superadmin" class="px-3 py-1.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shrink-0">
              Manage
            </a>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-xl">verified_user</span>
              </div>
              <div>
                <h4 class="text-xs font-bold text-[#063B39]">System Security Health</h4>
                <p class="text-[11px] text-emerald-700 font-semibold">100% Operational • 0 Breaches</p>
              </div>
            </div>
            <a routerLink="/audit-logs" class="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 shrink-0">
              Audit Logs
            </a>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-[#DCEBE7] shadow-xs flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-xl">subscriptions</span>
              </div>
              <div>
                <h4 class="text-xs font-bold text-[#063B39]">SaaS Plan Subscriptions</h4>
                <p class="text-[11px] text-slate-500">Enterprise &amp; Growth Tiers</p>
              </div>
            </div>
            <a routerLink="/superadmin" class="px-3 py-1.5 bg-[#DCEBE7] hover:bg-[#0E6E68] hover:text-white text-[#063B39] text-[11px] font-bold rounded-lg transition-colors cursor-pointer shrink-0">
              Configure
            </a>
          </div>
        </div>

        <!-- SuperAdmin Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 dash-stats-grid">
          <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2 sm:mb-3">
                <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg">domain</span>
                </div>
                <span class="workora-badge-success text-[10px] sm:text-xs">All Healthy</span>
              </div>
              <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant Companies</p>
              <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">3 Organizations</h3>
            </div>
            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-2">100% Active Multi-Tenancy</p>
          </div>

          <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2 sm:mb-3">
                <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#3FA79B] flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg">badge</span>
                </div>
                <span class="workora-badge-teal text-[10px] sm:text-xs">Seeded</span>
              </div>
              <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total User Seats</p>
              <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">13 Total Accounts</h3>
            </div>
            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-2">Across 3 Companies + SuperAdmins</p>
          </div>

          <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2 sm:mb-3">
                <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg">monetization_on</span>
                </div>
                <span class="text-[#0E6E68] text-[10px] sm:text-xs font-bold bg-[#DCEBE7]/50 px-2 py-0.5 rounded-full">Monthly</span>
              </div>
              <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated MRR</p>
              <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">&#36;12,450</h3>
            </div>
            <p class="text-[10px] sm:text-[11px] text-emerald-600 font-semibold mt-2">Tier-1 SaaS Revenue</p>
          </div>

          <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2 sm:mb-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg">admin_panel_settings</span>
                </div>
                <span class="workora-badge-success text-[10px] sm:text-xs">108 Defined</span>
              </div>
              <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">System Permissions</p>
              <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">108 Catalog Keys</h3>
            </div>
            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-2">Granular PBAC Architecture</p>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- VIEW 2: HR ADMIN & COMPANY ADMIN DASHBOARD                                -->
      <!-- ========================================================================= -->
      @else if (authService.hasRole('HRAdmin')) {
        <!-- Today's Focus Action Banners -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 dash-focus-grid">
          <div class="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-xl">event_available</span>
              </div>
              <div>
                <h4 class="text-xs font-bold text-[#063B39]">Leave Requests Queue</h4>
                <p class="text-[11px] text-slate-500">Pending HR review</p>
              </div>
            </div>
            <a routerLink="/leave" class="px-3 py-1.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shrink-0">
              Review
            </a>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-xl">payments</span>
              </div>
              <div>
                <h4 class="text-xs font-bold text-[#063B39]">Monthly Payroll Cycle</h4>
                <p class="text-[11px] text-emerald-700 font-semibold">100% Tax Compliant</p>
              </div>
            </div>
            <a routerLink="/payroll" class="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 shrink-0">
              View Cycles
            </a>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-[#DCEBE7] shadow-xs flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-xl">badge</span>
              </div>
              <div>
                <h4 class="text-xs font-bold text-[#063B39]">Employee Directory</h4>
                <p class="text-[11px] text-slate-500">Active Company Staff</p>
              </div>
            </div>
            <a routerLink="/employees" class="px-3 py-1.5 bg-[#DCEBE7] hover:bg-[#0E6E68] hover:text-white text-[#063B39] text-[11px] font-bold rounded-lg transition-colors cursor-pointer shrink-0">
              Manage
            </a>
          </div>
        </div>

        <!-- HR Stats Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 dash-stats-grid">
          <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2 sm:mb-3">
                <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg">groups</span>
                </div>
                <span class="workora-badge-success text-[10px] sm:text-xs">Active</span>
              </div>
              <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Company Workforce</p>
              <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">6 Members</h3>
            </div>
            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-2">Full-time Employees</p>
          </div>

          <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2 sm:mb-3">
                <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#3FA79B] flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg">schedule</span>
                </div>
                <span class="workora-badge-teal text-[10px] sm:text-xs">96%</span>
              </div>
              <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Attendance</p>
              <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">Present &amp; On-Duty</h3>
            </div>
            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-2">Biometric &amp; Geofence Sync</p>
          </div>

          <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2 sm:mb-3">
                <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg">account_tree</span>
                </div>
                <span class="text-[#0E6E68] text-[10px] sm:text-xs font-bold bg-[#DCEBE7]/50 px-2 py-0.5 rounded-full">5 Depts</span>
              </div>
              <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Departments &amp; Branches</p>
              <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">3 Hubs</h3>
            </div>
            <p class="text-[10px] sm:text-[11px] text-emerald-600 font-semibold mt-2">SF, NY &amp; London</p>
          </div>

          <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2 sm:mb-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg">work</span>
                </div>
                <span class="workora-badge-success text-[10px] sm:text-xs">Active ATS</span>
              </div>
              <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Recruitment</p>
              <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">Open Vacancies</h3>
            </div>
            <p class="text-[10px] sm:text-[11px] text-slate-500 mt-2">Talent Pipeline Active</p>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- VIEW 3: EMPLOYEE SELF-SERVICE (ESS) DASHBOARD                             -->
      <!-- ========================================================================= -->
      @else {
        <!-- Personal ESS Punch Widget & Balance Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 dash-focus-grid">
          
          <!-- Live Punch Clock Card -->
          <div class="bg-white p-5 rounded-2xl border border-[#0E6E68]/30 shadow-xs flex flex-col justify-between gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">timer</span>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-[#063B39]">Daily Work Clock</h4>
                  <p class="text-[11px] text-emerald-600 font-semibold">Active Shift</p>
                </div>
              </div>
              <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                On Duty
              </span>
            </div>
            
            <div class="flex items-center justify-between pt-2 border-t border-[#DCEBE7]">
              <div>
                <p class="text-[10px] text-slate-500 font-bold uppercase">Time Elapsed</p>
                <p class="text-lg font-extrabold text-[#063B39] font-mono">06h 42m 18s</p>
              </div>
              <a routerLink="/attendance" class="px-4 py-2 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs">
                Punch Out
              </a>
            </div>
          </div>

          <!-- Leave Quota Overview -->
          <div class="bg-white p-5 rounded-2xl border border-[#DCEBE7] shadow-xs flex flex-col justify-between gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">beach_access</span>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-[#063B39]">My Leave Balances</h4>
                  <p class="text-[11px] text-slate-500">22 Days Available</p>
                </div>
              </div>
              <a routerLink="/leave" class="text-xs font-bold text-[#0E6E68] hover:underline">Apply</a>
            </div>

            <div class="grid grid-cols-3 gap-2 pt-2 border-t border-[#DCEBE7] text-center">
              <div class="p-2 bg-[#F4F8F7] rounded-xl">
                <p class="text-xs font-extrabold text-[#063B39]">14</p>
                <p class="text-[9px] text-slate-500 font-bold">Annual</p>
              </div>
              <div class="p-2 bg-[#F4F8F7] rounded-xl">
                <p class="text-xs font-extrabold text-[#063B39]">5</p>
                <p class="text-[9px] text-slate-500 font-bold">Sick</p>
              </div>
              <div class="p-2 bg-[#F4F8F7] rounded-xl">
                <p class="text-xs font-extrabold text-[#063B39]">3</p>
                <p class="text-[9px] text-slate-500 font-bold">Casual</p>
              </div>
            </div>
          </div>

          <!-- Latest Payslip Card -->
          <div class="bg-white p-5 rounded-2xl border border-[#DCEBE7] shadow-xs flex flex-col justify-between gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">request_quote</span>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-[#063B39]">Latest Payslip</h4>
                  <p class="text-[11px] text-slate-500">Disbursed Direct Deposit</p>
                </div>
              </div>
              <span class="workora-badge-success text-[10px]">Paid</span>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-[#DCEBE7]">
              <div>
                <p class="text-[10px] text-slate-500 font-bold uppercase">Net Payout</p>
                <p class="text-base font-extrabold text-[#063B39]">&#36;4,850.00</p>
              </div>
              <a routerLink="/my-payslips" class="px-3 py-1.5 bg-[#DCEBE7] hover:bg-[#0E6E68] hover:text-white text-[#063B39] text-xs font-bold rounded-xl transition-colors cursor-pointer">
                View Payslip
              </a>
            </div>
          </div>

        </div>

        <!-- ESS Secondary Widgets -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 dash-charts-grid">
          <!-- My Tasks -->
          <div class="bg-white p-5 sm:p-6 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-[#DCEBE7]">
              <div>
                <h3 class="text-sm font-extrabold text-[#063B39] font-heading">My Assigned Tasks</h3>
                <p class="text-[11px] text-slate-500">Priorities requiring your action</p>
              </div>
              <a routerLink="/tasks" class="text-xs font-bold text-[#0E6E68] hover:underline">View All</a>
            </div>

            <div class="space-y-2.5">
              <div class="p-3 bg-[#F4F8F7] rounded-xl flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-[#0E6E68] text-base">check_circle</span>
                  <span class="text-xs font-bold text-[#063B39]">Complete Q3 Security Training</span>
                </div>
                <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Due Tomorrow</span>
              </div>
              <div class="p-3 bg-[#F4F8F7] rounded-xl flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-[#3FA79B] text-base">radio_button_unchecked</span>
                  <span class="text-xs font-bold text-[#063B39]">Submit Travel Expense Receipts</span>
                </div>
                <span class="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md">In Progress</span>
              </div>
            </div>
          </div>

          <!-- Upcoming Company Holidays -->
          <div class="bg-white p-5 sm:p-6 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-[#DCEBE7]">
              <div>
                <h3 class="text-sm font-extrabold text-[#063B39] font-heading">Upcoming Holidays</h3>
                <p class="text-[11px] text-slate-500">Corporate holiday calendar</p>
              </div>
              <a routerLink="/holidays" class="text-xs font-bold text-[#0E6E68] hover:underline">Full Calendar</a>
            </div>

            <div class="space-y-2.5">
              <div class="p-3 bg-[#F4F8F7] rounded-xl flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center font-bold text-xs">
                    SEP
                  </div>
                  <div>
                    <div class="text-xs font-bold text-[#063B39]">Labor Day</div>
                    <div class="text-[10px] text-slate-500">Monday, Sep 7, 2026</div>
                  </div>
                </div>
                <span class="workora-badge-teal text-[10px]">Paid Day Off</span>
              </div>
              <div class="p-3 bg-[#F4F8F7] rounded-xl flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center font-bold text-xs">
                    NOV
                  </div>
                  <div>
                    <div class="text-xs font-bold text-[#063B39]">Thanksgiving Break</div>
                    <div class="text-[10px] text-slate-500">Thu-Fri, Nov 26-27, 2026</div>
                  </div>
                </div>
                <span class="workora-badge-teal text-[10px]">2 Days</span>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Team Availability Radar & Quick Links (For HR, Managers and Admins) -->
      @if (authService.hasRole('SuperAdmin') || authService.hasRole('HRAdmin') || authService.hasRole('Manager')) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 dash-charts-grid">
          
          <!-- Department Headcount Distribution -->
          <div class="bg-white col-span-1 p-5 sm:p-6 rounded-3xl border border-[#DCEBE7] shadow-xs workora-card space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-[#DCEBE7]">
              <div>
                <h3 class="text-sm font-extrabold text-[#063B39] font-heading">Team Breakdown</h3>
                <p class="text-[11px] text-slate-500">Cross-department distribution</p>
              </div>
              <span class="material-symbols-outlined text-[#0E6E68] text-xl">pie_chart</span>
            </div>

            <div class="space-y-3">
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-[#063B39]">Product &amp; Engineering</span>
                  <span class="text-[#0E6E68]">40%</span>
                </div>
                <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                  <div class="h-full bg-[#0E6E68] rounded-full" style="width: 40%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-[#063B39]">Design &amp; Creative</span>
                  <span class="text-[#0E6E68]">20%</span>
                </div>
                <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                  <div class="h-full bg-[#3FA79B] rounded-full" style="width: 20%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-[#063B39]">People &amp; Operations</span>
                  <span class="text-[#0E6E68]">20%</span>
                </div>
                <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                  <div class="h-full bg-[#063B39] rounded-full" style="width: 20%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-[#063B39]">Finance &amp; Accounts</span>
                  <span class="text-[#0E6E68]">20%</span>
                </div>
                <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full" style="width: 20%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Human Activity Stream -->
          <div class="bg-white col-span-1 lg:col-span-2 p-5 sm:p-6 rounded-3xl border border-[#DCEBE7] shadow-xs workora-card space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-[#DCEBE7]">
              <div>
                <h3 class="text-sm font-extrabold text-[#063B39] font-heading">Recent Workforce Activity</h3>
                <p class="text-[11px] text-slate-500">Live operational updates and requests</p>
              </div>
              <a routerLink="/employees" class="text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors flex items-center gap-1">
                <span>View Employees</span>
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
                        <div class="w-7 h-7 rounded-full bg-[#0E6E68] text-white font-bold text-[10px] flex items-center justify-center">JD</div>
                        <div>
                          <div class="font-bold text-[#063B39] text-xs">John Doe</div>
                          <div class="text-[10px] text-slate-500">Clocked in via Web Portal</div>
                        </div>
                      </div>
                    </td>
                    <td>Engineering</td>
                    <td><span class="workora-badge-teal">Present</span></td>
                    <td class="text-slate-500 text-xs">15m ago</td>
                  </tr>
                  <tr>
                    <td>
                      <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-full bg-[#3FA79B] text-white font-bold text-[10px] flex items-center justify-center">SC</div>
                        <div>
                          <div class="font-bold text-[#063B39] text-xs">Sarah Connor</div>
                          <div class="text-[10px] text-slate-500">Submitted Annual Leave Request</div>
                        </div>
                      </div>
                    </td>
                    <td>Engineering</td>
                    <td><span class="workora-badge-warning">Pending Review</span></td>
                    <td class="text-slate-500 text-xs">45m ago</td>
                  </tr>
                  <tr>
                    <td>
                      <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-full bg-[#063B39] text-white font-bold text-[10px] flex items-center justify-center">HV</div>
                        <div>
                          <div class="font-bold text-[#063B39] text-xs">Helena Vance</div>
                          <div class="text-[10px] text-slate-500">Updated Company Shift Template</div>
                        </div>
                      </div>
                    </td>
                    <td>Human Resources</td>
                    <td><span class="workora-badge-success">Saved</span></td>
                    <td class="text-slate-500 text-xs">1h ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      }

    </div>
  `
})
export class DashboardPageComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  readonly authService = inject(AuthService);
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
      const el = this.elementRef.nativeElement;
      const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.4 } });

      if (el.querySelector('.dash-header')) {
        tl.from('.dash-header', { y: -10, opacity: 0 });
      }
      if (el.querySelectorAll('.dash-focus-grid > div').length) {
        tl.from('.dash-focus-grid > div', { y: 15, opacity: 0, stagger: 0.06 }, '-=0.2');
      }
      if (el.querySelectorAll('.dash-stats-grid .stat-card').length) {
        tl.from('.dash-stats-grid .stat-card', { y: 15, opacity: 0, stagger: 0.06 }, '-=0.2');
      }
      if (el.querySelectorAll('.dash-charts-grid > div').length) {
        tl.from('.dash-charts-grid > div', { y: 15, opacity: 0, stagger: 0.08 }, '-=0.2');
      }
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  onExportReport(): void {
    this.notificationService.showSuccess('Workforce executive summary exported to CSV & PDF.');
  }
}
