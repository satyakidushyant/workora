import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * Enterprise Workora Account Security & Password Console.
 * Features live password complexity analysis, real-time match verification, and modern security card layout.
 */
@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-5 sm:space-y-6 w-full">
      
      <!-- Top Navigation & Header Section -->
      <div class="security-header">
        <div class="flex items-center gap-1.5 text-xs text-[#718686] font-medium mb-1">
          <a routerLink="/dashboard" class="hover:text-[#087F73] transition-colors flex items-center gap-1 text-slate-500 font-semibold no-underline">
            <span class="material-symbols-outlined text-sm">dashboard</span>
            <span>Dashboard</span>
          </a>
          <span class="text-slate-300">/</span>
          <span class="text-[#102A2A] font-bold">Account Security</span>
        </div>

        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-2xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center shrink-0 shadow-xs">
            <span class="material-symbols-outlined text-2xl">lock_reset</span>
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#102A2A] tracking-tight font-heading">
              Account Password &amp; Security
            </h1>
            <p class="text-xs sm:text-sm text-[#718686] mt-0.5 font-medium">
              Protect your workspace profile by managing your login credentials and password strength.
            </p>
          </div>
        </div>
      </div>

      <!-- Main Security Container Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start security-grid">
        
        <!-- Left: Password Form (7 Columns) -->
        <div class="lg:col-span-7 workora-card p-6 sm:p-8 space-y-6">
          <div class="flex items-center justify-between border-b border-[#DDE9E6] pb-4">
            <div>
              <h2 class="text-base font-extrabold text-[#102A2A] font-heading flex items-center gap-2">
                <span class="material-symbols-outlined text-[#087F73]">key</span>
                <span>Change Password</span>
              </h2>
              <p class="text-xs text-[#718686] mt-0.5">Enter your existing password and choose a secure new password.</p>
            </div>
            <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#EBF5F3] text-[#087F73] border border-[#087F73]/20 uppercase">
              Encrypted
            </span>
          </div>

          <form class="space-y-4.5" (ngSubmit)="onSubmit()">
            
            <!-- Current Password -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-[#102A2A]">
                Current Password <span class="text-rose-500">*</span>
              </label>
              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-3.5 text-[#087F73] text-base pointer-events-none">lock_open</span>
                <input 
                  class="w-full h-10 pl-10 pr-11 bg-[#F6FAF9] text-xs font-semibold text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] focus:bg-white outline-none transition-all placeholder:text-[#718686]" 
                  name="currentPassword"
                  [(ngModel)]="currentPassword"
                  placeholder="Enter your current password" 
                  [type]="showCurrentPassword() ? 'text' : 'password'"
                  required
                />
                <button 
                  class="material-symbols-outlined text-slate-400 hover:text-[#087F73] transition-colors cursor-pointer text-lg absolute right-3.5 flex items-center justify-center border-none bg-transparent" 
                  type="button"
                  (click)="showCurrentPassword.set(!showCurrentPassword())"
                  aria-label="Toggle current password visibility"
                >
                  {{ showCurrentPassword() ? 'visibility_off' : 'visibility' }}
                </button>
              </div>
            </div>

            <!-- New Password -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-[#102A2A]">
                  New Password <span class="text-rose-500">*</span>
                </label>
                @if (newPassword) {
                  <span class="text-[10px] font-bold" [ngClass]="strengthLabelColor()">
                    {{ strengthLabel() }}
                  </span>
                }
              </div>

              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-3.5 text-[#087F73] text-base pointer-events-none">vpn_key</span>
                <input 
                  class="w-full h-10 pl-10 pr-11 bg-[#F6FAF9] text-xs font-semibold text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] focus:bg-white outline-none transition-all placeholder:text-[#718686]" 
                  name="newPassword"
                  [(ngModel)]="newPassword"
                  (ngModelChange)="onPasswordChange($event)"
                  placeholder="At least 8 characters with numbers &amp; symbols" 
                  [type]="showNewPassword() ? 'text' : 'password'"
                  required
                />
                <button 
                  class="material-symbols-outlined text-slate-400 hover:text-[#087F73] transition-colors cursor-pointer text-lg absolute right-3.5 flex items-center justify-center border-none bg-transparent" 
                  type="button"
                  (click)="showNewPassword.set(!showNewPassword())"
                  aria-label="Toggle new password visibility"
                >
                  {{ showNewPassword() ? 'visibility_off' : 'visibility' }}
                </button>
              </div>

              <!-- Password Strength Meter Bar -->
              @if (newPassword) {
                <div class="grid grid-cols-4 gap-1.5 pt-1">
                  <div class="h-1.5 rounded-full transition-all" [ngClass]="strengthScore() >= 1 ? strengthBarColor() : 'bg-slate-200'"></div>
                  <div class="h-1.5 rounded-full transition-all" [ngClass]="strengthScore() >= 2 ? strengthBarColor() : 'bg-slate-200'"></div>
                  <div class="h-1.5 rounded-full transition-all" [ngClass]="strengthScore() >= 3 ? strengthBarColor() : 'bg-slate-200'"></div>
                  <div class="h-1.5 rounded-full transition-all" [ngClass]="strengthScore() >= 4 ? strengthBarColor() : 'bg-slate-200'"></div>
                </div>
              }
            </div>

            <!-- Confirm New Password -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-[#102A2A]">
                  Confirm New Password <span class="text-rose-500">*</span>
                </label>
                @if (confirmPassword && newPassword) {
                  <span class="text-[10px] font-bold flex items-center gap-1" [ngClass]="passwordsMatch() ? 'text-emerald-600' : 'text-rose-600'">
                    <span class="material-symbols-outlined text-[13px]">{{ passwordsMatch() ? 'check_circle' : 'cancel' }}</span>
                    <span>{{ passwordsMatch() ? 'Passwords match' : 'Passwords do not match' }}</span>
                  </span>
                }
              </div>

              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-3.5 text-[#087F73] text-base pointer-events-none">verified_user</span>
                <input 
                  class="w-full h-10 pl-10 pr-11 bg-[#F6FAF9] text-xs font-semibold text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] focus:bg-white outline-none transition-all placeholder:text-[#718686]" 
                  name="confirmPassword"
                  [(ngModel)]="confirmPassword"
                  placeholder="Repeat your new password" 
                  [type]="showConfirmPassword() ? 'text' : 'password'"
                  required
                />
                <button 
                  class="material-symbols-outlined text-slate-400 hover:text-[#087F73] transition-colors cursor-pointer text-lg absolute right-3.5 flex items-center justify-center border-none bg-transparent" 
                  type="button"
                  (click)="showConfirmPassword.set(!showConfirmPassword())"
                  aria-label="Toggle confirm password visibility"
                >
                  {{ showConfirmPassword() ? 'visibility_off' : 'visibility' }}
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="pt-4 flex items-center justify-end gap-3 border-t border-[#DDE9E6]">
              <button 
                type="button"
                (click)="onCancel()"
                class="workora-btn-secondary text-xs px-4 py-2.5">
                Clear
              </button>
              
              <button 
                type="submit"
                [disabled]="isLoading() || !isFormValid()"
                class="workora-btn-primary text-xs px-6 py-2.5 shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer">
                @if (isLoading()) {
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Updating...</span>
                } @else {
                  <span class="material-symbols-outlined text-base">lock</span>
                  <span>Update Password</span>
                }
              </button>
            </div>

          </form>
        </div>

        <!-- Right: Security Checklist & Guidelines (5 Columns) -->
        <div class="lg:col-span-5 space-y-4">
          
          <!-- Requirement Checklist Card -->
          <div class="workora-card p-6 space-y-4">
            <div class="flex items-center gap-2 border-b border-[#DDE9E6] pb-3">
              <span class="material-symbols-outlined text-[#087F73] text-lg">checklist</span>
              <h2 class="text-xs font-bold text-[#102A2A] tracking-wider uppercase font-heading">
                Password Criteria
              </h2>
            </div>

            <ul class="space-y-3 text-xs">
              <li [ngClass]="ruleMinLength() ? 'text-emerald-700 font-bold' : 'text-[#718686]'" class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-lg shrink-0" [ngClass]="ruleMinLength() ? 'text-emerald-600' : 'text-slate-300'">
                  {{ ruleMinLength() ? 'check_circle' : 'radio_button_unchecked' }}
                </span>
                <span>Minimum 8 characters length</span>
              </li>

              <li [ngClass]="ruleNumber() ? 'text-emerald-700 font-bold' : 'text-[#718686]'" class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-lg shrink-0" [ngClass]="ruleNumber() ? 'text-emerald-600' : 'text-slate-300'">
                  {{ ruleNumber() ? 'check_circle' : 'radio_button_unchecked' }}
                </span>
                <span>Contains at least one number (0-9)</span>
              </li>

              <li [ngClass]="ruleSymbol() ? 'text-emerald-700 font-bold' : 'text-[#718686]'" class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-lg shrink-0" [ngClass]="ruleSymbol() ? 'text-emerald-600' : 'text-slate-300'">
                  {{ ruleSymbol() ? 'check_circle' : 'radio_button_unchecked' }}
                </span>
                <span>Contains a special character (!&#64;#$%^&amp;*)</span>
              </li>

              <li [ngClass]="ruleLetterVariation() ? 'text-emerald-700 font-bold' : 'text-[#718686]'" class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-lg shrink-0" [ngClass]="ruleLetterVariation() ? 'text-emerald-600' : 'text-slate-300'">
                  {{ ruleLetterVariation() ? 'check_circle' : 'radio_button_unchecked' }}
                </span>
                <span>Mix of uppercase &amp; lowercase letters</span>
              </li>
            </ul>

            <div class="p-3.5 bg-[#DDF7F2]/40 rounded-2xl border border-[#087F73]/20 space-y-1">
              <p class="text-xs font-bold text-[#075E58] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">shield</span>
                <span>Security Recommendation</span>
              </p>
              <p class="text-[11px] text-[#718686] leading-relaxed">
                Use a password unique to your Workora corporate login and avoid reusing personal passwords.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  `
})
export class ChangePasswordPageComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  readonly isLoading = signal<boolean>(false);
  readonly showCurrentPassword = signal<boolean>(false);
  readonly showNewPassword = signal<boolean>(false);
  readonly showConfirmPassword = signal<boolean>(false);

  readonly ruleMinLength = signal<boolean>(false);
  readonly ruleNumber = signal<boolean>(false);
  readonly ruleSymbol = signal<boolean>(false);
  readonly ruleLetterVariation = signal<boolean>(false);

  readonly strengthScore = computed<number>(() => {
    let score = 0;
    if (this.ruleMinLength()) score++;
    if (this.ruleNumber()) score++;
    if (this.ruleSymbol()) score++;
    if (this.ruleLetterVariation()) score++;
    return score;
  });

  readonly strengthLabel = computed<string>(() => {
    const score = this.strengthScore();
    if (score <= 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    return 'Strong & Secure';
  });

  readonly strengthLabelColor = computed<string>(() => {
    const score = this.strengthScore();
    if (score <= 1) return 'text-rose-600';
    if (score === 2) return 'text-amber-600';
    if (score === 3) return 'text-blue-600';
    return 'text-emerald-600';
  });

  readonly strengthBarColor = computed<string>(() => {
    const score = this.strengthScore();
    if (score <= 1) return 'bg-rose-500';
    if (score === 2) return 'bg-amber-500';
    if (score === 3) return 'bg-blue-500';
    return 'bg-emerald-500';
  });

  readonly passwordsMatch = computed<boolean>(() => {
    return !!this.newPassword && !!this.confirmPassword && this.newPassword === this.confirmPassword;
  });

  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    this.ctx = gsap.context(() => {
      gsap.from('.security-header', { y: -10, opacity: 0, duration: 0.4 });
      gsap.from('.security-grid > div', { y: 15, opacity: 0, stagger: 0.1, duration: 0.4 });
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  onPasswordChange(pwd: string): void {
    this.ruleMinLength.set(pwd.length >= 8);
    this.ruleNumber.set(/[0-9]/.test(pwd));
    this.ruleSymbol.set(/[^A-Za-z0-9]/.test(pwd));
    this.ruleLetterVariation.set(/[a-z]/.test(pwd) && /[A-Z]/.test(pwd));
  }

  onCancel(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.onPasswordChange('');
  }

  isFormValid(): boolean {
    return !!this.currentPassword && 
           !!this.newPassword && 
           this.newPassword.length >= 8 && 
           this.newPassword === this.confirmPassword;
  }

  onSubmit(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.notificationService.showWarning('Please fill out all required password fields.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.notificationService.showWarning('The new passwords do not match. Please re-enter them.');
      return;
    }

    if (this.newPassword.length < 8) {
      this.notificationService.showWarning('New password must be at least 8 characters long.');
      return;
    }

    this.isLoading.set(true);

    this.authService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notificationService.showSuccess('Your account password has been updated successfully.');
        this.onCancel();
      },
      error: (err: any) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || err?.message || 'Failed to update password. Please verify your current password.';
        this.notificationService.showError(msg);
      }
    });
  }
}
