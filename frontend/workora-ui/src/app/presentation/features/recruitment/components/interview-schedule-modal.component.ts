import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Candidate, ScheduleInterviewParams } from '../../../../domain/models/recruitment.model';
import { Employee } from '../../../../domain/models/employee.model';

@Component({
  selector: 'app-interview-schedule-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">video_call</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Schedule Interview
              </h3>
              <p class="text-xs text-slate-500">Candidate: {{ candidate?.fullName }}</p>
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
              <label class="workora-label">Interviewer (Lead / Manager) <span class="text-rose-500">*</span></label>
              <select 
                formControlName="interviewerEmployeeId"
                class="workora-select">
                @for (emp of interviewers; track emp.id) {
                  <option [ngValue]="emp.id">{{ emp.fullName }} ({{ emp.designationTitle || emp.departmentName }})</option>
                }
              </select>
            </div>

            <div>
              <label class="workora-label">Interview Date &amp; Time <span class="text-rose-500">*</span></label>
              <input 
                type="datetime-local" 
                formControlName="scheduledAt" 
                class="workora-input !py-2.5"
              />
            </div>

            <div>
              <label class="workora-label">Meeting Link / Room Location <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="locationOrLink" 
                placeholder="https://meet.google.com/abc-defg-hij or Conf Room B" 
                class="workora-input !py-2.5"
              />
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
                <span>Scheduling...</span>
              } @else {
                <span class="material-symbols-outlined text-base">calendar_add_on</span>
                <span>Confirm Schedule</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class InterviewScheduleModalComponent implements OnInit {
  @Input() candidate: Candidate | null = null;
  @Input() interviewers: Employee[] = [];
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() scheduleInterview = new EventEmitter<ScheduleInterviewParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    interviewerEmployeeId: [null, [Validators.required]],
    scheduledAt: [new Date(Date.now() + 86400000).toISOString().substring(0, 16), [Validators.required]],
    locationOrLink: ['https://meet.google.com/workora-interview', [Validators.required]]
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnInit(): void {
    if (this.interviewers.length > 0) {
      this.form.patchValue({ interviewerEmployeeId: this.interviewers[0].id });
    }
  }

  onSubmit(): void {
    if (this.form.invalid || !this.candidate) return;
    const v = this.form.value;
    this.scheduleInterview.emit({
      candidateId: this.candidate.id,
      interviewerEmployeeId: Number(v.interviewerEmployeeId),
      scheduledAt: new Date(v.scheduledAt).toISOString(),
      locationOrLink: v.locationOrLink
    });
  }
}
