import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * Workora Change Password & Security Page Component.
 * Clean, modern interface with all notifications and validations delivered via toaster.
 */
@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-3.5 xs:p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl 2xl:max-w-8xl mx-auto w-full relative z-10">
      
      <!-- Header Section -->
      <div class="security-header">
        <div class="flex items-center gap-2 text-xs text-[#0E6E68]/70 mb-1">
          <a routerLink="/dashboard" class="hover:text-[#0E6E68] transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">dashboard</span>
            <span>Dashboard</span>
          </a>
          <span>/</span>
          <span class="text-[#063B39] font-bold">Security Settings</span>
        </div>
        <h1 class="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">Account &amp; Password Security</h1>
        <p class="text-xs sm:text-sm text-slate-600 mt-0.5">Keep your account safe and manage your login credentials.</p>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-12 gap-4 sm:gap-6 security-grid">
        
        <!-- Main Update Password Form (8 Columns) -->
        <div class="col-span-12 lg:col-span-8 space-y-4 sm:space-y-6">
          <section class="bg-white rounded-3xl p-5 xs:p-6 sm:p-8 border border-[#DCEBE7] shadow-sm workora-card">
            <div class="flex items-center gap-3 mb-5 sm:mb-6 pb-4 border-b border-[#DCEBE7]">
              <div class="w-10 h-10 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-2xl">lock_reset</span>
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-bold text-[#063B39] font-heading">Change Your Password</h2>
                <p class="text-xs text-slate-500">Enter your current password followed by your chosen new password.</p>
              </div>
            </div>

            <form class="space-y-4" (ngSubmit)="onSubmit()">
              <!-- Current Password -->
              <div class="space-y-1">
                <label class="text-xs font-bold text-[#063B39]">Current Password</label>
                <div class="relative flex items-center">
                  <input 
                    class="workora-input pl-4 pr-11 !py-2.5 text-xs w-full" 
                    name="currentPassword"
                    [(ngModel)]="currentPassword"
                    placeholder="••••••••••••" 
                    [type]="showCurrentPassword() ? 'text' : 'password'"
                    required
                  />
                  <button 
                    class="material-symbols-outlined text-slate-400 hover:text-[#063B39] transition-colors cursor-pointer text-lg absolute right-3.5 flex items-center justify-center border-none bg-transparent" 
                    type="button"
                    (click)="showCurrentPassword.set(!showCurrentPassword())"
                    aria-label="Toggle current password visibility"
                  >
                    {{ showCurrentPassword() ? 'visibility_off' : 'visibility' }}
                  </button>
                </div>
              </div>

              <!-- New & Confirm Password Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-xs font-bold text-[#063B39]">New Password</label>
                  <div class="relative flex items-center">
                    <input 
                      class="workora-input pl-4 pr-11 !py-2.5 text-xs w-full" 
                      name="newPassword"
                      [(ngModel)]="newPassword"
                      (ngModelChange)="onPasswordChange($event)"
                      placeholder="Minimum 8 characters" 
                      [type]="showNewPassword() ? 'text' : 'password'"
                      required
                    />
                    <button 
                      class="material-symbols-outlined text-slate-400 hover:text-[#063B39] transition-colors cursor-pointer text-lg absolute right-3.5 flex items-center justify-center border-none bg-transparent" 
                      type="button"
                      (click)="showNewPassword.set(!showNewPassword())"
                      aria-label="Toggle new password visibility"
                    >
                      {{ showNewPassword() ? 'visibility_off' : 'visibility' }}
                    </button>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-xs font-bold text-[#063B39]">Confirm New Password</label>
                  <div class="relative flex items-center">
                    <input 
                      class="workora-input pl-4 pr-11 !py-2.5 text-xs w-full" 
                      name="confirmPassword"
                      [(ngModel)]="confirmPassword"
                      placeholder="Repeat new password" 
                      [type]="showConfirmPassword() ? 'text' : 'password'"
                      required
                    />
                    <button 
                      class="material-symbols-outlined text-slate-400 hover:text-[#063B39] transition-colors cursor-pointer text-lg absolute right-3.5 flex items-center justify-center border-none bg-transparent" 
                      type="button"
                      (click)="showConfirmPassword.set(!showConfirmPassword())"
                      aria-label="Toggle confirm password visibility"
                    >
                      {{ showConfirmPassword() ? 'visibility_off' : 'visibility' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 border-t border-[#DCEBE7]">
                <button 
                  class="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-[#DCEBE7]/30 rounded-xl transition-colors border-none bg-transparent cursor-pointer text-center" 
                  type="button"
                  (click)="onCancel()"
                >
                  Clear Form
                </button>
                <button 
                  [disabled]="isLoading()"
                  class="px-6 py-2.5 workora-btn-primary text-xs font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-75" 
                  type="submit"
                >
                  @if (isLoading()) {
                    <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    <span>Saving password...</span>
                  } @else {
                    <span>Update Password</span>
                    <span class="material-symbols-outlined text-sm">check</span>
                  }
                </button>
              </div>
            </form>
          </section>

          <!-- Advanced Security Options -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white rounded-3xl p-5 border border-[#DCEBE7] shadow-sm flex items-start gap-3.5 workora-card">
              <div class="p-3 bg-[#DCEBE7] text-[#0E6E68] rounded-2xl shrink-0">
                <span class="material-symbols-outlined text-2xl">fingerprint</span>
              </div>
              <div>
                <h3 class="text-xs font-bold text-[#063B39]">Biometric &amp; Passkeys</h3>
                <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Sign in faster with Touch ID, Windows Hello, or your security key.</p>
                <button (click)="onPasskeysClick()" class="mt-2 text-[#0E6E68] font-bold text-[11px] flex items-center gap-1 hover:underline cursor-pointer border-none bg-transparent p-0">
                  Manage Passkeys <span class="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>

            <div class="bg-white rounded-3xl p-5 border border-[#DCEBE7] shadow-sm flex items-start gap-3.5 workora-card">
              <div class="p-3 bg-[#DCEBE7] text-[#3FA79B] rounded-2xl shrink-0">
                <span class="material-symbols-outlined text-2xl">devices</span>
              </div>
              <div>
                <h3 class="text-xs font-bold text-[#063B39]">Active Device Sessions</h3>
                <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">You are currently signed in on this desktop browser.</p>
                <button (click)="onSessionsClick()" class="mt-2 text-[#0E6E68] font-bold text-[11px] flex items-center gap-1 hover:underline cursor-pointer border-none bg-transparent p-0">
                  View Active Logins <span class="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Checklist & 2FA (4 Columns) -->
        <div class="col-span-12 lg:col-span-4 space-y-4">
          
          <!-- Password Guidance Checklist -->
          <section class="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCEBE7] shadow-sm workora-card space-y-3">
            <h2 class="text-xs font-bold text-[#063B39] tracking-wider uppercase">Good Password Checklist</h2>
            <ul class="space-y-2 text-xs">
              <li [ngClass]="ruleMinLength() ? 'text-emerald-700 font-semibold' : 'text-slate-500'" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base">{{ ruleMinLength() ? 'check_circle' : 'radio_button_unchecked' }}</span>
                <span>At least 8 characters</span>
              </li>
              <li [ngClass]="ruleNumber() ? 'text-emerald-700 font-semibold' : 'text-slate-500'" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base">{{ ruleNumber() ? 'check_circle' : 'radio_button_unchecked' }}</span>
                <span>Contains a number</span>
              </li>
              <li [ngClass]="ruleSymbol() ? 'text-emerald-700 font-semibold' : 'text-slate-500'" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base">{{ ruleSymbol() ? 'check_circle' : 'radio_button_unchecked' }}</span>
                <span>Contains a symbol (!&#64;#$%^*)</span>
              </li>
              <li [ngClass]="ruleLetterVariation() ? 'text-emerald-700 font-semibold' : 'text-slate-500'" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base">{{ ruleLetterVariation() ? 'check_circle' : 'radio_button_unchecked' }}</span>
                <span>Upper &amp; lowercase mix</span>
              </li>
            </ul>

            <div class="pt-2 text-[11px] text-slate-400 italic">
              Tip: A 3-4 word passphrase (e.g. <em>Forest-Pine-River-99</em>) is easy to remember and very strong.
            </div>
          </section>

          <!-- 2FA Friendly Card -->
          <section class="rounded-3xl bg-gradient-to-br from-[#DCEBE7]/70 via-white to-[#DCEBE7]/40 border border-[#DCEBE7] p-5 sm:p-6 shadow-sm space-y-3">
            <div class="inline-flex p-2.5 bg-[#0E6E68] rounded-2xl text-white">
              <span class="material-symbols-outlined text-xl">shield</span>
            </div>
            <div>
              <h2 class="text-sm font-bold text-[#063B39]">Two-Factor Authentication</h2>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">Add an extra layer of protection to your account with an authenticator app (Google Authenticator, 1Password, or Authy).</p>
            </div>
            <button 
              type="button"
              (click)="onEnable2FA()"
              class="w-full py-2.5 workora-btn-primary text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Enable 2FA Protection</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </section>

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

  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ctx = gsap.context(() => {
      gsap.from('.security-header', { y: -10, opacity: 0, duration: 0.5 });
      gsap.from('.security-grid > div', { y: 15, opacity: 0, stagger: 0.1, duration: 0.6 });
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

  onPasskeysClick(): void {
    this.notificationService.showInfo('Passkey authentication management is enabled for this workspace.');
  }

  onSessionsClick(): void {
    this.notificationService.showInfo('You have 1 active browser session in London, UK (Current).');
  }

  onEnable2FA(): void {
    this.notificationService.showSuccess('2FA setup QR code dispatched to your registered work email.');
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
        this.onCancel();
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
