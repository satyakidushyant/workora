import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrainingProgram, EnrollTrainingParams } from '../../../../domain/models/training.model';
import { Employee } from '../../../../domain/models/employee.model';

@Component({
  selector: 'app-training-enroll-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">how_to_reg</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Enroll in Training
              </h3>
              <p class="text-xs text-slate-500">Course: {{ program?.title }}</p>
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
            <label class="block text-xs font-bold text-[#063B39] mb-1">Select Employee to Enroll <span class="text-rose-500">*</span></label>
            <select 
              formControlName="employeeId"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
              @for (emp of employees; track emp.id) {
                <option [ngValue]="emp.id">{{ emp.fullName }} ({{ emp.employeeCode }})</option>
              }
            </select>
          </div>

          <div class="p-3.5 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] space-y-1 text-xs">
            <div class="flex items-center justify-between text-slate-600">
              <span>Instructor:</span>
              <strong class="text-[#063B39]">{{ program?.trainerName }}</strong>
            </div>
            <div class="flex items-center justify-between text-slate-600">
              <span>Schedule:</span>
              <strong class="text-slate-800">{{ program?.startDate | date:'mediumDate' }} – {{ program?.endDate | date:'mediumDate' }}</strong>
            </div>
            <div class="flex items-center justify-between text-slate-600">
              <span>Seats Remaining:</span>
              <strong class="text-[#0E6E68]">{{ (program?.capacity || 0) - (program?.enrolledCount || 0) }} Available</strong>
            </div>
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
                <span>Enrolling...</span>
              } @else {
                <span class="material-symbols-outlined text-base">person_add</span>
                <span>Confirm Enrollment</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class TrainingEnrollModalComponent implements OnInit {
  @Input() program: TrainingProgram | null = null;
  @Input() employees: Employee[] = [];
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() enroll = new EventEmitter<EnrollTrainingParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    employeeId: [null, [Validators.required]]
  });

  ngOnInit(): void {
    if (this.employees.length > 0) {
      this.form.patchValue({ employeeId: this.employees[0].id });
    }
  }

  onSubmit(): void {
    if (this.form.invalid || !this.program) return;
    const v = this.form.value;
    this.enroll.emit({
      trainingProgramId: this.program.id,
      employeeId: Number(v.employeeId)
    });
  }
}
