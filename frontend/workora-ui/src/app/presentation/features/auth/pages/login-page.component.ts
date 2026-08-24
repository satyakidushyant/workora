import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthShaderComponent } from '../components/auth-shader.component';

/**
 * Workora Sign-In Page Component.
 * Clean, modern interface with all feedback delivered via rich toaster notifications.
 */
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShaderComponent],
  template: `
    <div class="font-sans text-[#163331] bg-[#F4F8F7] min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden flex flex-col justify-between antialiased selection:bg-[#DCEBE7] selection:text-[#063B39] relative">
      <!-- Soft Ambient Background Glows -->
      <app-auth-shader></app-auth-shader>

      <!-- Top Header Bar -->
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
          <a routerLink="/" class="text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Home</span>
          </a>
        </div>
      </header>

      <!-- Main Split-Screen Content Area -->
      <main class="flex-grow flex items-center justify-center px-3.5 xs:px-4 py-3 md:py-4 relative z-10 max-w-7xl 2xl:max-w-8xl mx-auto w-full overflow-y-auto lg:overflow-visible">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center w-full my-auto">
          
          <!-- LEFT: Brand Story Side (Desktop) -->
          <div class="hidden lg:block lg:col-span-6 space-y-5 text-left auth-brand-side">
            
            <!-- Value Pill -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7] border border-[#0E6E68]/20 text-[#0E6E68] text-xs font-bold shadow-xs">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Calm Workplace Operations</span>
            </div>

            <!-- Title & Subtitle -->
            <div class="space-y-2">
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#063B39] tracking-tight leading-[1.2] font-heading">
                Welcome back! <br/>
                <span class="text-[#0E6E68]">Let's take care of your team.</span>
              </h1>
              <p class="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
                Log in to review approvals, coordinate attendance, manage people records, and keep everyday work moving forward.
              </p>
            </div>

            <!-- Highlights -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div class="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#DCEBE7] shadow-xs flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">verified_user</span>
                </div>
                <div class="text-left">
                  <h4 class="text-xs font-bold text-[#063B39]">Encrypted &amp; Private</h4>
                  <p class="text-[10px] text-slate-500">AES-256 enterprise-grade security</p>
                </div>
              </div>

              <div class="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#DCEBE7] shadow-xs flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#3FA79B] flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">bolt</span>
                </div>
                <div class="text-left">
                  <h4 class="text-xs font-bold text-[#063B39]">Zero-Lag Sync</h4>
                  <p class="text-[10px] text-slate-500">Real-time status across teams</p>
                </div>
              </div>
            </div>

            <!-- Friendly Reassurance -->
            <div class="pt-2 flex items-center gap-2 text-xs text-[#0E6E68] font-semibold">
              <span class="material-symbols-outlined text-sm text-emerald-600">lock</span>
              <span>Need help logging in? Our support team is always one message away.</span>
            </div>

          </div>

          <!-- RIGHT: Sign-In Card -->
          <div class="col-span-1 lg:col-span-6 flex justify-center lg:justify-end">
            <div class="w-full max-w-[440px] bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE7] shadow-xl flex flex-col gap-4 auth-card">
              
              <!-- Card Header -->
              <div class="text-center space-y-1">
                <div class="inline-flex p-3 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] mb-1">
                  <span class="material-symbols-outlined text-2xl">waving_hand</span>
                </div>
                <h2 class="text-xl sm:text-2xl font-extrabold text-[#063B39] tracking-tight font-heading">Sign In</h2>
                <p class="text-xs text-slate-500">Enter your work email to access your workspace.</p>
              </div>

              <!-- Credentials Form -->
              <form (ngSubmit)="onSubmit()" class="flex flex-col gap-3.5">
                
                <!-- Email Field -->
                <div class="space-y-1 auth-field">
                  <label class="text-xs font-bold text-[#063B39]">Work Email</label>
                  <div class="relative flex items-center">
                    <input 
                      type="email" 
                      name="email"
                      [(ngModel)]="email"
                      required
                      placeholder="you@company.com"
                      class="workora-input pl-4 pr-11 !py-2.5 text-xs w-full"
                    />
                    <span class="material-symbols-outlined text-[#3FA79B] absolute right-3.5 text-base pointer-events-none">mail</span>
                  </div>
                </div>

                <!-- Password Field -->
                <div class="space-y-1 auth-field">
                  <div class="flex justify-between items-center">
                    <label class="text-xs font-bold text-[#063B39]">Password</label>
                    <a routerLink="/forgot-password" class="text-[11px] font-bold text-[#0E6E68] hover:text-[#063B39] hover:underline cursor-pointer">
                      Forgot password?
                    </a>
                  </div>
                  <div class="relative flex items-center">
                    <input 
                      [type]="showPassword() ? 'text' : 'password'"
                      name="password"
                      [(ngModel)]="password"
                      required
                      placeholder="••••••••••••"
                      class="workora-input pl-4 pr-11 !py-2.5 text-xs w-full"
                    />
                    <button 
                      type="button" 
                      (click)="togglePasswordVisibility()"
                      class="material-symbols-outlined text-slate-400 hover:text-[#063B39] transition-colors cursor-pointer text-base absolute right-3.5 flex items-center justify-center border-none bg-transparent"
                      aria-label="Toggle password visibility"
                    >
                      {{ showPassword() ? 'visibility_off' : 'visibility' }}
                    </button>
                  </div>
                </div>

                <!-- Remember Me Checkbox -->
                <div class="flex items-center justify-between pt-1">
                  <label class="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
                    <input 
                      type="checkbox" 
                      name="rememberMe"
                      [(ngModel)]="rememberMe"
                      class="rounded border-[#DCEBE7] text-[#0E6E68] focus:ring-[#0E6E68] cursor-pointer"
                    />
                    <span>Remember me on this computer</span>
                  </label>
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  [disabled]="isLoading()"
                  class="w-full h-11 workora-btn-primary text-xs font-bold mt-1 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  @if (isLoading()) {
                    <span class="animate-spin material-symbols-outlined text-base">progress_activity</span>
                    <span>Signing in securely...</span>
                  } @else {
                    <span>Sign In to Dashboard</span>
                    <span class="material-symbols-outlined text-base">arrow_forward</span>
                  }
                </button>

              </form>

              <!-- Quick Demo Access Pills (Testing helper) -->
              <div class="pt-2 border-t border-[#DCEBE7] space-y-2">
                <div class="text-[10px] font-bold text-[#0E6E68] uppercase tracking-wider text-center">
                  Quick Demo Login Fill
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    (click)="fillDemoCredentials('admin')"
                    class="p-2 text-[11px] font-bold text-[#063B39] bg-[#fafdfc] hover:bg-[#DCEBE7]/50 border border-[#DCEBE7] rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-sm text-[#0E6E68]">admin_panel_settings</span>
                    <span>Admin Demo</span>
                  </button>
                  <button 
                    type="button"
                    (click)="fillDemoCredentials('manager')"
                    class="p-2 text-[11px] font-bold text-[#063B39] bg-[#fafdfc] hover:bg-[#DCEBE7]/50 border border-[#DCEBE7] rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-sm text-[#3FA79B]">supervisor_account</span>
                    <span>Manager Demo</span>
                  </button>
                </div>
              </div>

              <!-- New to Workora hint -->
              <div class="text-center text-xs text-slate-500 pt-1">
                New to Workora? <a routerLink="/" class="text-[#0E6E68] font-bold hover:underline cursor-pointer">Explore the platform</a>
              </div>

            </div>
          </div>

        </div>
      </main>

      <!-- Footer -->
      <footer class="relative z-10 w-full px-6 py-3.5 text-center text-xs text-slate-500 shrink-0">
        <p>&copy; 2026 Workora Inc. Crafted for healthy, productive workplaces.</p>
      </footer>
    </div>
  `
})
export class LoginPageComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  private ctx?: gsap.Context;

  email = '';
  password = '';
  rememberMe = true;

  readonly isLoading = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ctx = gsap.context(() => {
      gsap.from('.auth-card', {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      });
      gsap.from('.auth-brand-side', {
        x: -25,
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
    this.showPassword.update(prev => !prev);
  }

  fillDemoCredentials(role: 'admin' | 'manager'): void {
    if (role === 'admin') {
      this.email = 'admin@workora.com';
      this.password = 'Admin@123';
    } else {
      this.email = 'manager@workora.com';
      this.password = 'Manager@123';
    }
    this.notificationService.showInfo(`Filled ${role} demo credentials. Click Sign In.`);
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.notificationService.showWarning('Please enter both your work email and password.');
      return;
    }

    this.isLoading.set(true);

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notificationService.showSuccess('Welcome back! Loading your dashboard...');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading.set(false);
        // Error toast is automatically handled by globalErrorInterceptor with the exact backend message
      }
    });
  }
}
