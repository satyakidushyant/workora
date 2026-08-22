import { Component, ElementRef, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

/**
 * Enterprise Auth Ambient Background Component.
 * Renders high-performance organic ambient light glows and subtle floating mesh
 * in Workora brand palette (#063B39, #0E6E68, #3FA79B, #DCEBE7).
 */
@Component({
  selector: 'app-auth-shader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#F4F8F7]">
      <!-- Background Mesh / Grid Lines -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#063b3908_1px,transparent_1px),linear-gradient(to_bottom,#063b3908_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <!-- Organic Ambient Light Orbs -->
      <div #orb1 class="auth-orb absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#3FA79B]/15 rounded-full blur-[140px] transform-gpu"></div>
      <div #orb2 class="auth-orb absolute top-1/4 -right-40 w-[550px] h-[550px] bg-[#0E6E68]/15 rounded-full blur-[150px] transform-gpu"></div>
      <div #orb3 class="auth-orb absolute -bottom-40 left-1/4 w-[650px] h-[650px] bg-[#DCEBE7]/70 rounded-full blur-[160px] transform-gpu"></div>
      <div #orb4 class="auth-orb absolute top-2/3 right-1/4 w-[400px] h-[400px] bg-[#063B39]/08 rounded-full blur-[120px] transform-gpu"></div>
    </div>
  `
})
export class AuthShaderComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ctx = gsap.context(() => {
      // Gentle, continuous floating motion for ambient light orbs
      gsap.to('.auth-orb:nth-child(2)', {
        x: 40,
        y: 30,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.auth-orb:nth-child(3)', {
        x: -50,
        y: -40,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1
      });

      gsap.to('.auth-orb:nth-child(4)', {
        x: 30,
        y: -30,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2
      });
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
