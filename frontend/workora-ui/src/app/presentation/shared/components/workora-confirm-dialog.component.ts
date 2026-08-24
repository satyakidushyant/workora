import { Component, Input, Output, EventEmitter, ElementRef, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

/**
 * Reusable Enterprise Workora Confirmation Dialog Component.
 * Styled with soft glass backdrop, danger/warning/info variants, and smooth GSAP entrance.
 */
@Component({
  selector: 'app-workora-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div 
        (click)="onBackdropClick($event)"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#063B39]/50 backdrop-blur-xs dialog-backdrop animate-in fade-in duration-200"
      >
        <div class="relative w-full max-w-md bg-white border border-[#DCEBE7] rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden dialog-card">
          
          <!-- Top Icon & Header -->
          <div class="flex items-start gap-4">
            <div 
              [ngClass]="{
                'bg-red-50 text-red-600 border-red-200/80': variant === 'danger',
                'bg-amber-50 text-amber-600 border-amber-200/80': variant === 'warning',
                'bg-[#DCEBE7] text-[#0E6E68] border-[#0E6E68]/20': variant === 'info'
              }"
              class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs"
            >
              <span class="material-symbols-outlined text-2xl">{{ iconName }}</span>
            </div>

            <div class="space-y-1 flex-1">
              <h3 class="text-lg font-extrabold text-[#063B39] font-heading tracking-tight">
                {{ title }}
              </h3>
              <p class="text-xs text-[#6B7F7C] leading-relaxed">
                {{ message }}
              </p>
            </div>
          </div>

          <!-- Actions Footer -->
          <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#DCEBE7]">
            <button 
              type="button" 
              (click)="cancel.emit()" 
              [disabled]="isLoading"
              class="workora-btn-secondary text-xs px-4 py-2"
            >
              {{ cancelText }}
            </button>
            <button 
              type="button" 
              (click)="confirm.emit()" 
              [disabled]="isLoading"
              [ngClass]="variant === 'danger' ? 'workora-btn-danger' : 'workora-btn-primary'"
              class="text-xs px-5 py-2"
            >
              @if (isLoading) {
                <span class="material-symbols-outlined text-base animate-spin">progress_activity</span>
                <span>Processing...</span>
              } @else {
                <span>{{ confirmText }}</span>
              }
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class WorkoraConfirmDialogComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private ctx?: gsap.Context;

  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed with this operation?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() variant: 'danger' | 'warning' | 'info' = 'danger';
  @Input() isLoading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get iconName(): string {
    if (this.variant === 'danger') return 'warning';
    if (this.variant === 'warning') return 'report_problem';
    return 'info';
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.ctx = gsap.context(() => {}, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-backdrop') && !this.isLoading) {
      this.cancel.emit();
    }
  }
}
