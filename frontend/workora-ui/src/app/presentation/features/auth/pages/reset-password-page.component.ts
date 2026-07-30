import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthShaderComponent } from '../components/auth-shader.component';

/**
 * Password strength rating categories.
 */
export type PasswordStrengthLevel = 'Minimal' | 'Warning' | 'Average' | 'Info' | 'Success';

/**
 * Enterprise HRMS Reset Password Page Component.
 * Enables user to define a new password via password recovery token, 
 * featuring WebGL liquid mesh shader canvas, live password strength entropy meter,
 * and policy criteria verification.
 */
@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShaderComponent],
  template: `
    <div class="bg-[#0d1320] text-on-surface font-body-md overflow-x-hidden min-h-screen relative flex flex-col items-center justify-center antialiased">
      <!-- WebGL Shader Background & Interactive Atmospheric Orbs -->
      <app-auth-shader></app-auth-shader>

      <!-- Main Container Canvas -->
      <main class="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 my-auto w-full max-w-md">
        <!-- Brand Identity -->
        <div class="mb-8 text-center cursor-pointer" routerLink="/">
          <div class="flex items-center justify-center gap-3 mb-2">
            <img alt="Workora Logo" class="h-10 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(77,142,255,0.5)]" src="/workora.png"/>
            <h1 class="font-display-lg text-3xl md:text-4xl font-extrabold tracking-tighter text-on-surface">Workora</h1>
          </div>
          <p class="text-on-surface-variant font-body-md text-xs max-w-xs mx-auto opacity-80">
            Security first workforce intelligence. Secure your account with a high-entropy credential.
          </p>
        </div>

        <!-- Reset Form Card -->
        <div class="glass-panel w-full rounded-2xl p-8 relative overflow-hidden shadow-2xl">
          <!-- Form Header -->
          <div class="mb-6">
            <h2 class="font-headline-md text-2xl font-bold text-on-surface mb-1">Reset Password</h2>
            <p class="text-xs font-label-sm text-on-surface-variant">Choose a unique passphrase for your secure environment.</p>
          </div>

          <!-- Error Feedback Banner -->
          @if (errorMessage()) {
            <div class="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3 text-error">
              <span class="material-symbols-outlined text-xl shrink-0 mt-0.5">error</span>
              <div class="font-body-sm text-xs">{{ errorMessage() }}</div>
            </div>
          }

          <form class="space-y-5" (ngSubmit)="onSubmit()">
            <!-- New Password Field -->
            <div class="relative">
              <label class="block text-xs font-label-sm text-on-surface-variant mb-1 font-semibold uppercase tracking-wider" for="new_password">New Password</label>
              <div class="relative">
                <input 
                  class="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:ring-0 transition-all duration-300 py-3 px-1 text-sm text-on-surface placeholder-on-surface-variant/30 input-glow outline-none pr-10" 
                  id="new_password" 
                  name="newPassword"
                  [(ngModel)]="newPassword"
                  (ngModelChange)="onPasswordChange($event)"
                  placeholder="••••••••••••" 
                  [type]="showPassword() ? 'text' : 'password'"
                  required
                />
                <button 
                  class="absolute right-1 bottom-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" 
                  type="button"
                  (click)="togglePasswordVisibility()"
                >
                  <span class="material-symbols-outlined text-xl">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <!-- Password Strength Meter -->
            <div class="space-y-2 py-1">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-label-sm text-on-surface-variant">Security entropy</span>
                <span 
                  [ngClass]="{
                    'text-on-surface-variant': strengthLevel() === 'Minimal',
                    'text-error': strengthLevel() === 'Warning',
                    'text-primary-container': strengthLevel() === 'Average',
                    'text-primary': strengthLevel() === 'Info',
                    'text-secondary': strengthLevel() === 'Success'
                  }"
                  class="text-xs font-bold uppercase transition-colors duration-300 tracking-wider"
                >
                  {{ strengthLevel() }}
                </span>
              </div>
              <div class="grid grid-cols-4 gap-2 h-1.5">
                <div [ngClass]="getBarClass(1)" class="strength-bar rounded-full"></div>
                <div [ngClass]="getBarClass(2)" class="strength-bar rounded-full"></div>
                <div [ngClass]="getBarClass(3)" class="strength-bar rounded-full"></div>
                <div [ngClass]="getBarClass(4)" class="strength-bar rounded-full"></div>
              </div>
            </div>

            <!-- Validation Checklist -->
            <div class="space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
              <div class="flex items-center gap-2">
                <span 
                  [ngClass]="hasMinLength() ? 'text-secondary' : 'text-on-surface-variant'" 
                  class="material-symbols-outlined text-lg transition-colors"
                >
                  {{ hasMinLength() ? 'check_circle' : 'circle' }}
                </span>
                <span [ngClass]="hasMinLength() ? 'text-on-surface font-medium' : 'text-on-surface-variant'" class="text-xs">
                  At least 8 characters
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span 
                  [ngClass]="hasComplexity() ? 'text-secondary' : 'text-on-surface-variant'" 
                  class="material-symbols-outlined text-lg transition-colors"
                >
                  {{ hasComplexity() ? 'check_circle' : 'circle' }}
                </span>
                <span [ngClass]="hasComplexity() ? 'text-on-surface font-medium' : 'text-on-surface-variant'" class="text-xs">
                  Contains symbols or numbers
                </span>
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div class="relative">
              <label class="block text-xs font-label-sm text-on-surface-variant mb-1 font-semibold uppercase tracking-wider" for="confirm_password">Confirm New Password</label>
              <div class="relative">
                <input 
                  class="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:ring-0 transition-all duration-300 py-3 px-1 text-sm text-on-surface placeholder-on-surface-variant/30 input-glow outline-none" 
                  id="confirm_password" 
                  name="confirmPassword"
                  [(ngModel)]="confirmPassword"
                  placeholder="••••••••••••" 
                  type="password"
                  required
                />
              </div>
            </div>

            <!-- Action Button -->
            <button 
              [disabled]="isLoading() || isSuccess()"
              class="group relative w-full mt-4 bg-gradient-to-r from-primary to-secondary text-on-primary-container font-bold py-3.5 px-6 rounded-full shadow-[0_0_20px_rgba(173,198,255,0.2)] hover:shadow-[0_0_30px_rgba(173,198,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden active:scale-[0.98] cursor-pointer disabled:opacity-75" 
              type="submit"
            >
              <!-- Specular Highlight -->
              <div class="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              @if (isLoading()) {
                <span class="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                <span>Updating Secure Vault...</span>
              } @else if (isSuccess()) {
                <span class="material-symbols-outlined text-lg text-on-primary-container">verified</span>
                <span>Securely Updated</span>
              } @else {
                <span>Reset Password</span>
                <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform text-lg">arrow_forward</span>
              }
            </button>
          </form>

          <!-- Back to Login -->
          <div class="mt-6 pt-4 border-t border-white/5 text-center">
            <a routerLink="/login" class="text-xs font-label-sm text-on-surface-variant hover:text-primary transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer">
              <span class="material-symbols-outlined text-base">arrow_back</span>
              <span>Back to login</span>
            </a>
          </div>
        </div>

        <!-- System Security Status -->
        <div class="mt-8 flex items-center gap-6 opacity-60">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#5de6ff]"></span>
            <span class="text-xs font-label-sm uppercase tracking-widest text-outline">Encrypted</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#5de6ff]"></span>
            <span class="text-xs font-label-sm uppercase tracking-widest text-outline">ISO 27001</span>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .glass-panel {
      background: rgba(255, 255, 255, 0.035);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: inset 1px 1px 0px rgba(255, 255, 255, 0.08), 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .strength-bar {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .input-glow:focus {
      box-shadow: 0 4px 20px rgba(173, 198, 255, 0.15);
    }
  `]
})
export class ResetPasswordPageComponent {
  private readonly authService: AuthService = inject(AuthService) as AuthService;
  private readonly route: ActivatedRoute = inject(ActivatedRoute) as ActivatedRoute;
  private readonly router: Router = inject(Router) as Router;

  /**
   * Reset token extracted from query params.
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
  readonly strengthLevel = signal<PasswordStrengthLevel>('Minimal');

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
      this.strengthLevel.set('Minimal');
      return;
    }

    if (lenPass) score++;
    if (complexPass) score++;
    if (val.length >= 12) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;

    this.strengthScore.set(score);

    if (score === 0 || score === 1) this.strengthLevel.set('Warning');
    else if (score === 2) this.strengthLevel.set('Average');
    else if (score === 3) this.strengthLevel.set('Info');
    else if (score >= 4) this.strengthLevel.set('Success');
    else this.strengthLevel.set('Minimal');
  }

  /**
   * Helper computing CSS background color class for strength bar indicators.
   * 
   * @param barIndex 1 to 4 bar position.
   * @returns Tailwind background color class string.
   */
  getBarClass(barIndex: number): string {
    const score = this.strengthScore();
    if (barIndex > score) return 'bg-white/10';
    if (score <= 1) return 'bg-error shadow-[0_0_10px_rgba(255,180,171,0.3)]';
    if (score === 2) return 'bg-error-container shadow-[0_0_10px_rgba(147,0,10,0.3)]';
    if (score === 3) return 'bg-primary-container shadow-[0_0_10px_rgba(77,142,255,0.3)]';
    return 'bg-secondary shadow-[0_0_10px_rgba(93,230,255,0.3)]';
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
