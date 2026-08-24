import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthShaderComponent } from '../components/auth-shader.component';

export type PasswordStrengthLevel = 'Minimal' | 'Warning' | 'Average' | 'Info' | 'Success';

/**
 * Enterprise HRMS Reset Password Page Component.
 * Enables user to define a new password via password recovery token
 * with modern Workora SaaS aesthetic, strength indicators, and GSAP entrance.
 */
@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShaderComponent],
  template: `
    <div class="bg-[#F4F8F7] text-[#163331] font-sans min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden relative flex flex-col justify-between items-center antialiased selection:bg-[#DCEBE7] selection:text-[#063B39]">
      <app-auth-shader></app-auth-shader>

      <!-- Header Navigation: Big 3D Logo Only -->
      <header class="relative z-10 w-full px-4 xs:px-6 md:px-12 py-3 xs:py-4 md:py-5 flex justify-between items-center max-w-7xl 2xl:max-w-8xl mx-auto shrink-0">
        <a routerLink="/" class="flex items-center cursor-pointer group focus:outline-none" aria-label="Workora Home">
          <img 
            alt="Workora 3D Logo" 
            src="/workoraLogo.png" 
            class="h-9 xs:h-11 sm:h-13 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_6px_14px_rgba(14,110,104,0.22)] group-hover:drop-shadow-[0_8px_20px_rgba(63,167,155,0.35)]"
          />
        </a>

        <div class="flex items-center gap-4">
          <a routerLink="/login" class="text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-base">arrow_back</span>
            <span class="hidden xs:inline">Back to Sign In</span>
          </a>
        </div>
      </header>

      <main class="relative z-10 flex flex-col items-center justify-center px-3.5 xs:px-6 py-4 my-auto w-full max-w-md overflow-y-auto lg:overflow-visible">
        
        <!-- Reset Form Card -->
        <div class="bg-white w-full rounded-2xl sm:rounded-3xl p-5 xs:p-7 sm:p-8 border border-[#DCEBE7] shadow-lg auth-card">
          
          <div class="text-center mb-5 space-y-1">
            <div class="inline-flex p-2.5 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] mb-1">
              <span class="material-symbols-outlined text-2xl">key</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-[#063B39] tracking-tight font-heading">Set New Password</h2>
            <p class="text-xs text-[#6B7F7C]">Choose a strong passphrase for your account.</p>
          </div>

          <!-- Error Alert Banner -->
          @if (errorMessage()) {
            <div class="mb-4 p-3 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-red-700 text-xs animate-in fade-in duration-200">
              <span class="material-symbols-outlined text-base shrink-0 mt-0.5 text-red-600">error</span>
              <div class="font-medium leading-relaxed">{{ errorMessage() }}</div>
            </div>
          }

          <form class="space-y-3.5" (ngSubmit)="onSubmit()">
            
            <!-- New Password Field -->
            <div class="space-y-1 auth-field">
              <label class="workora-label !mb-1" for="new_password">New Password</label>
              <div class="relative flex items-center">
                <input 
                  class="workora-input pl-4 pr-11 !py-2.5 text-xs" 
                  id="new_password" 
                  name="newPassword"
                  [(ngModel)]="newPassword"
                  (ngModelChange)="onPasswordChange($event)"
                  placeholder="••••••••••••" 
                  [type]="showPassword() ? 'text' : 'password'"
                  required
                />
                <button 
                  class="material-symbols-outlined text-slate-400 hover:text-[#063B39] transition-colors cursor-pointer text-base absolute right-3.5 flex items-center justify-center border-none bg-transparent" 
                  type="button"
                  (click)="togglePasswordVisibility()"
                  aria-label="Toggle password visibility"
                >
                  {{ showPassword() ? 'visibility_off' : 'visibility' }}
                </button>
              </div>
            </div>

            <!-- Strength Meter -->
            <div class="space-y-1 py-0.5">
              <div class="flex justify-between items-center text-xs">
                <span class="text-[#6B7F7C] font-medium text-[11px]">Security strength</span>
                <span 
                  [ngClass]="{
                    'text-slate-400': strengthLevel() === 'Minimal',
                    'text-red-600': strengthLevel() === 'Warning',
                    'text-amber-600': strengthLevel() === 'Average',
                    'text-[#0E6E68]': strengthLevel() === 'Info',
                    'text-emerald-600': strengthLevel() === 'Success'
                  }"
                  class="font-bold uppercase tracking-wider text-[10px]"
                >
                  {{ strengthLevel() }}
                </span>
              </div>
              <div class="grid grid-cols-4 gap-1.5 h-1.5">
                <div [ngClass]="getBarClass(1)" class="rounded-full transition-all duration-300"></div>
                <div [ngClass]="getBarClass(2)" class="rounded-full transition-all duration-300"></div>
                <div [ngClass]="getBarClass(3)" class="rounded-full transition-all duration-300"></div>
                <div [ngClass]="getBarClass(4)" class="rounded-full transition-all duration-300"></div>
              </div>
            </div>

            <!-- Validation Checklist -->
            <div class="space-y-1 bg-[#FAFCFB] p-2.5 rounded-xl border border-[#DCEBE7] text-[11px]">
              <div class="flex items-center gap-1.5">
                <span 
                  [ngClass]="hasMinLength() ? 'text-emerald-600' : 'text-slate-400'" 
                  class="material-symbols-outlined text-sm"
                >
                  {{ hasMinLength() ? 'check_circle' : 'radio_button_unchecked' }}
                </span>
                <span [ngClass]="hasMinLength() ? 'text-[#063B39] font-semibold' : 'text-[#6B7F7C]'">
                  At least 8 characters
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <span 
                  [ngClass]="hasComplexity() ? 'text-emerald-600' : 'text-slate-400'" 
                  class="material-symbols-outlined text-sm"
                >
                  {{ hasComplexity() ? 'check_circle' : 'radio_button_unchecked' }}
                </span>
                <span [ngClass]="hasComplexity() ? 'text-[#063B39] font-semibold' : 'text-[#6B7F7C]'">
                  Contains numbers or symbols
                </span>
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div class="space-y-1 auth-field">
              <label class="workora-label !mb-1" for="confirm_password">Confirm New Password</label>
              <div class="relative flex items-center">
                <input 
                  class="workora-input px-4 !py-2.5 text-xs" 
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
              class="w-full h-11 workora-btn-primary text-xs disabled:opacity-75" 
              type="submit"
            >
              @if (isLoading()) {
                <span class="material-symbols-outlined text-base animate-spin">progress_activity</span>
                <span>Updating Password...</span>
              } @else if (isSuccess()) {
                <span class="material-symbols-outlined text-base">verified</span>
                <span>Updated Successfully</span>
              } @else {
                <span>Update Password</span>
                <span class="material-symbols-outlined text-base">arrow_forward</span>
              }
            </button>
          </form>

          <!-- Back to Login -->
          <div class="mt-5 pt-3.5 border-t border-[#DCEBE7] text-center">
            <a routerLink="/login" class="text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer">
              <span class="material-symbols-outlined text-base">arrow_back</span>
              <span>Back to Sign In</span>
            </a>
          </div>
        </div>

      </main>

      <!-- Footer -->
      <footer class="relative z-10 w-full px-6 py-3 text-center text-[11px] text-[#6B7F7C] shrink-0">
        <p>© 2026 Workora HRMS. All rights reserved.</p>
      </footer>
    </div>
  `
})
export class ResetPasswordPageComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly authService: AuthService = inject(AuthService) as AuthService;
  private readonly route: ActivatedRoute = inject(ActivatedRoute) as ActivatedRoute;
  private readonly router: Router = inject(Router) as Router;

  private ctx?: gsap.Context;

  token = '';
  email = '';
  newPassword = '';
  confirmPassword = '';

  readonly showPassword = signal<boolean>(false);
  readonly strengthScore = signal<number>(0);
  readonly strengthLevel = signal<PasswordStrengthLevel>('Minimal');
  readonly hasMinLength = signal<boolean>(false);
  readonly hasComplexity = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly isSuccess = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ctx = gsap.context(() => {
      gsap.from('.auth-card', {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      });
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

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

  getBarClass(barIndex: number): string {
    const score = this.strengthScore();
    if (barIndex > score) return 'bg-slate-200';
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-amber-500';
    if (score === 3) return 'bg-[#0E6E68]';
    return 'bg-emerald-500';
  }

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
        this.errorMessage.set(err?.error?.message || err?.message || 'Password reset failed. The reset token may be expired or invalid.');
      }
    });
  }
}
