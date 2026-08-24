import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthShaderComponent } from '../components/auth-shader.component';

/**
 * Workora Forgot Password Component.
 * Clean, supportive recovery screen with feedback delivered via toaster notifications.
 */
@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShaderComponent],
  template: `
    <div class="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden flex flex-col justify-between font-sans text-[#163331] bg-[#F4F8F7] relative antialiased selection:bg-[#DCEBE7] selection:text-[#063B39]">
      <app-auth-shader></app-auth-shader>

      <!-- Header Navigation -->
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
          <a routerLink="/login" class="text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Sign In</span>
          </a>
        </div>
      </header>

      <!-- Central Card Container -->
      <main class="relative z-10 w-full max-w-md px-3.5 xs:px-6 py-4 mx-auto my-auto overflow-y-auto lg:overflow-visible">
        
        <div class="bg-white rounded-3xl p-6 xs:p-8 border border-[#DCEBE7] shadow-xl relative auth-card">
          
          <!-- Header -->
          <div class="text-center mb-5 space-y-1">
            <div class="inline-flex p-3 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] mb-1">
              <span class="material-symbols-outlined text-2xl">lock_reset</span>
            </div>
            <h1 class="text-xl sm:text-2xl font-extrabold text-[#063B39] tracking-tight font-heading">Forgot your password?</h1>
            <p class="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Enter your work email and we'll send you a secure link to reset it.
            </p>
          </div>

          <!-- Form -->
          <form class="space-y-4" (ngSubmit)="onSubmit()">
            <div class="space-y-1 auth-field">
              <label class="text-xs font-bold text-[#063B39]" for="email">Work Email Address</label>
              <div class="relative flex items-center">
                <input 
                  class="workora-input pl-4 pr-11 !py-2.5 text-xs w-full" 
                  id="email" 
                  name="email"
                  [(ngModel)]="email"
                  placeholder="you@company.com" 
                  required 
                  type="email"
                />
                <span class="material-symbols-outlined text-[#3FA79B] absolute right-3.5 text-base pointer-events-none">mail</span>
              </div>
            </div>

            <button 
              [disabled]="isLoading() || isSubmitted()" 
              class="w-full h-11 workora-btn-primary text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75" 
              type="submit"
            >
              @if (isLoading()) {
                <span class="animate-spin material-symbols-outlined text-base">progress_activity</span>
                <span>Sending link...</span>
              } @else if (isSubmitted()) {
                <span class="material-symbols-outlined text-base">check_circle</span>
                <span>Reset Link Dispatched</span>
              } @else {
                <span>Send Password Reset Link</span>
                <span class="material-symbols-outlined text-base">send</span>
              }
            </button>
          </form>

          <!-- Success Notification Card -->
          @if (isSubmitted()) {
            <div class="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-xs animate-in fade-in duration-200">
              <span class="material-symbols-outlined text-emerald-600 shrink-0 mt-0.5 text-lg">check_circle</span>
              <div>
                <p class="font-bold">Check your inbox!</p>
                <p class="opacity-90 mt-0.5 leading-relaxed">
                  We've sent recovery instructions to <strong>{{ email }}</strong>. Click the link in the email to choose a new password.
                </p>
              </div>
            </div>
          }

          <!-- Back to Login -->
          <div class="mt-6 pt-4 border-t border-[#DCEBE7] text-center">
            <a routerLink="/login" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E6E68] hover:text-[#063B39] transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-base">arrow_back</span>
              <span>Remember your password? Sign In</span>
            </a>
          </div>
        </div>

        <div class="mt-4 text-center text-xs text-slate-500">
          Still stuck? <a (click)="onContactAdmin($event)" class="text-[#0E6E68] font-bold hover:underline cursor-pointer">Contact your HR Administrator</a>
        </div>
      </main>

      <!-- Footer -->
      <footer class="relative z-10 w-full px-6 py-3.5 text-center text-xs text-slate-500 shrink-0">
        <p>&copy; 2026 Workora Inc. Secure password recovery portal.</p>
      </footer>
    </div>
  `
})
export class ForgotPasswordPageComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  private ctx?: gsap.Context;

  email = '';
  readonly isLoading = signal<boolean>(false);
  readonly isSubmitted = signal<boolean>(false);

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
      this.notificationService.showWarning('Please enter your work email address.');
      return;
    }

    this.isLoading.set(true);

    this.authService.forgotPassword({ email: this.email }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSubmitted.set(true);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onContactAdmin(event: Event): void {
    event.preventDefault();
    this.notificationService.showInfo('For account recovery assistance, please reach out to your HR department or admin@workora.com.');
  }
}
