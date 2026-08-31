import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy, HostListener, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubmitExpenseParams } from '../../../../domain/models/expense.model';
import { Employee } from '../../../../domain/models/employee.model';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

@Component({
  selector: 'app-submit-expense-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, WorkoraSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-lg" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">receipt</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Submit Expense Claim
              </h3>
              <p class="text-xs text-slate-500">Attach receipt for corporate reimbursement.</p>
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
              <label class="workora-label">Employee <span class="text-rose-500">*</span></label>
              <app-workora-select
                formControlName="employeeId"
                [options]="employeeOptions()"
                [searchable]="true"
                searchPlaceholder="Search employee name or code..."
                placeholder="Choose employee"
                icon="badge"
              ></app-workora-select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Category <span class="text-rose-500">*</span></label>
                <app-workora-select
                  formControlName="category"
                  [options]="categoryOptions"
                  placeholder="Choose category"
                  icon="category"
                ></app-workora-select>
              </div>

              <div>
                <label class="workora-label">Claim Amount ($) <span class="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  formControlName="amount" 
                  placeholder="e.g. 120.50"
                  class="workora-input !py-2.5"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Expense Date <span class="text-rose-500">*</span></label>
                <input 
                  type="date" 
                  formControlName="expenseDate" 
                  class="workora-input !py-2.5"
                />
              </div>

              <div>
                <label class="workora-label">Merchant / Vendor</label>
                <input 
                  type="text" 
                  formControlName="merchantName" 
                  placeholder="e.g. Uber / Delta / Hilton"
                  class="workora-input !py-2.5"
                />
              </div>
            </div>

            <div>
              <label class="workora-label">Receipt / Bill URL / Cloud Link <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="receiptUrl" 
                placeholder="https://storage.workora.com/receipts/bill-01.pdf"
                class="workora-input !py-2.5"
              />
            </div>

            <div>
              <label class="workora-label">Business Justification <span class="text-rose-500">*</span></label>
              <textarea 
                formControlName="description" 
                rows="2" 
                placeholder="e.g. Client dinner with ACME partner delegation..."
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
                <span class="material-symbols-outlined text-base">upload</span>
                <span>Submit Claim</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class SubmitExpenseModalComponent implements OnInit {
  private readonly _employees = signal<Employee[]>([]);

  @Input() set employees(val: Employee[]) {
    this._employees.set(val || []);
    if (val && val.length > 0 && !this.form.get('employeeId')?.value) {
      this.form.patchValue({ employeeId: val[0].id });
    }
  }

  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitExpense = new EventEmitter<SubmitExpenseParams>();

  private readonly fb = inject(FormBuilder);

  readonly categoryOptions: WorkoraSelectOption<string>[] = [
    { value: 'Travel', label: 'Travel & Flights', icon: 'flight', badge: 'Travel', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'Meals', label: 'Meals & Dining', icon: 'restaurant', badge: 'Meals', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'Accommodation', label: 'Hotel & Stays', icon: 'hotel', badge: 'Stay', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
    { value: 'Internet', label: 'Internet / Telecom', icon: 'wifi', badge: 'Telecom', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'OfficeSupplies', label: 'Office & Tech', icon: 'devices', badge: 'Supplies', badgeClass: 'bg-teal-50 text-teal-700 border-teal-200' },
    { value: 'Other', label: 'Miscellaneous', icon: 'more_horiz', badge: 'Other', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' }
  ];

  readonly employeeOptions = computed<WorkoraSelectOption<number>[]>(() => {
    return this._employees().map(emp => ({
      value: emp.id,
      label: emp.fullName,
      sublabel: `${emp.employeeCode} • ${emp.designationTitle || emp.departmentName || 'Employee'}`,
      icon: 'person'
    }));
  });

  readonly form: FormGroup = this.fb.group({
    employeeId: [null, [Validators.required]],
    category: ['Travel', [Validators.required]],
    amount: [100, [Validators.required, Validators.min(1)]],
    expenseDate: [new Date().toISOString().substring(0, 10), [Validators.required]],
    merchantName: [''],
    receiptUrl: ['https://storage.workora.com/receipts/demo-receipt.pdf', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(5)]]
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
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.submitExpense.emit({
      employeeId: Number(v.employeeId),
      category: v.category,
      amount: Number(v.amount),
      expenseDate: v.expenseDate,
      merchantName: v.merchantName || null,
      receiptUrl: v.receiptUrl,
      description: v.description
    });
  }
}
