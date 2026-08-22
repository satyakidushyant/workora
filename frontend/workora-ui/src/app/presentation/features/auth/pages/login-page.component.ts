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
    <div class="font-sans text-[#163331] bg-[#F4F8F7] min-h-screen relative overflow-x-hidden flex flex-col justify-between antialiased selection:bg-[#DCEBE7] selection:text-[#063B39]">
      <!-- Soft Ambient Background Glows -->
      <app-auth-shader></app-auth-shader>

      <!-- Top Simple Header Bar -->
      <header class="relative z-10 w-full px-6 md:px-12 py-5 flex justify-between items-center max-w-7xl mx-auto">
        <a routerLink="/" class="flex items-center gap-3 cursor-pointer group text-decoration-none">
          <div class="relative flex items-center justify-center">
            <img alt="Workora Logo" class="h-9 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-xs" src="/workoraLogo.png"/>
          </div>
          <span class="text-2xl font-extrabold tracking-tight text-[#063B39] font-heading flex items-center">
            Workora
            <span class="w-1.5 h-1.5 rounded-full bg-[#0E6E68] ml-1"></span>
          </span>
        </a>
        
        <div class="flex items-center gap-6">
          <a (click)="onHelpCenter($event)" class="text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors uppercase tracking-wider cursor-pointer">
            Help Center
          </a>
        </div>
      </header>

      <!-- Main Split-Screen Content Area -->
      <main class="flex-grow flex items-center justify-center px-4 py-8 md:py-12 relative z-10 max-w-7xl mx-auto w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
          
          <!-- LEFT: Brand Showcase Banner (Visible on Desktop/Tablet) -->
          <div class="lg:col-span-6 space-y-8 text-center lg:text-left auth-brand-side">
            
            <!-- Value Pill -->
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DCEBE7] border border-[rgba(14,110,104,0.2)] text-[#0E6E68] text-xs font-bold uppercase tracking-wider shadow-xs">
              <span class="w-2 h-2 rounded-full bg-[#0E6E68] animate-pulse"></span>
              <span>Next-Gen Enterprise HRMS</span>
            </div>

            <!-- Title & Subtitle -->
            <div class="space-y-3">
              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight leading-[1.15] font-heading">
                Empower Your People. <br class="hidden sm:block"/>
                <span class="text-[#0E6E68]">Simplify Your Work.</span>
              </h1>
              <p class="text-sm sm:text-base text-[#6B7F7C] max-w-lg leading-relaxed mx-auto lg:mx-0">
                Log in to coordinate payroll, attendance tracking, team operations, and employee performance in one unified executive workspace.
              </p>
            </div>

            <!-- Floating Feature Highlights -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div class="bg-white/85 backdrop-blur-md p-4 rounded-2xl border border-[#DCEBE7] shadow-sm flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">verified_user</span>
                </div>
                <div class="text-left">
                  <h4 class="text-xs font-bold text-[#063B39]">SOC-2 &amp; GDPR</h4>
                  <p class="text-[11px] text-[#6B7F7C]">256-bit encrypted data vault</p>
                </div>
              </div>

              <div class="bg-white/85 backdrop-blur-md p-4 rounded-2xl border border-[#DCEBE7] shadow-sm flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#3FA79B] flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">speed</span>
                </div>
                <div class="text-left">
                  <h4 class="text-xs font-bold text-[#063B39]">Real-Time Sync</h4>
                  <p class="text-[11px] text-[#6B7F7C]">99.9% platform availability</p>
                </div>
              </div>
            </div>

            <!-- Trust Badge Subtext -->
            <div class="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-[#0E6E68]/80 font-medium">
              <span class="material-symbols-outlined text-base text-[#3FA79B]">lock</span>
              <span>Protected by Workora Enterprise Shield</span>
            </div>

          </div>

          <!-- RIGHT: Login SaaS Card -->
          <div class="lg:col-span-6 flex justify-center lg:justify-end">
            <div class="w-full max-w-[460px] bg-white rounded-3xl p-8 sm:p-10 border border-[#DCEBE7] shadow-lg flex flex-col gap-6 auth-card">
              
              <!-- Card Header -->
              <div class="text-center space-y-1.5">
                <div class="inline-flex p-3 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] mb-1">
                  <span class="material-symbols-outlined text-3xl">lock_open</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">Sign In to Workora</h2>
                <p class="text-xs sm:text-sm text-[#6B7F7C]">Access your company's intelligent HR portal.</p>
              </div>

              <!-- Error Alert Banner -->
              @if (errorMessage()) {
                <div class="p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-red-700 animate-in fade-in duration-200 text-xs">
                  <span class="material-symbols-outlined text-lg shrink-0 mt-0.5 text-red-600">error</span>
                  <div class="font-medium leading-relaxed">{{ errorMessage() }}</div>
                </div>
              }

              <!-- Corporate SSO Button -->
              <button 
                type="button" 
                (click)="onSsoLogin()"
                class="w-full h-11 flex items-center justify-center gap-3 bg-[#FAFCFB] hover:bg-[#DCEBE7]/50 border border-[#DCEBE7] hover:border-[#3FA79B]/60 rounded-xl transition-all duration-200 group cursor-pointer text-xs font-bold text-[#063B39]"
              >
                <span class="material-symbols-outlined text-[#0E6E68] text-lg">domain</span>
                <span>Continue with Corporate SSO</span>
              </button>

              <!-- Divider -->
              <div class="flex items-center gap-4 py-0.5">
                <div class="h-px flex-grow bg-[#DCEBE7]"></div>
                <span class="text-[11px] text-[#6B7F7C] font-bold uppercase tracking-wider">Or with email</span>
                <div class="h-px flex-grow bg-[#DCEBE7]"></div>
              </div>

              <!-- Credentials Form -->
              <form (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                
                <!-- Email Field -->
                <div class="space-y-1.5 auth-field">
                  <label class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Corporate Email</label>
                  <div class="relative flex items-center">
                    <input 
                      type="email" 
                      name="email"
                      [(ngModel)]="email"
                      required
                      placeholder="admin@workora.com"
                      class="workora-input pr-10"
                    />
                    <span class="material-symbols-outlined text-[#3FA79B] absolute right-3.5 text-lg pointer-events-none">alternate_email</span>
                  </div>
                </div>

                <!-- Password Field -->
                <div class="space-y-1.5 auth-field">
                  <div class="flex justify-between items-center pr-0.5">
                    <label class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Password</label>
                    <a routerLink="/forgot-password" class="text-xs font-semibold text-[#0E6E68] hover:text-[#063B39] transition-colors cursor-pointer">Forgot?</a>
                  </div>
                  <div class="relative flex items-center">
                    <input 
                      [type]="showPassword() ? 'text' : 'password'"
                      name="password"
                      [(ngModel)]="password"
                      required
                      placeholder="••••••••••••"
                      class="workora-input pr-10"
                    />
                    <button 
                      type="button"
                      (click)="showPassword.set(!showPassword())"
                      class="material-symbols-outlined text-slate-400 hover:text-[#063B39] transition-colors cursor-pointer text-lg absolute right-3.5 flex items-center justify-center border-none bg-transparent"
                      aria-label="Toggle password visibility"
                    >
                      {{ showPassword() ? 'visibility_off' : 'visibility' }}
                    </button>
                  </div>
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  [disabled]="isLoading()"
                  class="mt-2 w-full h-12 workora-btn-primary disabled:opacity-75"
                >
                  @if (isLoading()) {
                    <span class="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    <span>Signing In...</span>
                  } @else {
                    <span>Sign In to Workspace</span>
                    <span class="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                  }
                </button>
              </form>

              <!-- Footer Prompt -->
              <div class="text-center pt-2 border-t border-[#DCEBE7]">
                <p class="text-xs text-[#6B7F7C]">
                  Need an account? <a (click)="onContactAdmin($event)" class="text-[#0E6E68] font-bold hover:underline cursor-pointer">Request Access</a>
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      <!-- Bottom Simple Footer -->
      <footer class="relative z-10 w-full px-6 py-4 text-center text-xs text-[#6B7F7C]">
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
        const msg = err?.message || 'Authentication failed. Please verify your credentials.';
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
