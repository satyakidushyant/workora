import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
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
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">content_copy</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Clone Role: {{ role?.name }}
              </h3>
              <p class="text-xs text-slate-500">Duplicate this role and all of its assigned permissions.</p>
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
            <label class="block text-xs font-bold text-[#063B39] mb-1">New Cloned Role Name <span class="text-rose-500">*</span></label>
            <input 
              type="text" 
              formControlName="newName" 
              placeholder="e.g. {{ role?.name }} (Copy)"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
            @if (form.get('newName')?.invalid && form.get('newName')?.touched) {
              <p class="text-[11px] text-rose-500 font-semibold mt-1">New role name is required.</p>
            }
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Description</label>
            <textarea 
              formControlName="description" 
              rows="3" 
              placeholder="Describe the cloned role purpose..."
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all resize-none"
            ></textarea>
          </div>

          <!-- Actions -->
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
