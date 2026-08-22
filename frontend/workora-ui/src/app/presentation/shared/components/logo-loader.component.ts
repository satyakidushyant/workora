import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type LoaderSpeed = 'fast' | 'normal' | 'slow';

/**
 * Enterprise Workora Lightweight Branded Loader Component.
 * Features rotating teal accent rings, soft pulse, and Workora emblem for inline component loading states.
 */
@Component({
  selector: 'app-logo-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center text-center select-none py-6" [ngClass]="containerClass">
      <!-- Workora Logo with smooth spinner ring -->
      <div class="relative flex items-center justify-center" [ngClass]="wrapperDimensions">
        
        <!-- Rotating Brand Accent Ring -->
        <div 
          *ngIf="showRings"
          class="absolute inset-[-12%] rounded-full border-2 border-transparent border-t-[#0E6E68] border-r-[#3FA79B] animate-spin pointer-events-none">
        </div>

        <!-- Workora Emblem -->
        <div class="relative z-10 w-full h-full rounded-full flex items-center justify-center bg-white p-1 shadow-sm border border-[#DCEBE7]">
          <img
            src="/workoraLogo.png"
            alt="Workora Logo"
            class="w-full h-full object-contain pointer-events-none drop-shadow-xs"
          />
        </div>
      </div>

      <!-- Loading Label -->
      <div *ngIf="label" class="mt-3 space-y-0.5 z-10 max-w-xs px-2">
        <p class="text-xs font-bold text-[#063B39] tracking-wide flex items-center justify-center gap-1">
          <span>{{ label }}</span>
          <span *ngIf="showDots" class="inline-flex">
            <span class="animate-bounce inline-block" style="animation-delay: 0s;">.</span>
            <span class="animate-bounce inline-block" style="animation-delay: 0.15s;">.</span>
            <span class="animate-bounce inline-block" style="animation-delay: 0.3s;">.</span>
          </span>
        </p>
        <p *ngIf="sublabel" class="text-[11px] text-[#6B7F7C]">
          {{ sublabel }}
        </p>
      </div>
    </div>
  `
})
export class LogoLoaderComponent {
  @Input() size: LoaderSize = 'md';
  @Input() speed: LoaderSpeed = 'normal';
  @Input() label?: string = 'Loading...';
  @Input() sublabel?: string;
  @Input() showRings: boolean = true;
  @Input() showGlow: boolean = false;
  @Input() showDots: boolean = true;

  get containerClass(): string {
    return this.size === 'full' ? 'min-h-[220px] w-full' : '';
  }

  get wrapperDimensions(): string {
    switch (this.size) {
      case 'xs': return 'w-7 h-7';
      case 'sm': return 'w-9 h-9';
      case 'md': return 'w-12 h-12';
      case 'lg': return 'w-16 h-16';
      case 'xl':
      case '2xl':
      case 'full': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  }
}
