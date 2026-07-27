import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

/**
 * Enterprise HRMS Login Page Component.
 * Implements a split-screen desktop and mobile layout with high-converting branding, 
 * corporate credentials authentication, show/hide password toggle, and error handling.
 */
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col md:flex-row overflow-hidden bg-surface">
      <!-- Left Section: Branding & Enterprise Imagery (Desktop) -->
      <div class="hidden md:flex md:w-1/2 lg:w-3/5 h-full relative overflow-hidden geometric-pattern min-h-screen">
        <!-- Overlay Gradient -->
        <div class="absolute inset-0 z-10 opacity-40 bg-gradient-to-tr from-primary to-transparent"></div>
        
        <!-- Background Hero Image -->
        <div class="absolute inset-0 z-0">
          <div 
            class="w-full h-full bg-cover bg-center" 
            style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuALv-9Y4mxK5JrVaVIUOi2lE_COA9Fs-h6qTlVfKpbhbnTfg2niLfcD-gUK0PeXcSBTtZkD1z0Ok8gygWkSUV8Dr5LWivbOZH0nRvlOYn1h4TpCaBm67qgcTlGh-Zx8FgRjI01Kn5Bp1Nd9wTTAvooX0X0i6g_OGtQu--apu4pVKgp3OTDikwqiHwuMr_2BFhufKau-q1WiPmIjvOB-tg1g0vnXmRd08jGwIrzzXnm81lOFFvnfjNDHO5Go7yR_x8uXofbUmuP8sn8j')"
          ></div>
        </div>

        <!-- Left Column Content -->
        <div class="relative z-20 flex flex-col justify-end p-12 lg:p-20 w-full h-full text-on-primary">
          <div class="max-w-xl">
            <h1 class="font-headline-lg text-headline-lg mb-4 text-white font-bold leading-tight">
              Powering the Modern Enterprise.
            </h1>
            <p class="font-body-lg text-body-lg opacity-80 leading-relaxed text-gray-200">
              Workora delivers integrated payroll, talent management, and HR operations in a single, secure environment built for the future of work.
            </p>
            
            <!-- Statistics Banner -->
            <div class="mt-8 flex gap-container-margin items-center">
              <div class="flex flex-col">
                <span class="font-headline-md text-headline-md font-bold text-white">50k+</span>
                <span class="font-label-md text-label-md uppercase opacity-60 text-gray-300">Organizations</span>
              </div>
              <div class="flex flex-col border-l border-white/20 pl-gutter">
                <span class="font-headline-md text-headline-md font-bold text-white">99.9%</span>
                <span class="font-label-md text-label-md uppercase opacity-60 text-gray-300">Uptime SLA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section: Form Container -->
      <div class="flex-1 flex flex-col bg-surface overflow-y-auto min-h-screen">
        <!-- Mobile Header (Logo only) -->
        <div class="md:hidden p-container-margin flex justify-center pt-8">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">groups</span>
            <span class="font-headline-sm text-headline-sm font-black text-primary">Workora</span>
          </div>
        </div>

        <main class="flex-grow flex items-center justify-center p-gutter lg:p-container-margin py-8">
          <div class="w-full max-w-md">
            <!-- Login Card -->
            <div class="bg-surface-container-lowest p-8 md:p-10 rounded-xl login-card-shadow border border-border-subtle transition-all duration-300 hover:shadow-lg">
              
              <!-- Desktop Header Branding -->
              <div class="hidden md:flex items-center gap-2 mb-8">
                <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">groups</span>
                <span class="font-headline-sm text-headline-sm font-black text-primary">Workora</span>
              </div>

              <!-- Section Title -->
              <div class="mb-8">
                <h2 class="font-headline-md text-headline-md text-primary mb-2 font-bold">Welcome Back</h2>
                <p class="font-body-md text-body-md text-slate-text">Access your enterprise HR dashboard.</p>
              </div>

              <!-- Error Alert Message -->
              @if (errorMessage()) {
                <div class="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 flex items-start gap-3 text-error">
                  <span class="material-symbols-outlined text-xl shrink-0 mt-0.5">error</span>
                  <div class="font-body-sm text-body-sm">{{ errorMessage() }}</div>
                </div>
              }

              <!-- Credentials Login Form -->
              <form class="space-y-6" (ngSubmit)="onSubmit()">
                <!-- Email Field -->
                <div class="space-y-1">
                  <label class="font-label-md text-label-md text-on-surface block" for="email">Corporate Email</label>
                  <div class="relative group">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-text/60 group-focus-within:text-secondary transition-colors">mail</span>
                    <input 
                      class="w-full pl-10 pr-4 py-3 bg-white border border-border-subtle rounded-lg font-body-md text-body-md text-primary focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none" 
                      id="email" 
                      name="email" 
                      [(ngModel)]="email"
                      placeholder="name@company.com" 
                      required 
                      type="email"
                    />
                  </div>
                </div>

                <!-- Password Field -->
                <div class="space-y-1">
                  <div class="flex justify-between items-center">
                    <label class="font-label-md text-label-md text-on-surface block" for="password">Password</label>
                    <a class="font-label-md text-label-md text-secondary hover:underline transition-all cursor-pointer" (click)="onForgotPassword($event)">Forgot password?</a>
                  </div>
                  <div class="relative group">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-text/60 group-focus-within:text-secondary transition-colors">lock</span>
                    <input 
                      class="w-full pl-10 pr-12 py-3 bg-white border border-border-subtle rounded-lg font-body-md text-body-md text-primary focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none" 
                      id="password" 
                      name="password" 
                      [(ngModel)]="password"
                      placeholder="••••••••" 
                      required 
                      [type]="showPassword() ? 'text' : 'password'"
                    />
                    <button 
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-text/40 hover:text-slate-text transition-colors flex items-center" 
                      type="button"
                      (click)="togglePasswordVisibility()"
                    >
                      <span class="material-symbols-outlined text-[20px]">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Remember Me Checkbox -->
                <div class="flex items-center">
                  <input 
                    class="w-4 h-4 text-secondary border-border-subtle rounded focus:ring-secondary cursor-pointer" 
                    id="remember" 
                    name="remember" 
                    type="checkbox"
                    [(ngModel)]="rememberMe"
                  />
                  <label class="ml-2 font-body-sm text-body-sm text-slate-text cursor-pointer select-none" for="remember">
                    Remember me for 30 days
                  </label>
                </div>

                <!-- Submit Button with Dynamic Micro-interactions -->
                <button 
                  [disabled]="isLoading() || isSuccess()" 
                  [ngClass]="{
                    'bg-primary hover:bg-primary-container': !isSuccess(),
                    'bg-success': isSuccess()
                  }"
                  class="w-full py-3.5 text-on-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md disabled:opacity-75 disabled:cursor-not-allowed" 
                  type="submit"
                >
                  @if (isLoading()) {
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  } @else if (isSuccess()) {
                    <span class="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Success</span>
                  } @else {
                    <span>Sign In</span>
                    <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                  }
                </button>

                <!-- SSO / Alternative Divider -->
                <div class="relative flex items-center py-2">
                  <div class="flex-grow border-t border-border-subtle"></div>
                  <span class="flex-shrink mx-4 font-label-md text-label-md text-slate-text opacity-50 uppercase">or</span>
                  <div class="flex-grow border-t border-border-subtle"></div>
                </div>

                <!-- SSO Single Sign-On Button -->
                <button 
                  class="w-full py-3 bg-white border border-border-subtle text-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-3 hover:bg-surface-container-low transition-colors" 
                  type="button"
                  (click)="onSsoLogin()"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span>Single Sign-On (SSO)</span>
                </button>
              </form>
            </div>

            <!-- Assistance Text -->
            <p class="mt-8 text-center font-body-sm text-body-sm text-slate-text">
              New to Workora? <a class="text-secondary font-bold hover:underline cursor-pointer" (click)="onContactAdmin($event)">Contact your administrator</a>
            </p>
          </div>
        </main>

        <!-- Footer -->
        <footer class="p-container-margin mt-auto border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4 py-4">
          <div class="font-body-sm text-body-sm text-slate-text opacity-70">
            © 2026 Workora Inc. All rights reserved.
          </div>
          <div class="flex gap-gutter">
            <a class="font-label-md text-label-md text-slate-text hover:text-primary transition-colors cursor-pointer">Privacy Policy</a>
            <a class="font-label-md text-label-md text-slate-text hover:text-primary transition-colors cursor-pointer">Terms of Service</a>
            <a class="font-label-md text-label-md text-slate-text hover:text-primary transition-colors cursor-pointer">Help Center</a>
          </div>
        </footer>
      </div>
    </div>
  `
})
export class LoginPageComponent {
  /**
   * Service injected for authentication token and session management.
   */
  private readonly authService: AuthService = inject(AuthService) as AuthService;

  /**
   * Angular router injected for post-login navigation.
   */
  private readonly router: Router = inject(Router) as Router;

  /**
   * Corporate email input field model.
   */
  email = '';

  /**
   * User password input field model.
   */
  password = '';

  /**
   * Remember session preference flag.
   */
  rememberMe = false;

  /**
   * Signal controlling password visibility toggle state.
   */
  readonly showPassword = signal<boolean>(false);

  /**
   * Signal indicating active network request state.
   */
  readonly isLoading = signal<boolean>(false);

  /**
   * Signal controlling success micro-interaction state prior to redirect.
   */
  readonly isSuccess = signal<boolean>(false);

  /**
   * Signal holding authentication error feedback message.
   */
  readonly errorMessage = signal<string | null>(null);

  /**
   * Toggles input field visibility state for user password.
   */
  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  /**
   * Dispatches user login credentials authentication request to the backend service.
   */
  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Please enter both corporate email and password.');
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.message || 'Authentication failed. Please verify your credentials.');
      }
    });
  }

  /**
   * Triggers Single Sign-On (SSO) login flow.
   */
  onSsoLogin(): void {
    this.errorMessage.set('SSO Integration is managed via Enterprise Identity Provider (IdP). Please contact IT support.');
  }

  /**
   * Handles forgot password user interaction.
   * 
   * @param event DOM Event
   */
  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('Password reset instructions have been sent to your administrator contact system.');
  }

  /**
   * Handles contact administrator click action.
   * 
   * @param event DOM Event
   */
  onContactAdmin(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('Please contact your enterprise system administrator for account provisioning.');
  }
}

