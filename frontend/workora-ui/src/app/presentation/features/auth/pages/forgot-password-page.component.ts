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
    <div class="min-h-screen flex flex-col justify-between font-sans text-[#163331] bg-[#F4F8F7] relative overflow-x-hidden antialiased selection:bg-[#DCEBE7] selection:text-[#063B39]">
      <app-auth-shader></app-auth-shader>

      <!-- Header Navigation -->
      <header class="relative z-10 w-full px-6 md:px-12 py-5 flex justify-between items-center max-w-7xl mx-auto">
        <a routerLink="/" class="flex items-center gap-3 cursor-pointer group text-decoration-none">
          <img alt="Workora Logo" class="h-9 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-xs" src="/workoraLogo.png"/>
          <span class="text-2xl font-extrabold tracking-tight text-[#063B39] font-heading flex items-center">
            Workora
            <span class="w-1.5 h-1.5 rounded-full bg-[#0E6E68] ml-1"></span>
          </span>
        </a>
      </header>

      <!-- Central Card Container -->
      <main class="relative z-10 w-full max-w-md px-6 py-8 mx-auto my-auto">
        
        <div class="bg-white rounded-3xl p-8 sm:p-10 border border-[#DCEBE7] shadow-lg relative auth-card">
          
          <!-- Header -->
          <div class="text-center mb-6 space-y-2">
            <div class="inline-flex p-3 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] mb-1">
              <span class="material-symbols-outlined text-3xl">lock_reset</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">Reset Password</h1>
            <p class="text-xs sm:text-sm text-[#6B7F7C] leading-relaxed">
              Enter your corporate email and we'll send you an encrypted recovery link.
            </p>
          </div>

          <!-- Error Alert Banner -->
          @if (errorMessage()) {
            <div class="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-red-700 text-xs animate-in fade-in duration-200">
              <span class="material-symbols-outlined text-lg shrink-0 mt-0.5 text-red-600">error</span>
              <div class="font-medium leading-relaxed">{{ errorMessage() }}</div>
            </div>
          }

          <!-- Form -->
          <form class="space-y-4" (ngSubmit)="onSubmit()">
            <div class="space-y-1.5 auth-field">
              <label class="text-xs font-bold text-[#063B39] uppercase tracking-wider" for="email">Corporate Email</label>
              <div class="relative flex items-center">
                <input 
                  class="workora-input pr-10" 
                  id="email" 
                  name="email"
                  [(ngModel)]="email"
                  placeholder="admin@workora.com" 
                  required 
                  type="email"
                />
                <span class="material-symbols-outlined text-[#3FA79B] absolute right-3.5 text-lg pointer-events-none">mail</span>
              </div>
            </div>

            <button 
              [disabled]="isLoading() || isSubmitted()" 
              class="w-full h-12 workora-btn-primary disabled:opacity-75" 
              type="submit"
            >
              @if (isLoading()) {
                <span class="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                <span>Processing...</span>
              } @else if (isSubmitted()) {
                <span class="material-symbols-outlined text-lg">check_circle</span>
                <span>Reset Link Sent</span>
              } @else {
                <span>Send Recovery Link</span>
                <span class="material-symbols-outlined text-lg">send</span>
              }
            </button>
          </form>

          <!-- Success Notification Banner -->
          @if (isSubmitted()) {
            <div class="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5 text-emerald-800 text-xs animate-in fade-in duration-200">
              <span class="material-symbols-outlined text-emerald-600 shrink-0 mt-0.5 text-lg">check_circle</span>
              <div>
                <p class="font-bold">Recovery email dispatched</p>
                <p class="opacity-90 mt-0.5 leading-relaxed">
                  Please check your inbox and follow the secure instructions to set a new password.
                </p>
              </div>
            </div>
          }

          <!-- Back to Login -->
          <div class="mt-6 pt-4 border-t border-[#DCEBE7] text-center">
            <a routerLink="/login" class="inline-flex items-center gap-2 text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-base">arrow_back</span>
              <span>Back to Sign In</span>
            </a>
          </div>
        </div>

        <div class="mt-6 text-center text-xs text-[#6B7F7C]">
          Having trouble? <a (click)="onContactAdmin($event)" class="text-[#0E6E68] font-bold hover:underline cursor-pointer">Contact IT Support</a>
        </div>
      </main>

      <!-- Footer -->
      <footer class="relative z-10 w-full px-6 py-4 text-center text-xs text-[#6B7F7C]">
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
        const msg = err?.message || 'Unable to process recovery request. Please verify your email.';
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
