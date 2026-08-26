import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Designation, Department, CreateDesignationParams, UpdateDesignationParams } from '../../../../domain/models/organization.model';

/**
 * Presentational modal component for creating and updating designations.
 */
@Component({
  selector: 'app-designation-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">badge</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                {{ isEditMode ? 'Update Job Designation' : 'Create Job Designation' }}
              </h3>
              <p class="text-xs text-slate-500">Specify job title, seniority level, department, and salary grade.</p>
            </div>
          </div>
          <button 
            type="button" 
            (click)="closeModal.emit()"
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Department Selector -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Department <span class="text-rose-500">*</span></label>
            <select 
              formControlName="departmentId"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
              <option [ngValue]="null" disabled>-- Select Associated Department --</option>
              @for (dept of departments; track dept.id) {
                <option [ngValue]="dept.id">{{ dept.name }} ({{ dept.code }})</option>
              }
            </select>
            @if (form.get('departmentId')?.invalid && form.get('departmentId')?.touched) {
              <p class="text-[11px] text-rose-500 font-semibold mt-1">Department is required.</p>
            }
          </div>

          <!-- Title -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Job Title <span class="text-rose-500">*</span></label>
            <input 
              type="text" 
              formControlName="title" 
              placeholder="e.g. Senior Software Engineer"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
            @if (form.get('title')?.invalid && form.get('title')?.touched) {
              <p class="text-[11px] text-rose-500 font-semibold mt-1">Job title is required.</p>
            }
          </div>

          <!-- Level & Grade -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Seniority Level (1-10) <span class="text-rose-500">*</span></label>
              <input 
                type="number" 
                formControlName="level" 
                min="1" 
                max="10"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Salary Grade (Optional)</label>
              <input 
                type="text" 
                formControlName="grade" 
                placeholder="e.g. L4, E3, M2"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium uppercase transition-all"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Role Description / Scope</label>
            <textarea 
              formControlName="description" 
              rows="3" 
              placeholder="Summary of responsibilities and scope of this role..."
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all resize-none"
            ></textarea>
          </div>

          <!-- Modal Action Buttons -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#DCEBE7]">
            <button 
              type="button" 
              (click)="closeModal.emit()"
              class="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border-none bg-transparent">
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
                <span class="material-symbols-outlined text-base">check</span>
                <span>{{ isEditMode ? 'Update Designation' : 'Create Designation' }}</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class DesignationFormModalComponent implements OnChanges {
  @Input() designation: Designation | null = null;
  @Input() departments: Department[] = [];
  @Input() selectedDepartmentId?: number;
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveDesignation = new EventEmitter<CreateDesignationParams | UpdateDesignationParams>();

  private readonly fb = inject(FormBuilder);
  get isEditMode(): boolean {
    return !!this.designation;
  }

  readonly form: FormGroup = this.fb.group({
    departmentId: [null, [Validators.required]],
    title: ['', [Validators.required, Validators.maxLength(150)]],
    level: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
    grade: [''],
    description: ['']
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['designation'] && this.designation) {
      this.form.patchValue({
        departmentId: this.designation.departmentId,
        title: this.designation.title,
        level: this.designation.level,
        grade: this.designation.grade || '',
        description: this.designation.description || ''
      });
    } else if (this.selectedDepartmentId && !this.designation) {
      this.form.patchValue({ departmentId: this.selectedDepartmentId });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const formVal = this.form.value;

    if (this.isEditMode && this.designation) {
      const params: UpdateDesignationParams = {
        id: this.designation.id,
        departmentId: Number(formVal.departmentId),
        title: formVal.title,
        level: Number(formVal.level),
        grade: formVal.grade || null,
        description: formVal.description || null
      };
      this.saveDesignation.emit(params);
    } else {
      const params: CreateDesignationParams = {
        departmentId: Number(formVal.departmentId),
        title: formVal.title,
        level: Number(formVal.level),
        grade: formVal.grade || null,
        description: formVal.description || null
      };
      this.saveDesignation.emit(params);
    }
  }
}
