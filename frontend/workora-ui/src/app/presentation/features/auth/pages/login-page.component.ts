import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthShaderComponent } from '../components/auth-shader.component';

/**
 * Enterprise HRMS Secure Login Page Component.
 * Features ultra-sleek spatial glassmorphism architecture, WebGL liquid mesh shader background,
 * multi-factor corporate credentials authentication, SSO integration, live error feedback,
 * and password visibility toggle.
 */
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShaderComponent],
  template: `
    <div class="dark selection:bg-primary/30 selection:text-on-primary font-body-md text-on-surface bg-[#0d1320] min-h-screen relative overflow-x-hidden flex flex-col antialiased">
      <!-- WebGL Shader Background & Interactive Atmospheric Orbs -->
      <app-auth-shader></app-auth-shader>

      <!-- Header Navigation -->
      <header class="relative z-10 w-full px-6 md:px-10 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div class="flex items-center gap-3 cursor-pointer" routerLink="/">
          <img alt="Workora Logo" class="h-10 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(77,142,255,0.5)]" src="/workora.png"/>
          <span class="font-display-lg text-2xl font-bold text-on-surface tracking-tight">Workora</span>
        </div>
        <a (click)="onHelpCenter($event)" class="text-on-surface-variant hover:text-primary transition-colors font-label-sm uppercase tracking-wider text-xs cursor-pointer" href="#">
          Help Center
        </a>
      </header>

      <!-- Main Login Content -->
      <main class="flex-grow flex items-center justify-center p-4 md:p-8 relative z-10 my-auto">
        <div class="w-full max-w-[480px]">
          <!-- Login Glass Bento Card -->
          <div class="glass-card rounded-2xl p-6 md:p-10 flex flex-col gap-6">
            <div class="text-center space-y-2">
              <h1 class="font-display-lg text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">Welcome Back</h1>
              <p class="text-on-surface-variant font-body-md text-sm opacity-80">Access your workspace and data depth.</p>
            </div>

            <!-- Error Alert Banner -->
            @if (errorMessage()) {
              <div class="p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3 text-error animate-in fade-in duration-200">
                <span class="material-symbols-outlined text-xl shrink-0 mt-0.5">error</span>
                <div class="font-body-sm text-xs font-medium">{{ errorMessage() }}</div>
              </div>
            }

            <!-- Corporate SSO Button -->
            <button 
              type="button" 
              (click)="onSsoLogin()"
              class="w-full h-14 flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full transition-all duration-300 group cursor-pointer"
            >
              <span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">lock_person</span>
              <span class="font-label-sm text-sm font-semibold text-on-surface">Continue with Corporate SSO</span>
            </button>

            <!-- Divider -->
            <div class="flex items-center gap-4 py-1">
              <div class="h-px flex-grow bg-white/10"></div>
              <span class="text-xs text-outline font-medium uppercase tracking-widest">Or credentials</span>
              <div class="h-px flex-grow bg-white/10"></div>
            </div>

            <!-- Credentials Form -->
            <form (ngSubmit)="onSubmit()" class="flex flex-col gap-5">
              <!-- Email Field -->
              <div class="space-y-1 group">
                <label class="text-xs text-outline ml-1 uppercase tracking-wider font-semibold">Corporate Email</label>
                <div class="relative input-focus-glow border-b-2 border-white/10 transition-all duration-300">
                  <input 
                    type="email" 
                    name="email"
                    [(ngModel)]="email"
                    required
                    placeholder="name@company.com"
                    class="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 px-1 placeholder:text-outline/40 font-body-md text-sm outline-none"
                  />
                  <span class="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/50 group-focus-within:text-primary transition-colors text-xl pointer-events-none">alternate_email</span>
                </div>
              </div>

              <!-- Password Field -->
              <div class="space-y-1 group">
                <div class="flex justify-between items-end pr-1">
                  <label class="text-xs text-outline ml-1 uppercase tracking-wider font-semibold">Password</label>
                  <a routerLink="/forgot-password" class="text-xs text-primary/80 hover:text-primary transition-colors cursor-pointer">Forgot Password?</a>
                </div>
                <div class="relative input-focus-glow border-b-2 border-white/10 transition-all duration-300">
                  <input 
                    [type]="showPassword() ? 'text' : 'password'"
                    name="password"
                    [(ngModel)]="password"
                    required
                    placeholder="••••••••••••"
                    class="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 px-1 placeholder:text-outline/40 font-body-md text-sm outline-none pr-10"
                  />
                  <button 
                    type="button"
                    (click)="showPassword.set(!showPassword())"
                    class="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/50 hover:text-primary transition-colors cursor-pointer text-xl"
                  >
                    {{ showPassword() ? 'visibility_off' : 'visibility' }}
                  </button>
                </div>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit"
                [disabled]="isLoading()"
                class="button-glow mt-2 w-full h-14 bg-gradient-to-r from-primary-container to-tertiary-container rounded-full text-on-primary-container font-headline-md text-base font-bold flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75"
              >
                @if (isLoading()) {
                  <span class="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                  <span>Authenticating...</span>
                } @else {
                  <span>Sign In to Workspace</span>
                  <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                }
              </button>
            </form>

            <div class="mt-2 text-center">
              <p class="text-xs text-outline">
                New to Workora? <a (click)="onContactAdmin($event)" class="text-secondary font-bold hover:underline cursor-pointer">Request Access</a>
              </p>
            </div>
          </div>

          <!-- Trust Footer -->
          <div class="mt-10 text-center space-y-4">
            <p class="text-xs text-outline uppercase tracking-[0.2em] font-semibold">Trusted by the world's most innovative teams</p>
            <div class="flex justify-center items-center gap-8 opacity-50 grayscale contrast-125 hover:opacity-80 transition-opacity">
              <div class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-lg">rocket_launch</span>
                <span class="font-bold text-xs tracking-wider">SPACE-X</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-lg">bolt</span>
                <span class="font-bold text-xs tracking-wider">VOLT</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-lg">cloud</span>
                <span class="font-bold text-xs tracking-wider">NEBULA</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Global Footer -->
      <footer class="w-full mt-12 border-t border-white/10 bg-surface-container-low/40 backdrop-blur-3xl relative z-10">
        <div class="max-w-7xl mx-auto px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-1 space-y-3">
            <div class="flex items-center gap-2.5">
              <img alt="Workora Logo" class="h-8 w-auto object-contain" src="/workora.png"/>
              <span class="font-display-lg text-xl font-bold text-on-surface">Workora</span>
            </div>
            <p class="text-on-surface-variant text-xs leading-relaxed max-w-xs">
              The spatial workforce platform designed for the future of work. Experience depth in every interaction.
            </p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 col-span-1 md:col-span-3 gap-6">
            <div class="space-y-2">
              <h4 class="text-on-surface font-bold text-xs uppercase tracking-widest">Platform</h4>
              <nav class="flex flex-col gap-1.5">
                <a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Payroll</a>
                <a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Benefits</a>
                <a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Compliance</a>
              </nav>
            </div>
            <div class="space-y-2">
              <h4 class="text-on-surface font-bold text-xs uppercase tracking-widest">Support</h4>
              <nav class="flex flex-col gap-1.5">
                <a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Documentation</a>
                <a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">API Status</a>
                <a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Support</a>
              </nav>
            </div>
            <div class="space-y-2">
              <h4 class="text-on-surface font-bold text-xs uppercase tracking-widest">Legal</h4>
              <nav class="flex flex-col gap-1.5">
                <a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Privacy</a>
                <a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Terms</a>
                <a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Security</a>
              </nav>
            </div>
          </div>
        </div>
        <div class="max-w-7xl mx-auto px-6 md:px-10 py-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-60">
          <p class="text-xs text-outline">© 2026 Workora Enterprise. All rights reserved.</p>
          <div class="flex gap-4">
            <span class="material-symbols-outlined text-lg hover:text-primary cursor-pointer transition-colors">language</span>
            <span class="material-symbols-outlined text-lg hover:text-primary cursor-pointer transition-colors">public</span>
            <span class="material-symbols-outlined text-lg hover:text-primary cursor-pointer transition-colors">mail</span>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(26, 32, 44, 0.45);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: inset 1px 1px 0px rgba(255, 255, 255, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .input-focus-glow:focus-within {
      box-shadow: 0 0 15px rgba(173, 198, 255, 0.25);
      border-color: rgba(173, 198, 255, 0.6);
    }

    .button-glow {
      box-shadow: 0 0 0px rgba(173, 198, 255, 0);
      transition: all 0.3s ease;
    }
    
    .button-glow:hover {
      box-shadow: 0 0 30px rgba(173, 198, 255, 0.35);
      transform: translateY(-1px);
    }
  `]
})
export class LoginPageComponent {
  private readonly authService: AuthService = inject(AuthService) as AuthService;
  private readonly notificationService: NotificationService = inject(NotificationService) as NotificationService;
  private readonly router: Router = inject(Router) as Router;

  /**
   * Credentials form input parameters.
   */
  email = '';
  password = '';

  /**
   * Password visibility toggle state signal.
   */
  readonly showPassword = signal<boolean>(false);

  /**
   * API request loading status signal.
   */
  readonly isLoading = signal<boolean>(false);

  /**
   * User feedback error message signal.
   */
  readonly errorMessage = signal<string | null>(null);

  /**
   * Submits email and password credentials for user authentication.
   */
  onSubmit(): void {
    if (!this.email || !this.password) {
      const msg = 'Please enter both corporate email and password.';
      this.errorMessage.set(msg);
      this.notificationService.showWarning(msg);
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notificationService.showSuccess('Welcome back! Authentication successful.');
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        const msg = err?.message || 'Authentication failed. Please verify your credentials.';
        this.errorMessage.set(msg);
        this.notificationService.showError(msg);
      }
    });
  }


  /**
   * Handles Single Sign-On (SSO) login flow.
   */
  onSsoLogin(): void {
    this.errorMessage.set('Redirecting to corporate SSO provider portal...');
  }

  /**
   * Handles contact administrator or request access action.
   * 
   * @param event DOM Mouse Event.
   */
  onContactAdmin(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('Please contact your IT administrator at admin@workora.com to request access credentials.');
  }

  /**
   * Handles Help Center click action.
   * 
   * @param event DOM Mouse Event.
   */
  onHelpCenter(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('Help Center documentation is available at docs.workora.com.');
  }
}
