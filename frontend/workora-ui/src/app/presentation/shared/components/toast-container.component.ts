import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ToastItem } from '../../../core/services/notification.service';

/**
 * Workora Branded Toast Notification Component.
 * Styled in Workora's signature deep forest teal (#063B39), mint accent (#3FA79B),
 * and light sage (#DCEBE7) with smooth animations and auto-dismiss progress.
 */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 sm:top-5 right-3 sm:right-5 z-[99999] flex flex-col space-y-3 max-w-[380px] sm:max-w-sm w-full pointer-events-none px-2 sm:px-0">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto p-4 rounded-2xl sm:rounded-3xl border backdrop-blur-2xl transition-all duration-300 transform animate-slide-in relative overflow-hidden group shadow-2xl"
          [ngClass]="getToastStyles(toast.type)"
        >
          
          <!-- Subtle Glow in Workora Brand Colors -->
          <div 
            class="absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-25"
            [ngClass]="getGlowBg(toast.type)"
          ></div>

          <div class="flex items-start justify-between gap-3 relative z-10">
            <!-- Icon Badge -->
            <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner" [ngClass]="getIconBg(toast.type)">
              @if (toast.type === 'success') {
                <span class="material-symbols-outlined text-xl text-[#3FA79B]">check_circle</span>
              }
              @if (toast.type === 'error') {
                <span class="material-symbols-outlined text-xl text-rose-400">error</span>
              }
              @if (toast.type === 'warning') {
                <span class="material-symbols-outlined text-xl text-amber-400">warning</span>
              }
              @if (toast.type === 'info') {
                <span class="material-symbols-outlined text-xl text-[#3FA79B]">info</span>
              }
            </div>

            <!-- Content Area -->
            <div class="flex-1 min-w-0 pt-0.5">
              <h4 class="text-xs sm:text-sm font-bold text-white leading-snug">
                {{ toast.message }}
              </h4>
              @if (toast.details && toast.details.length > 0) {
                <ul class="mt-1.5 space-y-0.5 text-[11px] text-[#DCEBE7]/80 list-disc list-inside">
                  @for (detail of toast.details; track detail) {
                    <li>{{ detail }}</li>
                  }
                </ul>
              }
            </div>

            <!-- Dismiss Button -->
            <button
              type="button"
              (click)="notificationService.removeToast(toast.id)"
              class="text-[#DCEBE7]/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer border-none bg-transparent"
              aria-label="Dismiss notification"
            >
              <span class="material-symbols-outlined text-base flex items-center justify-center">close</span>
            </button>
          </div>

          <!-- Bottom Progress Bar in Workora Mint/Brand Tone -->
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
            <div 
              class="h-full animate-toast-progress" 
              [ngClass]="getProgressBarStyles(toast.type)"
              [style.animation-duration.ms]="toast.duration || 4000"
            ></div>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-16px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes toastProgress {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    .animate-slide-in {
      animation: slideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .animate-toast-progress {
      animation: toastProgress linear forwards;
    }
  `]
})
export class ToastContainerComponent {
  readonly notificationService = inject(NotificationService);

  getToastStyles(type: ToastItem['type']): string {
    switch (type) {
      case 'success':
        return 'bg-[#063B39]/95 border-[#3FA79B]/40 text-white shadow-[0_14px_35px_-6px_rgba(6,59,57,0.45)]';
      case 'error':
        return 'bg-[#063B39]/95 border-rose-500/50 text-white shadow-[0_14px_35px_-6px_rgba(239,68,68,0.3)]';
      case 'warning':
        return 'bg-[#063B39]/95 border-amber-500/50 text-white shadow-[0_14px_35px_-6px_rgba(245,158,11,0.3)]';
      case 'info':
      default:
        return 'bg-[#063B39]/95 border-[#0E6E68]/60 text-white shadow-[0_14px_35px_-6px_rgba(14,110,104,0.45)]';
    }
  }

  getIconBg(type: ToastItem['type']): string {
    switch (type) {
      case 'success':
        return 'bg-[#3FA79B]/20 text-[#3FA79B] border border-[#3FA79B]/30';
      case 'error':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'info':
      default:
        return 'bg-[#0E6E68]/30 text-[#3FA79B] border border-[#3FA79B]/30';
    }
  }

  getGlowBg(type: ToastItem['type']): string {
    switch (type) {
      case 'success':
        return 'bg-[#3FA79B]';
      case 'error':
        return 'bg-rose-500';
      case 'warning':
        return 'bg-amber-500';
      case 'info':
      default:
        return 'bg-[#0E6E68]';
    }
  }

  getProgressBarStyles(type: ToastItem['type']): string {
    switch (type) {
      case 'success':
        return 'bg-[#3FA79B]';
      case 'error':
        return 'bg-rose-400';
      case 'warning':
        return 'bg-amber-400';
      case 'info':
      default:
        return 'bg-[#3FA79B]';
    }
  }
}
