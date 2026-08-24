import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthShaderComponent } from '../components/auth-shader.component';

/**
 * Enterprise HRMS Forgot Password Component.
 * Enables users to request account password recovery link via corporate email
 * with modern Workora SaaS aesthetic and GSAP entrance animations.
 */
@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShaderComponent],
  template: `
    <div class="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden flex flex-col justify-between font-sans text-[#163331] bg-[#F4F8F7] relative antialiased selection:bg-[#DCEBE7] selection:text-[#063B39]">
      <app-auth-shader></app-auth-shader>

      <!-- Header Navigation: Big 3D Logo Only -->
      <header class="relative z-10 w-full px-4 xs:px-6 md:px-12 py-3 xs:py-4 md:py-5 flex justify-between items-center max-w-7xl 2xl:max-w-8xl mx-auto shrink-0">
        <a routerLink="/" class="flex items-center cursor-pointer group focus:outline-none" aria-label="Workora Home">
          <img 
            alt="Workora 3D Logo" 
            src="/workoraLogo.png" 
            class="h-9 xs:h-11 sm:h-13 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_6px_14px_rgba(14,110,104,0.22)] group-hover:drop-shadow-[0_8px_20px_rgba(63,167,155,0.35)]"
          />
        </a>

        <div class="flex items-center gap-4">
          <a routerLink="/login" class="text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-base">arrow_back</span>
            <span class="hidden xs:inline">Back to Sign In</span>
          </a>
        </div>
      </header>

      <!-- Central Card Container -->
      <main class="relative z-10 w-full max-w-md px-3.5 xs:px-6 py-4 mx-auto my-auto overflow-y-auto lg:overflow-visible">
        
        <div class="bg-white rounded-2xl sm:rounded-3xl p-5 xs:p-7 sm:p-8 border border-[#DCEBE7] shadow-lg relative auth-card">
          
          <!-- Header -->
          <div class="text-center mb-5 space-y-1">
            <div class="inline-flex p-2.5 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] mb-1">
              <span class="material-symbols-outlined text-2xl">lock_reset</span>
            </div>
            <h1 class="text-xl sm:text-2xl font-extrabold text-[#063B39] tracking-tight font-heading">Reset Password</h1>
            <p class="text-xs text-[#6B7F7C] leading-relaxed">
              Enter your corporate email and we'll send you an encrypted recovery link.
            </p>
          </div>

          <!-- Error Alert Banner -->
          @if (errorMessage()) {
            <div class="mb-4 p-3 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-red-700 text-xs animate-in fade-in duration-200">
              <span class="material-symbols-outlined text-base shrink-0 mt-0.5 text-red-600">error</span>
              <div class="font-medium leading-relaxed">{{ errorMessage() }}</div>
            </div>
          }

          <!-- Form -->
          <form class="space-y-3.5" (ngSubmit)="onSubmit()">
            <div class="space-y-1 auth-field">
              <label class="workora-label !mb-1" for="email">Corporate Email</label>
              <div class="relative flex items-center">
                <input 
                  class="workora-input pl-4 pr-11 !py-2.5 text-xs" 
                  id="email" 
                  name="email"
                  [(ngModel)]="email"
                  placeholder="admin@workora.com" 
                  required 
                  type="email"
                />
                <span class="material-symbols-outlined text-[#3FA79B] absolute right-3.5 text-base pointer-events-none">mail</span>
              </div>
            </div>

            <button 
              [disabled]="isLoading() || isSubmitted()" 
              class="w-full h-11 workora-btn-primary text-xs disabled:opacity-75" 
              type="submit"
            >
              @if (isLoading()) {
                <span class="animate-spin material-symbols-outlined text-base">progress_activity</span>
                <span>Processing...</span>
              } @else if (isSubmitted()) {
                <span class="material-symbols-outlined text-base">check_circle</span>
                <span>Reset Link Sent</span>
              } @else {
                <span>Send Recovery Link</span>
                <span class="material-symbols-outlined text-base">send</span>
              }
            </button>
          </form>

          <!-- Success Notification Banner -->
          @if (isSubmitted()) {
            <div class="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5 text-emerald-800 text-xs animate-in fade-in duration-200">
              <span class="material-symbols-outlined text-emerald-600 shrink-0 mt-0.5 text-base">check_circle</span>
              <div>
                <p class="font-bold">Recovery email dispatched</p>
                <p class="opacity-90 mt-0.5 leading-relaxed">
                  Please check your inbox and follow the secure instructions to set a new password.
                </p>
              </div>
            </div>
          }

          <!-- Back to Login -->
          <div class="mt-5 pt-3.5 border-t border-[#DCEBE7] text-center">
            <a routerLink="/login" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-base">arrow_back</span>
              <span>Back to Sign In</span>
            </a>
          </div>
        </div>

        <div class="mt-4 text-center text-xs text-[#6B7F7C]">
          Having trouble? <a (click)="onContactAdmin($event)" class="text-[#0E6E68] font-bold hover:underline cursor-pointer">Contact IT Support</a>
        </div>
      </main>

      <!-- Footer -->
      <footer class="relative z-10 w-full px-6 py-3 text-center text-[11px] text-[#6B7F7C] shrink-0">
        <p>© 2026 Workora HRMS. All rights reserved.</p>
      </footer>
    </div>
  `
})
export class ForgotPasswordPageComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly authService: AuthService = inject(AuthService) as AuthService;
  private readonly notificationService: NotificationService = inject(NotificationService) as NotificationService;

  private ctx?: gsap.Context;

  email = '';
  readonly isLoading = signal<boolean>(false);
  readonly isSubmitted = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ctx = gsap.context(() => {
      gsap.from('.auth-card', {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      });
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  onSubmit(): void {
    if (!this.email) {
      const msg = 'Please enter your corporate email address.';
      this.errorMessage.set(msg);
      this.notificationService.showWarning(msg);
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.forgotPassword({ email: this.email }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSubmitted.set(true);
        this.notificationService.showSuccess('Recovery link dispatched to your corporate email address.');
      },
      error: (err: any) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || err?.message || 'Unable to process recovery request. Please verify your email.';
        this.errorMessage.set(msg);
        this.notificationService.showError(msg);
      }
    });
  }

  onContactAdmin(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('Please contact IT Desk or HR Administrator for manual account recovery.');
  }
}
