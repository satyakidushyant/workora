import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthShaderComponent } from '../components/auth-shader.component';

export type PasswordStrengthLevel = 'Minimal' | 'Warning' | 'Average' | 'Info' | 'Success';

/**
 * Workora Reset Password Page Component.
 * Clean, secure interface with all notifications and validation delivered via toasts.
 */
@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShaderComponent],
  template: `
    <div class="bg-[#F4F8F7] text-[#163331] font-sans min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden relative flex flex-col justify-between items-center antialiased selection:bg-[#DCEBE7] selection:text-[#063B39]">
      <app-auth-shader></app-auth-shader>

      <!-- Header Navigation -->
      <header class="relative z-10 w-full px-4 xs:px-6 md:px-12 py-3 xs:py-4 md:py-5 flex justify-between items-center max-w-7xl 2xl:max-w-8xl mx-auto shrink-0">
        <a routerLink="/" class="flex items-center gap-2 cursor-pointer group focus:outline-none" aria-label="Workora Home">
          <img 
            alt="Workora Logo" 
            src="/workoraLogo.png" 
            class="h-9 xs:h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_4px_10px_rgba(14,110,104,0.22)]"
          />
          <span class="font-extrabold text-lg sm:text-xl tracking-tight text-[#063B39] font-heading">Workora</span>
        </a>

        <div class="flex items-center gap-4">
          <a routerLink="/login" class="text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Sign In</span>
          </a>
        </div>
      </header>

      <main class="relative z-10 flex flex-col items-center justify-center px-3.5 xs:px-6 py-4 my-auto w-full max-w-md overflow-y-auto lg:overflow-visible">
        
        <!-- Reset Form Card -->
        <div class="bg-white w-full rounded-3xl p-6 xs:p-8 border border-[#DCEBE7] shadow-xl auth-card">
          
          <div class="text-center mb-5 space-y-1">
            <div class="inline-flex p-3 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] mb-1">
              <span class="material-symbols-outlined text-2xl">key</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-[#063B39] tracking-tight font-heading">Choose a New Password</h2>
            <p class="text-xs text-slate-500">Pick something memorable and secure to protect your account.</p>
          </div>

          <form class="space-y-4" (ngSubmit)="onSubmit()">
            
            <!-- New Password Field -->
            <div class="space-y-1 auth-field">
              <label class="text-xs font-bold text-[#063B39]" for="new_password">New Password</label>
              <div class="relative flex items-center">
                <input 
                  class="workora-input pl-4 pr-11 !py-2.5 text-xs w-full" 
                  id="new_password" 
                  name="newPassword"
                  [(ngModel)]="newPassword"
                  (ngModelChange)="onPasswordChange($event)"
                  placeholder="At least 8 characters" 
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
                <span class="text-slate-500 font-medium text-[11px]">Password Strength</span>
                <span 
                  [ngClass]="{
                    'text-slate-400': strengthLevel() === 'Minimal',
                    'text-red-600': strengthLevel() === 'Warning',
                    'text-amber-600': strengthLevel() === 'Average',
                    'text-[#0E6E68]': strengthLevel() === 'Info',
                    'text-emerald-600': strengthLevel() === 'Success'
                  }"
                  class="font-bold text-[11px]"
                >
                  {{ strengthLabel() }}
                </span>
              </div>
              <div class="h-1.5 w-full bg-[#DCEBE7]/60 rounded-full overflow-hidden flex gap-1">
                <div [ngClass]="strengthScore() >= 1 ? 'bg-amber-500' : 'bg-transparent'" class="h-full flex-1 rounded-full transition-all duration-300"></div>
                <div [ngClass]="strengthScore() >= 2 ? 'bg-amber-500' : 'bg-transparent'" class="h-full flex-1 rounded-full transition-all duration-300"></div>
                <div [ngClass]="strengthScore() >= 3 ? 'bg-[#0E6E68]' : 'bg-transparent'" class="h-full flex-1 rounded-full transition-all duration-300"></div>
                <div [ngClass]="strengthScore() >= 4 ? 'bg-emerald-500' : 'bg-transparent'" class="h-full flex-1 rounded-full transition-all duration-300"></div>
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div class="space-y-1 auth-field">
              <label class="text-xs font-bold text-[#063B39]" for="confirm_password">Confirm New Password</label>
              <div class="relative flex items-center">
                <input 
                  class="workora-input pl-4 pr-11 !py-2.5 text-xs w-full" 
                  id="confirm_password" 
                  name="confirmPassword"
                  [(ngModel)]="confirmPassword"
                  placeholder="Repeat new password" 
                  [type]="showConfirmPassword() ? 'text' : 'password'"
                  required
                />
                <button 
                  class="material-symbols-outlined text-slate-400 hover:text-[#063B39] transition-colors cursor-pointer text-base absolute right-3.5 flex items-center justify-center border-none bg-transparent" 
                  type="button"
                  (click)="toggleConfirmPasswordVisibility()"
                  aria-label="Toggle confirm password visibility"
                >
                  {{ showConfirmPassword() ? 'visibility_off' : 'visibility' }}
                </button>
              </div>
            </div>

            <button 
              [disabled]="isLoading()" 
              class="w-full h-11 workora-btn-primary text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 mt-2" 
              type="submit"
            >
              @if (isLoading()) {
                <span class="animate-spin material-symbols-outlined text-base">progress_activity</span>
                <span>Updating password...</span>
              } @else {
                <span>Save New Password &amp; Sign In</span>
                <span class="material-symbols-outlined text-base">check</span>
              }
            </button>
          </form>

          <!-- Back to Login -->
          <div class="mt-5 pt-3.5 border-t border-[#DCEBE7] text-center">
            <a routerLink="/login" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-base">arrow_back</span>
              <span>Back to Sign In</span>
            </a>
          </div>
        </div>

      </main>

      <!-- Footer -->
      <footer class="relative z-10 w-full px-6 py-3.5 text-center text-xs text-slate-500 shrink-0">
        <p>&copy; 2026 Workora Inc. Secure password update.</p>
      </footer>
    </div>
  `
})
export class ResetPasswordPageComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private ctx?: gsap.Context;

  token = '';
  email = '';
  newPassword = '';
  confirmPassword = '';

  readonly isLoading = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);
  readonly showConfirmPassword = signal<boolean>(false);
  readonly strengthScore = signal<number>(0);
  readonly strengthLevel = signal<PasswordStrengthLevel>('Minimal');
  readonly strengthLabel = signal<string>('Enter password');

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
    this.showPassword.update(p => !p);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(p => !p);
  }

  onPasswordChange(pwd: string): void {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    this.strengthScore.set(score);

    if (pwd.length === 0) {
      this.strengthLevel.set('Minimal');
      this.strengthLabel.set('Enter password');
    } else if (score <= 1) {
      this.strengthLevel.set('Warning');
      this.strengthLabel.set('Weak — add numbers or symbols');
    } else if (score === 2) {
      this.strengthLevel.set('Average');
      this.strengthLabel.set('Fair — getting stronger');
    } else if (score === 3) {
      this.strengthLevel.set('Info');
      this.strengthLabel.set('Good password');
    } else {
      this.strengthLevel.set('Success');
      this.strengthLabel.set('Excellent & secure! 🎉');
    }
  }

  onSubmit(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.notificationService.showWarning('Please fill out both password fields.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.notificationService.showWarning('Passwords do not match. Please double-check.');
      return;
    }

    if (this.newPassword.length < 8) {
      this.notificationService.showWarning('Please use at least 8 characters for your password.');
      return;
    }

    this.isLoading.set(true);

    this.authService.resetPassword({
      token: this.token || 'demo-token',
      email: this.email || 'user@workora.com',
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
