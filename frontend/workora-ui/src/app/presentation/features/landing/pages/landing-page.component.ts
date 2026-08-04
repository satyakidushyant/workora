import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Workora Enterprise HRMS Suite Landing Page Component.
 * Integrates WebGL Simplex 2D Shader Liquid Mesh background animation (ANIMATION_29),
 * CSS ambient glow fallback layer, Hanken Grotesk / Inter typography stack,
 * Apple Vision Pro frosted glass design tokens, Workora SVG emblem, and 16:9 widescreen spatial preview.
 */
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, NgClass, RouterLink],
  template: `
    <div class="font-sans text-body-md antialiased bg-[#0d1320] text-[#dde2f4] min-h-screen relative overflow-x-hidden selection:bg-[#adc6ff] selection:text-[#002e6a]">
      
      <!-- STITCH WEBGL LIQUID MESH SHADER CANVAS LAYER -->
      <div class="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <!-- Ambient CSS Mesh Glow Fallback Orbs -->
        <div class="absolute w-[600px] h-[600px] rounded-full bg-blue-500/30 blur-[120px] -top-32 -left-32 animate-pulse pointer-events-none"></div>
        <div class="absolute w-[500px] h-[500px] rounded-full bg-purple-500/25 blur-[120px] top-1/3 -right-32 animate-pulse pointer-events-none"></div>
        <div class="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/25 blur-[120px] -bottom-32 left-1/3 animate-pulse pointer-events-none"></div>
        
        <!-- Live WebGL Canvas -->
        <canvas #shaderCanvas id="shader-canvas-ANIMATION_29" class="absolute inset-0 w-full h-full block pointer-events-none"></canvas>
      </div>

      <!-- Top Navigation Bar -->
      <nav class="fixed top-4 left-1/2 -translate-x-1/2 rounded-full w-[calc(100%-48px)] max-w-7xl apple-glass-high border border-white/20 shadow-2xl z-50 flex justify-between items-center px-4 sm:px-8 py-3 transition-all duration-300">
        
        <!-- Logo & Brand Title -->
        <div class="flex items-center gap-3 cursor-pointer group" (click)="scrollToTop()">
          <div class="relative flex items-center justify-center">
            <div class="absolute inset-0 bg-blue-500/30 rounded-full blur-xl group-hover:bg-blue-400/60 transition-all"></div>
            <img 
              alt="Workora Logo" 
              class="h-10 sm:h-12 w-auto object-contain relative z-10 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] group-hover:scale-110 transition-transform duration-300" 
              src="/workora.png"
            />
          </div>
          <span class="font-display-lg text-xl sm:text-2xl font-bold text-[#dde2f4] group-hover:text-[#adc6ff] transition-colors">Workora</span>
        </div>

        <!-- Desktop Nav Links -->
        <div class="hidden md:flex items-center gap-8">
          <button 
            (click)="scrollToSection('solutions')"
            [ngClass]="{ 'text-white font-bold': activeSection() === 'solutions' }"
            class="font-body-md text-[#c2c6d6] hover:text-[#5de6ff] transition-all duration-300 bg-transparent border-none cursor-pointer"
          >
            Solutions
          </button>
          <button 
            (click)="scrollToSection('enterprise')"
            [ngClass]="{ 'text-white font-bold': activeSection() === 'enterprise' }"
            class="font-body-md text-[#c2c6d6] hover:text-[#5de6ff] transition-all duration-300 bg-transparent border-none cursor-pointer"
          >
            Enterprise
          </button>
          <button 
            (click)="scrollToSection('pricing')"
            [ngClass]="{ 'text-white font-bold': activeSection() === 'pricing' }"
            class="font-body-md text-[#c2c6d6] hover:text-[#5de6ff] transition-all duration-300 bg-transparent border-none cursor-pointer"
          >
            Pricing
          </button>
          <button 
            (click)="scrollToSection('resources')"
            [ngClass]="{ 'text-white font-bold': activeSection() === 'resources' }"
            class="font-body-md text-[#c2c6d6] hover:text-[#5de6ff] transition-all duration-300 bg-transparent border-none cursor-pointer"
          >
            Resources
          </button>
        </div>

        <!-- Nav Actions -->
        <div class="flex items-center gap-3">
          <button 
            routerLink="/login" 
            class="hidden sm:block text-[#c2c6d6] font-body-md hover:text-[#adc6ff] transition-colors bg-transparent border-none cursor-pointer"
          >
            Sign In
          </button>
          <button 
            routerLink="/login" 
            class="bg-[#adc6ff] text-[#00285d] px-5 py-2 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/20 border-none cursor-pointer text-xs sm:text-sm"
          >
            Request Demo
          </button>

          <!-- Mobile Drawer Toggle -->
          <button 
            (click)="toggleMobileMenu()" 
            class="md:hidden text-white/90 hover:text-white p-2 rounded-full glass-panel hover:bg-white/20 transition-all cursor-pointer ml-1"
            aria-label="Toggle Menu"
          >
            <span class="material-symbols-outlined text-xl flex items-center justify-center">{{ isMobileMenuOpen() ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </nav>

      <!-- Mobile Menu Drawer Dropdown -->
      @if (isMobileMenuOpen()) {
        <div class="md:hidden fixed top-24 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-7xl apple-glass-high rounded-3xl p-5 space-y-3 z-50 animate-in slide-in-from-top-2 duration-300 shadow-2xl">
          <div class="space-y-1">
            <a (click)="scrollToSection('solutions')" class="block px-4 py-2.5 text-white/90 hover:text-white font-semibold text-sm rounded-2xl hover:bg-white/15 transition-all cursor-pointer">Solutions</a>
            <a (click)="scrollToSection('enterprise')" class="block px-4 py-2.5 text-white/90 hover:text-white font-semibold text-sm rounded-2xl hover:bg-white/15 transition-all cursor-pointer">Enterprise</a>
            <a (click)="scrollToSection('pricing')" class="block px-4 py-2.5 text-white/90 hover:text-white font-semibold text-sm rounded-2xl hover:bg-white/15 transition-all cursor-pointer">Pricing</a>
            <a (click)="scrollToSection('resources')" class="block px-4 py-2.5 text-white/90 hover:text-white font-semibold text-sm rounded-2xl hover:bg-white/15 transition-all cursor-pointer">Resources</a>
          </div>
          <div class="pt-3 border-t border-white/15 flex flex-col gap-2">
            <button routerLink="/login" (click)="isMobileMenuOpen.set(false)" class="w-full text-center py-2.5 rounded-full font-bold glass-panel text-white hover:bg-white/20 cursor-pointer text-xs">Sign In</button>
            <button routerLink="/login" (click)="isMobileMenuOpen.set(false)" class="w-full text-center bg-[#adc6ff] text-[#00285d] py-2.5 rounded-full font-bold shadow-lg hover:scale-105 transition-all cursor-pointer text-xs">Request Demo</button>
          </div>
        </div>
      }

      <!-- Main Content Container -->
      <main class="relative z-10 pt-32 bg-transparent">
        
        <!-- HERO SECTION -->
        <section id="solutions" class="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-32 text-center scroll-mt-24">
          
          <!-- Eyebrow Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <span class="w-2 h-2 rounded-full bg-[#5de6ff] animate-pulse"></span>
            <span class="font-label-sm text-[#c2c6d6] uppercase tracking-wider text-xs font-semibold">One platform for HR, payroll, and people operations</span>
          </div>

          <!-- Headline -->
          <h1 class="font-display-lg text-[40px] md:text-[80px] leading-tight mb-4 text-glow font-extrabold text-[#dde2f4]">
            Unified workforce intelligence
          </h1>

          <!-- Subheadline -->
          <p class="max-w-3xl mx-auto font-body-lg text-[#c2c6d6] mb-10 text-base md:text-xl leading-relaxed">
            The high-performance workspace that brings hiring, attendance, and payroll into a single, immersive ecosystem. Built for teams that move fast.
          </p>

          <!-- Action CTAs -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button 
              routerLink="/login" 
              class="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#adc6ff] to-[#b76dff] text-[#00285d] font-bold rounded-full hover:shadow-[0_0_30px_rgba(173,198,255,0.4)] transition-all cursor-pointer border-none text-sm"
            >
              Get Started Free
            </button>
            <button 
              (click)="scrollToSection('pillars')"
              class="w-full sm:w-auto px-8 py-3.5 glass-panel text-[#dde2f4] font-bold rounded-full hover:bg-white/10 transition-all border-white/20 cursor-pointer text-sm"
            >
              Explore Modules
            </button>
          </div>

          <!-- Glass-framed Widescreen Dashboard Preview -->
          <div class="relative group float-animation">
            <div class="absolute -inset-4 bg-[#adc6ff]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div class="apple-glass-high p-3 rounded-2xl relative overflow-hidden border-white/20 shadow-2xl">
              <img 
                alt="Workora 16:9 Spatial Widescreen Glass Dashboard Preview" 
                class="w-full h-auto rounded-xl shadow-2xl object-cover aspect-video" 
                src="/hero-dashboard-widescreen.png"
              />
            </div>
          </div>
        </section>

        <!-- BENTO FEATURE GRID SECTION -->
        <section id="pillars" class="max-w-7xl mx-auto px-6 sm:px-8 py-20 scroll-mt-24">
          
          <div id="enterprise" class="mb-16 text-center md:text-left scroll-mt-24">
            <h2 class="font-display-lg text-3xl md:text-5xl mb-2 text-glow font-extrabold text-[#dde2f4]">Designed for depth.</h2>
            <p class="font-body-lg text-[#c2c6d6] max-w-xl text-base sm:text-lg">Every module is natively integrated. No more switching tabs or syncing data.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 md:grid-rows-3">
            
            <!-- Core HR (Big 2x2) -->
            <div class="md:col-span-2 md:row-span-2 apple-glass-high p-8 rounded-3xl glass-card-hover flex flex-col justify-between group">
              <div>
                <span class="material-symbols-outlined text-[#adc6ff] mb-6 block text-4xl" style="font-variation-settings: 'FILL' 1;">badge</span>
                <h3 class="font-headline-md text-2xl font-bold mb-3 text-white">Core HR</h3>
                <p class="font-body-md text-[#c2c6d6] text-sm sm:text-base leading-relaxed">Centralize employee records, dynamic org charts, and automated onboarding workflows that make new hires feel at home from day one.</p>
              </div>
              <div class="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <span class="font-label-sm text-[#5de6ff] text-xs font-semibold">View 12 features</span>
                <span class="material-symbols-outlined text-[#5de6ff] group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </div>
            </div>

            <!-- Payroll (2x1) -->
            <div class="md:col-span-2 apple-glass-high p-6 rounded-3xl glass-card-hover flex items-center gap-6">
              <div class="w-16 h-16 rounded-full bg-[#00cbe6]/20 flex items-center justify-center flex-shrink-0 border border-[#5de6ff]/20">
                <span class="material-symbols-outlined text-[#5de6ff]" style="font-size: 32px;">payments</span>
              </div>
              <div>
                <h3 class="font-headline-md text-lg font-bold text-white mb-1">Automated Payroll</h3>
                <p class="font-body-md text-[#c2c6d6] text-sm">One-click global payroll with automated tax compliance and instant digital payslips.</p>
              </div>
            </div>

            <!-- Attendance (1x1) -->
            <div class="apple-glass-high p-6 rounded-3xl glass-card-hover flex flex-col justify-between">
              <span class="material-symbols-outlined text-[#ddb7ff]" style="font-size: 32px;">schedule</span>
              <div class="mt-6">
                <h3 class="font-headline-md text-base font-bold text-white mb-1">Attendance</h3>
                <p class="font-label-sm text-[#c2c6d6] text-xs">Smart clock-in &amp; shift tracking.</p>
              </div>
            </div>

            <!-- Security (1x1) -->
            <div class="apple-glass-high p-6 rounded-3xl glass-card-hover flex flex-col justify-between">
              <span class="material-symbols-outlined text-[#ffb4ab]" style="font-size: 32px;">verified_user</span>
              <div class="mt-6">
                <h3 class="font-headline-md text-base font-bold text-white mb-1">Security</h3>
                <p class="font-label-sm text-[#c2c6d6] text-xs">Audit trails &amp; RBAC.</p>
              </div>
            </div>

            <!-- Recruitment (2x1) -->
            <div class="md:col-span-2 apple-glass-high p-6 rounded-3xl glass-card-hover flex justify-between items-center">
              <div class="max-w-[65%]">
                <h3 class="font-headline-md text-xl font-bold text-white mb-1">Recruitment</h3>
                <p class="font-body-md text-[#c2c6d6] text-sm">Streamlined applicant tracking from job post to offer letter.</p>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="w-10 h-10 rounded-full bg-[#adc6ff]/20 border border-[#adc6ff]/40"></div>
                <div class="w-10 h-10 rounded-full bg-[#5de6ff]/20 border border-[#5de6ff]/40"></div>
                <div class="w-10 h-10 rounded-full bg-[#ddb7ff]/20 border border-[#ddb7ff]/40"></div>
                <div class="w-10 h-10 rounded-full bg-white/10 border border-white/20"></div>
              </div>
            </div>

            <!-- Performance (1x1) -->
            <div class="apple-glass-high p-6 rounded-3xl glass-card-hover">
              <span class="material-symbols-outlined text-[#adc6ff] mb-2 block">trending_up</span>
              <h3 class="font-headline-md text-base font-bold text-white mb-1">Performance</h3>
              <p class="font-label-sm text-[#c2c6d6] text-xs">OKRs &amp; 360 Feedback loops.</p>
            </div>

            <!-- Reporting (1x1) -->
            <div class="apple-glass-high p-6 rounded-3xl glass-card-hover">
              <span class="material-symbols-outlined text-[#5de6ff] mb-2 block">analytics</span>
              <h3 class="font-headline-md text-base font-bold text-white mb-1">Reporting</h3>
              <p class="font-label-sm text-[#c2c6d6] text-xs">Role-aware cost insights.</p>
            </div>

          </div>
        </section>

        <!-- CTA BANNER SECTION -->
        <section id="pricing" class="max-w-7xl mx-auto px-6 sm:px-8 py-20 scroll-mt-24">
          <div class="relative apple-glass-high rounded-3xl p-10 md:p-16 overflow-hidden flex flex-col items-center text-center border-white/30 shadow-2xl">
            <!-- Background Ambient Radial Glow -->
            <div class="absolute inset-0 bg-gradient-to-br from-[#adc6ff]/10 via-transparent to-[#b76dff]/10 pointer-events-none"></div>
            <h2 class="font-display-lg text-3xl md:text-5xl font-extrabold mb-4 relative z-10 text-glow text-[#dde2f4]">Ready to bring HR into one system?</h2>
            <p class="font-body-lg text-[#c2c6d6] max-w-2xl mb-8 relative z-10 text-sm sm:text-base leading-relaxed">
              Join enterprise teams using Workora to power their workforce. Experience the most advanced HR management system ever built.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 relative z-10">
              <button 
                routerLink="/login" 
                class="px-8 py-3.5 bg-[#adc6ff] text-[#00285d] font-bold rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-none text-sm"
              >
                Get Started Now
              </button>
              <button 
                routerLink="/login" 
                class="px-8 py-3.5 glass-panel border-white/30 text-[#dde2f4] font-bold rounded-full hover:bg-white/10 transition-all cursor-pointer text-sm"
              >
                Talk to Sales
              </button>
            </div>
          </div>
        </section>

      </main>

      <!-- FOOTER -->
      <footer id="resources" class="w-full mt-20 bg-[#151c28]/40 backdrop-blur-3xl border-t border-white/10 py-16 scroll-mt-24 relative z-10">
        <div class="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <!-- Brand Info -->
          <div class="col-span-2 md:col-span-1">
            <div class="flex items-center gap-3 mb-4 cursor-pointer group" (click)="scrollToTop()">
              <img alt="Workora Logo" class="h-8 w-auto object-contain filter drop-shadow-md group-hover:scale-110 transition-transform" src="/workora.png"/>
              <span class="font-display-lg text-xl text-[#dde2f4] font-bold">Workora</span>
            </div>
            <p class="font-body-md text-[#c2c6d6] opacity-80 text-xs leading-relaxed max-w-xs mb-4">
              The spatial workforce platform designed for the future of work.
            </p>
          </div>

          <!-- Product Links -->
          <div>
            <h4 class="font-bold text-white text-xs uppercase tracking-wider mb-4">Product</h4>
            <ul class="space-y-2.5 text-xs text-[#c2c6d6]">
              <li><a (click)="scrollToSection('solutions')" class="hover:text-[#adc6ff] transition-colors cursor-pointer">Payroll</a></li>
              <li><a (click)="scrollToSection('solutions')" class="hover:text-[#adc6ff] transition-colors cursor-pointer">Benefits</a></li>
              <li><a (click)="scrollToSection('solutions')" class="hover:text-[#adc6ff] transition-colors cursor-pointer">Compliance</a></li>
            </ul>
          </div>

          <!-- Support Links -->
          <div>
            <h4 class="font-bold text-white text-xs uppercase tracking-wider mb-4">Support</h4>
            <ul class="space-y-2.5 text-xs text-[#c2c6d6]">
              <li><a (click)="scrollToSection('resources')" class="hover:text-[#adc6ff] transition-colors cursor-pointer">Documentation</a></li>
              <li><a (click)="scrollToSection('resources')" class="hover:text-[#adc6ff] transition-colors cursor-pointer">Support Center</a></li>
              <li><a (click)="scrollToSection('resources')" class="hover:text-[#adc6ff] transition-colors cursor-pointer">API Status</a></li>
            </ul>
          </div>

          <!-- Legal Links -->
          <div>
            <h4 class="font-bold text-white text-xs uppercase tracking-wider mb-4">Legal</h4>
            <ul class="space-y-2.5 text-xs text-[#c2c6d6]">
              <li><a class="hover:text-[#adc6ff] transition-colors cursor-pointer">Privacy Policy</a></li>
              <li><a class="hover:text-[#adc6ff] transition-colors cursor-pointer">Terms of Service</a></li>
              <li><a class="hover:text-[#adc6ff] transition-colors cursor-pointer">Security Compliance</a></li>
            </ul>
          </div>

        </div>

        <div class="max-w-7xl mx-auto px-6 sm:px-8 mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#c2c6d6] opacity-80">
          <span>© 2026 Workora Enterprise. All rights reserved.</span>
          <div class="flex gap-4">
            <a class="material-symbols-outlined hover:text-[#adc6ff] transition-colors cursor-pointer text-base">language</a>
            <a class="material-symbols-outlined hover:text-[#adc6ff] transition-colors cursor-pointer text-base">public</a>
            <a class="material-symbols-outlined hover:text-[#adc6ff] transition-colors cursor-pointer text-base">terminal</a>
          </div>
        </div>
      </footer>

    </div>
  `
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('shaderCanvas', { static: false }) shaderCanvas!: ElementRef<HTMLCanvasElement>;

  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly activeSection = signal<string>('solutions');

  private animationFrameId: number | null = null;
  private resizeListener: (() => void) | null = null;

  ngAfterViewInit(): void {
    // Delay initialization by 50ms to ensure container layout dimensions are populated
    setTimeout(() => {
      this.initShaderCanvas();
    }, 50);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  /**
   * Initializes WebGL 2D Simplex Noise Liquid Mesh Shader (STITCH_SHADER_ANIMATION_29).
   */
  private initShaderCanvas(): void {
    const canvas = this.shaderCanvas?.nativeElement;
    if (!canvas) return;

    const resizeCanvas = () => {
      const w = window.innerWidth || document.documentElement.clientWidth || 1280;
      const h = window.innerHeight || document.documentElement.clientHeight || 720;
      canvas.width = w;
      canvas.height = h;
    };

    resizeCanvas();
    this.resizeListener = resizeCanvas;
    window.addEventListener('resize', this.resizeListener);

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = v_texCoord;
    float time = u_time * 0.15;
    
    float n1 = snoise(uv * 1.5 + vec2(time * 0.5, time * 0.3));
    float n2 = snoise(uv * 2.0 - vec2(time * 0.4, time * 0.6));
    float n3 = snoise(uv * 1.0 + vec2(sin(time), cos(time)));
    
    vec3 color1 = vec3(0.027, 0.051, 0.102); // Deep Navy #070d19
    vec3 color2 = vec3(0.231, 0.510, 0.965); // Blue
    vec3 color3 = vec3(0.639, 0.384, 0.961); // Purple
    vec3 color4 = vec3(0.133, 0.824, 0.941); // Cyan
    
    vec3 finalColor = color1;
    
    float orb1 = smoothstep(0.2, 0.8, n1);
    float orb2 = smoothstep(0.3, 0.9, n2);
    float orb3 = smoothstep(0.4, 0.7, n3);
    
    finalColor = mix(finalColor, color2, orb1 * 0.35);
    finalColor = mix(finalColor, color3, orb2 * 0.25);
    finalColor = mix(finalColor, color4, orb3 * 0.25);
    
    float dist = distance(uv, vec2(0.5));
    finalColor *= smoothstep(1.5, 0.5, dist);
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;

    const compileShader = (type: number, src: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;

    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');

    const render = (t: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      this.animationFrameId = requestAnimationFrame(render);
    };

    this.animationFrameId = requestAnimationFrame(render);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(prev => !prev);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.activeSection.set('solutions');
  }

  scrollToSection(sectionId: string): void {
    this.isMobileMenuOpen.set(false);
    this.activeSection.set(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
