import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplyLoanParams } from '../../../../domain/models/loan.model';
import { Employee } from '../../../../domain/models/employee.model';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

@Component({
  selector: 'app-apply-loan-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, WorkoraSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
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
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col flex-1 overflow-hidden">
          <div class="workora-modal-body space-y-4">
            <div>
              <label class="workora-label">Select Employee <span class="text-rose-500">*</span></label>
              <app-workora-select
                formControlName="employeeId"
                [options]="employeeOptions()"
                [searchable]="true"
                searchPlaceholder="Search employee..."
                placeholder="Choose employee"
                icon="person"
              ></app-workora-select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Loan Type <span class="text-rose-500">*</span></label>
                <app-workora-select
                  formControlName="loanType"
                  [options]="loanTypeOptions"
                  placeholder="Loan type"
                  icon="account_balance"
                ></app-workora-select>
              </div>

              <div>
                <label class="workora-label">Principal Amount ($) <span class="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  formControlName="principalAmount" 
                  (change)="recalculateEmi()"
                  class="workora-input !py-2.5"
                />
              </div>
            </div>

            <div>
              <label class="workora-label">Tenure (Months) <span class="text-rose-500">*</span></label>
              <input 
                type="number" 
                formControlName="tenureMonths" 
                (change)="recalculateEmi()"
                class="workora-input !py-2.5"
              />
            </div>

            <!-- Estimated Monthly EMI -->
            <div class="p-3.5 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] flex items-center justify-between text-xs">
              <span class="font-bold text-slate-600">Estimated Monthly EMI:</span>
              <span class="text-sm font-extrabold text-[#0E6E68]">\${{ estimatedEmi() | number:'1.2-2' }}/mo</span>
            </div>

            <div>
              <label class="workora-label">Purpose / Justification <span class="text-rose-500">*</span></label>
              <textarea 
                formControlName="reason" 
                rows="3" 
                placeholder="State the reason for this advance..."
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
export class ApplyLoanModalComponent implements OnInit {
  private readonly _employees = signal<Employee[]>([]);

  @Input() set employees(val: Employee[]) {
    this._employees.set(val || []);
    if (val && val.length > 0 && !this.form.get('employeeId')?.value) {
      this.form.patchValue({ employeeId: val[0].id });
    }
  }

  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitLoan = new EventEmitter<ApplyLoanParams>();

  private readonly fb = inject(FormBuilder);
  readonly estimatedEmi = signal<number>(100);

  readonly loanTypeOptions: WorkoraSelectOption<string>[] = [
    { value: 'PersonalLoan', label: 'Personal Loan', icon: 'person', badge: 'Personal', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'SalaryAdvance', label: 'Salary Advance', icon: 'payments', badge: 'Advance', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'EmergencyLoan', label: 'Emergency Loan', icon: 'emergency', badge: 'Emergency', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
    { value: 'EducationLoan', label: 'Education Loan', icon: 'school', badge: 'Education', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' }
  ];

  readonly employeeOptions = computed<WorkoraSelectOption<number>[]>(() => {
    return this._employees().map(emp => ({
      value: emp.id,
      label: emp.fullName,
      sublabel: `${emp.employeeCode} • ${emp.designationTitle || emp.departmentName || 'Staff'}`,
      icon: 'person'
    }));
  });

  readonly form: FormGroup = this.fb.group({
    employeeId: [null, [Validators.required]],
    loanType: ['SalaryAdvance', [Validators.required]],
    principalAmount: [1200, [Validators.required, Validators.min(100)]],
    tenureMonths: [12, [Validators.required, Validators.min(1), Validators.max(60)]],
    reason: ['', [Validators.required, Validators.minLength(5)]]
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnInit(): void {
    const emps = this._employees();
    if (emps.length > 0 && !this.form.get('employeeId')?.value) {
      this.form.patchValue({ employeeId: emps[0].id });
    }
    this.recalculateEmi();
  }

  recalculateEmi(): void {
    const p = Number(this.form.get('principalAmount')?.value) || 0;
    const t = Number(this.form.get('tenureMonths')?.value) || 1;
    this.estimatedEmi.set(t > 0 ? p / t : p);
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
