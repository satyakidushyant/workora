import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAppraisalParams } from '../../../../domain/models/performance.model';
import { Employee } from '../../../../domain/models/employee.model';

@Component({
  selector: 'app-create-appraisal-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">rate_review</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Initiate Appraisal Cycle
              </h3>
              <p class="text-xs text-slate-500">Launch performance evaluation for employee.</p>
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
            <label class="block text-xs font-bold text-[#063B39] mb-1">Select Employee <span class="text-rose-500">*</span></label>
            <select 
              formControlName="employeeId"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
              @for (emp of employees; track emp.id) {
                <option [ngValue]="emp.id">{{ emp.fullName }} ({{ emp.employeeCode }})</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Assigned Manager / Reviewer <span class="text-rose-500">*</span></label>
            <select 
              formControlName="reviewerEmployeeId"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
              @for (emp of employees; track emp.id) {
                <option [ngValue]="emp.id">{{ emp.fullName }} ({{ emp.designationTitle || emp.departmentName }})</option>
              }
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Review Period <span class="text-rose-500">*</span></label>
              <select 
                formControlName="period"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                <option value="Annual">Annual Review</option>
                <option value="H1">H1 Mid-Year</option>
                <option value="H2">H2 Year-End</option>
                <option value="Q1">Q1 Quarterly</option>
                <option value="Q2">Q2 Quarterly</option>
                <option value="Q3">Q3 Quarterly</option>
                <option value="Q4">Q4 Quarterly</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Year <span class="text-rose-500">*</span></label>
              <input 
                type="number" 
                formControlName="year" 
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
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
                <span>Initiating...</span>
              } @else {
                <span class="material-symbols-outlined text-base">rocket_launch</span>
                <span>Launch Cycle</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class CreateAppraisalModalComponent implements OnInit {
  @Input() employees: Employee[] = [];
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() createAppraisal = new EventEmitter<CreateAppraisalParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    employeeId: [null, [Validators.required]],
    reviewerEmployeeId: [null, [Validators.required]],
    period: ['Annual', [Validators.required]],
    year: [new Date().getFullYear(), [Validators.required]]
  });

  ngOnInit(): void {
    if (this.employees.length > 0) {
      this.form.patchValue({
        employeeId: this.employees[0].id,
        reviewerEmployeeId: this.employees[0].id
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.createAppraisal.emit({
      employeeId: Number(v.employeeId),
      reviewerEmployeeId: Number(v.reviewerEmployeeId),
      period: v.period,
      year: Number(v.year)
    });
  }
}
