import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ShiftApiRepository } from '../../../../data/repositories/shift-api.repository';
import { EmployeeApiRepository } from '../../../../data/repositories/employee-api.repository';
import { Shift, SaveShiftParams } from '../../../../domain/models/shift.model';
import { Employee } from '../../../../domain/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

@Component({
  selector: 'app-shifts-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkoraSelectComponent,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraEmptyStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">more_time</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Work Shifts &amp; Scheduling
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Configure rotational rosters, morning/evening shifts, grace periods, and employee assignments.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            type="button" 
            (click)="openAssignShiftModal()"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-[#DCEBE7] transition-all shadow-2xs cursor-pointer">
            <span class="material-symbols-outlined text-base text-[#0E6E68]">person_add</span>
            <span>Assign Shift</span>
          </button>

          <button 
            type="button" 
            (click)="openCreateShiftModal()"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
            <span class="material-symbols-outlined text-base">add</span>
            <span>Create Shift</span>
          </button>
        </div>
      </div>

      <!-- Shifts Grid -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (i of [1,2,3]; track i) {
            <app-workora-skeleton type="card"></app-workora-skeleton>
          }
        </div>
      } @else if (shifts().length === 0) {
        <div class="bg-white rounded-3xl p-12 border border-[#DCEBE7] shadow-xs">
          <app-workora-empty-state 
            icon="schedule" 
            title="No Shifts Configured"
            description="Create your first working shift to assign to employees."
            actionLabel="Create First Shift"
            (actionClick)="openCreateShiftModal()"
          ></app-workora-empty-state>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (shift of shifts(); track shift.id) {
            <div class="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCEBE7] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div class="flex items-start justify-between gap-3 mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-[#0E6E68]/10 text-[#0E6E68] flex items-center justify-center font-bold">
                      <span class="material-symbols-outlined text-xl">timer</span>
                    </div>
                    <div>
                      <h3 class="font-extrabold text-sm text-[#063B39]">{{ shift.name }}</h3>
                      <span class="font-mono text-[10px] font-extrabold text-[#0E6E68]">{{ shift.code }}</span>
                    </div>
                  </div>

                  @if (shift.spansMidnight) {
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                      Night Shift
                    </span>
                  }
                </div>

                <!-- Shift Timings Banner -->
                <div class="my-3 p-3.5 bg-gradient-to-tr from-[#063B39] to-[#0E6E68] text-white rounded-2xl flex items-center justify-between shadow-xs">
                  <div>
                    <span class="text-[10px] font-bold text-white/70 uppercase block">Shift Timings</span>
                    <p class="text-sm font-extrabold font-mono mt-0.5">{{ shift.startTime }} – {{ shift.endTime }}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-bold text-white/70 uppercase block">Break Time</span>
                    <p class="text-xs font-bold mt-0.5">{{ shift.breakMinutes }} Mins</p>
                  </div>
                </div>

                <div class="space-y-1.5 text-xs text-slate-600 bg-[#F4F8F7] p-3 rounded-2xl border border-[#DCEBE7]/70">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400 font-bold uppercase text-[10px]">Grace Period</span>
                    <span class="font-bold text-[#063B39]">{{ shift.gracePeriodMinutes }} Minutes</span>
                  </div>
                  @if (shift.description) {
                    <div class="pt-1 text-[11px] text-slate-500 line-clamp-2">
                      {{ shift.description }}
                    </div>
                  }
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-[#DCEBE7]">
                <button 
                  type="button" 
                  (click)="onDeleteShift(shift.id)"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border-none bg-transparent cursor-pointer"
                  title="Delete Shift">
                  <span class="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          }
        </div>

        <div class="bg-white rounded-2xl p-4 border border-[#DCEBE7]">
          <app-workora-pagination
            [pageNumber]="pageIndex()"
            [totalPages]="totalPages()"
            [totalCount]="totalShifts()"
            [pageSize]="pageSize"
            (pageChange)="onPageChange($event)"
          ></app-workora-pagination>
        </div>
      }

      <!-- Create Shift Modal -->
      @if (isCreateModalOpen()) {
        <div class="workora-modal-overlay" (click)="isCreateModalOpen.set(false)">
          <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
            <div class="workora-modal-header">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-[#063B39] font-heading">Create Work Shift</h3>
                  <p class="text-xs text-slate-500">Define working hours and grace period rules.</p>
                </div>
              </div>
              <button (click)="isCreateModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form [formGroup]="createForm" (ngSubmit)="onSaveShift()" class="flex flex-col flex-1 overflow-hidden">
              <div class="workora-modal-body space-y-4">
                <div>
                  <label class="workora-label">Shift Name <span class="text-rose-500">*</span></label>
                  <input type="text" formControlName="name" placeholder="e.g. Standard General Shift" class="workora-input !py-2.5" />
                </div>

                <div>
                  <label class="workora-label">Code <span class="text-rose-500">*</span></label>
                  <input type="text" formControlName="code" placeholder="e.g. GS-01" class="workora-input !py-2.5 uppercase font-mono" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="workora-label">Start Time <span class="text-rose-500">*</span></label>
                    <input type="time" formControlName="startTime" class="workora-input !py-2.5" />
                  </div>

                  <div>
                    <label class="workora-label">End Time <span class="text-rose-500">*</span></label>
                    <input type="time" formControlName="endTime" class="workora-input !py-2.5" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="workora-label">Grace Period (Mins)</label>
                    <input type="number" formControlName="gracePeriodMinutes" class="workora-input !py-2.5" />
                  </div>

                  <div>
                    <label class="workora-label">Break Duration (Mins)</label>
                    <input type="number" formControlName="breakMinutes" class="workora-input !py-2.5" />
                  </div>
                </div>

                <label class="flex items-center gap-2 text-xs font-bold text-[#063B39] cursor-pointer">
                  <input type="checkbox" formControlName="spansMidnight" class="workora-checkbox" />
                  <span>Shift Spans Midnight (Night Shift)</span>
                </label>
              </div>

              <div class="workora-modal-footer">
                <button type="button" (click)="isCreateModalOpen.set(false)" class="workora-btn-secondary">
                  Cancel
                </button>
                <button type="submit" [disabled]="createForm.invalid || isSubmitting()" class="workora-btn-primary">
                  Create Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Assign Shift Modal -->
      @if (isAssignModalOpen()) {
        <div class="workora-modal-overlay" (click)="isAssignModalOpen.set(false)">
          <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
            <div class="workora-modal-header">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined">person_pin</span>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-[#063B39] font-heading">Assign Shift to Employee</h3>
                  <p class="text-xs text-slate-500">Attach shift schedule to an employee.</p>
                </div>
              </div>
              <button (click)="isAssignModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div class="workora-modal-body space-y-4">
              <div>
                <label class="workora-label">Select Employee <span class="text-rose-500">*</span></label>
                <app-workora-select
                  [(ngModel)]="assignedEmpId"
                  [options]="employeeOptions()"
                  [searchable]="true"
                  searchPlaceholder="Search employee..."
                  placeholder="Select employee"
                  icon="person"
                ></app-workora-select>
              </div>

              <div>
                <label class="workora-label">Select Shift <span class="text-rose-500">*</span></label>
                <app-workora-select
                  [(ngModel)]="assignedShiftId"
                  [options]="shiftOptions()"
                  placeholder="Select shift"
                  icon="timer"
                ></app-workora-select>
              </div>

              <div>
                <label class="workora-label">Effective From Date <span class="text-rose-500">*</span></label>
                <input type="date" [(ngModel)]="effectiveFromDate" class="workora-input !py-2.5" />
              </div>
            </div>

            <div class="workora-modal-footer">
              <button type="button" (click)="isAssignModalOpen.set(false)" class="workora-btn-secondary">
                Cancel
              </button>
              <button type="button" (click)="onConfirmAssignShift()" [disabled]="!assignedEmpId || !assignedShiftId || isSubmitting()" class="workora-btn-primary">
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class ShiftsPageComponent implements OnInit {
  private readonly shiftRepo = inject(ShiftApiRepository);
  private readonly empRepo = inject(EmployeeApiRepository);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly shifts = signal<Shift[]>([]);
  readonly totalShifts = signal<number>(0);
  readonly pageIndex = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly isLoading = signal<boolean>(false);
  readonly pageSize = 9;

  readonly employees = signal<Employee[]>([]);

  readonly employeeOptions = computed<WorkoraSelectOption<number>[]>(() => {
    return this.employees().map(emp => ({
      value: emp.id,
      label: emp.fullName,
      sublabel: `${emp.employeeCode} • ${emp.designationTitle || emp.departmentName || 'Staff'}`,
      icon: 'person'
    }));
  });

  readonly shiftOptions = computed<WorkoraSelectOption<number>[]>(() => {
    return this.shifts().map(s => ({
      value: s.id,
      label: s.name,
      sublabel: `${s.startTime} – ${s.endTime} (${s.code})`,
      icon: 'timer'
    }));
  });

  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isAssignModalOpen = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  assignedEmpId?: number;
  assignedShiftId?: number;
  effectiveFromDate = new Date().toISOString().substring(0, 10);

  readonly createForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    code: ['', [Validators.required]],
    startTime: ['09:00', [Validators.required]],
    endTime: ['18:00', [Validators.required]],
    gracePeriodMinutes: [15],
    breakMinutes: [60],
    spansMidnight: [false]
  });

  ngOnInit(): void {
    this.loadShifts();
    this.empRepo.getEmployees({ pageSize: 100 }).subscribe(p => {
      this.employees.set(p.items);
      if (p.items.length > 0) this.assignedEmpId = p.items[0].id;
    });
  }

  loadShifts(): void {
    this.isLoading.set(true);
    this.shiftRepo.getShifts(this.pageIndex(), this.pageSize)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: p => {
          this.shifts.set(p.items);
          this.totalShifts.set(p.totalCount);
          this.totalPages.set(p.totalPages);
          if (p.items.length > 0) this.assignedShiftId = p.items[0].id;
        },
        error: () => {}
      });
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.loadShifts();
  }

  openCreateShiftModal(): void {
    this.createForm.reset({
      startTime: '09:00',
      endTime: '18:00',
      gracePeriodMinutes: 15,
      breakMinutes: 60,
      spansMidnight: false
    });
    this.isCreateModalOpen.set(true);
  }

  openAssignShiftModal(): void {
    this.isAssignModalOpen.set(true);
  }

  onSaveShift(): void {
    if (this.createForm.invalid) return;
    const v = this.createForm.value;

    this.isSubmitting.set(true);
    this.shiftRepo.createShift({
      companyId: 1,
      name: v.name,
      code: v.code.toUpperCase(),
      startTime: v.startTime,
      endTime: v.endTime,
      spansMidnight: !!v.spansMidnight,
      gracePeriodMinutes: Number(v.gracePeriodMinutes || 0),
      breakMinutes: Number(v.breakMinutes || 0)
    })
    .pipe(finalize(() => this.isSubmitting.set(false)))
    .subscribe({
      next: () => {
        this.isCreateModalOpen.set(false);
        this.notificationService.showSuccess('Work shift schedule created.');
        this.loadShifts();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to create shift.')
    });
  }

  onConfirmAssignShift(): void {
    if (!this.assignedEmpId || !this.assignedShiftId) return;

    this.isSubmitting.set(true);
    this.shiftRepo.assignShift({
      employeeId: this.assignedEmpId,
      shiftId: this.assignedShiftId,
      effectiveFrom: this.effectiveFromDate
    })
    .pipe(finalize(() => this.isSubmitting.set(false)))
    .subscribe({
      next: () => {
        this.isAssignModalOpen.set(false);
        this.notificationService.showSuccess('Shift assigned to employee.');
      },
      error: err => this.notificationService.showError(err.message || 'Failed to assign shift.')
    });
  }

  onDeleteShift(id: number): void {
    this.shiftRepo.deleteShift(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Shift removed.');
        this.loadShifts();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to delete shift.')
    });
  }
}
