import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy, HostListener, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveType, LeaveBalance, ApplyLeaveParams } from '../../../../domain/models/leave.model';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

@Component({
  selector: 'app-apply-leave-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, WorkoraSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-lg" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">event_available</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Apply for Leave
              </h3>
              <p class="text-xs text-slate-500">Submit a time-off application for manager approval.</p>
            </div>
          </div>
          <button 
            type="button" 
            (click)="closeModal.emit()"
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col flex-1 overflow-hidden">
          <div class="workora-modal-body space-y-4">
            <div>
              <label class="workora-label">Leave Policy Type <span class="text-rose-500">*</span></label>
              <app-workora-select
                formControlName="leaveTypeId"
                [options]="leaveTypeOptions()"
                placeholder="Choose leave category..."
                icon="beach_access"
              ></app-workora-select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Start Date <span class="text-rose-500">*</span></label>
                <input 
                  type="date" 
                  formControlName="startDate" 
                  (change)="recalculateDays()"
                  class="workora-input !py-2.5"
                />
              </div>

              <div>
                <label class="workora-label">End Date <span class="text-rose-500">*</span></label>
                <input 
                  type="date" 
                  formControlName="endDate" 
                  (change)="recalculateDays()"
                  class="workora-input !py-2.5"
                />
              </div>
            </div>

            <!-- Total Days Banner -->
            <div class="p-3.5 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] flex items-center justify-between">
              <span class="text-xs font-bold text-slate-600">Calculated Duration:</span>
              <span class="text-sm font-extrabold text-[#0E6E68]">{{ form.get('daysCount')?.value || 1 }} Business Day(s)</span>
            </div>

            <div>
              <label class="workora-label">Reason / Handover Note <span class="text-rose-500">*</span></label>
              <textarea 
                formControlName="reason" 
                rows="3" 
                placeholder="Reason / Handover Note"
                class="workora-input !rounded-2xl !py-2.5 resize-none"
              ></textarea>
            </div>
          </div>

          <div class="workora-modal-footer">
            <button 
              type="button" 
              (click)="closeModal.emit()"
              class="workora-btn-secondary">
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="form.invalid || isSubmitting"
              class="workora-btn-primary">
              @if (isSubmitting) {
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Submitting...</span>
              } @else {
                <span class="material-symbols-outlined text-base">send</span>
                <span>Submit Application</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class ApplyLeaveModalComponent implements OnInit {
  private readonly _leaveTypes = signal<LeaveType[]>([]);
  private readonly _balances = signal<LeaveBalance[]>([]);

  @Input() set leaveTypes(val: LeaveType[]) {
    this._leaveTypes.set(val || []);
    if (val && val.length > 0 && !this.form.get('leaveTypeId')?.value) {
      this.form.patchValue({ leaveTypeId: val[0].id });
    }
  }

  @Input() set balances(val: LeaveBalance[]) {
    this._balances.set(val || []);
  }

  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitLeave = new EventEmitter<ApplyLeaveParams>();

  private readonly fb = inject(FormBuilder);

  readonly leaveTypeOptions = computed<WorkoraSelectOption<number>[]>(() => {
    const types = this._leaveTypes();
    const bals = this._balances();

    return types.map(lt => {
      const bal = bals.find(b => b.leaveTypeId === lt.id);
      const available = bal ? `${bal.availableDays} days remaining` : `${lt.annualQuota} days/yr`;
      return {
        value: lt.id,
        label: lt.name,
        sublabel: `${lt.code} • ${available}`,
        icon: 'beach_access',
        badge: `${lt.annualQuota}d`,
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      };
    });
  });

  readonly form: FormGroup = this.fb.group({
    leaveTypeId: [null, [Validators.required]],
    startDate: [new Date().toISOString().substring(0, 10), [Validators.required]],
    endDate: [new Date().toISOString().substring(0, 10), [Validators.required]],
    daysCount: [1, [Validators.required, Validators.min(0.5)]],
    reason: ['', [Validators.required, Validators.minLength(5)]]
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnInit(): void {
    const types = this._leaveTypes();
    if (types.length > 0) {
      this.form.patchValue({ leaveTypeId: types[0].id });
    }
  }

  recalculateDays(): void {
    const start = new Date(this.form.get('startDate')?.value);
    const end = new Date(this.form.get('endDate')?.value);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
      const diffMs = end.getTime() - start.getTime();
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
      this.form.patchValue({ daysCount: days });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.submitLeave.emit({
      leaveTypeId: Number(v.leaveTypeId),
      startDate: v.startDate,
      endDate: v.endDate,
      daysCount: Number(v.daysCount),
      reason: v.reason
    });
  }
}
