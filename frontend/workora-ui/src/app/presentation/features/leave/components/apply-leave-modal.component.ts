import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveType, LeaveBalance, ApplyLeaveParams } from '../../../../domain/models/leave.model';

@Component({
  selector: 'app-apply-leave-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
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
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Leave Policy Type <span class="text-rose-500">*</span></label>
            <select 
              formControlName="leaveTypeId"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
              <option [ngValue]="null" disabled>-- Select Leave Type --</option>
              @for (lt of leaveTypes; track lt.id) {
                <option [ngValue]="lt.id">{{ lt.name }} ({{ lt.code }}) - {{ lt.annualQuota }} days/year</option>
              }
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Start Date <span class="text-rose-500">*</span></label>
              <input 
                type="date" 
                formControlName="startDate" 
                (change)="recalculateDays()"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">End Date <span class="text-rose-500">*</span></label>
              <input 
                type="date" 
                formControlName="endDate" 
                (change)="recalculateDays()"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>
          </div>

          <!-- Total Days Banner -->
          <div class="p-3.5 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] flex items-center justify-between">
            <span class="text-xs font-bold text-slate-600">Calculated Duration:</span>
            <span class="text-sm font-extrabold text-[#0E6E68]">{{ form.get('daysCount')?.value || 1 }} Business Day(s)</span>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Reason / Handover Note <span class="text-rose-500">*</span></label>
            <textarea 
              formControlName="reason" 
              rows="3" 
              placeholder="e.g. Annual family vacation, personal medical appointment..."
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all resize-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#DCEBE7]">
            <button 
              type="button" 
              (click)="closeModal.emit()"
              class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border-none bg-transparent">
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="form.invalid || isSubmitting"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer border-none">
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
  @Input() leaveTypes: LeaveType[] = [];
  @Input() balances: LeaveBalance[] = [];
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitLeave = new EventEmitter<ApplyLeaveParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    leaveTypeId: [null, [Validators.required]],
    startDate: [new Date().toISOString().substring(0, 10), [Validators.required]],
    endDate: [new Date().toISOString().substring(0, 10), [Validators.required]],
    daysCount: [1, [Validators.required, Validators.min(0.5)]],
    reason: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit(): void {
    if (this.leaveTypes.length > 0) {
      this.form.patchValue({ leaveTypeId: this.leaveTypes[0].id });
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
