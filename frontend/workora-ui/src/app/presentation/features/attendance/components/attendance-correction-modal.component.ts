import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttendanceRecord, RequestCorrectionParams } from '../../../../domain/models/attendance.model';

@Component({
  selector: 'app-attendance-correction-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">edit_calendar</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Request Attendance Correction
              </h3>
              <p class="text-xs text-slate-500">Date: {{ record?.attendanceDate | date:'longDate' }}</p>
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
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Adjusted Check In</label>
                <input 
                  type="time" 
                  formControlName="checkInTime" 
                  class="workora-input !py-2.5"
                />
              </div>

              <div>
                <label class="workora-label">Adjusted Check Out</label>
                <input 
                  type="time" 
                  formControlName="checkOutTime" 
                  class="workora-input !py-2.5"
                />
              </div>
            </div>

            <div>
              <label class="workora-label">Reason for Missed / Incorrect Punch <span class="text-rose-500">*</span></label>
              <textarea 
                formControlName="reason" 
                rows="3" 
                placeholder="Reason for Missed / Incorrect Punch"
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
                <span>Submit Request</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class AttendanceCorrectionModalComponent {
  @Input() record: AttendanceRecord | null = null;
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitCorrection = new EventEmitter<RequestCorrectionParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    checkInTime: ['09:00'],
    checkOutTime: ['18:00'],
    reason: ['', [Validators.required, Validators.minLength(5)]]
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.form.invalid || !this.record) return;
    const v = this.form.value;

    const dateStr = this.record.attendanceDate;
    const reqIn = v.checkInTime ? new Date(`${dateStr}T${v.checkInTime}:00`).toISOString() : null;
    const reqOut = v.checkOutTime ? new Date(`${dateStr}T${v.checkOutTime}:00`).toISOString() : null;

    this.submitCorrection.emit({
      attendanceRecordId: this.record.id,
      requestedCheckInTime: reqIn,
      requestedCheckOutTime: reqOut,
      reason: v.reason
    });
  }
}
