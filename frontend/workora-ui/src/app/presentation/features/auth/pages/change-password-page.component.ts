import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthShaderComponent } from '../components/auth-shader.component';

/**
 * Enterprise HRMS Change Password Page Component.
 * Enables authenticated employees and administrators to update their account passwords 
 * within the security settings workspace with WebGL liquid mesh shader background and glassmorphism UI.
 */
@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShaderComponent],
  template: `
    <div class="font-body-md text-on-surface bg-[#060e20] min-h-screen relative overflow-x-hidden antialiased">
      <!-- WebGL Shader Background & Interactive Atmospheric Orbs -->
      <app-auth-shader></app-auth-shader>

      <!-- SideNavBar Anchor -->
      <aside class="w-[240px] h-screen fixed left-0 top-0 z-50 bg-surface-container-low/70 backdrop-blur-2xl border-r border-white/10 shadow-2xl flex flex-col justify-between py-6">
        <div class="space-y-4">
          <div class="px-6 pb-4 flex items-center gap-3 cursor-pointer" routerLink="/">
            <img alt="Workora Logo" class="w-9 h-9 object-contain drop-shadow-[0_0_12px_rgba(77,142,255,0.5)]" src="/workora.png"/>
            <div>
              <span class="text-xl font-bold text-primary tracking-tighter block leading-none">WORKORA</span>
              <p class="text-[10px] font-label-caps text-outline tracking-widest mt-1">HRMS SUITE</p>
            </div>
          </div>
          <nav class="space-y-1">
            <a routerLink="/dashboard" class="text-on-surface-variant hover:text-on-surface px-6 py-3 flex items-center gap-3 transition-all hover:bg-white/5">
              <span class="material-symbols-outlined text-xl">dashboard</span>
              <span class="text-xs font-semibold">Dashboard</span>
            </a>
            <a class="text-on-surface-variant hover:text-on-surface px-6 py-3 flex items-center gap-3 transition-all hover:bg-white/5 cursor-pointer">
              <span class="material-symbols-outlined text-xl">payments</span>
              <span class="text-xs font-semibold">Payroll</span>
            </a>
            <a class="text-on-surface-variant hover:text-on-surface px-6 py-3 flex items-center gap-3 transition-all hover:bg-white/5 cursor-pointer">
              <span class="material-symbols-outlined text-xl">groups</span>
              <span class="text-xs font-semibold">Employees</span>
            </a>
            <!-- Active Item: Settings -->
            <a routerLink="/auth/change-password" class="text-primary bg-primary/10 border-r-4 border-primary px-6 py-3 flex items-center gap-3 transition-all font-bold cursor-pointer">
              <span class="material-symbols-outlined text-xl">settings</span>
              <span class="text-xs">Settings</span>
            </a>
            <a class="text-on-surface-variant hover:text-on-surface px-6 py-3 flex items-center gap-3 transition-all hover:bg-white/5 cursor-pointer">
              <span class="material-symbols-outlined text-xl">assessment</span>
              <span class="text-xs font-semibold">Reports</span>
            </a>
          </nav>
        </div>
        <div class="px-6 space-y-4">
          <div class="pt-4 border-t border-white/10">
            <a class="text-on-surface-variant hover:text-on-surface px-4 py-2 flex items-center gap-3 transition-all rounded-lg cursor-pointer">
              <span class="material-symbols-outlined text-xl">help_outline</span>
              <span class="text-xs font-semibold">Help Center</span>
            </a>
            <button routerLink="/login" class="w-full mt-3 px-4 py-2.5 bg-error/15 hover:bg-error/25 border border-error/30 text-error rounded-xl font-bold text-xs transition-all cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </aside>

      <!-- TopNavBar Anchor -->
      <header class="h-16 w-[calc(100%-240px)] fixed top-0 right-0 z-40 bg-surface-container-low/60 border-b border-white/10 backdrop-blur-2xl shadow-sm flex items-center justify-between px-8 ml-[240px]">
        <div class="flex items-center gap-4">
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-xl">search</span>
            <input 
              class="bg-surface-container-lowest/50 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-xs focus:ring-2 focus:ring-primary/50 focus:outline-none w-64 transition-all focus:w-80 text-on-surface" 
              placeholder="Search security settings..." 
              type="text"
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="hover:bg-white/10 rounded-full p-2 transition-all text-on-surface-variant relative cursor-pointer">
            <span class="material-symbols-outlined text-xl">notifications</span>
            <span class="absolute top-2 right-2 w-2 h-2 bg-error rounded-full shadow-[0_0_8px_#ffb4ab]"></span>
          </button>
          <button class="hover:bg-white/10 rounded-full p-2 transition-all text-on-surface-variant cursor-pointer">
            <span class="material-symbols-outlined text-xl">help</span>
          </button>
          <button class="hover:bg-white/10 rounded-full p-2 transition-all text-on-surface-variant cursor-pointer">
            <span class="material-symbols-outlined text-xl">grid_view</span>
          </button>
          <div class="h-6 w-[1px] bg-white/10 mx-2"></div>
          <div class="flex items-center gap-3 pl-2 cursor-pointer">
            <div class="text-right">
              <p class="text-xs font-bold text-on-surface">Administrator</p>
              <p class="text-[10px] font-label-caps text-outline tracking-wider uppercase">ENTERPRISE ADMIN</p>
            </div>
            <img 
              alt="User Profile Avatar" 
              class="w-9 h-9 rounded-full border-2 border-primary/40 object-cover shadow-lg" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE2kOi1D-ymzSWCW5sFKPUpYrmf_D_kZQaafZ7xTJ3Vf1dBhhIthq2Cs5HzAMsS918c818iTRaIMSqfK14-nikNnF8fdECsJqcFCEBzq6gSLFLLHODkH1Kr4QT3qIKYT_ObCzoXJhN3QXFAU9Fmn0jqd9Bm6Y5unoq0M--bAuUHYbKr2st31xKR2y8vkKHJxjriZndgC3LHbRW4ryvo2e-wAqazsCK9zYIcQ6sEn5aOnfMzE81FTK2"
            />
          </div>
        </div>
      </header>

      <!-- Main Content Canvas -->
      <main class="ml-[240px] pt-20 pb-16 min-h-screen relative z-10">
        <div class="px-8 max-w-7xl mx-auto space-y-6">
          <!-- Header Section -->
          <div>
            <nav class="flex items-center gap-2 text-outline mb-2">
              <span class="text-[10px] font-label-caps uppercase tracking-wider">WORKORA</span>
              <span class="material-symbols-outlined text-xs">chevron_right</span>
              <span class="text-[10px] font-label-caps uppercase tracking-wider">SETTINGS</span>
              <span class="material-symbols-outlined text-xs">chevron_right</span>
              <span class="text-[10px] font-label-caps text-primary font-bold uppercase tracking-wider">SECURITY</span>
            </nav>
            <h1 class="font-display-lg text-3xl font-extrabold text-on-surface tracking-tight">Security &amp; Authentication</h1>
            <p class="text-on-surface-variant text-sm mt-1">Manage your password, login methods, and account safety.</p>
          </div>

          <!-- Error Alert Banner -->
          @if (errorMessage()) {
            <div class="p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3 text-error animate-in fade-in duration-200">
              <span class="material-symbols-outlined text-xl shrink-0 mt-0.5">error</span>
              <div class="font-body-sm text-xs font-medium">{{ errorMessage() }}</div>
            </div>
          }

          <!-- Success Alert Banner -->
          @if (successMessage()) {
            <div class="p-4 rounded-xl bg-secondary/10 border border-secondary/30 flex items-start gap-3 text-secondary animate-in fade-in duration-200">
              <span class="material-symbols-outlined text-xl shrink-0 mt-0.5">check_circle</span>
              <div class="font-body-sm text-xs font-medium">{{ successMessage() }}</div>
            </div>
          }

          <!-- Bento Grid Layout -->
          <div class="grid grid-cols-12 gap-8">
            <!-- Main Update Password Form (8 Columns) -->
            <div class="col-span-12 lg:col-span-8 space-y-6">
              <section class="glass-panel rounded-2xl p-8">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                    <span class="material-symbols-outlined text-2xl">lock_reset</span>
                  </div>
                  <div>
                    <h2 class="font-headline-md text-xl font-bold text-on-surface">Update Password</h2>
                    <p class="text-xs text-on-surface-variant">Ensure your account uses a long, random password to stay secure.</p>
                  </div>
                </div>

                <form class="space-y-6" (ngSubmit)="onSubmit()">
                  <div class="space-y-4">
                    <div class="space-y-1.5">
                      <label class="text-xs text-outline uppercase tracking-wider font-semibold ml-1">Current Password</label>
                      <div class="relative">
                        <input 
                          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all outline-none" 
                          name="currentPassword"
                          [(ngModel)]="currentPassword"
                          placeholder="••••••••••••" 
                          [type]="showCurrentPassword() ? 'text' : 'password'"
                          required
                        />
                        <button 
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors cursor-pointer text-xl" 
                          type="button"
                          (click)="showCurrentPassword.set(!showCurrentPassword())"
                        >
                          <span class="material-symbols-outlined">{{ showCurrentPassword() ? 'visibility_off' : 'visibility' }}</span>
                        </button>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="space-y-1.5">
                        <label class="text-xs text-outline uppercase tracking-wider font-semibold ml-1">New Password</label>
                        <div class="relative">
                          <input 
                            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all outline-none" 
                            name="newPassword"
                            [(ngModel)]="newPassword"
                            (ngModelChange)="onPasswordChange($event)"
                            placeholder="Minimum 8 characters" 
                            [type]="showNewPassword() ? 'text' : 'password'"
                            required
                          />
                          <button 
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors cursor-pointer text-xl" 
                            type="button"
                            (click)="showNewPassword.set(!showNewPassword())"
                          >
                            <span class="material-symbols-outlined">{{ showNewPassword() ? 'visibility_off' : 'visibility' }}</span>
                          </button>
                        </div>
                      </div>

                      <div class="space-y-1.5">
                        <label class="text-xs text-outline uppercase tracking-wider font-semibold ml-1">Confirm New Password</label>
                        <div class="relative">
                          <input 
                            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all outline-none" 
                            name="confirmPassword"
                            [(ngModel)]="confirmPassword"
                            placeholder="Repeat new password" 
                            [type]="showConfirmPassword() ? 'text' : 'password'"
                            required
                          />
                          <button 
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors cursor-pointer text-xl" 
                            type="button"
                            (click)="showConfirmPassword.set(!showConfirmPassword())"
                          >
                            <span class="material-symbols-outlined">{{ showConfirmPassword() ? 'visibility_off' : 'visibility' }}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="pt-4 flex items-center justify-end gap-4 border-t border-white/10">
                    <button 
                      class="px-6 py-3 text-xs font-bold text-outline hover:text-on-surface transition-colors cursor-pointer" 
                      type="button"
                      (click)="onCancel()"
                    >
                      Discard Changes
                    </button>
                    <button 
                      [disabled]="isLoading()"
                      class="button-glow px-8 py-3 bg-gradient-to-r from-primary-container to-secondary rounded-full text-on-primary-container font-bold text-xs transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-75" 
                      type="submit"
                    >
                      @if (isLoading()) {
                        <span class="material-symbols-outlined text-base animate-spin">progress_activity</span>
                        <span>Saving...</span>
                      } @else {
                        <span>Update Security Credentials</span>
                      }
                    </button>
                  </div>
                </form>
              </section>

              <!-- Advanced Security Bento Cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="glass-panel rounded-2xl p-6 flex items-start gap-4">
                  <div class="p-3 bg-secondary/10 border border-secondary/20 text-secondary rounded-xl shrink-0">
                    <span class="material-symbols-outlined text-2xl">key</span>
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-on-surface">Passkeys</h3>
                    <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">Use biometric or hardware keys for instant, safe login.</p>
                    <button class="mt-4 text-secondary font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer">
                      MANAGE PASSKEYS <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>

                <div class="glass-panel rounded-2xl p-6 flex items-start gap-4">
                  <div class="p-3 bg-tertiary/10 border border-tertiary/20 text-tertiary rounded-xl shrink-0">
                    <span class="material-symbols-outlined text-2xl">devices</span>
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-on-surface">Active Sessions</h3>
                    <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">Review and manage devices currently logged into your account.</p>
                    <button class="mt-4 text-tertiary font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer">
                      VIEW 3 ACTIVE DEVICES <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar Checklist & Promotion (4 Columns) -->
            <div class="col-span-12 lg:col-span-4 space-y-6">
              <!-- Password Policy Checklist -->
              <section class="glass-panel rounded-2xl p-6 border-primary/20">
                <h2 class="text-xs font-bold text-primary tracking-widest uppercase mb-4">PASSWORD POLICY</h2>
                <ul class="space-y-3">
                  <li [ngClass]="ruleMinLength() ? 'text-secondary font-semibold' : 'text-outline'" class="flex items-center gap-3 text-xs transition-all duration-300">
                    <span class="material-symbols-outlined text-base">{{ ruleMinLength() ? 'check_circle' : 'circle' }}</span>
                    <span>At least 8 characters long</span>
                  </li>
                  <li [ngClass]="ruleNumber() ? 'text-secondary font-semibold' : 'text-outline'" class="flex items-center gap-3 text-xs transition-all duration-300">
                    <span class="material-symbols-outlined text-base">{{ ruleNumber() ? 'check_circle' : 'circle' }}</span>
                    <span>Include at least one number</span>
                  </li>
                  <li [ngClass]="ruleSymbol() ? 'text-secondary font-semibold' : 'text-outline'" class="flex items-center gap-3 text-xs transition-all duration-300">
                    <span class="material-symbols-outlined text-base">{{ ruleSymbol() ? 'check_circle' : 'circle' }}</span>
                    <span>One special character (!&#64;#$%^*)</span>
                  </li>
                  <li [ngClass]="ruleLetterVariation() ? 'text-secondary font-semibold' : 'text-outline'" class="flex items-center gap-3 text-xs transition-all duration-300">
                    <span class="material-symbols-outlined text-base">{{ ruleLetterVariation() ? 'check_circle' : 'circle' }}</span>
                    <span>Uppercase &amp; Lowercase letters</span>
                  </li>
                </ul>

                <div class="mt-6 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    [ngClass]="{
                      'w-1/4 bg-error': ruleMinLength() && !ruleNumber(),
                      'w-2/4 bg-error-container': ruleMinLength() && ruleNumber() && !ruleSymbol(),
                      'w-3/4 bg-primary': ruleMinLength() && ruleNumber() && ruleSymbol() && !ruleLetterVariation(),
                      'w-full bg-secondary shadow-[0_0_10px_#5de6ff]': ruleMinLength() && ruleNumber() && ruleSymbol() && ruleLetterVariation()
                    }"
                    class="h-full transition-all duration-500"
                  ></div>
                </div>
                <p class="text-[10px] font-bold text-outline mt-2 text-right uppercase tracking-wider">
                  STRENGTH: {{ (ruleMinLength() && ruleNumber() && ruleSymbol() && ruleLetterVariation()) ? 'SECURE' : 'INCOMPLETE' }}
                </p>
              </section>

              <!-- 2FA Promotion Card -->
              <section class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-container/20 to-secondary-container/10 border border-primary/30 p-6 group">
                <div class="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                <div class="relative z-10">
                  <div class="inline-flex items-center justify-center p-3 bg-primary rounded-xl text-on-primary mb-4 shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">verified_user</span>
                  </div>
                  <h2 class="text-base font-bold text-on-surface leading-tight">Elevate Your Protection</h2>
                  <p class="text-xs text-on-surface-variant mt-2 leading-relaxed">Users with Two-Factor Authentication (2FA) are 99% less likely to experience account theft.</p>
                  <button 
                    (click)="onEnable2FA()"
                    class="w-full mt-6 px-6 py-3 bg-white text-on-primary-fixed font-bold text-xs rounded-full hover:bg-primary-fixed transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10 cursor-pointer"
                  >
                    <span>ACTIVATE 2FA NOW</span>
                    <span class="material-symbols-outlined text-sm">bolt</span>
                  </button>
                </div>
              </section>

              <!-- Security Insights -->
              <div class="p-2 text-center">
                <p class="text-[10px] font-bold text-outline flex items-center justify-center gap-1.5 uppercase tracking-wider">
                  <span class="material-symbols-outlined text-xs">info</span>
                  LAST PASSWORD CHANGE: 45 DAYS AGO
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="w-full max-w-7xl mx-auto px-8 py-6 border-t border-white/10 flex justify-between items-center mt-12 opacity-70">
          <div class="flex items-center gap-3">
            <span class="text-primary font-bold text-xs">Workora</span>
            <p class="text-xs text-outline">© 2026 Workora HRMS. All Rights Reserved.</p>
          </div>
          <div class="flex gap-6">
            <a class="text-xs text-outline hover:text-secondary transition-colors cursor-pointer">Privacy Policy</a>
            <a class="text-xs text-outline hover:text-secondary transition-colors cursor-pointer">Terms of Service</a>
            <a class="text-xs text-outline hover:text-secondary transition-colors cursor-pointer">Security</a>
          </div>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    .glass-panel {
      background: rgba(26, 32, 44, 0.45);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: inset 1px 1px 0px rgba(255, 255, 255, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .button-glow {
      box-shadow: 0 0 0px rgba(173, 198, 255, 0);
      transition: all 0.3s ease;
    }
    
    .button-glow:hover {
      box-shadow: 0 0 25px rgba(173, 198, 255, 0.35);
    }
  `]
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
