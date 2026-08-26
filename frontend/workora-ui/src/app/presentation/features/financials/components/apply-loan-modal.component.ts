import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplyLoanParams } from '../../../../domain/models/loan.model';
import { Employee } from '../../../../domain/models/employee.model';

@Component({
  selector: 'app-apply-loan-modal',
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
              <span class="material-symbols-outlined">credit_score</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Apply for Loan / Advance
              </h3>
              <p class="text-xs text-slate-500">Submit an advance request with monthly EMI deduction.</p>
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

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Loan Type <span class="text-rose-500">*</span></label>
              <select 
                formControlName="loanType"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                <option value="PersonalLoan">Personal Loan</option>
                <option value="SalaryAdvance">Salary Advance</option>
                <option value="EmergencyLoan">Emergency Loan</option>
                <option value="EducationLoan">Education Loan</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Principal Amount ($) <span class="text-rose-500">*</span></label>
              <input 
                type="number" 
                formControlName="principalAmount" 
                (change)="recalculateEmi()"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Tenure (Months) <span class="text-rose-500">*</span></label>
            <input 
              type="number" 
              formControlName="tenureMonths" 
              (change)="recalculateEmi()"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
          </div>

          <!-- Estimated Monthly EMI -->
          <div class="p-3.5 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] flex items-center justify-between text-xs">
            <span class="font-bold text-slate-600">Estimated Monthly EMI:</span>
            <span class="text-sm font-extrabold text-[#0E6E68]">\${{ estimatedEmi() | number:'1.2-2' }}/mo</span>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Purpose / Justification <span class="text-rose-500">*</span></label>
            <textarea 
              formControlName="reason" 
              rows="3" 
              placeholder="State the reason for this advance..."
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
export class ApplyLoanModalComponent implements OnInit {
  @Input() employees: Employee[] = [];
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitLoan = new EventEmitter<ApplyLoanParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    employeeId: [null, [Validators.required]],
    loanType: ['PersonalLoan', [Validators.required]],
    principalAmount: [5000, [Validators.required, Validators.min(100)]],
    tenureMonths: [12, [Validators.required, Validators.min(1), Validators.max(60)]],
    reason: ['', [Validators.required, Validators.minLength(5)]]
  });

  estimatedEmi() {
    const p = Number(this.form.get('principalAmount')?.value || 0);
    const t = Number(this.form.get('tenureMonths')?.value || 1);
    return t > 0 ? p / t : 0;
  }

  recalculateEmi(): void {}

  ngOnInit(): void {
    if (this.employees.length > 0) {
      this.form.patchValue({ employeeId: this.employees[0].id });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.submitLoan.emit({
      employeeId: Number(v.employeeId),
      loanType: v.loanType,
      principalAmount: Number(v.principalAmount),
      tenureMonths: Number(v.tenureMonths),
      reason: v.reason
    });
  }
}
