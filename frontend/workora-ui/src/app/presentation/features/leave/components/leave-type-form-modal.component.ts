import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveType, SaveLeaveTypeParams } from '../../../../domain/models/leave.model';

@Component({
  selector: 'app-leave-type-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">policy</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                {{ leaveType ? 'Edit Leave Policy' : 'Create Leave Policy' }}
              </h3>
              <p class="text-xs text-slate-500">Configure annual quota, approvals, and carryover rules.</p>
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
              <label class="workora-label">Policy Name <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="name" 
                placeholder="e.g. Paid Time Off (PTO)"
                class="workora-input !py-2.5"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Code <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="code" 
                  placeholder="e.g. PTO / SICK"
                  class="workora-input !py-2.5 uppercase font-mono"
                />
              </div>

              <div>
                <label class="workora-label">Annual Quota (Days) <span class="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  formControlName="annualQuota" 
                  min="0"
                  class="workora-input !py-2.5"
                />
              </div>
            </div>

            <div class="space-y-2 pt-2">
              <label class="flex items-center gap-2 text-xs font-bold text-[#063B39] cursor-pointer">
                <input type="checkbox" formControlName="requiresHrApproval" class="workora-checkbox" />
                <span>Requires HR / Admin Final Approval</span>
              </label>

              <label class="flex items-center gap-2 text-xs font-bold text-[#063B39] cursor-pointer">
                <input type="checkbox" formControlName="allowNegativeBalance" class="workora-checkbox" />
                <span>Allow Negative Balance (Advance Leave)</span>
              </label>
            </div>

            <div>
              <label class="workora-label">Description / Guidelines</label>
              <textarea 
                formControlName="description" 
                rows="2" 
                placeholder="e.g. 18 days credited at year start, max 5 carryforward..."
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
                <span>Saving...</span>
              } @else {
                <span class="material-symbols-outlined text-base">save</span>
                <span>Save Policy</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class LeaveTypeFormModalComponent implements OnChanges {
  @Input() leaveType: LeaveType | null = null;
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() savePolicy = new EventEmitter<SaveLeaveTypeParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    code: ['', [Validators.required, Validators.maxLength(20)]],
    annualQuota: [15, [Validators.required, Validators.min(0)]],
    requiresHrApproval: [true],
    allowNegativeBalance: [false],
    description: ['']
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leaveType'] && this.leaveType) {
      this.form.patchValue({
        name: this.leaveType.name,
        code: this.leaveType.code,
        annualQuota: this.leaveType.annualQuota,
        requiresHrApproval: this.leaveType.requiresHrApproval,
        allowNegativeBalance: this.leaveType.allowNegativeBalance,
        description: this.leaveType.description || ''
      });
    } else if (changes['leaveType'] && !this.leaveType) {
      this.form.reset({
        annualQuota: 15,
        requiresHrApproval: true,
        allowNegativeBalance: false
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.savePolicy.emit({
      id: this.leaveType?.id,
      companyId: 1,
      name: v.name,
      code: v.code.toUpperCase(),
      annualQuota: Number(v.annualQuota),
      requiresHrApproval: !!v.requiresHrApproval,
      allowNegativeBalance: !!v.allowNegativeBalance,
      description: v.description || null
    });
  }
}
