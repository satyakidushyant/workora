import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AttendanceApiRepository } from '../../../../data/repositories/attendance-api.repository';
import {
  AttendanceRecord,
  AttendanceCorrection,
  AttendanceSummary,
  LiveAttendanceStatus,
  RequestCorrectionParams
} from '../../../../domain/models/attendance.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { ClockInWidgetComponent } from '../components/clock-in-widget.component';
import { AttendanceCorrectionModalComponent } from '../components/attendance-correction-modal.component';

type AttendanceTab = 'my-attendance' | 'corrections-review' | 'team-live';

@Component({
  selector: 'app-attendance-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent,
    ClockInWidgetComponent,
    AttendanceCorrectionModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">schedule</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Time &amp; Attendance Tracking
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Live punch clock, shifts adherence, timesheets, and biometric presence telemetry.
          </p>
        </div>

        <!-- Navigation Tabs -->
        <div class="p-1 bg-white rounded-2xl border border-[#DCEBE7] shadow-2xs flex items-center gap-1 self-start sm:self-center">
          <button 
            type="button" 
            (click)="activeTab.set('my-attendance')"
            [ngClass]="activeTab() === 'my-attendance' ? 'bg-[#0E6E68] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#063B39]'"
            class="px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base">person</span>
            <span>My Attendance</span>
          </button>

          @if (canManageAttendance()) {
            <button 
              type="button" 
              (click)="activeTab.set('corrections-review')"
              [ngClass]="activeTab() === 'corrections-review' ? 'bg-[#0E6E68] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#063B39]'"
              class="px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base">fact_check</span>
              <span>Corrections Review</span>
            </button>

            <button 
              type="button" 
              (click)="activeTab.set('team-live')"
              [ngClass]="activeTab() === 'team-live' ? 'bg-[#0E6E68] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#063B39]'"
              class="px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base">pie_chart</span>
              <span>Live Presence</span>
            </button>
          }
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 1: MY ATTENDANCE -->
      <!-- ======================================================== -->
      @if (activeTab() === 'my-attendance') {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
          
          <!-- Live Punch Clock Widget -->
          <div class="lg:col-span-1">
            <app-clock-in-widget
              [todayRecord]="todayRecord()"
              [isSubmitting]="isSubmittingPunch()"
              (clockIn)="onClockIn($event)"
              (clockOut)="onClockOut($event)"
            ></app-clock-in-widget>

            <!-- Monthly Aggregation Summary -->
            @if (monthlySummary(); as s) {
              <div class="bg-white rounded-3xl p-5 border border-[#DCEBE7] shadow-xs mt-6 space-y-4">
                <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-3">
                  <h3 class="text-xs font-extrabold text-[#063B39] uppercase tracking-wider">This Month's Metrics</h3>
                  <span class="text-[10px] font-bold text-slate-400">Month {{ s.month }}/{{ s.year }}</span>
                </div>

                <div class="grid grid-cols-2 gap-3 text-xs">
                  <div class="p-3 bg-[#F4F8F7] rounded-xl border border-[#DCEBE7]/60">
                    <span class="text-[10px] text-slate-400 font-bold uppercase block">Present Days</span>
                    <span class="text-base font-extrabold text-[#063B39]">{{ s.presentDays }} / {{ s.totalWorkingDays }}</span>
                  </div>
                  <div class="p-3 bg-[#F4F8F7] rounded-xl border border-[#DCEBE7]/60">
                    <span class="text-[10px] text-slate-400 font-bold uppercase block">Hours Worked</span>
                    <span class="text-base font-extrabold text-[#0E6E68]">{{ s.totalHoursWorked | number:'1.1-1' }} hrs</span>
                  </div>
                  <div class="p-3 bg-[#F4F8F7] rounded-xl border border-[#DCEBE7]/60">
                    <span class="text-[10px] text-slate-400 font-bold uppercase block">Overtime</span>
                    <span class="text-base font-extrabold text-[#3FA79B]">{{ s.totalOvertimeHours | number:'1.1-1' }} hrs</span>
                  </div>
                  <div class="p-3 bg-[#F4F8F7] rounded-xl border border-[#DCEBE7]/60">
                    <span class="text-[10px] text-slate-400 font-bold uppercase block">Late / Half Days</span>
                    <span class="text-base font-extrabold text-amber-600">{{ s.lateDays + s.halfDays }}</span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Attendance Timesheet History -->
          <div class="lg:col-span-2 space-y-4">
            <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden">
              <div class="p-5 border-b border-[#DCEBE7] flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-extrabold text-[#063B39]">Recent Timesheet Records</h3>
                  <p class="text-xs text-slate-500">Daily punch entries and shift completion history.</p>
                </div>
              </div>

              @if (isLoadingHistory()) {
                <div class="p-6">
                  <app-workora-skeleton type="table" [count]="5"></app-workora-skeleton>
                </div>
              } @else if (history().length === 0) {
                <div class="p-12">
                  <app-workora-empty-state 
                    icon="alarm_off" 
                    title="No Punch History"
                    description="Clock in using the timer to start recording daily attendance."
                  ></app-workora-empty-state>
                </div>
              } @else {
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                        <th class="py-3 px-4">Date</th>
                        <th class="py-3 px-4">Check In</th>
                        <th class="py-3 px-4">Check Out</th>
                        <th class="py-3 px-4">Hours</th>
                        <th class="py-3 px-4">Status</th>
                        <th class="py-3 px-4 text-right">Correction</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-[#DCEBE7]/70">
                      @for (record of history(); track record.id) {
                        <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                          <td class="py-3 px-4 font-bold text-[#063B39]">
                            {{ record.attendanceDate | date:'mediumDate' }}
                          </td>
                          <td class="py-3 px-4 font-mono">
                            {{ record.checkInTime ? (record.checkInTime | date:'shortTime') : '—' }}
                          </td>
                          <td class="py-3 px-4 font-mono">
                            {{ record.checkOutTime ? (record.checkOutTime | date:'shortTime') : '—' }}
                          </td>
                          <td class="py-3 px-4 font-semibold text-[#0E6E68]">
                            {{ record.workingHours | number:'1.1-2' }}h
                          </td>
                          <td class="py-3 px-4">
                            <span 
                              [ngClass]="{
                                'bg-emerald-50 text-emerald-700 border-emerald-200': record.status === 'Present',
                                'bg-amber-50 text-amber-700 border-amber-200': record.status === 'Late' || record.status === 'HalfDay',
                                'bg-rose-50 text-rose-700 border-rose-200': record.status === 'Absent',
                                'bg-blue-50 text-blue-700 border-blue-200': record.status === 'OnLeave'
                              }"
                              class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border">
                              {{ record.status }}
                            </span>
                          </td>
                          <td class="py-3 px-4 text-right">
                            <button 
                              type="button" 
                              (click)="openCorrectionModal(record)"
                              class="px-2.5 py-1 rounded-lg text-slate-500 hover:text-[#0E6E68] hover:bg-[#3FA79B]/10 text-[11px] font-bold transition-all border-none bg-transparent cursor-pointer"
                              title="Request Punch Adjustment">
                              <span class="material-symbols-outlined text-sm">edit_calendar</span>
                            </button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>

        </div>
      }

      <!-- ======================================================== -->
      <!-- TAB 2: CORRECTIONS REVIEW -->
      <!-- ======================================================== -->
      @if (activeTab() === 'corrections-review') {
        <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden animate-in fade-in duration-150">
          <div class="p-5 border-b border-[#DCEBE7] flex items-center justify-between">
            <div>
              <h3 class="text-sm font-extrabold text-[#063B39]">Attendance Correction Requests</h3>
              <p class="text-xs text-slate-500">Review employee punch adjustment and missed-swipe submissions.</p>
            </div>
          </div>

          @if (isLoadingCorrections()) {
            <div class="p-6">
              <app-workora-skeleton type="table" [count]="5"></app-workora-skeleton>
            </div>
          } @else if (corrections().length === 0) {
            <div class="p-12">
              <app-workora-empty-state 
                icon="task_alt" 
                title="No Pending Corrections"
                description="All attendance adjustment requests have been reviewed."
              ></app-workora-empty-state>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                    <th class="py-3.5 px-5">Employee</th>
                    <th class="py-3.5 px-4">Date</th>
                    <th class="py-3.5 px-4">Original Punch</th>
                    <th class="py-3.5 px-4">Requested Punch</th>
                    <th class="py-3.5 px-4">Reason</th>
                    <th class="py-3.5 px-4">Status</th>
                    <th class="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#DCEBE7]/70">
                  @for (c of corrections(); track c.id) {
                    <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                      <td class="py-3.5 px-5">
                        <p class="font-bold text-[#063B39]">{{ c.employeeName }}</p>
                        <p class="text-[10px] text-slate-400 font-mono">{{ c.employeeCode }}</p>
                      </td>
                      <td class="py-3.5 px-4 font-medium text-slate-600">
                        {{ c.attendanceDate | date:'mediumDate' }}
                      </td>
                      <td class="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {{ c.originalCheckInTime ? (c.originalCheckInTime | date:'shortTime') : '—' }} – {{ c.originalCheckOutTime ? (c.originalCheckOutTime | date:'shortTime') : '—' }}
                      </td>
                      <td class="py-3.5 px-4 font-mono text-[11px] font-bold text-[#0E6E68]">
                        {{ c.requestedCheckInTime ? (c.requestedCheckInTime | date:'shortTime') : '—' }} – {{ c.requestedCheckOutTime ? (c.requestedCheckOutTime | date:'shortTime') : '—' }}
                      </td>
                      <td class="py-3.5 px-4 text-slate-700 max-w-xs truncate">
                        {{ c.reason }}
                      </td>
                      <td class="py-3.5 px-4">
                        <span 
                          [ngClass]="{
                            'bg-amber-50 text-amber-700 border-amber-200': c.status === 'Pending',
                            'bg-emerald-50 text-emerald-700 border-emerald-200': c.status === 'Approved',
                            'bg-rose-50 text-rose-700 border-rose-200': c.status === 'Rejected'
                          }"
                          class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border">
                          {{ c.status }}
                        </span>
                      </td>
                      <td class="py-3.5 px-5 text-right">
                        @if (c.status === 'Pending') {
                          <div class="inline-flex items-center gap-1.5">
                            <button 
                              type="button" 
                              (click)="onApproveCorrection(c.id)"
                              class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all border-none cursor-pointer">
                              Approve
                            </button>
                            <button 
                              type="button" 
                              (click)="onRejectCorrection(c.id)"
                              class="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-all border-none cursor-pointer">
                              Reject
                            </button>
                          </div>
                        } @else {
                          <span class="text-[11px] text-slate-400 font-bold">Processed</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }

      <!-- ======================================================== -->
      <!-- TAB 3: TEAM LIVE PRESENCE -->
      <!-- ======================================================== -->
      @if (activeTab() === 'team-live') {
        <div class="space-y-6 animate-in fade-in duration-150">
          @if (liveStatus(); as live) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div class="bg-white p-5 rounded-3xl border border-[#DCEBE7] shadow-xs">
                <span class="text-[10px] text-slate-400 font-bold uppercase block">Total Headcount</span>
                <p class="text-2xl font-extrabold text-[#063B39] mt-1">{{ live.totalEmployees }}</p>
              </div>

              <div class="bg-emerald-50 p-5 rounded-3xl border border-emerald-200 shadow-xs">
                <span class="text-[10px] text-emerald-800 font-bold uppercase block">Present Now</span>
                <p class="text-2xl font-extrabold text-emerald-700 mt-1">{{ live.presentCount }}</p>
              </div>

              <div class="bg-amber-50 p-5 rounded-3xl border border-amber-200 shadow-xs">
                <span class="text-[10px] text-amber-800 font-bold uppercase block">Late Arrivals</span>
                <p class="text-2xl font-extrabold text-amber-700 mt-1">{{ live.lateCount }}</p>
              </div>

              <div class="bg-blue-50 p-5 rounded-3xl border border-blue-200 shadow-xs">
                <span class="text-[10px] text-blue-800 font-bold uppercase block">Approved Leave</span>
                <p class="text-2xl font-extrabold text-blue-700 mt-1">{{ live.onLeaveCount }}</p>
              </div>

              <div class="bg-rose-50 p-5 rounded-3xl border border-rose-200 shadow-xs">
                <span class="text-[10px] text-rose-800 font-bold uppercase block">Absent / Unmarked</span>
                <p class="text-2xl font-extrabold text-rose-700 mt-1">{{ live.absentCount }}</p>
              </div>
            </div>
          }
        </div>
      }

      <!-- Correction Modal -->
      @if (isCorrectionModalOpen()) {
        <app-attendance-correction-modal
          [record]="selectedRecord()"
          [isSubmitting]="isSubmittingCorrection()"
          (closeModal)="isCorrectionModalOpen.set(false)"
          (submitCorrection)="onSaveCorrectionRequest($event)"
        ></app-attendance-correction-modal>
      }

    </div>
  `
})
export class AttendancePageComponent implements OnInit {
  private readonly attendanceRepo = inject(AttendanceApiRepository);
  private readonly notificationService = inject(NotificationService);
  readonly authService = inject(AuthService);

  readonly activeTab = signal<AttendanceTab>('my-attendance');

  readonly todayRecord = signal<AttendanceRecord | null>(null);
  readonly history = signal<AttendanceRecord[]>([]);
  readonly monthlySummary = signal<AttendanceSummary | null>(null);
  readonly corrections = signal<AttendanceCorrection[]>([]);
  readonly liveStatus = signal<LiveAttendanceStatus | null>(null);

  readonly isLoadingHistory = signal<boolean>(false);
  readonly isLoadingCorrections = signal<boolean>(false);
  readonly isSubmittingPunch = signal<boolean>(false);
  readonly isSubmittingCorrection = signal<boolean>(false);

  readonly isCorrectionModalOpen = signal<boolean>(false);
  readonly selectedRecord = signal<AttendanceRecord | null>(null);

  canManageAttendance(): boolean {
    return this.authService.hasRole('SuperAdmin') ||
           this.authService.hasRole('HRAdmin') ||
           this.authService.hasRole('Manager') ||
           this.authService.hasPermission('attendance.manage') ||
           this.authService.hasPermission('attendance.approve');
  }

  ngOnInit(): void {
    this.loadTodayStatus();
    this.loadHistory();
    this.loadMonthlySummary();

    if (this.canManageAttendance()) {
      this.loadCorrections();
      this.loadLiveStatus();
    }
  }

  loadTodayStatus(): void {
    this.attendanceRepo.getTodayStatus().subscribe({
      next: rec => this.todayRecord.set(rec),
      error: () => {}
    });
  }

  loadHistory(): void {
    const empId = this.authService.currentUser()?.employeeId ?? 1;
    this.isLoadingHistory.set(true);
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().substring(0, 10);
    const endDate = now.toISOString().substring(0, 10);

    this.attendanceRepo.getAttendanceHistory(empId, startDate, endDate)
      .pipe(finalize(() => this.isLoadingHistory.set(false)))
      .subscribe({
        next: items => this.history.set(items),
        error: err => this.notificationService.showError(err.message || 'Failed to load attendance history.')
      });
  }

  loadMonthlySummary(): void {
    const empId = this.authService.currentUser()?.employeeId ?? 1;
    const now = new Date();
    this.attendanceRepo.getSummary(empId, now.getMonth() + 1, now.getFullYear()).subscribe({
      next: s => this.monthlySummary.set(s),
      error: () => {}
    });
  }

  loadCorrections(): void {
    if (!this.canManageAttendance()) return;

    this.isLoadingCorrections.set(true);
    this.attendanceRepo.getCorrections(1, 20)
      .pipe(finalize(() => this.isLoadingCorrections.set(false)))
      .subscribe({
        next: p => this.corrections.set(p.items),
        error: () => {}
      });
  }

  loadLiveStatus(): void {
    if (!this.canManageAttendance()) return;

    this.attendanceRepo.getLiveStatus(1).subscribe({
      next: s => this.liveStatus.set(s),
      error: () => {}
    });
  }

  onClockIn(remarks?: string): void {
    this.isSubmittingPunch.set(true);
    this.attendanceRepo.checkIn(remarks)
      .pipe(finalize(() => this.isSubmittingPunch.set(false)))
      .subscribe({
        next: rec => {
          this.todayRecord.set(rec);
          this.notificationService.showSuccess('Clocked in successfully. Have a productive day!');
          this.loadHistory();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to clock in.')
      });
  }

  onClockOut(remarks?: string): void {
    this.isSubmittingPunch.set(true);
    this.attendanceRepo.checkOut(remarks)
      .pipe(finalize(() => this.isSubmittingPunch.set(false)))
      .subscribe({
        next: rec => {
          this.todayRecord.set(rec);
          this.notificationService.showSuccess('Clocked out successfully. Enjoy your evening!');
          this.loadHistory();
          this.loadMonthlySummary();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to clock out.')
      });
  }

  openCorrectionModal(record: AttendanceRecord): void {
    this.selectedRecord.set(record);
    this.isCorrectionModalOpen.set(true);
  }

  onSaveCorrectionRequest(params: RequestCorrectionParams): void {
    this.isSubmittingCorrection.set(true);
    this.attendanceRepo.requestCorrection(params)
      .pipe(finalize(() => this.isSubmittingCorrection.set(false)))
      .subscribe({
        next: () => {
          this.isCorrectionModalOpen.set(false);
          this.notificationService.showSuccess('Attendance correction request submitted to manager.');
          this.loadCorrections();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to submit correction.')
      });
  }

  onApproveCorrection(id: number): void {
    this.attendanceRepo.approveCorrection(id, 'Approved by manager').subscribe({
      next: () => {
        this.notificationService.showSuccess('Correction request approved.');
        this.loadCorrections();
        this.loadHistory();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to approve correction.')
    });
  }

  onRejectCorrection(id: number): void {
    this.attendanceRepo.rejectCorrection(id, 'Rejected').subscribe({
      next: () => {
        this.notificationService.showSuccess('Correction request rejected.');
        this.loadCorrections();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to reject correction.')
    });
  }
}
