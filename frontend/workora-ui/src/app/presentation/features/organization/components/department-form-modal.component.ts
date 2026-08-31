import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department, CreateDepartmentParams, UpdateDepartmentParams } from '../../../../domain/models/organization.model';

/**
 * Presentational modal component for creating and updating departments.
 */
@Component({
  selector: 'app-department-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-lg" (click)="$event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">corporate_fare</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                {{ isEditMode ? 'Update Department' : 'Create New Department' }}
              </h3>
              <p class="text-xs text-slate-500">Configure organizational unit code, title, and hierarchy.</p>
            </div>
          </div>
          <button 
            type="button" 
            (click)="closeModal.emit()"
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col flex-1 overflow-hidden">
          <div class="workora-modal-body space-y-4">
            <!-- Department Code & Name -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Code <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="code" 
                  placeholder="e.g. ENG, HR, MKT"
                  class="workora-input !py-2.5 uppercase font-mono tracking-wider"
                />
                @if (form.get('code')?.invalid && form.get('code')?.touched) {
                  <p class="text-[11px] text-rose-500 font-semibold mt-1">Code is required (max 20 chars).</p>
                }
              </div>

              <div>
                <label class="workora-label">Department Name <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="name" 
                  placeholder="e.g. Software Engineering"
                  class="workora-input !py-2.5"
                />
                @if (form.get('name')?.invalid && form.get('name')?.touched) {
                  <p class="text-[11px] text-rose-500 font-semibold mt-1">Name is required.</p>
                }
              </div>
            </div>

            <!-- Parent Department Hierarchy -->
            <div>
              <label class="workora-label">Parent Department (Optional)</label>
              <select 
                formControlName="parentDepartmentId"
                class="workora-select">
                <option [ngValue]="null">-- None (Root Department) --</option>
                @for (dept of availableDepartments; track dept.id) {
                  @if (!department || dept.id !== department.id) {
                    <option [ngValue]="dept.id">{{ dept.name }} ({{ dept.code }})</option>
                  }
                }
              </select>
            </div>
          </div>

          <!-- Modal Action Buttons -->
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
                <span>Saving...</span>
              } @else {
                <span class="material-symbols-outlined text-base">check</span>
                <span>{{ isEditMode ? 'Update Department' : 'Create Department' }}</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class DepartmentFormModalComponent implements OnChanges {
  @Input() department: Department | null = null;
  @Input() availableDepartments: Department[] = [];
  @Input() companyId = 1;
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveDepartment = new EventEmitter<CreateDepartmentParams | UpdateDepartmentParams>();

  private readonly fb = inject(FormBuilder);
  get isEditMode(): boolean {
    return !!this.department;
  }

  readonly form: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(20)]],
    name: ['', [Validators.required, Validators.maxLength(150)]],
    parentDepartmentId: [null]
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['department'] && this.department) {
      this.form.patchValue({
        code: this.department.code,
        name: this.department.name,
        parentDepartmentId: this.department.parentDepartmentId || null
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const formVal = this.form.value;

    if (this.isEditMode && this.department) {
      const params: UpdateDepartmentParams = {
        id: this.department.id,
        code: formVal.code.toUpperCase(),
        name: formVal.name,
        parentDepartmentId: formVal.parentDepartmentId ? Number(formVal.parentDepartmentId) : null,
        headEmployeeId: this.department.headEmployeeId
      };
      this.saveDepartment.emit(params);
    } else {
      const params: CreateDepartmentParams = {
        companyId: this.companyId,
        code: formVal.code.toUpperCase(),
        name: formVal.name,
        parentDepartmentId: formVal.parentDepartmentId ? Number(formVal.parentDepartmentId) : null
      };
      this.saveDepartment.emit(params);
    }
  }
}
