import { Component, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { gsap } from 'gsap';
import { UserSummary, AdminResetPasswordParams } from '../../../../domain/models/user.model';

/**
 * Enterprise Workora Admin Reset Password Modal Component.
 * Enables administrators to securely reset employee credentials with validation and GSAP motion.
 */
@Component({
  selector: 'app-admin-reset-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs modal-backdrop">
      <div class="relative w-full max-w-md p-6 sm:p-8 bg-white border border-[#DCEBE7] rounded-3xl shadow-2xl overflow-hidden modal-box">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 mb-6 border-b border-[#DCEBE7]">
          <div>
            <h2 class="text-xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Reset User Password
            </h2>
            <p class="text-xs text-[#6B7F7C] mt-0.5">
              Override credentials for <span class="text-[#0E6E68] font-bold">{{ targetUser?.email }}</span>
            </p>
          </div>
          <button
            (click)="onCancel()"
            class="p-1.5 text-slate-400 hover:text-[#063B39] rounded-xl hover:bg-[#DCEBE7]/40 transition-colors border-none bg-transparent cursor-pointer"
            aria-label="Close modal">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- New Password -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-[#063B39] uppercase tracking-wider">
              New Password
            </label>
            <input
              type="password"
              formControlName="newPassword"
              placeholder="Enter new strong password"
              class="workora-input text-xs" />
            <div *ngIf="resetForm.get('newPassword')?.touched && resetForm.get('newPassword')?.invalid" class="text-red-600 text-xs mt-0.5">
              Password must be at least 8 characters long.
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-[#063B39] uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              type="password"
              formControlName="confirmPassword"
              placeholder="Re-enter new password"
              class="workora-input text-xs" />
            <div *ngIf="resetForm.errors?.['mismatch'] && resetForm.get('confirmPassword')?.touched" class="text-red-600 text-xs mt-0.5">
              Passwords do not match.
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-5 border-t border-[#DCEBE7] mt-6">
            <button
              type="button"
              (click)="onCancel()"
              class="workora-btn-secondary px-4 py-2 text-xs">
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="resetForm.invalid || isSubmitting"
              class="workora-btn-primary px-5 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!isSubmitting">Reset Password</span>
              <span *ngIf="isSubmitting" class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Resetting...</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminResetPasswordModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() targetUser!: UserSummary | null;
  @Input() isSubmitting = false;

  @Output() resetPassword = new EventEmitter<AdminResetPasswordParams>();
  @Output() cancel = new EventEmitter<void>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly fb = inject(FormBuilder);

  private ctx?: gsap.Context;
  resetForm!: FormGroup;

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ctx = gsap.context(() => {
      gsap.from('.modal-backdrop', {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out'
      });

      gsap.from('.modal-box', {
        scale: 0.94,
        y: 15,
        opacity: 0,
        duration: 0.35,
        ease: 'back.out(1.3)'
      });
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
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
