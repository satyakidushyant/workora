import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role, CloneRoleParams } from '../../../../domain/models/role-permission.model';

/**
 * Presentational modal component for cloning a role with its assigned permissions.
 */
@Component({
  selector: 'app-clone-role-modal',
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
              <span class="material-symbols-outlined text-xl">content_copy</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#102A2A] font-heading">
                Clone Role: {{ role?.name }}
              </h3>
              <p class="text-xs text-[#718686]">Duplicate this role and all assigned permissions.</p>
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
              <label class="workora-label">New Cloned Role Name <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="newName" 
                placeholder="New Cloned Role Name"
                class="workora-input !py-2.5"
              />
              @if (form.get('newName')?.invalid && form.get('newName')?.touched) {
                <p class="text-[11px] text-rose-500 font-semibold mt-1">New role name is required.</p>
              }
            </div>

            <div>
              <label class="workora-label">Description</label>
              <textarea 
                formControlName="description" 
                rows="3" 
                placeholder="Describe the cloned role purpose..."
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
                <span>Cloning...</span>
              } @else {
                <span class="material-symbols-outlined text-base">content_copy</span>
                <span>Clone Role</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class CloneRoleModalComponent {
  @Input() role: Role | null = null;
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() cloneRole = new EventEmitter<CloneRoleParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    newName: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['']
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.form.invalid || !this.role) return;
    const formVal = this.form.value;
    this.cloneRole.emit({
      sourceRoleId: this.role.id,
      newName: formVal.newName,
      description: formVal.description || null
    });
  }
}
