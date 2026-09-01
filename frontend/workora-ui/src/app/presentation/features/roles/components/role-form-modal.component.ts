import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role, CreateRoleParams, UpdateRoleParams } from '../../../../domain/models/role-permission.model';

/**
 * Presentational modal component for creating and updating roles.
 */
@Component({
  selector: 'app-role-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center font-extrabold shadow-2xs shrink-0">
              <span class="material-symbols-outlined text-xl">{{ isEditMode ? 'edit_square' : 'add_moderator' }}</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#102A2A] font-heading">
                {{ isEditMode ? 'Update Security Role' : 'Create Custom Role' }}
              </h3>
              <p class="text-xs text-[#718686]">Define access title and security scope.</p>
            </div>
          </div>
          <button 
            type="button" 
            (click)="closeModal.emit()"
            class="text-slate-400 hover:text-[#102A2A] rounded-xl p-1.5 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col flex-1 overflow-hidden">
          <div class="workora-modal-body space-y-4">
            <div>
              <label class="workora-label">Role Name <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="name" 
                placeholder="Role Name"
                class="workora-input !py-2.5"
              />
              @if (form.get('name')?.invalid && form.get('name')?.touched) {
                <p class="text-[11px] text-rose-500 font-semibold mt-1">Role name is required (max 100 chars).</p>
              }
            </div>

            <div>
              <label class="workora-label">Role Scope / Description</label>
              <textarea 
                formControlName="description" 
                rows="3" 
                placeholder="Describe access privileges and purpose for this role..."
                class="workora-input !rounded-2xl !py-2.5 resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Actions -->
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
                <span>{{ isEditMode ? 'Update Role' : 'Create Role' }}</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class RoleFormModalComponent implements OnChanges {
  @Input() role: Role | null = null;
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveRole = new EventEmitter<CreateRoleParams | UpdateRoleParams>();

  private readonly fb = inject(FormBuilder);
  get isEditMode(): boolean {
    return !!this.role;
  }

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['']
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['role'] && this.role) {
      this.form.patchValue({
        name: this.role.name,
        description: this.role.description || ''
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const formVal = this.form.value;

    if (this.isEditMode && this.role) {
      const params: UpdateRoleParams = {
        id: this.role.id,
        name: formVal.name,
        description: formVal.description || null
      };
      this.saveRole.emit(params);
    } else {
      const params: CreateRoleParams = {
        name: formVal.name,
        description: formVal.description || null
      };
      this.saveRole.emit(params);
    }
  }
}
