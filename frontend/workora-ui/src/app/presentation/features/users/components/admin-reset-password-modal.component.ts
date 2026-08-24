import { Component, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { gsap } from 'gsap';
import { UserSummary, AdminResetPasswordParams } from '../../../../domain/models/user.model';

/**
 * Enterprise Workora Admin Reset Password Modal Component.
 * Enables administrators to securely reset employee credentials with validation, password toggle, and GSAP motion.
 */
@Component({
  selector: 'app-admin-reset-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-3.5 xs:p-4 bg-[#063B39]/50 backdrop-blur-xs modal-backdrop">
      <div class="relative w-full max-w-md p-5 xs:p-6 sm:p-8 bg-white border border-[#DCEBE7] rounded-2xl sm:rounded-3xl shadow-2xl workora-modal-container overflow-hidden modal-box">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-3.5 sm:pb-4 mb-4 sm:mb-6 border-b border-[#DCEBE7]">
          <div>
            <h2 class="text-lg sm:text-xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Reset User Password
            </h2>
            <p class="text-xs text-[#6B7F7C] mt-0.5">
              Override credentials for <span class="text-[#0E6E68] font-bold">{{ effectiveUser?.email }}</span>
            </p>
          </div>
          <button
            type="button"
            (click)="onCancel()"
            class="p-1.5 text-slate-400 hover:text-[#063B39] rounded-xl hover:bg-[#DCEBE7]/40 transition-colors border-none bg-transparent cursor-pointer shrink-0"
            aria-label="Close modal">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form (with scroll body for small screens) -->
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-4 workora-modal-body">
          
          <!-- New Password -->
          <div class="space-y-1">
            <label class="workora-label">
              New Password
            </label>
            <div class="relative flex items-center">
              <input
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="newPassword"
                placeholder="Enter new strong password"
                class="workora-input text-xs pl-4 pr-11 !py-2.5" 
                [ngClass]="{'workora-input-error': resetForm.get('newPassword')?.touched && resetForm.get('newPassword')?.invalid}"
              />
              <button 
                type="button"
                (click)="showPassword.set(!showPassword())"
                class="material-symbols-outlined text-slate-400 hover:text-[#063B39] transition-colors cursor-pointer text-base absolute right-3.5 flex items-center justify-center border-none bg-transparent"
                aria-label="Toggle password visibility"
              >
                {{ showPassword() ? 'visibility_off' : 'visibility' }}
              </button>
            </div>
            @if (resetForm.get('newPassword')?.touched && resetForm.get('newPassword')?.invalid) {
              <div class="text-red-600 text-xs mt-1 font-medium">
                Password must be at least 8 characters long.
              </div>
            }
          </div>

          <!-- Confirm Password -->
          <div class="space-y-1">
            <label class="workora-label">
              Confirm New Password
            </label>
            <div class="relative flex items-center">
              <input
                [type]="showConfirmPassword() ? 'text' : 'password'"
                formControlName="confirmPassword"
                placeholder="Re-enter new password"
                class="workora-input text-xs pl-4 pr-11 !py-2.5" 
                [ngClass]="{'workora-input-error': resetForm.errors?.['mismatch'] && resetForm.get('confirmPassword')?.touched}"
              />
              <button 
                type="button"
                (click)="showConfirmPassword.set(!showConfirmPassword())"
                class="material-symbols-outlined text-slate-400 hover:text-[#063B39] transition-colors cursor-pointer text-base absolute right-3.5 flex items-center justify-center border-none bg-transparent"
                aria-label="Toggle confirm password visibility"
              >
                {{ showConfirmPassword() ? 'visibility_off' : 'visibility' }}
              </button>
            </div>
            @if (resetForm.errors?.['mismatch'] && resetForm.get('confirmPassword')?.touched) {
              <div class="text-red-600 text-xs mt-1 font-medium">
                Passwords do not match.
              </div>
            }
          </div>

          <!-- Security Notice -->
          <div class="p-3 rounded-xl bg-[#DCEBE7]/40 border border-[#0E6E68]/15 text-[11px] text-[#063B39] leading-relaxed">
            <span class="font-bold">Security Note:</span> The user will be required to authenticate with these new credentials on their next session.
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-5 border-t border-[#DCEBE7] mt-6">
            <button
              type="button"
              (click)="onCancel()"
              [disabled]="effectiveLoading"
              class="workora-btn-secondary px-4 py-2 text-xs">
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="resetForm.invalid || effectiveLoading"
              class="workora-btn-primary px-5 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed shadow-teal">
              @if (effectiveLoading) {
                <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Resetting...</span>
              } @else {
                <span>Reset Password</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class AdminResetPasswordModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() set user(val: UserSummary | null | undefined) {
    this.targetUser = val;
  }
  @Input() targetUser!: UserSummary | null | undefined;
  @Input() isLoading = false;
  @Input() isSubmitting = false;

  get effectiveUser(): UserSummary | null | undefined {
    return this.targetUser;
  }

  get effectiveLoading(): boolean {
    return this.isLoading || this.isSubmitting;
  }

  @Output() confirm = new EventEmitter<AdminResetPasswordParams>();
  @Output() resetPassword = new EventEmitter<AdminResetPasswordParams>();
  @Output() cancel = new EventEmitter<void>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly fb = inject(FormBuilder);

  readonly showPassword = signal<boolean>(false);
  readonly showConfirmPassword = signal<boolean>(false);

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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    this.ctx = gsap.context(() => {
      gsap.from('.modal-backdrop', {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out'
      });

      gsap.from('.modal-box', {
        scale: 0.95,
        y: 12,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.out'
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
    if (this.resetForm.invalid || !this.effectiveUser) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const payload: AdminResetPasswordParams = {
      userId: this.effectiveUser.id,
      newPassword: this.resetForm.value.newPassword
    };

    this.confirm.emit(payload);
    this.resetPassword.emit(payload);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
