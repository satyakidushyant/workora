import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';

/**
 * Enterprise HRMS Change Password Page Component.
 * Enables authenticated employees and administrators to update their account passwords 
 * within the security settings workspace using modern Workora SaaS design and GSAP entrance.
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
        <h1 class="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">Security &amp; Password</h1>
        <p class="text-xs sm:text-sm text-[#6B7F7C] mt-0.5">Manage your credentials, 2FA authentication, and account safety.</p>
      </div>

      <!-- Error Alert Banner -->
      @if (errorMessage()) {
        <div class="p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-red-700 animate-in fade-in duration-200 text-xs">
          <span class="material-symbols-outlined text-lg shrink-0 mt-0.5 text-red-600">error</span>
          <div class="font-medium leading-relaxed">{{ errorMessage() }}</div>
        </div>
      }

      <!-- Success Alert Banner -->
      @if (successMessage()) {
        <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5 text-emerald-800 animate-in fade-in duration-200 text-xs">
          <span class="material-symbols-outlined text-lg shrink-0 mt-0.5 text-emerald-600">check_circle</span>
          <div class="font-medium leading-relaxed">{{ successMessage() }}</div>
        </div>
      }

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-12 gap-4 sm:gap-6 security-grid">
        
        <!-- Main Update Password Form (8 Columns) -->
        <div class="col-span-12 lg:col-span-8 space-y-4 sm:space-y-6">
          <section class="bg-white rounded-2xl p-4.5 xs:p-6 sm:p-8 border border-[#DCEBE7] shadow-sm workora-card">
            <div class="flex items-center gap-3 mb-5 sm:mb-6">
              <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-2xl">lock_reset</span>
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-bold text-[#063B39] font-heading">Update Password</h2>
                <p class="text-xs text-[#6B7F7C]">Ensure your account uses a strong passphrase to stay secure.</p>
              </div>
            </div>

            <form class="space-y-4" (ngSubmit)="onSubmit()">
              <!-- Current Password -->
              <div class="space-y-1">
                <label class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Current Password</label>
                <div class="relative flex items-center">
                  <input 
                    class="workora-input pl-4 pr-11 !py-2.5" 
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
                  <label class="text-xs font-bold text-[#063B39] uppercase tracking-wider">New Password</label>
                  <div class="relative flex items-center">
                    <input 
                      class="workora-input pl-4 pr-11 !py-2.5" 
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
                  <label class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Confirm New Password</label>
                  <div class="relative flex items-center">
                    <input 
                      class="workora-input pl-4 pr-11 !py-2.5" 
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
                  Discard Changes
                </button>
                <button 
                  [disabled]="isLoading()"
                  class="px-5 py-2.5 workora-btn-primary text-xs disabled:opacity-75" 
                  type="submit"
                >
                  @if (isLoading()) {
                    <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    <span>Saving...</span>
                  } @else {
                    <span>Save New Password</span>
                  }
                </button>
              </div>
            </form>
          </section>

          <!-- Advanced Security Options -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white rounded-2xl p-5 border border-[#DCEBE7] shadow-sm flex items-start gap-3 workora-card">
              <div class="p-2.5 bg-[#DCEBE7] text-[#0E6E68] rounded-xl shrink-0">
                <span class="material-symbols-outlined text-2xl">key</span>
              </div>
              <div>
                <h3 class="text-xs font-bold text-[#063B39]">Hardware Passkeys</h3>
                <p class="text-[11px] text-[#6B7F7C] mt-0.5 leading-relaxed">Use biometric or FIDO2 security keys for instant login.</p>
                <button class="mt-2 text-[#0E6E68] font-bold text-[11px] flex items-center gap-1 hover:underline cursor-pointer border-none bg-transparent p-0">
                  Manage Passkeys <span class="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-[#DCEBE7] shadow-sm flex items-start gap-3 workora-card">
              <div class="p-2.5 bg-[#DCEBE7] text-[#3FA79B] rounded-xl shrink-0">
                <span class="material-symbols-outlined text-2xl">devices</span>
              </div>
              <div>
                <h3 class="text-xs font-bold text-[#063B39]">Active Sessions</h3>
                <p class="text-[11px] text-[#6B7F7C] mt-0.5 leading-relaxed">Review devices currently authenticated in your workspace.</p>
                <button class="mt-2 text-[#3FA79B] font-bold text-[11px] flex items-center gap-1 hover:underline cursor-pointer border-none bg-transparent p-0">
                  View 2 Active Devices <span class="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Checklist & Promotion (4 Columns) -->
        <div class="col-span-12 lg:col-span-4 space-y-4">
          
          <!-- Password Policy Checklist -->
          <section class="bg-white rounded-2xl p-5 border border-[#DCEBE7] shadow-sm workora-card">
            <h2 class="text-[11px] font-bold text-[#0E6E68] tracking-wider uppercase mb-3">Password Policy</h2>
            <ul class="space-y-2 text-xs">
              <li [ngClass]="ruleMinLength() ? 'text-emerald-700 font-semibold' : 'text-slate-500'" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base">{{ ruleMinLength() ? 'check_circle' : 'radio_button_unchecked' }}</span>
                <span>At least 8 characters</span>
              </li>
              <li [ngClass]="ruleNumber() ? 'text-emerald-700 font-semibold' : 'text-slate-500'" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base">{{ ruleNumber() ? 'check_circle' : 'radio_button_unchecked' }}</span>
                <span>Includes a number</span>
              </li>
              <li [ngClass]="ruleSymbol() ? 'text-emerald-700 font-semibold' : 'text-slate-500'" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base">{{ ruleSymbol() ? 'check_circle' : 'radio_button_unchecked' }}</span>
                <span>Includes a symbol (!&#64;#$%^*)</span>
              </li>
              <li [ngClass]="ruleLetterVariation() ? 'text-emerald-700 font-semibold' : 'text-slate-500'" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base">{{ ruleLetterVariation() ? 'check_circle' : 'radio_button_unchecked' }}</span>
                <span>Upper &amp; lowercase letters</span>
              </li>
            </ul>

            <div class="mt-4 h-1.5 w-full bg-[#DCEBE7]/60 rounded-full overflow-hidden">
              <div 
                [ngClass]="{
                  'w-1/4 bg-red-500': ruleMinLength() && !ruleNumber(),
                  'w-2/4 bg-amber-500': ruleMinLength() && ruleNumber() && !ruleSymbol(),
                  'w-3/4 bg-[#0E6E68]': ruleMinLength() && ruleNumber() && ruleSymbol() && !ruleLetterVariation(),
                  'w-full bg-emerald-500': ruleMinLength() && ruleNumber() && ruleSymbol() && ruleLetterVariation()
                }"
                class="h-full transition-all duration-300"
              ></div>
            </div>
          </section>

          <!-- 2FA Promotion Card -->
          <section class="rounded-2xl bg-gradient-to-br from-[#DCEBE7]/70 to-white border border-[#DCEBE7] p-5 shadow-sm">
            <div class="inline-flex p-2 bg-[#0E6E68] rounded-xl text-white mb-3">
              <span class="material-symbols-outlined text-lg">verified_user</span>
            </div>
            <h2 class="text-sm font-bold text-[#063B39]">Two-Factor Authentication</h2>
            <p class="text-xs text-[#6B7F7C] mt-1 leading-relaxed">Protect your account with SMS or authenticator app verification on login.</p>
            <button 
              (click)="onEnable2FA()"
              class="w-full mt-4 py-2.5 workora-btn-primary text-xs"
            >
              <span>Enable 2FA Protection</span>
              <span class="material-symbols-outlined text-sm">bolt</span>
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
  private readonly authService: AuthService = inject(AuthService) as AuthService;

  private ctx?: gsap.Context;

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  readonly showCurrentPassword = signal<boolean>(false);
  readonly showNewPassword = signal<boolean>(false);
  readonly showConfirmPassword = signal<boolean>(false);

  readonly ruleMinLength = signal<boolean>(false);
  readonly ruleLetterVariation = signal<boolean>(false);
  readonly ruleNumber = signal<boolean>(false);
  readonly ruleSymbol = signal<boolean>(false);

  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ctx = gsap.context(() => {
      gsap.from('.security-header', {
        y: -15,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
      });

      gsap.from('.security-grid > *', {
        y: 20,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.1
      });
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  onPasswordChange(val: string): void {
    this.ruleMinLength.set(val.length >= 8);
    this.ruleLetterVariation.set(/[A-Z]/.test(val) && /[a-z]/.test(val));
    this.ruleNumber.set(/[0-9]/.test(val));
    this.ruleSymbol.set(/[^A-Za-z0-9]/.test(val));
  }

  onCancel(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  onEnable2FA(): void {
    this.successMessage.set('2FA Enrollment wizard enabled for this account.');
  }

  onSubmit(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage.set('Please fill in all current and new password fields.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('New password and confirmation do not match.');
      return;
    }

    if (!this.ruleMinLength() || !this.ruleLetterVariation() || !this.ruleNumber() || !this.ruleSymbol()) {
      this.errorMessage.set('Your new password does not satisfy all required corporate security policies.');
      return;
    }

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.isLoading.set(true);

    this.authService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Your password has been changed successfully.');
        this.onCancel();
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || err?.message || 'Failed to update password. Please check your current password.');
      }
    });
  }
}
