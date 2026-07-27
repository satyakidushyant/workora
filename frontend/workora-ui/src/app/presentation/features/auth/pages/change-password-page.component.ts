import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

/**
 * Enterprise HRMS Change Password Page Component.
 * Enables authenticated employees and administrators to update their account passwords 
 * within the security settings workspace.
 */
@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen font-body-md text-body-md overflow-hidden bg-background">
      <!-- SideNavBar Anchor -->
      <nav class="fixed left-0 top-0 h-full w-60 bg-primary flex flex-col py-gutter overflow-y-auto sidebar-scroll z-50 shadow-sm">
        <div class="px-6 mb-8">
          <h1 class="font-headline-md text-headline-md font-bold text-on-primary">Workora</h1>
          <p class="font-label-md text-label-md text-on-primary-container opacity-80 uppercase tracking-widest mt-1 text-gray-300">Enterprise HRMS</p>
        </div>
        
        <div class="flex flex-col gap-1 px-3">
          <a routerLink="/dashboard" class="flex items-center gap-3 px-4 py-3 text-on-primary-container hover:bg-primary-container transition-colors rounded-lg text-gray-300">
            <span class="material-symbols-outlined">groups</span>
            <span class="font-label-md text-label-md">Core HR</span>
          </a>
          <a class="flex items-center gap-3 px-4 py-3 text-on-primary-container hover:bg-primary-container transition-colors rounded-lg text-gray-300 cursor-pointer">
            <span class="material-symbols-outlined">payments</span>
            <span class="font-label-md text-label-md">Payroll & Finance</span>
          </a>
          <a class="flex items-center gap-3 px-4 py-3 text-on-primary-container hover:bg-primary-container transition-colors rounded-lg text-gray-300 cursor-pointer">
            <span class="material-symbols-outlined">psychology</span>
            <span class="font-label-md text-label-md">Talent Management</span>
          </a>
          <a class="flex items-center gap-3 px-4 py-3 text-on-primary-container hover:bg-primary-container transition-colors rounded-lg text-gray-300 cursor-pointer">
            <span class="material-symbols-outlined">conveyor_belt</span>
            <span class="font-label-md text-label-md">Operations</span>
          </a>
          <a class="flex items-center gap-3 px-4 py-3 text-on-primary-container hover:bg-primary-container transition-colors rounded-lg text-gray-300 cursor-pointer">
            <span class="material-symbols-outlined">schedule</span>
            <span class="font-label-md text-label-md">Time & Attendance</span>
          </a>
          <a class="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container rounded-lg opacity-90 transition-all font-semibold cursor-pointer">
            <span class="material-symbols-outlined">settings</span>
            <span class="font-label-md text-label-md">Settings</span>
          </a>
        </div>

        <div class="mt-auto px-6 pt-8 border-t border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold">
              AD
            </div>
            <div>
              <p class="font-label-md text-label-md text-on-primary font-bold">Administrator</p>
              <p class="text-[10px] text-on-primary-container text-gray-300">ID: 99283-W</p>
            </div>
          </div>
        </div>
      </nav>

      <!-- TopNavBar Anchor -->
      <header class="fixed top-0 right-0 w-[calc(100%-240px)] flex justify-between items-center h-16 px-container-margin z-40 bg-surface/80 backdrop-blur-md border-b border-border-subtle">
        <div class="flex items-center gap-4 flex-1">
          <div class="relative w-full max-w-md">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input 
              class="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-body-sm focus:ring-2 focus:ring-secondary-container transition-all outline-none" 
              placeholder="Search employee records, reports, or modules..." 
              type="text"
            />
          </div>
        </div>
        
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-4">
            <button class="text-slate-text hover:text-primary transition-colors relative">
              <span class="material-symbols-outlined">notifications</span>
              <span class="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button class="text-slate-text hover:text-primary transition-colors">
              <span class="material-symbols-outlined">help_outline</span>
            </button>
          </div>
          <div class="h-8 w-[1px] bg-border-subtle"></div>
          <div class="flex items-center gap-3 cursor-pointer group">
            <img 
              class="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-secondary transition-all" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp5uH8Q263l9Q6Iib5tuhtTXDI-Z3edyEUcCkc06ZxT8ObU7y8Uf1scubN3mpW736eE-rAdlXI51s9xZMpfoCheUhvAigGPf0Xy9qIhu8jCBWzroP9TigoHKPhDwk8lllNH_2zZUMO7C_JsJSAjrAGY5DFvrm9dfT901CyG9pH7pKjHY2o63YnppXwKxNSrV1ii2ulHhyD7dfOVo4DNiGcgeIg0uRWYoDcAua30pb1dhjaaTqKhG2VFqS94EMTp8B0VICOq-VKL8RY" 
              alt="Administrator Profile"
            />
            <span class="font-label-md text-label-md text-primary font-bold">Administrator</span>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="ml-60 pt-16 h-screen overflow-y-auto bg-background">
        <div class="p-8 max-w-5xl mx-auto pb-16">
          
          <!-- Breadcrumbs -->
          <nav class="flex items-center gap-2 text-on-surface-variant font-label-md text-[11px] mb-6">
            <a class="hover:text-primary transition-colors cursor-pointer">SETTINGS</a>
            <span class="material-symbols-outlined text-[12px]">chevron_right</span>
            <a class="hover:text-primary transition-colors cursor-pointer">ACCOUNT SECURITY</a>
            <span class="material-symbols-outlined text-[12px]">chevron_right</span>
            <span class="text-primary font-bold">CHANGE PASSWORD</span>
          </nav>

          <!-- Page Header -->
          <div class="mb-8">
            <h2 class="font-headline-lg text-headline-lg text-primary mb-2 font-bold">Security Settings</h2>
            <p class="text-on-surface-variant font-body-md max-w-2xl">
              Manage your credentials and authentication methods to ensure your HRMS account remains secure. Regular password rotations are recommended by the corporate policy.
            </p>
          </div>

          <!-- Error Alert Banner -->
          @if (errorMessage()) {
            <div class="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 flex items-start gap-3 text-error">
              <span class="material-symbols-outlined text-xl shrink-0">error</span>
              <div class="font-body-sm text-body-sm">{{ errorMessage() }}</div>
            </div>
          }

          <!-- Success Alert Banner -->
          @if (successMessage()) {
            <div class="mb-6 p-4 rounded-lg bg-success/10 border border-success/20 flex items-start gap-3 text-success">
              <span class="material-symbols-outlined text-xl shrink-0">check_circle</span>
              <div class="font-body-sm text-body-sm">{{ successMessage() }}</div>
            </div>
          }

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            <!-- Change Password Form Container -->
            <div class="lg:col-span-2 bg-surface-container-lowest border border-border-subtle rounded-xl shadow-sm overflow-hidden">
              <div class="p-6 border-b border-border-subtle bg-surface-bright flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-secondary">lock_reset</span>
                  <h3 class="font-headline-sm text-headline-sm text-primary font-bold">Update Password</h3>
                </div>
                <span class="text-[10px] font-bold bg-warning/10 text-warning px-2 py-1 rounded uppercase tracking-tighter">Last changed: 45 days ago</span>
              </div>

              <form class="p-8 space-y-6" (ngSubmit)="onSubmit()">
                <!-- Current Password -->
                <div class="space-y-2">
                  <label class="block font-label-md text-label-md text-on-surface font-semibold">Current Password</label>
                  <div class="relative">
                    <input 
                      class="w-full border border-border-subtle bg-surface rounded-lg px-4 py-3 text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all outline-none" 
                      name="currentPassword"
                      [(ngModel)]="currentPassword"
                      placeholder="••••••••••••" 
                      [type]="showCurrentPassword() ? 'text' : 'password'"
                      required
                    />
                    <button 
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center" 
                      type="button"
                      (click)="showCurrentPassword.set(!showCurrentPassword())"
                    >
                      <span class="material-symbols-outlined text-sm">{{ showCurrentPassword() ? 'visibility_off' : 'visibility' }}</span>
                    </button>
                  </div>
                </div>

                <!-- New & Confirm Password Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block font-label-md text-label-md text-on-surface font-semibold">New Password</label>
                    <div class="relative">
                      <input 
                        class="w-full border border-border-subtle bg-surface rounded-lg px-4 py-3 text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all outline-none" 
                        name="newPassword"
                        [(ngModel)]="newPassword"
                        (ngModelChange)="onPasswordChange($event)"
                        placeholder="••••••••••••" 
                        [type]="showNewPassword() ? 'text' : 'password'"
                        required
                      />
                      <button 
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center" 
                        type="button"
                        (click)="showNewPassword.set(!showNewPassword())"
                      >
                        <span class="material-symbols-outlined text-sm">{{ showNewPassword() ? 'visibility_off' : 'visibility' }}</span>
                      </button>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block font-label-md text-label-md text-on-surface font-semibold">Confirm New Password</label>
                    <div class="relative">
                      <input 
                        class="w-full border border-border-subtle bg-surface rounded-lg px-4 py-3 text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all outline-none" 
                        name="confirmPassword"
                        [(ngModel)]="confirmPassword"
                        placeholder="••••••••••••" 
                        [type]="showConfirmPassword() ? 'text' : 'password'"
                        required
                      />
                      <button 
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center" 
                        type="button"
                        (click)="showConfirmPassword.set(!showConfirmPassword())"
                      >
                        <span class="material-symbols-outlined text-sm">{{ showConfirmPassword() ? 'visibility_off' : 'visibility' }}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Form Action Buttons -->
                <div class="pt-6 flex items-center justify-end gap-4 border-t border-border-subtle">
                  <button 
                    class="px-6 py-2.5 rounded font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer" 
                    type="button"
                    (click)="onCancel()"
                  >
                    Cancel
                  </button>
                  <button 
                    [disabled]="isLoading()"
                    class="px-8 py-2.5 rounded bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-75" 
                    type="submit"
                  >
                    @if (isLoading()) {
                      <span class="material-symbols-outlined text-sm animate-spin">sync</span>
                      <span>Saving...</span>
                    } @else {
                      <span>Save Changes</span>
                    }
                  </button>
                </div>
              </form>
            </div>

            <!-- Password Policy Sidebar -->
            <div class="space-y-6">
              <div class="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm">
                <h4 class="font-headline-sm text-headline-sm text-primary mb-4 flex items-center gap-2 font-bold">
                  <span class="material-symbols-outlined text-info text-sm">verified_user</span>
                  Password Policy
                </h4>
                <p class="text-body-sm text-on-surface-variant mb-6">
                  Your password must meet these security requirements to be accepted by the Workora system.
                </p>

                <ul class="space-y-4">
                  <li class="flex items-start gap-3">
                    <span 
                      [ngClass]="ruleMinLength() ? 'text-success' : 'text-on-surface-variant/30'" 
                      class="material-symbols-outlined text-[18px]"
                      style="font-variation-settings: 'FILL' 1;"
                    >
                      {{ ruleMinLength() ? 'check_circle' : 'radio_button_unchecked' }}
                    </span>
                    <div class="flex-1">
                      <p class="font-label-md text-label-md text-on-surface font-semibold">Minimum length</p>
                      <p class="text-[11px] text-on-surface-variant">At least 8 characters long</p>
                    </div>
                  </li>

                  <li class="flex items-start gap-3">
                    <span 
                      [ngClass]="ruleLetterVariation() ? 'text-success' : 'text-on-surface-variant/30'" 
                      class="material-symbols-outlined text-[18px]"
                      style="font-variation-settings: 'FILL' 1;"
                    >
                      {{ ruleLetterVariation() ? 'check_circle' : 'radio_button_unchecked' }}
                    </span>
                    <div class="flex-1">
                      <p class="font-label-md text-label-md text-on-surface font-semibold">Letter variations</p>
                      <p class="text-[11px] text-on-surface-variant">Must include Uppercase and Lowercase</p>
                    </div>
                  </li>

                  <li class="flex items-start gap-3">
                    <span 
                      [ngClass]="ruleNumber() ? 'text-success' : 'text-on-surface-variant/30'" 
                      class="material-symbols-outlined text-[18px]"
                      style="font-variation-settings: 'FILL' 1;"
                    >
                      {{ ruleNumber() ? 'check_circle' : 'radio_button_unchecked' }}
                    </span>
                    <div class="flex-1">
                      <p class="font-label-md text-label-md text-on-surface font-semibold">Numeric requirement</p>
                      <p class="text-[11px] text-on-surface-variant">At least one number (0-9)</p>
                    </div>
                  </li>

                  <li class="flex items-start gap-3">
                    <span 
                      [ngClass]="ruleSymbol() ? 'text-success' : 'text-on-surface-variant/30'" 
                      class="material-symbols-outlined text-[18px]"
                      style="font-variation-settings: 'FILL' 1;"
                    >
                      {{ ruleSymbol() ? 'check_circle' : 'radio_button_unchecked' }}
                    </span>
                    <div class="flex-1">
                      <p class="font-label-md text-label-md text-on-surface font-semibold">Special character</p>
                      <p class="text-[11px] text-on-surface-variant">At least one symbol (e.g. !&#64;#$)</p>
                    </div>
                  </li>
                </ul>

                <div class="mt-8 p-4 bg-secondary/5 rounded-lg border border-secondary/10">
                  <div class="flex gap-3">
                    <span class="material-symbols-outlined text-secondary text-sm">lightbulb</span>
                    <div>
                      <p class="font-label-md text-label-md text-secondary font-bold">Pro Tip</p>
                      <p class="text-body-sm text-secondary/80 mt-1">Use a passphrase of 4 random words for better security and easier recall.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Security Alert Card -->
              <div class="bg-primary p-6 rounded-xl text-on-primary relative overflow-hidden">
                <div class="relative z-10">
                  <h4 class="font-headline-sm text-headline-sm mb-2 font-bold text-white">Two-Factor Auth</h4>
                  <p class="text-body-sm opacity-80 mb-4 text-gray-300">Adding 2FA increases your account security by up to 90% against unauthorized access.</p>
                  <button 
                    class="w-full py-2 bg-on-primary text-primary font-bold text-[11px] rounded uppercase tracking-wider hover:bg-primary-fixed transition-colors cursor-pointer"
                    (click)="onEnable2FA()"
                  >
                    Enable 2FA Now
                  </button>
                </div>
                <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-secondary-container rounded-full blur-2xl opacity-40"></div>
                <div class="absolute -left-4 -top-4 w-16 h-16 bg-info rounded-full blur-xl opacity-20"></div>
              </div>
            </div>

          </div>

          <!-- Footer Policy Links -->
          <div class="mt-12 pt-4 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center text-[11px] text-on-surface-variant font-label-md uppercase tracking-widest gap-4">
            <p>© 2026 Workora Enterprise HRMS • Secure Environment</p>
            <div class="flex gap-4">
              <a class="hover:text-primary transition-colors cursor-pointer">Privacy Policy</a>
              <a class="hover:text-primary transition-colors cursor-pointer">Terms of Service</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class ChangePasswordPageComponent {
  private readonly authService: AuthService = inject(AuthService) as AuthService;
  private readonly router: Router = inject(Router) as Router;

  /**
   * Current password model.
   */
  currentPassword = '';

  /**
   * New password model.
   */
  newPassword = '';

  /**
   * Confirm password model.
   */
  confirmPassword = '';

  /**
   * Signals controlling password input visibility toggles.
   */
  readonly showCurrentPassword = signal<boolean>(false);
  readonly showNewPassword = signal<boolean>(false);
  readonly showConfirmPassword = signal<boolean>(false);

  /**
   * Signals tracking rule verification.
   */
  readonly ruleMinLength = signal<boolean>(false);
  readonly ruleLetterVariation = signal<boolean>(false);
  readonly ruleNumber = signal<boolean>(false);
  readonly ruleSymbol = signal<boolean>(false);

  /**
   * Signal indicating active API request state.
   */
  readonly isLoading = signal<boolean>(false);

  /**
   * Signal holding user error feedback message.
   */
  readonly errorMessage = signal<string | null>(null);

  /**
   * Signal holding user success feedback message.
   */
  readonly successMessage = signal<string | null>(null);

  /**
   * Evaluates live password rules against input value.
   * 
   * @param val New password string.
   */
  onPasswordChange(val: string): void {
    this.ruleMinLength.set(val.length >= 8);
    this.ruleLetterVariation.set(/[A-Z]/.test(val) && /[a-z]/.test(val));
    this.ruleNumber.set(/[0-9]/.test(val));
    this.ruleSymbol.set(/[^A-Za-z0-9]/.test(val));
  }

  /**
   * Cancels password change form entries.
   */
  onCancel(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  /**
   * Triggers 2FA enrollment placeholder.
   */
  onEnable2FA(): void {
    this.successMessage.set('2FA Enrollment wizard will launch shortly. Multi-factor authenticator setup enabled.');
  }

  /**
   * Submits password update request to backend API.
   */
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
        this.errorMessage.set(err?.message || 'Failed to update password. Please check your current password.');
      }
    });
  }
}
