import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
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
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Interviewer (Lead / Manager) <span class="text-rose-500">*</span></label>
            <select 
              formControlName="interviewerEmployeeId"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
              @for (emp of interviewers; track emp.id) {
                <option [ngValue]="emp.id">{{ emp.fullName }} ({{ emp.designationTitle || emp.departmentName }})</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Interview Date &amp; Time <span class="text-rose-500">*</span></label>
            <input 
              type="datetime-local" 
              formControlName="scheduledAt" 
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Meeting Link / Room Location <span class="text-rose-500">*</span></label>
            <input 
              type="text" 
              formControlName="locationOrLink" 
              placeholder="https://meet.google.com/abc-defg-hij or Conf Room B" 
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
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
