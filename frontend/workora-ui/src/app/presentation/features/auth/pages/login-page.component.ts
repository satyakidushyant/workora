import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthShaderComponent } from '../components/auth-shader.component';

/**
 * Enterprise HRMS Secure Login Page Component.
 * Features a modern split-screen SaaS layout, Workora brand showcase,
 * GSAP entrance animations, corporate credentials authentication, and SSO support.
 */
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShaderComponent],
  template: `
    <div class="font-sans text-[#163331] bg-[#F4F8F7] min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden flex flex-col justify-between antialiased selection:bg-[#DCEBE7] selection:text-[#063B39] relative">
      <!-- Soft Ambient Background Glows -->
      <app-auth-shader></app-auth-shader>

      <!-- Top Simple Header Bar (Big 3D Logo Only) -->
      <header class="relative z-10 w-full px-4 xs:px-6 md:px-12 py-3 xs:py-4 md:py-5 flex justify-between items-center max-w-7xl 2xl:max-w-8xl mx-auto shrink-0">
        <a routerLink="/" class="flex items-center cursor-pointer group focus:outline-none" aria-label="Workora Home">
          <img 
            alt="Workora 3D Logo" 
            src="/workoraLogo.png" 
            class="h-9 xs:h-11 sm:h-13 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_6px_14px_rgba(14,110,104,0.22)] group-hover:drop-shadow-[0_8px_20px_rgba(63,167,155,0.35)]"
          />
        </a>

        <div class="flex items-center gap-4">
          <a routerLink="/" class="text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-base">arrow_back</span>
            <span class="hidden xs:inline">Back to Home</span>
          </a>
        </div>
      </header>

      <!-- Main Split-Screen Content Area -->
      <main class="flex-grow flex items-center justify-center px-3.5 xs:px-4 py-3 md:py-4 relative z-10 max-w-7xl 2xl:max-w-8xl mx-auto w-full overflow-y-auto lg:overflow-visible">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center w-full my-auto">
          
          <!-- LEFT: Brand Showcase Banner (Visible on Desktop/Tablet) -->
          <div class="hidden lg:block lg:col-span-6 space-y-4 lg:space-y-6 text-left auth-brand-side">
            
            <!-- Value Pill -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DCEBE7] border border-[rgba(14,110,104,0.2)] text-[#0E6E68] text-[11px] font-bold uppercase tracking-wider shadow-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-[#0E6E68] animate-pulse"></span>
              <span>Next-Gen Enterprise HRMS</span>
            </div>

            <!-- Title & Subtitle -->
            <div class="space-y-2">
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#063B39] tracking-tight leading-[1.2] font-heading">
                Empower Your People. <br class="hidden sm:block"/>
                <span class="text-[#0E6E68]">Simplify Your Work.</span>
              </h1>
              <p class="text-xs sm:text-sm text-[#6B7F7C] max-w-md leading-relaxed">
                Log in to coordinate payroll, attendance tracking, team operations, and employee performance in one unified executive workspace.
              </p>
            </div>

            <!-- Floating Feature Highlights -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div class="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#DCEBE7] shadow-xs flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg">verified_user</span>
                </div>
                <div class="text-left">
                  <h4 class="text-xs font-bold text-[#063B39]">SOC-2 &amp; GDPR</h4>
                  <p class="text-[10px] text-[#6B7F7C]">256-bit encrypted data vault</p>
                </div>
              </div>

              <div class="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#DCEBE7] shadow-xs flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#3FA79B] flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg">speed</span>
                </div>
                <div class="text-left">
                  <h4 class="text-xs font-bold text-[#063B39]">Real-Time Sync</h4>
                  <p class="text-[10px] text-[#6B7F7C]">99.9% platform availability</p>
                </div>
              </div>
            </div>

            <!-- Trust Badge Subtext -->
            <div class="pt-1 flex items-center gap-1.5 text-xs text-[#0E6E68]/80 font-medium">
              <span class="material-symbols-outlined text-sm text-[#3FA79B]">lock</span>
              <span>Protected by Workora Enterprise Shield</span>
            </div>

          </div>

          <!-- RIGHT: Login SaaS Card -->
          <div class="col-span-1 lg:col-span-6 flex justify-center lg:justify-end">
            <div class="w-full max-w-[430px] bg-white rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-7 border border-[#DCEBE7] shadow-lg flex flex-col gap-3.5 sm:gap-4 auth-card">
              
              <!-- Card Header -->
              <div class="text-center space-y-1">
                <div class="inline-flex p-2.5 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] mb-0.5">
                  <span class="material-symbols-outlined text-2xl">lock_open</span>
                </div>
                <h2 class="text-xl sm:text-2xl font-extrabold text-[#063B39] tracking-tight font-heading">Sign In to Workora</h2>
                <p class="text-xs text-[#6B7F7C]">Access your company's intelligent HR portal.</p>
              </div>

              <!-- Error Alert Banner -->
              @if (errorMessage()) {
                <div class="p-2.5 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2 text-red-700 animate-in fade-in duration-200 text-xs">
                  <span class="material-symbols-outlined text-base shrink-0 mt-0.5 text-red-600">error</span>
                  <div class="font-medium leading-relaxed">{{ errorMessage() }}</div>
                </div>
              }

              <!-- Corporate SSO Button -->
              <button 
                type="button" 
                (click)="onSsoLogin()"
                class="workora-btn-sso"
              >
                <span class="material-symbols-outlined text-[#0E6E68] text-base">domain</span>
                <span>Continue with Corporate SSO</span>
              </button>

              <!-- Divider -->
              <div class="flex items-center gap-3 py-0.5">
                <div class="h-px flex-grow bg-[#DCEBE7]"></div>
                <span class="text-[10px] text-[#6B7F7C] font-bold uppercase tracking-wider">Or with email</span>
                <div class="h-px flex-grow bg-[#DCEBE7]"></div>
              </div>

              <!-- Credentials Form -->
              <form (ngSubmit)="onSubmit()" class="flex flex-col gap-3">
                
                <!-- Email Field -->
                <div class="space-y-1 auth-field">
                  <label class="workora-label !mb-1">Corporate Email</label>
                  <div class="relative flex items-center">
                    <input 
                      type="email" 
                      name="email"
                      [(ngModel)]="email"
                      required
                      placeholder="admin@workora.com"
                      class="workora-input pl-4 pr-11 !py-2.5 text-xs"
                    />
                    <span class="material-symbols-outlined text-[#3FA79B] absolute right-3.5 text-base pointer-events-none">alternate_email</span>
                  </div>
                </div>

                <!-- Password Field -->
                <div class="space-y-1 auth-field">
                  <label class="workora-label !mb-1">Password</label>
                  <div class="relative flex items-center">
                    <input 
                      [type]="showPassword() ? 'text' : 'password'"
                      name="password"
                      [(ngModel)]="password"
                      required
                      placeholder="••••••••••••"
                      class="workora-input pl-4 pr-11 !py-2.5 text-xs"
                    />
                    <button 
                      type="button"
                      (click)="showPassword.set(!showPassword())"
                      class="material-symbols-outlined text-slate-400 hover:text-[#063B39] transition-colors cursor-pointer text-base absolute right-3.5 flex items-center justify-center border-none bg-transparent"
                      aria-label="Toggle password visibility"
                    >
                      {{ showPassword() ? 'visibility_off' : 'visibility' }}
                    </button>
                  </div>
                </div>

                <!-- Options Row (Remember Me & Forgot Password) -->
                <div class="flex items-center justify-between pt-0.5 text-xs auth-field">
                  <label class="flex items-center gap-2 cursor-pointer select-none text-[#163331] hover:text-[#063B39] text-xs">
                    <input 
                      type="checkbox" 
                      name="rememberMe"
                      [(ngModel)]="rememberMe"
                      class="workora-checkbox"
                    />
                    <span class="text-[11px] font-medium text-[#6B7F7C]">Remember me</span>
                  </label>
                  <a routerLink="/forgot-password" class="text-[11px] font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors cursor-pointer">
                    Forgot Password?
                  </a>
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  [disabled]="isLoading()"
                  class="mt-1 w-full h-10 sm:h-11 workora-btn-primary text-xs disabled:opacity-75"
                >
                  @if (isLoading()) {
                    <span class="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    <span>Signing In...</span>
                  } @else {
                    <span>Sign In to Workspace</span>
                    <span class="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                  }
                </button>
              </form>

              <!-- Footer Prompt -->
              <div class="text-center pt-1.5 border-t border-[#DCEBE7]">
                <p class="text-[11px] text-[#6B7F7C]">
                  Need an account? <a (click)="onContactAdmin($event)" class="text-[#0E6E68] font-bold hover:underline cursor-pointer">Request Access</a>
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      <!-- Bottom Simple Footer -->
      <footer class="relative z-10 w-full px-6 py-2.5 md:py-3 text-center text-[11px] text-[#6B7F7C] shrink-0">
        <p>© 2026 Workora HRMS. All rights reserved. Enterprise Workforce Cloud.</p>
      </footer>

    </div>
  `
})
export class LoginPageComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly authService: AuthService = inject(AuthService) as AuthService;
  private readonly notificationService: NotificationService = inject(NotificationService) as NotificationService;
  private readonly router: Router = inject(Router) as Router;

  private ctx?: gsap.Context;

  email = '';
  password = '';
  rememberMe = false;

  readonly showPassword = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ctx = gsap.context(() => {
      // Staggered Entrance Animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.7 } });

      tl.from('.auth-brand-side', {
        x: -30,
        opacity: 0,
        duration: 0.8
      })
      .from('.auth-card', {
        x: 30,
        opacity: 0,
        duration: 0.8
      }, '-=0.6')
      .from('.auth-field', {
        y: 15,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5
      }, '-=0.4');
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

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
        const msg = err?.error?.message || err?.message || 'Authentication failed. Please verify your credentials.';
        this.errorMessage.set(msg);
        this.notificationService.showError(msg);
      }
    });
  }

  onSsoLogin(): void {
    this.errorMessage.set('Redirecting to corporate SSO provider portal...');
  }

  onContactAdmin(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('Please contact your IT administrator at admin@workora.com to request access credentials.');
  }

  onHelpCenter(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('Help Center documentation is available at docs.workora.com.');
  }
}
