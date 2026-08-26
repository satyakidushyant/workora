import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { LeaveApiRepository } from '../../../../data/repositories/leave-api.repository';
import {
  LeaveRequest,
  LeaveBalance,
  LeaveType,
  LeaveCalendarItem,
  ApplyLeaveParams,
  SaveLeaveTypeParams
} from '../../../../domain/models/leave.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { ApplyLeaveModalComponent } from '../components/apply-leave-modal.component';
import { LeaveTypeFormModalComponent } from '../components/leave-type-form-modal.component';

type LeaveTab = 'my-leaves' | 'approvals' | 'calendar' | 'policies';

@Component({
  selector: 'app-leave-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent,
    ApplyLeaveModalComponent,
    LeaveTypeFormModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">beach_access</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Leave &amp; Time Off
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage personal time-off quotas, apply for leave, track team calendars, and review requests.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            type="button" 
            (click)="openApplyModal()"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
            <span class="material-symbols-outlined text-base">add_circle</span>
            <span>Apply for Leave</span>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#DCEBE7] shadow-2xs overflow-x-auto">
        <button 
          type="button" 
          (click)="activeTab.set('my-leaves')"
          [ngClass]="activeTab() === 'my-leaves' ? 'bg-[#0E6E68] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#063B39]'"
          class="px-4 py-2 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5 shrink-0">
          <span class="material-symbols-outlined text-base">person</span>
          <span>My Leaves &amp; Balances</span>
        </button>

        <button 
          type="button" 
          (click)="activeTab.set('approvals')"
          [ngClass]="activeTab() === 'approvals' ? 'bg-[#0E6E68] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#063B39]'"
          class="px-4 py-2 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5 shrink-0">
          <span class="material-symbols-outlined text-base">approval</span>
          <span>Team Approvals ({{ pendingCount() }})</span>
        </button>

        <button 
          type="button" 
          (click)="activeTab.set('calendar')"
          [ngClass]="activeTab() === 'calendar' ? 'bg-[#0E6E68] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#063B39]'"
          class="px-4 py-2 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5 shrink-0">
          <span class="material-symbols-outlined text-base">calendar_month</span>
          <span>Team Leave Schedule</span>
        </button>

        <button 
          type="button" 
          (click)="activeTab.set('policies')"
          [ngClass]="activeTab() === 'policies' ? 'bg-[#0E6E68] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#063B39]'"
          class="px-4 py-2 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5 shrink-0">
          <span class="material-symbols-outlined text-base">policy</span>
          <span>Leave Policy Types</span>
        </button>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 1: MY LEAVES & BALANCES -->
      <!-- ======================================================== -->
      @if (activeTab() === 'my-leaves') {
        <div class="space-y-6 animate-in fade-in duration-150">
          
          <!-- Balance Quota Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            @for (b of balances(); track b.id) {
              <div class="bg-white rounded-3xl p-5 border border-[#DCEBE7] shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between mb-2">
                    <span class="text-xs font-extrabold text-[#063B39]">{{ b.leaveTypeName }}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#DCEBE7] text-[#063B39]">{{ b.leaveTypeCode }}</span>
                  </div>
                  <div class="flex items-baseline gap-1 mt-2">
                    <span class="text-3xl font-extrabold text-[#0E6E68] font-heading">{{ b.availableDays }}</span>
                    <span class="text-xs text-slate-400 font-semibold">/ {{ b.allocatedDays }} Available</span>
                  </div>
                </div>

                <div class="flex items-center justify-between text-[11px] text-slate-500 pt-3 mt-3 border-t border-[#DCEBE7]/70">
                  <span>Used: <strong class="text-slate-700">{{ b.usedDays }}</strong></span>
                  <span>Pending: <strong class="text-amber-600">{{ b.pendingDays }}</strong></span>
                </div>
              </div>
            }
          </div>

          <!-- My Leave Applications Table -->
          <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden">
            <div class="p-5 border-b border-[#DCEBE7]">
              <h3 class="text-sm font-extrabold text-[#063B39]">My Submitted Leave Requests</h3>
            </div>

            @if (isLoadingRequests()) {
              <div class="p-6">
                <app-workora-skeleton type="table" [count]="4"></app-workora-skeleton>
              </div>
            } @else if (myRequests().length === 0) {
              <div class="p-12">
                <app-workora-empty-state 
                  icon="beach_access" 
                  title="No Leave History"
                  description="You have not submitted any time-off requests yet."
                  actionLabel="Apply for Leave"
                  (actionClick)="openApplyModal()"
                ></app-workora-empty-state>
              </div>
            } @else {
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                      <th class="py-3 px-5">Type</th>
                      <th class="py-3 px-4">Period</th>
                      <th class="py-3 px-4">Days</th>
                      <th class="py-3 px-4">Reason</th>
                      <th class="py-3 px-4">Status</th>
                      <th class="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#DCEBE7]/70">
                    @for (r of myRequests(); track r.id) {
                      <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                        <td class="py-3.5 px-5 font-bold text-[#063B39]">
                          {{ r.leaveTypeName }}
                        </td>
                        <td class="py-3.5 px-4 font-medium text-slate-600">
                          {{ r.startDate | date:'mediumDate' }} – {{ r.endDate | date:'mediumDate' }}
                        </td>
                        <td class="py-3.5 px-4 font-extrabold text-[#0E6E68]">
                          {{ r.daysCount }} Day(s)
                        </td>
                        <td class="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                          {{ r.reason }}
                        </td>
                        <td class="py-3.5 px-4">
                          <span 
                            [ngClass]="{
                              'bg-amber-50 text-amber-700 border-amber-200': r.status === 'Pending',
                              'bg-emerald-50 text-emerald-700 border-emerald-200': r.status === 'Approved',
                              'bg-rose-50 text-rose-700 border-rose-200': r.status === 'Rejected',
                              'bg-slate-100 text-slate-500 border-slate-200': r.status === 'Cancelled'
                            }"
                            class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border">
                            {{ r.status }}
                          </span>
                        </td>
                        <td class="py-3.5 px-5 text-right">
                          @if (r.status === 'Pending') {
                            <button 
                              type="button" 
                              (click)="onCancelLeave(r.id)"
                              class="text-rose-600 hover:text-rose-800 text-[11px] font-bold border-none bg-transparent cursor-pointer">
                              Cancel
                            </button>
                          } @else {
                            <span class="text-slate-400 text-[11px]">—</span>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>

        </div>
      }

      <!-- ======================================================== -->
      <!-- TAB 2: TEAM APPROVALS -->
      <!-- ======================================================== -->
      @if (activeTab() === 'approvals') {
        <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden animate-in fade-in duration-150">
          <div class="p-5 border-b border-[#DCEBE7]">
            <h3 class="text-sm font-extrabold text-[#063B39]">Team Leave Applications for Approval</h3>
          </div>

          @if (allRequests().length === 0) {
            <div class="p-12">
              <app-workora-empty-state 
                icon="thumb_up" 
                title="No Pending Approvals"
                description="All leave requests for your team have been processed."
              ></app-workora-empty-state>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                    <th class="py-3.5 px-5">Employee</th>
                    <th class="py-3.5 px-4">Leave Type</th>
                    <th class="py-3.5 px-4">Date Range</th>
                    <th class="py-3.5 px-4">Days</th>
                    <th class="py-3.5 px-4">Reason</th>
                    <th class="py-3.5 px-4">Status</th>
                    <th class="py-3.5 px-5 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#DCEBE7]/70">
                  @for (r of allRequests(); track r.id) {
                    <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                      <td class="py-3.5 px-5">
                        <p class="font-bold text-[#063B39]">{{ r.employeeName }}</p>
                        <p class="text-[10px] text-slate-400 font-mono">{{ r.employeeCode }}</p>
                      </td>
                      <td class="py-3.5 px-4 font-semibold text-slate-700">
                        {{ r.leaveTypeName }}
                      </td>
                      <td class="py-3.5 px-4 text-slate-600 font-medium">
                        {{ r.startDate | date:'mediumDate' }} – {{ r.endDate | date:'mediumDate' }}
                      </td>
                      <td class="py-3.5 px-4 font-bold text-[#0E6E68]">
                        {{ r.daysCount }}d
                      </td>
                      <td class="py-3.5 px-4 text-slate-700 max-w-xs truncate">
                        {{ r.reason }}
                      </td>
                      <td class="py-3.5 px-4">
                        <span 
                          [ngClass]="{
                            'bg-amber-50 text-amber-700 border-amber-200': r.status === 'Pending',
                            'bg-emerald-50 text-emerald-700 border-emerald-200': r.status === 'Approved',
                            'bg-rose-50 text-rose-700 border-rose-200': r.status === 'Rejected'
                          }"
                          class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border">
                          {{ r.status }}
                        </span>
                      </td>
                      <td class="py-3.5 px-5 text-right">
                        @if (r.status === 'Pending') {
                          <div class="inline-flex items-center gap-1.5">
                            <button 
                              type="button" 
                              (click)="onApproveLeave(r.id)"
                              class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all border-none cursor-pointer">
                              Approve
                            </button>
                            <button 
                              type="button" 
                              (click)="onRejectLeave(r.id)"
                              class="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-all border-none cursor-pointer">
                              Reject
                            </button>
                          </div>
                        } @else {
                          <span class="text-slate-400 text-[11px] font-bold">Processed</span>
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
      <!-- TAB 3: TEAM CALENDAR -->
      <!-- ======================================================== -->
      @if (activeTab() === 'calendar') {
        <div class="bg-white rounded-3xl p-6 border border-[#DCEBE7] shadow-xs space-y-4 animate-in fade-in duration-150">
          <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
            <h3 class="text-sm font-extrabold text-[#063B39]">Approved Team Time-Off Schedule</h3>
            <span class="text-xs font-bold text-[#0E6E68]">{{ calendarItems().length }} Scheduled Leave Events</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (item of calendarItems(); track item.leaveRequestId) {
              <div class="p-4 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    <span class="material-symbols-outlined">flight</span>
                  </div>
                  <div>
                    <h4 class="text-xs font-extrabold text-[#063B39]">{{ item.employeeName }}</h4>
                    <p class="text-[11px] text-slate-500">{{ item.leaveTypeName }} ({{ item.daysCount }}d)</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-[10px] font-mono text-slate-500 font-bold block">{{ item.startDate | date:'MMM d' }} – {{ item.endDate | date:'MMM d' }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- ======================================================== -->
      <!-- TAB 4: LEAVE POLICIES -->
      <!-- ======================================================== -->
      @if (activeTab() === 'policies') {
        <div class="space-y-4 animate-in fade-in duration-150">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold text-slate-500">Configured Corporate Leave Policy Types</p>
            <button 
              type="button" 
              (click)="openCreatePolicyModal()"
              class="px-4 py-2 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer border-none">
              Add Policy Type
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (lt of leaveTypes(); track lt.id) {
              <div class="bg-white rounded-3xl p-5 border border-[#DCEBE7] shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-extrabold text-[#063B39]">{{ lt.name }}</h4>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#DCEBE7] text-[#063B39]">{{ lt.code }}</span>
                  </div>
                  <p class="text-xs text-slate-500 mt-2">{{ lt.description || 'Standard corporate leave quota.' }}</p>
                </div>

                <div class="pt-3 border-t border-[#DCEBE7] flex items-center justify-between text-xs font-bold">
                  <span class="text-[#0E6E68]">{{ lt.annualQuota }} Days / Year</span>
                  <button 
                    type="button" 
                    (click)="openEditPolicyModal(lt)"
                    class="text-[#0E6E68] hover:underline cursor-pointer border-none bg-transparent">
                    Edit Policy
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Apply Modal -->
      @if (isApplyModalOpen()) {
        <app-apply-leave-modal
          [leaveTypes]="leaveTypes()"
          [balances]="balances()"
          [isSubmitting]="isSubmittingApply()"
          (closeModal)="isApplyModalOpen.set(false)"
          (submitLeave)="onSaveApplyLeave($event)"
        ></app-apply-leave-modal>
      }

      <!-- Policy Form Modal -->
      @if (isPolicyModalOpen()) {
        <app-leave-type-form-modal
          [leaveType]="selectedLeaveType()"
          [isSubmitting]="isSubmittingPolicy()"
          (closeModal)="isPolicyModalOpen.set(false)"
          (savePolicy)="onSaveLeavePolicy($event)"
        ></app-leave-type-form-modal>
      }

    </div>
  `
})
export class LeavePageComponent implements OnInit {
  private readonly leaveRepo = inject(LeaveApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly activeTab = signal<LeaveTab>('my-leaves');

  readonly balances = signal<LeaveBalance[]>([]);
  readonly leaveTypes = signal<LeaveType[]>([]);
  readonly myRequests = signal<LeaveRequest[]>([]);
  readonly allRequests = signal<LeaveRequest[]>([]);
  readonly calendarItems = signal<LeaveCalendarItem[]>([]);

  readonly isLoadingRequests = signal<boolean>(false);
  readonly isSubmittingApply = signal<boolean>(false);
  readonly isSubmittingPolicy = signal<boolean>(false);

  readonly isApplyModalOpen = signal<boolean>(false);
  readonly isPolicyModalOpen = signal<boolean>(false);
  readonly selectedLeaveType = signal<LeaveType | null>(null);

  pendingCount(): number {
    return this.allRequests().filter(r => r.status === 'Pending').length;
  }

  ngOnInit(): void {
    this.loadBalances();
    this.loadLeaveTypes();
    this.loadMyRequests();
    this.loadAllRequests();
    this.loadCalendar();
  }

  loadBalances(): void {
    this.leaveRepo.getMyLeaveBalances().subscribe({
      next: b => this.balances.set(b),
      error: () => {}
    });
  }

  loadLeaveTypes(): void {
    this.leaveRepo.getLeaveTypes().subscribe({
      next: t => this.leaveTypes.set(t),
      error: () => {}
    });
  }

  loadMyRequests(): void {
    this.isLoadingRequests.set(true);
    this.leaveRepo.getLeaveRequests({ pageSize: 20 })
      .pipe(finalize(() => this.isLoadingRequests.set(false)))
      .subscribe({
        next: p => this.myRequests.set(p.items),
        error: () => {}
      });
  }

  loadAllRequests(): void {
    this.leaveRepo.getLeaveRequests({ pageSize: 50 }).subscribe({
      next: p => this.allRequests.set(p.items),
      error: () => {}
    });
  }

  loadCalendar(): void {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().substring(0, 10);
    const end = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString().substring(0, 10);

    this.leaveRepo.getLeaveCalendar(start, end).subscribe({
      next: items => this.calendarItems.set(items),
      error: () => {}
    });
  }

  openApplyModal(): void {
    this.isApplyModalOpen.set(true);
  }

  openCreatePolicyModal(): void {
    this.selectedLeaveType.set(null);
    this.isPolicyModalOpen.set(true);
  }

  openEditPolicyModal(lt: LeaveType): void {
    this.selectedLeaveType.set(lt);
    this.isPolicyModalOpen.set(true);
  }

  onSaveApplyLeave(params: ApplyLeaveParams): void {
    this.isSubmittingApply.set(true);
    this.leaveRepo.applyLeave(params)
      .pipe(finalize(() => this.isSubmittingApply.set(false)))
      .subscribe({
        next: () => {
          this.isApplyModalOpen.set(false);
          this.notificationService.showSuccess('Leave application submitted successfully.');
          this.loadMyRequests();
          this.loadBalances();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to submit leave.')
      });
  }

  onSaveLeavePolicy(params: SaveLeaveTypeParams): void {
    this.isSubmittingPolicy.set(true);
    const req$ = params.id
      ? this.leaveRepo.updateLeaveType(params)
      : this.leaveRepo.createLeaveType(params);

    req$.pipe(finalize(() => this.isSubmittingPolicy.set(false)))
      .subscribe({
        next: () => {
          this.isPolicyModalOpen.set(false);
          this.notificationService.showSuccess('Leave policy saved.');
          this.loadLeaveTypes();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to save policy.')
      });
  }

  onApproveLeave(id: number): void {
    this.leaveRepo.approveLeave(id, 'Approved').subscribe({
      next: () => {
        this.notificationService.showSuccess('Leave request approved.');
        this.loadAllRequests();
        this.loadCalendar();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to approve leave.')
    });
  }

  onRejectLeave(id: number): void {
    this.leaveRepo.rejectLeave(id, 'Rejected').subscribe({
      next: () => {
        this.notificationService.showSuccess('Leave request rejected.');
        this.loadAllRequests();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to reject leave.')
    });
  }

  onCancelLeave(id: number): void {
    this.leaveRepo.cancelLeave(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Leave request cancelled.');
        this.loadMyRequests();
        this.loadBalances();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to cancel leave.')
    });
  }
}
