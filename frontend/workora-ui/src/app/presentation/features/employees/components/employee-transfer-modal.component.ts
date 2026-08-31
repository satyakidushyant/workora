import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department, Designation, Branch } from '../../../../domain/models/organization.model';
import { Employee, TransferEmployeeParams } from '../../../../domain/models/employee.model';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

@Component({
  selector: 'app-employee-transfer-modal',
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
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col flex-1 overflow-hidden">
          <div class="workora-modal-body space-y-4">
            <div>
              <label class="workora-label">New Department <span class="text-rose-500">*</span></label>
              <app-workora-select
                formControlName="departmentId"
                [options]="deptOptions()"
                placeholder="Choose department"
                icon="account_tree"
              ></app-workora-select>
            </div>

            <div>
              <label class="workora-label">New Designation <span class="text-rose-500">*</span></label>
              <app-workora-select
                formControlName="designationId"
                [options]="desigOptions()"
                placeholder="Choose designation"
                icon="workspace_premium"
              ></app-workora-select>
            </div>

            <div>
              <label class="workora-label">New Branch Location <span class="text-rose-500">*</span></label>
              <app-workora-select
                formControlName="branchId"
                [options]="branchOptions()"
                placeholder="Choose branch"
                icon="location_on"
              ></app-workora-select>
            </div>

            <div>
              <label class="workora-label">New Reporting Manager</label>
              <app-workora-select
                formControlName="managerId"
                [options]="managerOptions()"
                [searchable]="true"
                searchPlaceholder="Search manager name..."
                placeholder="None (Direct to Executive)"
                [clearable]="true"
                icon="supervisor_account"
              ></app-workora-select>
            </div>

            <div>
              <label class="workora-label">Transfer Transition Notes</label>
              <textarea 
                formControlName="notes" 
                rows="3" 
                placeholder="Transfer Transition Notes"
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
                <span>Transferring...</span>
              } @else {
                <span class="material-symbols-outlined text-base">swap_horiz</span>
                <span>Confirm Transfer</span>
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

  readonly deptOptions = computed<WorkoraSelectOption<number>[]>(() => {
    return this.departments.map(d => ({
      value: d.id,
      label: d.name,
      icon: 'account_tree'
    }));
  });

  readonly desigOptions = computed<WorkoraSelectOption<number>[]>(() => {
    return this.designations.map(des => ({
      value: des.id,
      label: des.title,
      sublabel: `Level ${des.level}`,
      icon: 'workspace_premium',
      badge: `Lvl ${des.level}`,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }));
  });

  readonly branchOptions = computed<WorkoraSelectOption<number>[]>(() => {
    return this.branches.map(b => ({
      value: b.id,
      label: b.name,
      sublabel: b.location,
      icon: 'location_on'
    }));
  });

  readonly managerOptions = computed<WorkoraSelectOption<number>[]>(() => {
    return this.existingEmployees
      .filter(emp => !this.employee || emp.id !== this.employee.id)
      .map(emp => ({
        value: emp.id,
        label: emp.fullName,
        sublabel: `${emp.employeeCode} • ${emp.designationTitle || 'Staff'}`,
        icon: 'person'
      }));
  });

  readonly form: FormGroup = this.fb.group({
    departmentId: [null, [Validators.required]],
    designationId: [null, [Validators.required]],
    branchId: [null, [Validators.required]],
    managerId: [null],
    notes: ['']
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employee) {
      this.form.patchValue({
        departmentId: this.employee.departmentId || null,
        designationId: this.employee.designationId || null,
        branchId: this.employee.branchId || null,
        managerId: this.employee.managerId || null
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
