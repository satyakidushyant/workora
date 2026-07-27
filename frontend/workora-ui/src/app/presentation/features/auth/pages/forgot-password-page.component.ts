import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

/**
 * Enterprise HRMS Forgot Password Component.
 * Enables users to request account password recovery link via corporate email.
 */
@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex overflow-hidden bg-background">
      <div class="flex w-full min-h-screen">
        <!-- Left Side: Professional Branding -->
        <div class="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
          <!-- Background Image -->
          <div 
            class="absolute inset-0 z-0 bg-cover bg-center" 
            style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCssEZNegTTypOophZAugIVEbFGFE474rM26WFrjWnXXcv0NXqArDCv-GtGeAJg_OHVtAodg0QbVOGaPoLFn4ewzC_MsyMctkC4fukqgCyO7lk41b9lJz07UEj5RT9RjUb5B_5cVMyrFxhCr5GVg9lAWKIMpspjfuD69fh1u5EFzs3OrDSIewnRQsg7k_QJl0OWKcrat76aNtqLUetLVGykI9vxHaOiocRWzr1RFWByHiMsGtKXVpOAIcf9PX3g0a7hgyqDkGdA67-l')"
          ></div>
          
          <!-- Overlay Content -->
          <div class="relative z-10 w-full h-full glass-effect flex flex-col justify-between p-12 text-on-primary">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;">groups</span>
              <h1 class="font-headline-md text-headline-md font-extrabold tracking-tight">Workora</h1>
            </div>
            
            <div class="max-w-md">
              <h2 class="font-headline-lg text-headline-lg mb-4 font-bold text-white leading-tight">Secure Access Recovery.</h2>
              <p class="font-body-lg text-body-lg opacity-90 leading-relaxed text-gray-200">
                Your data protection is our priority. We employ enterprise-grade security protocols to ensure your HR and Payroll information remains shielded.
              </p>
            </div>
            
            <div class="font-label-md text-label-md opacity-60 text-gray-300">
              © 2026 Workora Enterprise HRMS. All rights reserved.
            </div>
          </div>
        </div>

        <!-- Right Side: Interaction Canvas -->
        <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background min-h-screen">
          <div class="w-full max-w-md flex flex-col gap-base">
            
            <!-- Back to Login Link -->
            <a routerLink="/login" class="group inline-flex items-center gap-2 text-slate-text hover:text-secondary transition-colors mb-stack-md cursor-pointer">
              <span class="material-symbols-outlined text-sm">arrow_back</span>
              <span class="font-label-md text-label-md">Back to Login</span>
            </a>

            <!-- Reset Request Card -->
            <div class="bg-surface-container-lowest p-8 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-border-subtle">
              <!-- Header -->
              <div class="mb-8">
                <div class="flex lg:hidden items-center gap-2 mb-6">
                  <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">groups</span>
                  <span class="font-headline-sm text-headline-sm font-black text-primary">Workora</span>
                </div>
                <h2 class="font-headline-md text-headline-md text-primary mb-2 font-bold">Forgot Password?</h2>
                <p class="font-body-md text-body-md text-on-surface-variant">
                  Enter your corporate email and we'll send you a link to reset your password.
                </p>
              </div>

              <!-- Error Alert Message -->
              @if (errorMessage()) {
                <div class="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 flex items-start gap-3 text-error">
                  <span class="material-symbols-outlined text-xl shrink-0">error</span>
                  <div class="font-body-sm text-body-sm">{{ errorMessage() }}</div>
                </div>
              }

              <!-- Recovery Form -->
              <form class="space-y-6" (ngSubmit)="onSubmit()">
                <div class="space-y-stack-sm">
                  <label class="font-label-md text-label-md text-primary block" for="email">Corporate Email Address</label>
                  <div class="relative">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">mail</span>
                    <input 
                      class="w-full pl-10 pr-4 py-3 rounded-lg border border-border-subtle bg-surface-container-low text-primary font-body-md focus:ring-2 focus:ring-secondary-container focus:border-secondary outline-none transition-all placeholder:text-outline-variant" 
                      id="email" 
                      name="email" 
                      [(ngModel)]="email"
                      placeholder="e.g. name@company.com" 
                      required 
                      type="email"
                    />
                  </div>
                </div>

                <button 
                  [disabled]="isLoading() || isSubmitted()" 
                  [ngClass]="{
                    'bg-secondary hover:bg-secondary-container': !isSubmitted(),
                    'bg-success opacity-90': isSubmitted()
                  }"
                  class="w-full text-on-secondary py-3.5 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm disabled:cursor-not-allowed" 
                  type="submit"
                >
                  @if (isLoading()) {
                    <span class="animate-spin material-symbols-outlined text-sm">sync</span>
                    <span>Processing...</span>
                  } @else if (isSubmitted()) {
                    <span class="material-symbols-outlined text-sm">check_circle</span>
                    <span>Link Sent</span>
                  } @else {
                    <span>Send Reset Link</span>
                    <span class="material-symbols-outlined text-sm">send</span>
                  }
                </button>
              </form>

              <!-- Success Notification Banner -->
              @if (isSubmitted()) {
                <div class="mt-6 p-4 rounded-lg bg-success/10 border border-success/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <span class="material-symbols-outlined text-success shrink-0 mt-0.5">check_circle</span>
                  <div>
                    <p class="font-label-md text-label-md text-success font-bold">Recovery link sent!</p>
                    <p class="font-body-sm text-body-sm text-success opacity-90 mt-0.5">
                      Please check your inbox and follow the instructions to secure your account.
                    </p>
                  </div>
                </div>
              }
            </div>

            <!-- Footer Support -->
            <div class="mt-8 text-center">
              <p class="font-body-sm text-body-sm text-slate-text">
                Having trouble? <a (click)="onContactAdmin($event)" class="text-secondary font-semibold hover:underline cursor-pointer">Contact System Administrator</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .glass-effect {
      background: rgba(22, 24, 44, 0.75);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
  `]
})
export class ForgotPasswordPageComponent {
  /**
   * AuthService instance injected for handling recovery API requests.
   */
  private readonly authService: AuthService = inject(AuthService) as AuthService;

  /**
   * Router instance injected for navigation.
   */
  private readonly router: Router = inject(Router) as Router;

  /**
   * Model storing input email address.
   */
  email = '';

  /**
   * Signal indicating active HTTP request.
   */
  readonly isLoading = signal<boolean>(false);

  /**
   * Signal indicating successful reset link dispatch state.
   */
  readonly isSubmitted = signal<boolean>(false);

  /**
   * Signal holding error feedback message.
   */
  readonly errorMessage = signal<string | null>(null);

  /**
   * Submits password recovery link request.
   */
  onSubmit(): void {
    if (!this.email) {
      this.errorMessage.set('Please enter your corporate email address.');
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.forgotPassword({ email: this.email }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSubmitted.set(true);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.message || 'Unable to process recovery request. Please verify your email.');
      }
    });
  }

  /**
   * Handles contact administrator click action.
   * 
   * @param event DOM Event
   */
  onContactAdmin(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('Please contact IT Desk or HR Administrator for manual account recovery.');
  }
}
