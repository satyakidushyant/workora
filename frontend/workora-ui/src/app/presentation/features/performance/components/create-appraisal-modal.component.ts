import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
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
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
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
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col flex-1 overflow-hidden">
          <div class="workora-modal-body space-y-4">
            <div>
              <label class="workora-label">Select Employee <span class="text-rose-500">*</span></label>
              <select 
                formControlName="employeeId"
                class="workora-select">
                @for (emp of employees; track emp.id) {
                  <option [ngValue]="emp.id">{{ emp.fullName }} ({{ emp.employeeCode }})</option>
                }
              </select>
            </div>

            <div>
              <label class="workora-label">Assigned Manager / Reviewer <span class="text-rose-500">*</span></label>
              <select 
                formControlName="reviewerEmployeeId"
                class="workora-select">
                @for (emp of employees; track emp.id) {
                  <option [ngValue]="emp.id">{{ emp.fullName }} ({{ emp.designationTitle || emp.departmentName }})</option>
                }
              </select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Review Period <span class="text-rose-500">*</span></label>
                <select 
                  formControlName="period"
                  class="workora-select">
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
                <label class="workora-label">Year <span class="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  formControlName="year" 
                  class="workora-input !py-2.5"
                />
              </div>
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

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

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
