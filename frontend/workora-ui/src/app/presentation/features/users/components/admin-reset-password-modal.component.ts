import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSummary, AdminResetPasswordParams } from '../../../../domain/models/user.model';

@Component({
  selector: 'app-admin-reset-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div class="relative w-full max-w-md p-6 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl shadow-purple-500/10 overflow-hidden">
        <!-- Background Glow -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Header -->
        <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div>
            <h2 class="text-xl font-bold text-white tracking-tight">
              Reset User Password
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Override password for <span class="text-indigo-400 font-semibold">{{ targetUser?.email }}</span>
            </p>
          </div>
          <button
            (click)="onCancel()"
            class="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
            aria-label="Close modal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- New Password -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <input
              type="password"
              formControlName="newPassword"
              placeholder="Enter new strong password"
              class="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
            <div *ngIf="resetForm.get('newPassword')?.touched && resetForm.get('newPassword')?.invalid" class="text-red-400 text-xs mt-1">
              Password must be at least 8 characters long.
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              formControlName="confirmPassword"
              placeholder="Re-enter new password"
              class="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
            <div *ngIf="resetForm.errors?.['mismatch'] && resetForm.get('confirmPassword')?.touched" class="text-red-400 text-xs mt-1">
              Passwords do not match.
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-slate-800 mt-6">
            <button
              type="button"
              (click)="onCancel()"
              class="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium">
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="resetForm.invalid || isSubmitting"
              class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium text-sm shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!isSubmitting">Reset Password</span>
              <span *ngIf="isSubmitting" class="flex items-center space-x-2">
                <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Resetting...</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminResetPasswordModalComponent implements OnInit {
  @Input() targetUser!: UserSummary | null;
  @Input() isSubmitting = false;

  @Output() resetPassword = new EventEmitter<AdminResetPasswordParams>();
  @Output() cancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  resetForm!: FormGroup;

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: FormGroup) {
    const pass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.targetUser) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.resetPassword.emit({
      userId: this.targetUser.id,
      newPassword: this.resetForm.value.newPassword
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
