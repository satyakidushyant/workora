import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type LoaderSpeed = 'fast' | 'normal' | 'slow';

/**
 * Enterprise Workora Official Logo Loader Component.
 * Features ultra-luxurious spatial design using the official Workora PNG logo emblem (/workora.png),
 * multi-layer rotating orbital energy rings, specular light sweep effect, breathing glow aura,
 * customizable size presets (xs, sm, md, lg, xl, 2xl, full), and animation speeds (fast, normal, slow).
 */
@Component({
  selector: 'app-logo-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center text-center select-none" [ngClass]="[containerClass, gapClass]">
      <!-- Workora Logo & Orbital Energy Ring Container -->
      <div class="relative flex items-center justify-center" [ngClass]="wrapperDimensions">
        
        <!-- Ambient Atmospheric Radial Glow Backdrop -->
        <div 
          *ngIf="showGlow"
          class="absolute inset-0 rounded-full bg-gradient-to-tr from-[#38bdf8]/30 via-[#4d8eff]/40 to-[#a078ff]/30 blur-xl animate-pulse pointer-events-none">
        </div>

        <!-- Outer Rotating Energy Orbital Ring 1 (Clockwise Cyan Gradient) -->
        <div 
          *ngIf="showRings"
          class="absolute inset-[-15%] rounded-full border-2 border-transparent border-t-[#38bdf8] border-r-[#4d8eff] animate-spin pointer-events-none filter drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]" 
          [style.animation-duration]="outerSpinDuration">
        </div>

        <!-- Inner Counter-Rotating Orbital Ring 2 (Counter-Clockwise Purple Gradient) -->
        <div 
          *ngIf="showRings"
          class="absolute inset-[-7%] rounded-full border-2 border-transparent border-b-[#a078ff] border-l-[#38bdf8] animate-spin-reverse pointer-events-none filter drop-shadow-[0_0_10px_rgba(160,120,255,0.6)]" 
          [style.animation-duration]="innerSpinDuration">
        </div>

        <!-- Specular Shimmer Layer Overlay -->
        <div class="relative z-10 w-full h-full rounded-2xl flex items-center justify-center overflow-hidden group">
          <!-- Workora Official PNG Emblem Image -->
          <img
            src="/workora.png"
            alt="Workora Logo"
            class="w-full h-full object-contain filter drop-shadow-[0_0_22px_rgba(77,142,255,0.65)] animate-breath pointer-events-none"
            [style.animation-duration]="breathDuration"
          />

          <!-- Specular Light Sweep Shimmer Effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer pointer-events-none"></div>
        </div>
      </div>

      <!-- Loading Typography & Dynamic Dot Pulse -->
      <div *ngIf="label" class="space-y-1 z-10 max-w-xs px-2">
        <p [ngClass]="labelSizeClass" class="font-semibold text-slate-100 tracking-wide flex items-center justify-center gap-1">
          <span>{{ label }}</span>
          <span *ngIf="showDots" class="inline-flex">
            <span class="animate-bounce inline-block" style="animation-delay: 0s;">.</span>
            <span class="animate-bounce inline-block" style="animation-delay: 0.15s;">.</span>
            <span class="animate-bounce inline-block" style="animation-delay: 0.3s;">.</span>
          </span>
        </p>
        <p *ngIf="sublabel" [ngClass]="sublabelSizeClass" class="text-slate-400 font-mono tracking-wider uppercase text-opacity-90">
          {{ sublabel }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    @keyframes breath {
      0%, 100% {
        transform: scale(0.96);
        filter: drop-shadow(0 0 14px rgba(77,142,255,0.45));
      }
      50% {
        transform: scale(1.06);
        filter: drop-shadow(0 0 28px rgba(56,189,248,0.85));
      }
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-150%) rotate(15deg);
      }
      60%, 100% {
        transform: translateX(150%) rotate(15deg);
      }
    }

    @keyframes spinReverse {
      from {
        transform: rotate(360deg);
      }
      to {
        transform: rotate(0deg);
      }
    }

    .animate-breath {
      animation: breath 3s ease-in-out infinite;
    }

    .animate-shimmer {
      animation: shimmer 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    .animate-spin-reverse {
      animation: spinReverse 1.8s linear infinite;
    }
  `]
})
export class LogoLoaderComponent {
  @Input() size: LoaderSize = 'md';
  @Input() speed: LoaderSpeed = 'normal';
  @Input() label?: string = 'Loading Workora...';
  @Input() sublabel?: string;
  @Input() showRings: boolean = true;
  @Input() showGlow: boolean = true;
  @Input() showDots: boolean = true;

  get containerClass(): string {
    return this.size === 'full' ? 'min-h-[360px] w-full p-8' : '';
  }

  get gapClass(): string {
    switch (this.size) {
      case 'xs': return 'space-y-1';
      case 'sm': return 'space-y-2';
      case 'md': return 'space-y-4';
      case 'lg': return 'space-y-5';
      case 'xl':
      case '2xl':
      case 'full': return 'space-y-6';
      default: return 'space-y-4';
    }
  }

  get wrapperDimensions(): string {
    switch (this.size) {
      case 'xs': return 'w-8 h-8';
      case 'sm': return 'w-12 h-12';
      case 'md': return 'w-20 h-20';
      case 'lg': return 'w-32 h-32';
      case 'xl': return 'w-44 h-44';
      case '2xl': return 'w-56 h-56';
      case 'full': return 'w-36 h-36';
      default: return 'w-20 h-20';
    }
  }

  get labelSizeClass(): string {
    switch (this.size) {
      case 'xs': return 'text-[10px]';
      case 'sm': return 'text-xs';
      case 'md': return 'text-sm';
      case 'lg': return 'text-base';
      case 'xl':
      case '2xl':
      case 'full': return 'text-lg font-bold';
      default: return 'text-sm';
    }
  }

  get sublabelSizeClass(): string {
    switch (this.size) {
      case 'xs':
      case 'sm': return 'text-[9px]';
      case 'md': return 'text-xs';
      case 'lg':
      case 'xl':
      case '2xl':
      case 'full': return 'text-sm';
      default: return 'text-xs';
    }
  }

  get outerSpinDuration(): string {
    switch (this.speed) {
      case 'fast': return '1.1s';
      case 'slow': return '3.5s';
      case 'normal':
      default: return '2.0s';
    }
  }

  get innerSpinDuration(): string {
    switch (this.speed) {
      case 'fast': return '0.8s';
      case 'slow': return '2.6s';
      case 'normal':
      default: return '1.5s';
    }
  }

  get breathDuration(): string {
    switch (this.speed) {
      case 'fast': return '1.6s';
      case 'slow': return '4.5s';
      case 'normal':
      default: return '3.0s';
    }
  }
}


