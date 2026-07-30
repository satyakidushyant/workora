import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthShaderComponent } from '../components/auth-shader.component';

/**
 * Enterprise HRMS Forgot Password Component.
 * Enables users to request account password recovery link via corporate email
 * with WebGL liquid mesh shader background and glassmorphic UI.
 */
@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShaderComponent],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center font-body-md text-on-surface selection:bg-primary/30 relative overflow-x-hidden bg-[#0d1320] antialiased">
      <!-- WebGL Shader Background & Interactive Atmospheric Orbs -->
      <app-auth-shader></app-auth-shader>

      <main class="relative z-10 w-full max-w-md px-6 py-12 my-auto">
        <!-- Top Branding -->
        <div class="flex flex-col items-center mb-8">
          <div class="flex items-center gap-3 mb-2 cursor-pointer" routerLink="/">
            <img alt="Workora Logo" class="h-10 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(77,142,255,0.5)]" src="/workora.png"/>
            <span class="font-display-lg text-2xl font-bold tracking-tight text-on-surface">Workora</span>
          </div>
        </div>

        <!-- Central Glass Card -->
        <div class="glass-card bg-surface-container-low/60 rounded-2xl p-8 relative overflow-hidden">
          <!-- Icon Header -->
          <div class="flex flex-col items-center text-center mb-8">
            <div class="relative mb-4">
              <div class="absolute inset-0 bg-secondary/20 blur-xl rounded-full"></div>
              <div class="relative w-16 h-16 rounded-full bg-secondary-container/20 border border-secondary/30 flex items-center justify-center">
                <span class="material-symbols-outlined text-secondary text-3xl" style="font-variation-settings: 'FILL' 1;">lock_reset</span>
              </div>
            </div>
            <h1 class="font-headline-md text-2xl font-bold text-on-surface mb-2">Forgot Password?</h1>
            <p class="font-body-md text-sm text-on-surface-variant max-w-[280px]">
              Enter your corporate email and we'll send you a link to reset your password.
            </p>
          </div>

          <!-- Error Alert Banner -->
          @if (errorMessage()) {
            <div class="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3 text-error">
              <span class="material-symbols-outlined text-xl shrink-0 mt-0.5">error</span>
              <div class="font-body-sm text-xs">{{ errorMessage() }}</div>
            </div>
          }

          <!-- Form -->
          <form class="space-y-6" (ngSubmit)="onSubmit()">
            <div class="space-y-1">
              <label class="font-label-sm text-xs text-on-surface-variant ml-1 uppercase tracking-wider font-semibold" for="email">Corporate Email</label>
              <div class="input-focus-expand relative flex items-center border-b-2 border-white/10 py-2 transition-colors duration-300">
                <span class="material-symbols-outlined text-outline absolute left-0 text-xl pointer-events-none">mail</span>
                <input 
                  class="w-full bg-transparent border-none focus:ring-0 text-sm text-on-surface pl-8 pr-2 placeholder:text-outline/50 outline-none" 
                  id="email" 
                  name="email"
                  [(ngModel)]="email"
                  placeholder="name@company.com" 
                  required 
                  type="email"
                />
              </div>
            </div>

            <button 
              [disabled]="isLoading() || isSubmitted()" 
              class="w-full bg-gradient-to-r from-primary-container to-secondary py-3.5 rounded-full font-bold text-on-primary-container hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75" 
              type="submit"
            >
              @if (isLoading()) {
                <span class="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                <span>Processing...</span>
              } @else if (isSubmitted()) {
                <span class="material-symbols-outlined text-lg">check_circle</span>
                <span>Reset Link Sent</span>
              } @else {
                <span>Send Reset Link</span>
                <span class="material-symbols-outlined text-lg">send</span>
              }
            </button>
          </form>

          <!-- Success Notification Banner -->
          @if (isSubmitted()) {
            <div class="mt-6 p-4 rounded-xl bg-secondary/10 border border-secondary/30 flex items-start gap-3 animate-in fade-in duration-300">
              <span class="material-symbols-outlined text-secondary shrink-0 mt-0.5">check_circle</span>
              <div>
                <p class="font-label-sm text-xs text-secondary font-bold">Recovery link sent!</p>
                <p class="font-body-sm text-xs text-on-surface-variant opacity-90 mt-0.5 leading-relaxed">
                  Please check your corporate inbox and follow instructions to update password.
                </p>
              </div>
            </div>
          }

          <!-- Back to Login -->
          <div class="mt-8 pt-6 border-t border-white/5 text-center">
            <a routerLink="/login" class="inline-flex items-center gap-2 font-label-sm text-xs text-on-surface-variant hover:text-primary transition-colors group cursor-pointer">
              <span class="material-symbols-outlined text-lg transition-transform duration-300 group-hover:-translate-x-1">arrow_back</span>
              <span>Back to Login</span>
            </a>
          </div>
        </div>

        <!-- Footer Support & Copyright -->
        <div class="mt-8 text-center space-y-2">
          <p class="font-body-sm text-xs text-on-surface-variant">
            Having trouble? <a (click)="onContactAdmin($event)" class="text-secondary font-semibold hover:underline cursor-pointer">Contact System Administrator</a>
          </p>
          <p class="font-label-sm text-xs text-outline/60">
            © 2026 Workora Enterprise. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(26, 32, 44, 0.45);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: inset 1px 1px 0px rgba(255, 255, 255, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      transition: border-color 0.3s ease;
    }

    .glass-card:hover {
      border-color: rgba(255, 255, 255, 0.25);
    }

    .input-focus-expand {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .input-focus-expand:focus-within {
      border-bottom-color: #adc6ff;
      box-shadow: 0 10px 20px -10px rgba(173, 198, 255, 0.3);
    }
  `]
})
export class ForgotPasswordPageComponent {

  private readonly authService: AuthService = inject(AuthService) as AuthService;
  private readonly notificationService: NotificationService = inject(NotificationService) as NotificationService;
  private readonly router: Router = inject(Router) as Router;

  /**
   * Model storing input corporate email address.
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
