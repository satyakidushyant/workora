import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee, TerminateEmployeeParams } from '../../../../domain/models/employee.model';

@Component({
  selector: 'app-employee-terminate-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">person_off</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Offboard Employee
              </h3>
              <p class="text-xs text-slate-500">{{ employee?.fullName }} ({{ employee?.employeeCode }})</p>
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
            <label class="block text-xs font-bold text-[#063B39] mb-1">Effective Termination / Relieving Date <span class="text-rose-500">*</span></label>
            <input 
              type="date" 
              formControlName="terminationDate" 
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Reason / Exit Notes</label>
            <textarea 
              formControlName="reason" 
              rows="3" 
              placeholder="e.g. Resignation, Contract concluded, Mutual separation..."
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all resize-none"
            ></textarea>
          </div>

          <div class="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-800">
            <p class="font-bold">Important Notice:</p>
            <p class="mt-0.5 text-[11px] leading-relaxed">
              Terminating will revoke active login credentials and suspend payroll generation. You can reactivate this profile anytime.
            </p>
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
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer border-none">
              @if (isSubmitting) {
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Terminating...</span>
              } @else {
                <span class="material-symbols-outlined text-base">person_remove</span>
                <span>Confirm Termination</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class EmployeeTerminateModalComponent {
  @Input() employee: Employee | null = null;
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() terminateEmployee = new EventEmitter<TerminateEmployeeParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    terminationDate: [new Date().toISOString().substring(0, 10), [Validators.required]],
    reason: ['']
  });

  onSubmit(): void {
    if (this.form.invalid || !this.employee) return;
    const v = this.form.value;
    this.terminateEmployee.emit({
      id: this.employee.id,
      terminationDate: v.terminationDate,
      reason: v.reason || null
    });
  }
}
