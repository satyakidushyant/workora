import { Component, Input, Output, EventEmitter, inject, signal, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreatePayrollRunParams } from '../../../../domain/models/payroll.model';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

@Component({
  selector: 'app-create-payroll-run-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, WorkoraSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">payments</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Execute Payroll Cycle
              </h3>
              <p class="text-xs text-slate-500">Calculate salaries, deductions, and tax withholdings.</p>
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
                <label class="workora-label">Payroll Month <span class="text-rose-500">*</span></label>
                <app-workora-select
                  formControlName="periodMonth"
                  [options]="monthOptions"
                  placeholder="Month"
                  icon="calendar_month"
                ></app-workora-select>
              </div>

              <div>
                <label class="workora-label">Payroll Year <span class="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  formControlName="periodYear" 
                  class="workora-input !py-2.5"
                />
              </div>
            </div>

            <div class="p-3.5 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] text-xs text-slate-600 leading-relaxed">
              <p class="font-bold text-[#063B39]">Computation Steps:</p>
              <ul class="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                <li>Attendance punches, overtime &amp; unpaid leaves factored.</li>
                <li>Active loans and monthly EMI deductions applied.</li>
                <li>Approved expense reimbursements aggregated.</li>
              </ul>
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
                <span>Calculating...</span>
              } @else {
                <span class="material-symbols-outlined text-base">calculate</span>
                <span>Compute Batch</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class CreatePayrollRunModalComponent {
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() createRun = new EventEmitter<CreatePayrollRunParams>();

  private readonly fb = inject(FormBuilder);

  readonly monthOptions: WorkoraSelectOption<number>[] = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  readonly form: FormGroup = this.fb.group({
    periodMonth: [new Date().getMonth() + 1, [Validators.required]],
    periodYear: [new Date().getFullYear(), [Validators.required, Validators.min(2020), Validators.max(2035)]]
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.createRun.emit({
      companyId: 1,
      periodMonth: Number(v.periodMonth),
      periodYear: Number(v.periodYear)
    });
  }
}
