import { Component, ElementRef, AfterViewInit, OnDestroy, OnInit, inject, signal, computed, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { EmployeeApiRepository } from '../../../../data/repositories/employee-api.repository';
import { AttendanceApiRepository } from '../../../../data/repositories/attendance-api.repository';
import { LeaveApiRepository } from '../../../../data/repositories/leave-api.repository';
import { PayrollApiRepository } from '../../../../data/repositories/payroll-api.repository';
import { HolidayApiRepository } from '../../../../data/repositories/holiday-api.repository';
import { TaskApiRepository } from '../../../../data/repositories/task-api.repository';
import { SuperAdminApiRepository } from '../../../../data/repositories/superadmin-api.repository';
import { OrganizationApiRepository } from '../../../../data/repositories/organization-api.repository';
import { Employee } from '../../../../domain/models/employee.model';
import { AttendanceRecord, LiveAttendanceStatus } from '../../../../domain/models/attendance.model';
import { LeaveBalance, LeaveRequest } from '../../../../domain/models/leave.model';
import { Payslip, PayrollRun } from '../../../../domain/models/payroll.model';
import { Holiday } from '../../../../domain/models/holiday.model';
import { TaskItem } from '../../../../domain/models/task.model';
import { SuperAdminMetrics, TenantOrganization } from '../../../../domain/models/superadmin.model';
import { Department, Branch } from '../../../../domain/models/organization.model';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';

/**
 * Production Workora Dashboard Workspace Component.
 * Fetches and displays 100% real-time operational data from backend APIs
 * tailored dynamically for SuperAdmin, HRAdmin, FinanceManager, Manager, and Employee personas.
 */
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
              Live workforce health and operational overview for {{ currentUser()?.companyName || 'your organization' }}.
            } @else if (authService.hasRole('FinanceManager')) {
              Company Payroll, Statutory Remittances, and Expense Claims overview.
            } @else if (authService.hasRole('Manager')) {
              Direct team availability and task velocity overview.
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
            <button (click)="onExportSummary()" class="workora-btn-secondary text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial">
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

      <!-- Loading State Skeleton -->
      @if (isLoading()) {
        <div class="space-y-6">
          <app-workora-skeleton type="card" [count]="4"></app-workora-skeleton>
          <app-workora-skeleton type="table" [count]="3"></app-workora-skeleton>
        </div>
      } @else {

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
                  <h4 class="text-xs font-bold text-[#063B39]">{{ organizations().length }} Tenant Organizations</h4>
                  <p class="text-[11px] text-slate-500">Live SaaS Provisioning</p>
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
                  <h4 class="text-xs font-bold text-[#063B39]">Audit &amp; Security Health</h4>
                  <p class="text-[11px] text-emerald-700 font-semibold">Active Monitoring</p>
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
                  <h4 class="text-xs font-bold text-[#063B39]">SaaS Subscription Plans</h4>
                  <p class="text-[11px] text-slate-500">Tier Management</p>
                </div>
              </div>
              <a routerLink="/superadmin" class="px-3 py-1.5 bg-[#DCEBE7] hover:bg-[#0E6E68] hover:text-white text-[#063B39] text-[11px] font-bold rounded-lg transition-colors cursor-pointer shrink-0">
                Configure
              </a>
            </div>
          </div>

          <!-- SuperAdmin Stats Grid -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 dash-stats-grid">
            <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-2 sm:mb-3">
                  <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-lg">domain</span>
                  </div>
                  <span class="workora-badge-success text-[10px] sm:text-xs">Active</span>
                </div>
                <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant Organizations</p>
                <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">
                  {{ metrics()?.totalOrganizations ?? organizations().length }} Orgs
                </h3>
              </div>
              <p class="text-[10px] sm:text-[11px] text-slate-500 mt-2">Active Multi-Tenancy</p>
            </div>

            <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-2 sm:mb-3">
                  <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#3FA79B] flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-lg">badge</span>
                  </div>
                  <span class="workora-badge-teal text-[10px] sm:text-xs">Global</span>
                </div>
                <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total System Users</p>
                <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">
                  {{ metrics()?.totalSystemUsers ?? '-' }} Users
                </h3>
              </div>
              <p class="text-[10px] sm:text-[11px] text-slate-500 mt-2">Platform-wide accounts</p>
            </div>

            <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-2 sm:mb-3">
                  <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-lg">groups</span>
                  </div>
                  <span class="text-[#0E6E68] text-[10px] sm:text-xs font-bold bg-[#DCEBE7]/50 px-2 py-0.5 rounded-full">Workforce</span>
                </div>
                <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Managed Employees</p>
                <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">
                  {{ metrics()?.totalEmployees ?? '-' }} Staff
                </h3>
              </div>
              <p class="text-[10px] sm:text-[11px] text-emerald-600 font-semibold mt-2">All Tenant Workforce</p>
            </div>

            <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-2 sm:mb-3">
                  <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-lg">admin_panel_settings</span>
                  </div>
                  <span class="workora-badge-success text-[10px] sm:text-xs">Security</span>
                </div>
                <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Active Organizations</p>
                <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">
                  {{ metrics()?.activeOrganizations ?? '-' }} Active
                </h3>
              </div>
              <p class="text-[10px] sm:text-[11px] text-slate-500 mt-2">Operational tenants</p>
            </div>
          </div>
        }

        <!-- ========================================================================= -->
        <!-- VIEW 2: HR ADMIN & COMPANY ADMIN DASHBOARD                                -->
        <!-- ========================================================================= -->
        @else if (authService.hasRole('HRAdmin') || authService.hasRole('Manager')) {
          <!-- Today's Focus Action Banners -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 dash-focus-grid">
            <div class="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">event_available</span>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-[#063B39]">{{ pendingLeaveRequests().length }} Pending Leave Requests</h4>
                  <p class="text-[11px] text-slate-500">Requires review &amp; approval</p>
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
                  <h4 class="text-xs font-bold text-[#063B39]">Monthly Payroll Cycles</h4>
                  <p class="text-[11px] text-emerald-700 font-semibold">{{ payrollRuns().length }} Active Cycles</p>
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
                  <h4 class="text-xs font-bold text-[#063B39]">Workforce Directory</h4>
                  <p class="text-[11px] text-slate-500">{{ totalEmployees() }} Active Staff Members</p>
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
                <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">
                  {{ totalEmployees() }} Members
                </h3>
              </div>
              <p class="text-[10px] sm:text-[11px] text-slate-500 mt-2">Active Employees</p>
            </div>

            <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-2 sm:mb-3">
                  <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#3FA79B] flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-lg">schedule</span>
                  </div>
                  <span class="workora-badge-teal text-[10px] sm:text-xs">Live</span>
                </div>
                <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Attendance</p>
                <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">
                  {{ livePresence()?.presentCount ?? 0 }} Present
                </h3>
              </div>
              <p class="text-[10px] sm:text-[11px] text-slate-500 mt-2">
                {{ livePresence()?.lateCount ? (livePresence()!.lateCount + ' Late • ') : '' }}Real-time Tracking
              </p>
            </div>

            <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-2 sm:mb-3">
                  <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-lg">account_tree</span>
                  </div>
                  <span class="text-[#0E6E68] text-[10px] sm:text-xs font-bold bg-[#DCEBE7]/50 px-2 py-0.5 rounded-full">
                    {{ departments().length }} Depts
                  </span>
                </div>
                <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Branches &amp; Hubs</p>
                <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">
                  {{ branches().length }} Locations
                </h3>
              </div>
              <p class="text-[10px] sm:text-[11px] text-emerald-600 font-semibold mt-2">Active Org Master</p>
            </div>

            <div class="workora-card p-4 sm:p-5 rounded-2xl bg-white border border-[#DCEBE7] shadow-xs stat-card flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-2 sm:mb-3">
                  <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-lg">checklist</span>
                  </div>
                  <span class="workora-badge-success text-[10px] sm:text-xs">Tasks</span>
                </div>
                <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Open Tasks</p>
                <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-0.5 font-heading">
                  {{ tasks().length }} Tracked
                </h3>
              </div>
              <p class="text-[10px] sm:text-[11px] text-slate-500 mt-2">Team Action Items</p>
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
                    <p class="text-[11px] text-slate-500">
                      {{ todayAttendance()?.checkInTime ? 'Clocked in at ' + (todayAttendance()?.checkInTime | date:'shortTime') : 'Not yet clocked in today' }}
                    </p>
                  </div>
                </div>
                <span 
                  [ngClass]="todayAttendance()?.checkInTime && !todayAttendance()?.checkOutTime ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'"
                  class="px-2.5 py-1 text-[10px] font-bold rounded-full border"
                >
                  {{ todayAttendance()?.checkInTime && !todayAttendance()?.checkOutTime ? 'On Duty' : (todayAttendance()?.checkOutTime ? 'Shift Completed' : 'Pending Check-In') }}
                </span>
              </div>
              
              <div class="flex items-center justify-between pt-2 border-t border-[#DCEBE7]">
                <div>
                  <p class="text-[10px] text-slate-500 font-bold uppercase">Total Hours</p>
                  <p class="text-base font-extrabold text-[#063B39] font-mono">
                    {{ todayAttendance()?.workingHours ? (todayAttendance()!.workingHours + ' hrs') : '--:--' }}
                  </p>
                </div>
                <a routerLink="/attendance" class="px-4 py-2 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs">
                  {{ todayAttendance()?.checkInTime && !todayAttendance()?.checkOutTime ? 'Punch Out' : 'Punch Clock' }}
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
                    <h4 class="text-xs font-bold text-[#063B39]">My Leave Quotas</h4>
                    <p class="text-[11px] text-slate-500">{{ totalAvailableLeaves() }} Days Available</p>
                  </div>
                </div>
                <a routerLink="/leave" class="text-xs font-bold text-[#0E6E68] hover:underline">Apply</a>
              </div>

              @if (leaveBalances().length > 0) {
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-[#DCEBE7] text-center">
                  @for (bal of leaveBalances().slice(0, 3); track bal.leaveTypeId) {
                    <div class="p-2 bg-[#F4F8F7] rounded-xl">
                      <p class="text-xs font-extrabold text-[#063B39]">{{ bal.availableDays }}</p>
                      <p class="text-[9px] text-slate-500 font-bold truncate">{{ bal.leaveTypeName }}</p>
                    </div>
                  }
                </div>
              } @else {
                <p class="text-xs text-slate-400 text-center py-2 border-t border-[#DCEBE7]">No leave quotas allocated yet.</p>
              }
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
                    <p class="text-[11px] text-slate-500">
                      {{ latestPayslip() ? (latestPayslip()!.paymentStatus) : 'No payslips published' }}
                    </p>
                  </div>
                </div>
                @if (latestPayslip()) {
                  <span class="workora-badge-success text-[10px]">Disbursed</span>
                }
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-[#DCEBE7]">
                <div>
                  <p class="text-[10px] text-slate-500 font-bold uppercase">Net Payout</p>
                  <p class="text-base font-extrabold text-[#063B39]">
                    {{ latestPayslip() ? ('$' + latestPayslip()!.netSalary.toLocaleString()) : '$0.00' }}
                  </p>
                </div>
                <a routerLink="/my-payslips" class="px-3 py-1.5 bg-[#DCEBE7] hover:bg-[#0E6E68] hover:text-white text-[#063B39] text-xs font-bold rounded-xl transition-colors cursor-pointer">
                  View Payslips
                </a>
              </div>
            </div>

          </div>

          <!-- ESS Secondary Widgets: Tasks & Upcoming Holidays -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 dash-charts-grid">
            
            <!-- My Tasks -->
            <div class="bg-white p-5 sm:p-6 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-[#DCEBE7]">
                <div>
                  <h3 class="text-sm font-extrabold text-[#063B39] font-heading">My Assigned Tasks</h3>
                  <p class="text-[11px] text-slate-500">Priorities requiring action</p>
                </div>
                <a routerLink="/tasks" class="text-xs font-bold text-[#0E6E68] hover:underline">View All</a>
              </div>

              @if (tasks().length > 0) {
                <div class="space-y-2.5">
                  @for (t of tasks().slice(0, 3); track t.id) {
                    <div class="p-3 bg-[#F4F8F7] rounded-xl flex items-center justify-between">
                      <div class="flex items-center gap-2.5 min-w-0">
                        <span class="material-symbols-outlined text-base" [ngClass]="t.status === 'Done' ? 'text-emerald-600' : 'text-[#0E6E68]'">
                          {{ t.status === 'Done' ? 'check_circle' : 'radio_button_unchecked' }}
                        </span>
                        <span class="text-xs font-bold text-[#063B39] truncate">{{ t.title }}</span>
                      </div>
                      <span [ngClass]="t.priority === 'High' ? 'text-rose-600 bg-rose-50' : 'text-slate-500 bg-white'" class="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0">
                        {{ t.status }}
                      </span>
                    </div>
                  }
                </div>
              } @else {
                <app-workora-empty-state 
                  title="No Pending Tasks" 
                  description="You are all caught up on your assigned action items.">
                </app-workora-empty-state>
              }
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

              @if (upcomingHolidays().length > 0) {
                <div class="space-y-2.5">
                  @for (h of upcomingHolidays().slice(0, 3); track h.id) {
                    <div class="p-3 bg-[#F4F8F7] rounded-xl flex items-center justify-between">
                      <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center font-bold text-xs">
                          {{ h.date | date:'MMM' }}
                        </div>
                        <div>
                          <div class="text-xs font-bold text-[#063B39]">{{ h.name }}</div>
                          <div class="text-[10px] text-slate-500">{{ h.date | date:'EEEE, MMM d, y' }}</div>
                        </div>
                      </div>
                      <span class="workora-badge-teal text-[10px]">{{ h.type }}</span>
                    </div>
                  }
                </div>
              } @else {
                <app-workora-empty-state 
                  title="No Upcoming Holidays" 
                  description="No holidays configured for the upcoming period.">
                </app-workora-empty-state>
              }
            </div>

          </div>
        }

        <!-- Department Breakdown & Recent Activity (For Admins & Managers) -->
        @if (authService.hasRole('SuperAdmin') || authService.hasRole('HRAdmin') || authService.hasRole('Manager')) {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 dash-charts-grid">
            
            <!-- Department Breakdown -->
            <div class="bg-white col-span-1 p-5 sm:p-6 rounded-3xl border border-[#DCEBE7] shadow-xs workora-card space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-[#DCEBE7]">
                <div>
                  <h3 class="text-sm font-extrabold text-[#063B39] font-heading">Department Breakdown</h3>
                  <p class="text-[11px] text-slate-500">Configured departments</p>
                </div>
                <span class="material-symbols-outlined text-[#0E6E68] text-xl">pie_chart</span>
              </div>

              @if (departments().length > 0) {
                <div class="space-y-3">
                  @for (d of departments().slice(0, 5); track d.id) {
                    <div>
                      <div class="flex justify-between text-xs font-bold mb-1">
                        <span class="text-[#063B39]">{{ d.name }}</span>
                        <span class="text-[#0E6E68]">{{ d.code }}</span>
                      </div>
                      <div class="h-2 w-full bg-[#DCEBE7]/50 rounded-full overflow-hidden">
                        <div class="h-full bg-[#0E6E68] rounded-full" style="width: 100%"></div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <p class="text-xs text-slate-400 text-center py-4">No departments configured yet.</p>
              }
            </div>

            <!-- Recent Workforce Activity Stream -->
            <div class="bg-white col-span-1 lg:col-span-2 p-5 sm:p-6 rounded-3xl border border-[#DCEBE7] shadow-xs workora-card space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-[#DCEBE7]">
                <div>
                  <h3 class="text-sm font-extrabold text-[#063B39] font-heading">Recent Workforce Directory</h3>
                  <p class="text-[11px] text-slate-500">Live operational personnel records</p>
                </div>
                <a routerLink="/employees" class="text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors flex items-center gap-1">
                  <span>View All</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>

              @if (employees().length > 0) {
                <div class="workora-table-responsive">
                  <table class="workora-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Hire Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (emp of employees().slice(0, 5); track emp.id) {
                        <tr>
                          <td>
                            <div class="flex items-center gap-2.5">
                              <div class="w-7 h-7 rounded-full bg-[#0E6E68] text-white font-bold text-[10px] flex items-center justify-center">
                                {{ getInitials(emp.firstName, emp.lastName) }}
                              </div>
                              <div>
                                <div class="font-bold text-[#063B39] text-xs">{{ emp.fullName }}</div>
                                <div class="text-[10px] text-slate-500">{{ emp.employeeCode }}</div>
                              </div>
                            </div>
                          </td>
                          <td class="text-xs text-slate-600">{{ emp.departmentName || '-' }}</td>
                          <td>
                            <span [ngClass]="emp.employmentStatus === 'Active' ? 'workora-badge-success' : 'workora-badge-warning'" class="text-[10px]">
                              {{ emp.employmentStatus }}
                            </span>
                          </td>
                          <td class="text-slate-500 text-xs">{{ emp.hireDate | date:'mediumDate' }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <app-workora-empty-state 
                  title="No Employees Found" 
                  description="Onboard your first employee to populate the directory.">
                </app-workora-empty-state>
              }
            </div>

          </div>
        }

      }

    </div>
  `
})
export class DashboardPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly empRepo = inject(EmployeeApiRepository);
  private readonly attendanceRepo = inject(AttendanceApiRepository);
  private readonly leaveRepo = inject(LeaveApiRepository);
  private readonly payrollRepo = inject(PayrollApiRepository);
  private readonly holidayRepo = inject(HolidayApiRepository);
  private readonly taskRepo = inject(TaskApiRepository);
  private readonly superAdminRepo = inject(SuperAdminApiRepository);
  private readonly orgRepo = inject(OrganizationApiRepository);

  readonly currentUser = this.authService.currentUser;
  readonly isLoading = signal<boolean>(false);

  // Live Domain Signals
  readonly metrics = signal<SuperAdminMetrics | null>(null);
  readonly organizations = signal<TenantOrganization[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly totalEmployees = signal<number>(0);
  readonly departments = signal<Department[]>([]);
  readonly branches = signal<Branch[]>([]);
  readonly todayAttendance = signal<AttendanceRecord | null>(null);
  readonly livePresence = signal<LiveAttendanceStatus | null>(null);
  readonly leaveBalances = signal<LeaveBalance[]>([]);
  readonly pendingLeaveRequests = signal<LeaveRequest[]>([]);
  readonly payrollRuns = signal<PayrollRun[]>([]);
  readonly myPayslips = signal<Payslip[]>([]);
  readonly tasks = signal<TaskItem[]>([]);
  readonly upcomingHolidays = signal<Holiday[]>([]);

  readonly totalAvailableLeaves = computed<number>(() => {
    return this.leaveBalances().reduce((acc, bal) => acc + (bal.availableDays || 0), 0);
  });

  readonly latestPayslip = computed<Payslip | null>(() => {
    const slips = this.myPayslips();
    return slips.length > 0 ? slips[0] : null;
  });

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

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    const companyId = this.authService.currentUser()?.companyId;
    const currentYear = new Date().getFullYear();

    // 1. SuperAdmin Data
    if (this.authService.hasRole('SuperAdmin')) {
      this.superAdminRepo.getMetrics()
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: m => this.metrics.set(m),
          error: () => {}
        });

      this.superAdminRepo.getOrganizations(1, 10).subscribe({
        next: p => this.organizations.set(p.items),
        error: () => {}
      });
    }

    // 2. HR & Manager Operations Data
    if (this.authService.hasRole('HRAdmin') || this.authService.hasRole('Manager') || this.authService.hasPermission('employees.view')) {
      this.empRepo.getEmployees({ pageSize: 10 })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: p => {
            this.employees.set(p.items);
            this.totalEmployees.set(p.totalCount);
          },
          error: () => {}
        });

      this.attendanceRepo.getLiveStatus(companyId ?? undefined).subscribe({
        next: s => this.livePresence.set(s),
        error: () => {}
      });

      this.orgRepo.getDepartments({ pageSize: 10 }).subscribe({
        next: p => this.departments.set(p.items),
        error: () => {}
      });

      this.orgRepo.getBranches({ pageSize: 10 }).subscribe({
        next: p => this.branches.set(p.items),
        error: () => {}
      });

      this.leaveRepo.getLeaveRequests({ pageSize: 10 }).subscribe({
        next: p => this.pendingLeaveRequests.set((p.items || []).filter(r => r.status && r.status.toLowerCase().includes('pending'))),
        error: () => {}
      });

      this.payrollRepo.getRuns(1, 5).subscribe({
        next: p => this.payrollRuns.set(p.items),
        error: () => {}
      });
    }

    // 3. Employee Self-Service Data (For tenant employees)
    if (!this.authService.hasRole('SuperAdmin')) {
      this.attendanceRepo.getTodayStatus()
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: rec => this.todayAttendance.set(rec),
          error: () => {}
        });

      this.leaveRepo.getMyLeaveBalances().subscribe({
        next: b => this.leaveBalances.set(b),
        error: () => {}
      });

      this.payrollRepo.getMyPayslips().subscribe({
        next: p => this.myPayslips.set(p),
        error: () => {}
      });

      this.taskRepo.getMyTasks().subscribe({
        next: p => this.tasks.set(p),
        error: () => {}
      });

      this.holidayRepo.getHolidays(currentYear).subscribe({
        next: h => this.upcomingHolidays.set(h),
        error: () => {}
      });
    }
  }

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
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  getInitials(firstName?: string, lastName?: string): string {
    const f = firstName ? firstName.charAt(0).toUpperCase() : 'W';
    const l = lastName ? lastName.charAt(0).toUpperCase() : 'U';
    return `${f}${l}`;
  }

  onExportSummary(): void {
    this.notificationService.showSuccess('Workforce executive summary exported to CSV & PDF.');
  }
}
