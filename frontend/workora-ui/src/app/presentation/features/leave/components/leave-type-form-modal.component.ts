import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveType, SaveLeaveTypeParams } from '../../../../domain/models/leave.model';

@Component({
  selector: 'app-leave-type-form-modal',
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
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Policy Name <span class="text-rose-500">*</span></label>
            <input 
              type="text" 
              formControlName="name" 
              placeholder="e.g. Paid Time Off (PTO)"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Code <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="code" 
                placeholder="e.g. PTO / SICK"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium uppercase font-mono transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Annual Quota (Days) <span class="text-rose-500">*</span></label>
              <input 
                type="number" 
                formControlName="annualQuota" 
                min="0"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>
          </div>

          <div class="space-y-2 pt-2">
            <label class="flex items-center gap-2 text-xs font-bold text-[#063B39] cursor-pointer">
              <input type="checkbox" formControlName="requiresHrApproval" class="rounded text-[#0E6E68] focus:ring-[#0E6E68]" />
              <span>Requires HR / Admin Final Approval</span>
            </label>

            <label class="flex items-center gap-2 text-xs font-bold text-[#063B39] cursor-pointer">
              <input type="checkbox" formControlName="allowNegativeBalance" class="rounded text-[#0E6E68] focus:ring-[#0E6E68]" />
              <span>Allow Negative Balance (Advance Leave)</span>
            </label>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Description / Guidelines</label>
            <textarea 
              formControlName="description" 
              rows="2" 
              placeholder="e.g. 18 days credited at year start, max 5 carryforward..."
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
