import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department, Designation, Branch } from '../../../../domain/models/organization.model';
import { Employee, TransferEmployeeParams } from '../../../../domain/models/employee.model';

@Component({
  selector: 'app-employee-transfer-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">swap_horiz</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Transfer / Promote: {{ employee?.fullName }}
              </h3>
              <p class="text-xs text-slate-500">Reassign department, designation, branch, or manager.</p>
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
            <label class="block text-xs font-bold text-[#063B39] mb-1">New Department <span class="text-rose-500">*</span></label>
            <select 
              formControlName="departmentId"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
              @for (d of departments; track d.id) {
                <option [ngValue]="d.id">{{ d.name }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">New Designation <span class="text-rose-500">*</span></label>
            <select 
              formControlName="designationId"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
              @for (des of designations; track des.id) {
                <option [ngValue]="des.id">{{ des.title }} (Level {{ des.level }})</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">New Branch Location <span class="text-rose-500">*</span></label>
            <select 
              formControlName="branchId"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
              @for (b of branches; track b.id) {
                <option [ngValue]="b.id">{{ b.name }} ({{ b.location }})</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">New Reporting Manager</label>
            <select 
              formControlName="managerId"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
              <option [ngValue]="null">-- None (Reports to Executive) --</option>
              @for (emp of existingEmployees; track emp.id) {
                @if (!employee || emp.id !== employee.id) {
                  <option [ngValue]="emp.id">{{ emp.fullName }} ({{ emp.employeeCode }})</option>
                }
              }
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Transfer Transition Notes</label>
            <textarea 
              formControlName="notes" 
              rows="3" 
              placeholder="e.g. Promotion to Senior Lead, relocated to NY branch..."
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
                <span>Saving...</span>
              } @else {
                <span class="material-symbols-outlined text-base">swap_horiz</span>
                <span>Execute Transfer</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class EmployeeTransferModalComponent implements OnChanges {
  @Input() employee: Employee | null = null;
  @Input() departments: Department[] = [];
  @Input() designations: Designation[] = [];
  @Input() branches: Branch[] = [];
  @Input() existingEmployees: Employee[] = [];
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() transferEmployee = new EventEmitter<TransferEmployeeParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    departmentId: [null, [Validators.required]],
    designationId: [null, [Validators.required]],
    branchId: [null, [Validators.required]],
    managerId: [null],
    notes: ['']
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employee) {
      this.form.patchValue({
        departmentId: this.employee.departmentId,
        designationId: this.employee.designationId,
        branchId: this.employee.branchId,
        managerId: this.employee.managerId || null,
        notes: ''
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid || !this.employee) return;
    const v = this.form.value;
    this.transferEmployee.emit({
      id: this.employee.id,
      departmentId: Number(v.departmentId),
      designationId: Number(v.designationId),
      branchId: Number(v.branchId),
      managerId: v.managerId ? Number(v.managerId) : null,
      notes: v.notes || null
    });
  }
}
