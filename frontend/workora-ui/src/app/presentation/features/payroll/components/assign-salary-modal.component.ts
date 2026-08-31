import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
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
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
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
                <option [ngValue]="null" disabled>-- Select Employee --</option>
                @for (emp of employees; track emp.id) {
                  <option [ngValue]="emp.id">{{ emp.fullName }} ({{ emp.employeeCode }})</option>
                }
              </select>
            </div>

            <div>
              <label class="workora-label">Salary Structure Template <span class="text-rose-500">*</span></label>
              <select 
                formControlName="salaryStructureId"
                class="workora-select">
                <option [ngValue]="null" disabled>-- Select Structure --</option>
                @for (s of structures; track s.id) {
                  <option [ngValue]="s.id">{{ s.name }}</option>
                }
              </select>
            </div>

            <div>
              <label class="workora-label">Annual / Monthly Base Salary ($) <span class="text-rose-500">*</span></label>
              <input 
                type="number" 
                formControlName="baseSalary" 
                placeholder="e.g. 75000"
                class="workora-input !py-2.5"
              />
            </div>

            <div>
              <label class="workora-label">Effective From Date <span class="text-rose-500">*</span></label>
              <input 
                type="date" 
                formControlName="effectiveFrom" 
                class="workora-input !py-2.5"
              />
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

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

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
