import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalaryStructure, AssignSalaryStructureParams } from '../../../../domain/models/payroll.model';
import { Employee } from '../../../../domain/models/employee.model';

@Component({
  selector: 'app-assign-salary-modal',
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
              <span class="material-symbols-outlined">badge</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Assign Salary Compensation
              </h3>
              <p class="text-xs text-slate-500">Attach salary structure &amp; base rate to employee.</p>
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
              <option [ngValue]="null" disabled>-- Select Employee --</option>
              @for (emp of employees; track emp.id) {
                <option [ngValue]="emp.id">{{ emp.fullName }} ({{ emp.employeeCode }})</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Salary Structure Template <span class="text-rose-500">*</span></label>
            <select 
              formControlName="salaryStructureId"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
              <option [ngValue]="null" disabled>-- Select Structure --</option>
              @for (s of structures; track s.id) {
                <option [ngValue]="s.id">{{ s.name }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Annual / Monthly Base Salary ($) <span class="text-rose-500">*</span></label>
            <input 
              type="number" 
              formControlName="baseSalary" 
              placeholder="e.g. 75000"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Effective From Date <span class="text-rose-500">*</span></label>
            <input 
              type="date" 
              formControlName="effectiveFrom" 
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
                <span>Assigning...</span>
              } @else {
                <span class="material-symbols-outlined text-base">save</span>
                <span>Assign Structure</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class AssignSalaryModalComponent implements OnInit {
  @Input() employees: Employee[] = [];
  @Input() structures: SalaryStructure[] = [];
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() assignSalary = new EventEmitter<AssignSalaryStructureParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    employeeId: [null, [Validators.required]],
    salaryStructureId: [null, [Validators.required]],
    baseSalary: [60000, [Validators.required, Validators.min(1000)]],
    effectiveFrom: [new Date().toISOString().substring(0, 10), [Validators.required]]
  });

  ngOnInit(): void {
    if (this.employees.length > 0) this.form.patchValue({ employeeId: this.employees[0].id });
    if (this.structures.length > 0) this.form.patchValue({ salaryStructureId: this.structures[0].id });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.assignSalary.emit({
      employeeId: Number(v.employeeId),
      salaryStructureId: Number(v.salaryStructureId),
      baseSalary: Number(v.baseSalary),
      effectiveFrom: v.effectiveFrom
    });
  }
}
