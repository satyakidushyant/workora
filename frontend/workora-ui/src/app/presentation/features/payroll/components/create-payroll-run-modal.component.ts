import { Component, Input, Output, EventEmitter, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreatePayrollRunParams } from '../../../../domain/models/payroll.model';

@Component({
  selector: 'app-create-payroll-run-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
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
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Payroll Month <span class="text-rose-500">*</span></label>
              <select 
                formControlName="periodMonth"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                <option [ngValue]="1">January</option>
                <option [ngValue]="2">February</option>
                <option [ngValue]="3">March</option>
                <option [ngValue]="4">April</option>
                <option [ngValue]="5">May</option>
                <option [ngValue]="6">June</option>
                <option [ngValue]="7">July</option>
                <option [ngValue]="8">August</option>
                <option [ngValue]="9">September</option>
                <option [ngValue]="10">October</option>
                <option [ngValue]="11">November</option>
                <option [ngValue]="12">December</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Payroll Year <span class="text-rose-500">*</span></label>
              <input 
                type="number" 
                formControlName="periodYear" 
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
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

  readonly form: FormGroup = this.fb.group({
    periodMonth: [new Date().getMonth() + 1, [Validators.required]],
    periodYear: [new Date().getFullYear(), [Validators.required]]
  });

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
