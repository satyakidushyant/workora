import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ToastItem } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-[9999] flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      <div
        *ngFor="let toast of notificationService.toasts()"
        class="pointer-events-auto p-4 rounded-2xl border backdrop-blur-2xl shadow-2xl transition-all duration-300 transform animate-slide-in relative overflow-hidden group"
        [ngClass]="getToastStyles(toast.type)">
        
        <!-- Subtle Glow Effect -->
        <div class="absolute -right-10 -bottom-10 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-30"
             [ngClass]="getGlowBg(toast.type)"></div>

        <div class="flex items-start justify-between space-x-3 relative z-10">
          <!-- Icon -->
          <div class="p-2 rounded-xl flex-shrink-0" [ngClass]="getIconBg(toast.type)">
            <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg *ngIf="toast.type === 'warning'" class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg *ngIf="toast.type === 'info'" class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 pt-0.5">
            <h4 class="text-sm font-semibold tracking-tight text-white leading-snug">
              {{ toast.message }}
            </h4>
            <ul *ngIf="toast.details && toast.details.length > 0" class="mt-1.5 space-y-1 text-xs text-slate-300 list-disc list-inside">
              <li *ngFor="let detail of toast.details">{{ detail }}</li>
            </ul>
          </div>

          <!-- Dismiss Button -->
          <button
            (click)="notificationService.removeToast(toast.id)"
            class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .animate-slide-in {
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class ToastContainerComponent {
  readonly notificationService: NotificationService = inject(NotificationService);

  getToastStyles(type: ToastItem['type']): string {
    switch (type) {
      case 'success':
        return 'bg-slate-900/90 border-emerald-500/40 text-emerald-100 shadow-emerald-500/10';
      case 'error':
        return 'bg-slate-900/90 border-rose-500/40 text-rose-100 shadow-rose-500/10';
      case 'warning':
        return 'bg-slate-900/90 border-amber-500/40 text-amber-100 shadow-amber-500/10';
      case 'info':
      default:
        return 'bg-slate-900/90 border-indigo-500/40 text-indigo-100 shadow-indigo-500/10';
    }
  }

  getIconBg(type: ToastItem['type']): string {
    switch (type) {
      case 'success': return 'bg-emerald-500/10 border border-emerald-500/20';
      case 'error': return 'bg-rose-500/10 border border-rose-500/20';
      case 'warning': return 'bg-amber-500/10 border border-amber-500/20';
      case 'info': default: return 'bg-indigo-500/10 border border-indigo-500/20';
    }
  }

  getGlowBg(type: ToastItem['type']): string {
    switch (type) {
      case 'success': return 'bg-emerald-500';
      case 'error': return 'bg-rose-500';
      case 'warning': return 'bg-amber-500';
      case 'info': default: return 'bg-indigo-500';
    }
  }
}
