import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

/**
 * Password strength rating categories.
 */
export type PasswordStrengthLevel = 'Empty' | 'Weak' | 'Fair' | 'Strong' | 'Excellent';

/**
 * Enterprise HRMS Reset Password Page Component.
 * Enables user to define a new password via password recovery token, 
 * featuring live password strength evaluation and policy criteria verification.
 */
@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex w-full h-full bg-background overflow-hidden">
      <!-- Left Side: Narrative/Brand Visual Section (Split Screen) -->
      <section class="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden flex-col justify-between p-12 min-h-screen">
        <!-- Decorative Background Element -->
        <div class="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div class="absolute transform -rotate-45 -right-20 -top-20 w-[600px] h-[600px] border-[40px] border-secondary-container rounded-full"></div>
          <div class="absolute transform rotate-12 -left-20 bottom-0 w-[400px] h-[400px] border-[20px] border-tertiary-container rounded-full"></div>
        </div>

        <!-- Header Identity -->
        <div class="relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-secondary-container flex items-center justify-center rounded-lg shadow-lg">
              <span class="material-symbols-outlined text-on-secondary-container" style="font-variation-settings: 'FILL' 1;">corporate_fare</span>
            </div>
            <span class="font-headline-md text-headline-md font-black text-on-primary tracking-tight">Workora</span>
          </div>
        </div>

        <!-- Brand Message -->
        <div class="relative z-10 max-w-lg">
          <h1 class="font-headline-lg text-headline-lg text-on-primary mb-6 leading-tight font-bold">
            Securing Your Enterprise Infrastructure.
          </h1>
          <p class="font-body-lg text-body-lg text-on-primary-container opacity-90 text-gray-300">
            Precision-engineered HR and Payroll solutions. We ensure your security is as rigorous as your business operations.
          </p>

          <!-- Trust Elements -->
          <div class="mt-8 grid grid-cols-2 gap-4">
            <div class="p-4 border border-on-primary-container/20 rounded-xl bg-white/5 backdrop-blur-sm">
              <span class="material-symbols-outlined text-secondary-fixed mb-2 text-2xl">verified_user</span>
              <div class="font-label-md text-label-md text-on-primary font-semibold">AES-256 Encryption</div>
            </div>
            <div class="p-4 border border-on-primary-container/20 rounded-xl bg-white/5 backdrop-blur-sm">
              <span class="material-symbols-outlined text-secondary-fixed mb-2 text-2xl">admin_panel_settings</span>
              <div class="font-label-md text-label-md text-on-primary font-semibold">ISO 27001 Certified</div>
            </div>
          </div>
        </div>

        <!-- Footer Officer Status Card -->
        <div class="relative z-10 border-t border-on-primary-container/20 pt-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full border-2 border-secondary-fixed overflow-hidden shrink-0">
              <img 
                class="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuATXbroR08zyILqyuBU8gpGVW8O1GN8Bq1yyL9MHqL6neUyjgxf8wrM5bAy3CGsYLr0YxqQeJf8iqr9XB6R5Xq_j7b4wDUWZkyq5Zf11EGgF_II04krgxg2EwHwljVAjLwnDZBqv63EynJRwrGqGffQS-ahXhYEx6oVxfrhY6bI4-_IJ6J1CePtPEz1j8kQy1mGFJYTHj0oGJ89b-EAt7rX8rKuZcIQBvJCHlKuM9qnnoBAtAxwhmUrcvWM30Xn3Gk_azPwm1PW4bLw" 
                alt="Chief Security Officer"
              />
            </div>
            <div>
              <p class="font-label-md text-label-md text-on-primary font-bold">Nathaniel Wright</p>
              <p class="font-body-sm text-body-sm text-on-primary-container opacity-80 text-gray-300">Chief Security Officer, Workora Global</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Right Side: Interaction/Form Section -->
      <section class="w-full lg:w-1/2 flex items-center justify-center bg-surface-container-low px-6 sm:px-12 relative min-h-screen">
        <!-- Mobile Logo Only -->
        <div class="lg:hidden absolute top-8 left-6 flex items-center gap-2">
          <div class="w-8 h-8 bg-primary flex items-center justify-center rounded">
            <span class="material-symbols-outlined text-on-primary text-[20px]">corporate_fare</span>
          </div>
          <span class="font-headline-sm text-headline-sm font-black text-primary">Workora</span>
        </div>

        <!-- Form Card -->
        <div class="w-full max-w-[440px] bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-sm border border-border-subtle my-12">
          <div class="mb-8">
            <div class="w-12 h-12 bg-secondary-fixed flex items-center justify-center rounded-full mb-4">
              <span class="material-symbols-outlined text-on-secondary-fixed text-2xl">lock_reset</span>
            </div>
            <h2 class="font-headline-md text-headline-md text-primary mb-2 font-bold">Set New Password</h2>
            <p class="font-body-md text-body-md text-slate-text">
              Choose a strong password with at least 8 characters, including numbers and symbols.
            </p>
          </div>

          <!-- Error Feedback Banner -->
          @if (errorMessage()) {
            <div class="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 flex items-start gap-3 text-error">
              <span class="material-symbols-outlined text-xl shrink-0">error</span>
              <div class="font-body-sm text-body-sm">{{ errorMessage() }}</div>
            </div>
          }

          <form class="space-y-4" (ngSubmit)="onSubmit()">
            <!-- New Password Input -->
            <div class="space-y-1">
              <label class="block font-label-md text-label-md text-on-surface-variant" for="new_password">New Password</label>
              <div class="relative group border border-outline-variant rounded transition-all duration-200 bg-surface focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary">
                <input 
                  class="w-full bg-transparent border-0 py-3 pl-4 pr-12 text-primary font-body-md focus:outline-none" 
                  id="new_password" 
                  name="newPassword"
                  [(ngModel)]="newPassword"
                  (ngModelChange)="onPasswordChange($event)"
                  placeholder="••••••••" 
                  [type]="showPassword() ? 'text' : 'password'"
                  required
                />
                <button 
                  class="absolute right-3 top-3 text-on-surface-variant hover:text-primary transition-colors flex items-center" 
                  type="button"
                  (click)="togglePasswordVisibility()"
                >
                  <span class="material-symbols-outlined text-[20px]">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <!-- Password Strength Meter -->
            <div class="space-y-1 py-2">
              <div class="flex justify-between items-center">
                <span class="font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant">Password Strength</span>
                <span 
                  [ngClass]="{
                    'text-slate-text': strengthLevel() === 'Empty',
                    'text-error': strengthLevel() === 'Weak',
                    'text-warning': strengthLevel() === 'Fair',
                    'text-info': strengthLevel() === 'Strong',
                    'text-success': strengthLevel() === 'Excellent'
                  }"
                  class="font-label-md text-[10px] uppercase tracking-wider font-bold"
                >
                  {{ strengthLevel() }}
                </span>
              </div>
              
              <!-- Strength Bars -->
              <div class="flex gap-1">
                <div [ngClass]="getBarClass(1)" class="h-1 flex-1 rounded-full transition-all duration-300"></div>
                <div [ngClass]="getBarClass(2)" class="h-1 flex-1 rounded-full transition-all duration-300"></div>
                <div [ngClass]="getBarClass(3)" class="h-1 flex-1 rounded-full transition-all duration-300"></div>
                <div [ngClass]="getBarClass(4)" class="h-1 flex-1 rounded-full transition-all duration-300"></div>
              </div>
            </div>

            <!-- Confirm Password Input -->
            <div class="space-y-1">
              <label class="block font-label-md text-label-md text-on-surface-variant" for="confirm_password">Confirm New Password</label>
              <div class="relative group border border-outline-variant rounded transition-all duration-200 bg-surface focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary">
                <input 
                  class="w-full bg-transparent border-0 py-3 px-4 text-primary font-body-md focus:outline-none" 
                  id="confirm_password" 
                  name="confirmPassword"
                  [(ngModel)]="confirmPassword"
                  placeholder="••••••••" 
                  type="password"
                  required
                />
              </div>
            </div>

            <!-- Validation Feedback -->
            <div class="p-4 bg-surface-container-low rounded-lg border border-border-subtle my-4">
              <ul class="space-y-2">
                <li [ngClass]="hasMinLength() ? 'text-success' : 'text-on-surface-variant'" class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[16px]">{{ hasMinLength() ? 'check_circle' : 'cancel' }}</span>
                  <span class="font-body-sm text-body-sm">Minimum 8 characters</span>
                </li>
                <li [ngClass]="hasComplexity() ? 'text-success' : 'text-on-surface-variant'" class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[16px]">{{ hasComplexity() ? 'check_circle' : 'cancel' }}</span>
                  <span class="font-body-sm text-body-sm">Contains symbols or numbers</span>
                </li>
              </ul>
            </div>

            <!-- Action Button -->
            <div class="pt-2">
              <button 
                [disabled]="isLoading() || isSuccess()"
                [ngClass]="{
                  'bg-secondary hover:bg-secondary/90': !isSuccess(),
                  'bg-success': isSuccess()
                }"
                class="w-full text-on-secondary py-3 px-6 rounded font-label-md text-label-md shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:cursor-not-allowed" 
                type="submit"
              >
                @if (isLoading()) {
                  <span class="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  <span>Processing...</span>
                } @else if (isSuccess()) {
                  <span class="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Password Updated</span>
                } @else {
                  <span>Reset Password</span>
                  <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                }
              </button>
            </div>

            <div class="text-center pt-4">
              <a routerLink="/login" class="font-label-md text-label-md text-secondary hover:underline transition-all inline-flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-outlined text-[14px]">chevron_left</span>
                Return to Log In
              </a>
            </div>
          </form>
        </div>

        <!-- Global Footer -->
        <div class="absolute bottom-6 text-center w-full max-w-[440px]">
          <p class="font-body-sm text-body-sm text-slate-text/60">
            © 2026 Workora Inc. Enterprise Data Sovereignty Guaranteed.
          </p>
        </div>
      </section>
    </div>
  `
})
export class ResetPasswordPageComponent {
  private readonly authService: AuthService = inject(AuthService) as AuthService;
  private readonly route: ActivatedRoute = inject(ActivatedRoute) as ActivatedRoute;
  private readonly router: Router = inject(Router) as Router;

  /**
   * Reset token extracted from query params or route.
   */
  token = '';

  /**
   * Target corporate email extracted from query params.
   */
  email = '';

  /**
   * Model storing new password input.
   */
  newPassword = '';

  /**
   * Model storing confirmed password input.
   */
  confirmPassword = '';

  /**
   * Signal storing password visibility state.
   */
  readonly showPassword = signal<boolean>(false);

  /**
   * Signal storing numeric strength score (0 to 4).
   */
  readonly strengthScore = signal<number>(0);

  /**
   * Signal storing strength rating label.
   */
  readonly strengthLevel = signal<PasswordStrengthLevel>('Empty');

  /**
   * Signal indicating min 8 char rule check status.
   */
  readonly hasMinLength = signal<boolean>(false);

  /**
   * Signal indicating symbol/number complexity check status.
   */
  readonly hasComplexity = signal<boolean>(false);

  /**
   * Signal indicating active HTTP request.
   */
  readonly isLoading = signal<boolean>(false);

  /**
   * Signal indicating successful password reset completion.
   */
  readonly isSuccess = signal<boolean>(false);

  /**
   * Signal holding error feedback message.
   */
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
    });
  }

  /**
   * Toggles new password input visibility.
   */
  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  /**
   * Evaluates live password strength metrics on keypress or model update.
   * 
   * @param val Password string.
   */
  onPasswordChange(val: string): void {
    let score = 0;
    const lenPass = val.length >= 8;
    const complexPass = /[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val);

    this.hasMinLength.set(lenPass);
    this.hasComplexity.set(complexPass);

    if (!val) {
      this.strengthScore.set(0);
      this.strengthLevel.set('Empty');
      return;
    }

    if (lenPass) score++;
    if (complexPass) score++;
    if (val.length >= 12) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;

    this.strengthScore.set(score);

    if (score === 1) this.strengthLevel.set('Weak');
    else if (score === 2) this.strengthLevel.set('Fair');
    else if (score === 3) this.strengthLevel.set('Strong');
    else if (score >= 4) this.strengthLevel.set('Excellent');
    else this.strengthLevel.set('Weak');
  }

  /**
   * Helper computing CSS background color class for strength bar indicators.
   * 
   * @param barIndex 1 to 4 bar position.
   * @returns Tailwind background color class string.
   */
  getBarClass(barIndex: number): string {
    const score = this.strengthScore();
    if (barIndex > score) return 'bg-surface-container-highest';
    if (score === 1) return 'bg-error';
    if (score === 2) return 'bg-warning';
    if (score === 3) return 'bg-info';
    return 'bg-success';
  }

  /**
   * Submits new password reset payload to backend API.
   */
  onSubmit(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage.set('Please fill in both new password and confirmation fields.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match. Please verify your entries.');
      return;
    }

    if (!this.hasMinLength()) {
      this.errorMessage.set('Password must contain at least 8 characters.');
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.resetPassword({
      email: this.email,
      token: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.message || 'Password reset failed. The reset token may be expired or invalid.');
      }
    });
  }
}
