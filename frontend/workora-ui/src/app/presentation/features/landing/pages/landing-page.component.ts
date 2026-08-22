import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild, signal, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Workora Enterprise HRMS Landing Page Component.
 * Implements a modern, clean blue & white SaaS aesthetic,
 * comprehensive GSAP & ScrollTrigger entrance animations,
 * interactive HR dashboard mockups, 4-step workflow timeline,
 * security architecture, testimonials, and dynamic number counters.
 */
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#fafdfc] text-[#063B39] font-sans antialiased overflow-x-hidden selection:bg-[#DCEBE7] selection:text-[#063B39] relative">

      <!-- AMBIENT BACKGROUND GLOW ORBS -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div class="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#3FA79B]/15 rounded-full blur-[140px]"></div>
        <div class="absolute top-[35%] -right-40 w-[550px] h-[550px] bg-[#0E6E68]/12 rounded-full blur-[130px]"></div>
        <div class="absolute top-[70%] left-[20%] w-[700px] h-[700px] bg-[#DCEBE7]/60 rounded-full blur-[160px]"></div>
      </div>

      <!-- ========================================== -->
      <!-- 1. STICKY NAVBAR                           -->
      <!-- ========================================== -->
      <header 
        #navbarRef 
        [ngClass]="{
          'bg-white/85 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(14,110,104,0.08)] border-b border-[#DCEBE7] py-3': isScrolled(),
          'bg-transparent border-b border-transparent py-5': !isScrolled()
        }"
        class="fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 sm:px-10"
      >
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          
          <!-- Brand Logo & Name -->
          <a (click)="scrollToTop()" class="flex items-center gap-3 cursor-pointer group text-decoration-none">
            <div class="relative flex items-center justify-center">
              <div class="absolute inset-0 bg-[#0E6E68]/20 rounded-full blur-md group-hover:bg-[#3FA79B]/35 transition-all"></div>
              <img 
                src="/workoraLogo.png" 
                alt="Workora Logo" 
                class="h-9 sm:h-10 w-auto object-contain relative z-10 transition-transform duration-300 group-hover:scale-105 drop-shadow-xs"
              />
            </div>
            <span class="text-2xl font-extrabold tracking-tight text-[#063B39] font-heading flex items-center">
              Workora
              <span class="w-1.5 h-1.5 rounded-full bg-[#0E6E68] ml-1"></span>
            </span>
          </a>

          <!-- Center Navigation Links -->
          <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a (click)="scrollToSection('home')" class="hover:text-[#0E6E68] transition-colors cursor-pointer gsap-nav-item">Home</a>
            <a (click)="scrollToSection('features')" class="hover:text-[#0E6E68] transition-colors cursor-pointer gsap-nav-item">Features</a>
            <a (click)="scrollToSection('showcase')" class="hover:text-[#0E6E68] transition-colors cursor-pointer gsap-nav-item">Solutions</a>
            <a (click)="scrollToSection('why-workora')" class="hover:text-[#0E6E68] transition-colors cursor-pointer gsap-nav-item">About</a>
            <a (click)="scrollToSection('security')" class="hover:text-[#0E6E68] transition-colors cursor-pointer gsap-nav-item">Security</a>
            <a (click)="scrollToSection('contact')" class="hover:text-[#0E6E68] transition-colors cursor-pointer gsap-nav-item">Contact</a>
          </nav>

          <!-- Right Action CTAs -->
          <div class="flex items-center gap-4">
            <a 
              routerLink="/login" 
              class="hidden sm:inline-flex text-sm font-semibold text-[#063B39] hover:text-[#0E6E68] transition-colors px-3 py-2 cursor-pointer gsap-nav-item"
            >
              Sign In
            </a>
            <a 
              routerLink="/login" 
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E6E68] text-white text-sm font-bold shadow-md shadow-[#0E6E68]/20 hover:bg-[#063B39] hover:shadow-lg hover:shadow-[#0E6E68]/30 active:scale-95 transition-all cursor-pointer gsap-nav-item"
            >
              <span>Get Started</span>
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </a>

            <!-- Mobile Hamburger Button -->
            <button 
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 rounded-xl text-[#063B39] hover:bg-[#DCEBE7]/40 border border-[#DCEBE7] transition-colors"
              aria-label="Toggle navigation menu"
            >
              <span class="material-symbols-outlined text-2xl flex items-center justify-center">
                {{ isMobileMenuOpen() ? 'close' : 'menu' }}
              </span>
            </button>
          </div>
        </div>
      </header>

      <!-- Mobile Dropdown Menu -->
      @if (isMobileMenuOpen()) {
        <div class="md:hidden fixed top-20 left-4 right-4 bg-white/95 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl border border-[#DCEBE7] z-50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <nav class="flex flex-col space-y-3 font-semibold text-base text-[#063B39]">
            <a (click)="scrollToSection('home')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors">Home</a>
            <a (click)="scrollToSection('features')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors">Features</a>
            <a (click)="scrollToSection('showcase')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors">Solutions</a>
            <a (click)="scrollToSection('why-workora')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors">About</a>
            <a (click)="scrollToSection('security')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors">Security</a>
            <a (click)="scrollToSection('contact')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors">Contact</a>
          </nav>
          <div class="pt-4 border-t border-[#DCEBE7] flex flex-col gap-2.5">
            <a routerLink="/login" (click)="isMobileMenuOpen.set(false)" class="w-full py-2.5 text-center font-bold text-[#063B39] bg-[#DCEBE7]/50 rounded-xl hover:bg-[#DCEBE7] text-sm">Sign In</a>
            <a routerLink="/login" (click)="isMobileMenuOpen.set(false)" class="w-full py-2.5 text-center font-bold text-white bg-[#0E6E68] rounded-xl hover:bg-[#063B39] text-sm shadow-md">Get Started Free</a>
          </div>
        </div>
      }

      <!-- ========================================== -->
      <!-- 2. HERO SECTION                            -->
      <!-- ========================================== -->
      <section id="home" class="relative z-10 pt-32 sm:pt-40 pb-20 lg:pb-32 px-6 sm:px-10 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <!-- Hero Left Column: Copy & CTAs -->
          <div class="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            <!-- Trust Badge -->
            <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] shadow-2xs gsap-hero-badge">
              <span class="flex h-2.5 w-2.5 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3FA79B] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0E6E68]"></span>
              </span>
              <span class="text-xs sm:text-sm font-bold tracking-wide text-[#0E6E68] uppercase">Modern HR Management Platform</span>
            </div>

            <!-- Headline with Line-by-Line Stagger -->
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#063B39] leading-[1.15] font-heading">
              <span class="block gsap-hero-title-line">Simplify HR.</span>
              <span class="block text-[#0E6E68] gsap-hero-title-line">Empower People.</span>
              <span class="block gsap-hero-title-line">Grow Smarter.</span>
            </h1>

            <!-- Supporting Description -->
            <p class="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 gsap-hero-desc">
              Workora brings your people, processes, and HR operations together in one intelligent platform designed for modern businesses.
            </p>

            <!-- CTA Buttons & Social Proof -->
            <div class="space-y-4">
              <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a 
                  routerLink="/login" 
                  class="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0E6E68] text-white font-bold text-base shadow-xl shadow-[#0E6E68]/25 hover:bg-[#063B39] hover:shadow-2xl hover:shadow-[#0E6E68]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer gsap-hero-cta"
                >
                  <span>Get Started</span>
                  <span class="material-symbols-outlined text-xl">arrow_forward</span>
                </a>
                <button 
                  (click)="scrollToSection('features')"
                  class="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-[#063B39] font-bold text-base border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:bg-[#DCEBE7]/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm gsap-hero-cta"
                >
                  <span class="material-symbols-outlined text-xl text-[#0E6E68]">dashboard_customize</span>
                  <span>Explore Features</span>
                </button>
              </div>

              <!-- Micro-trust pills -->
              <div class="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium gsap-hero-desc">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                  <span>Free 14-day trial</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                  <span>No credit card required</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                  <span>Instant enterprise setup</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Hero Right Column: High-Fidelity Modern HR Dashboard Visual Mockup -->
          <div class="lg:col-span-5 relative perspective-1000">
            
            <!-- Dashboard Main Container Card -->
            <div class="relative bg-white rounded-2xl border border-[#DCEBE7] shadow-[0_25px_60px_-15px_rgba(14,110,104,0.15)] p-5 space-y-4 transform-gpu gsap-hero-dashboard">
              
              <!-- Dashboard Header bar -->
              <div class="flex items-center justify-between pb-3 border-b border-[#DCEBE7]">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-[#DCEBE7]/80 flex items-center justify-center p-1">
                    <img src="/workoraLogo.png" alt="Icon" class="h-6 w-auto object-contain" />
                  </div>
                  <div>
                    <h3 class="text-xs font-bold text-[#063B39] leading-none">Workora Command Center</h3>
                    <span class="text-[10px] text-[#0E6E68]/70">Live Organization Pulse</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center gap-1 border border-emerald-200/60">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Operational
                  </span>
                </div>
              </div>

              <!-- Top Metrics Grid -->
              <div class="grid grid-cols-2 gap-3">
                <!-- Employee Metric -->
                <div class="p-3.5 rounded-xl bg-gradient-to-br from-[#DCEBE7]/60 to-white border border-[#DCEBE7] shadow-2xs gsap-dash-card">
                  <div class="flex items-center justify-between text-xs text-[#0E6E68]/70 font-medium mb-1">
                    <span>Active Employees</span>
                    <span class="material-symbols-outlined text-[#0E6E68] text-sm">groups</span>
                  </div>
                  <div class="text-xl font-extrabold text-[#063B39]">2,840</div>
                  <div class="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
                    <span class="material-symbols-outlined text-xs">trending_up</span>
                    <span>+12.4% this quarter</span>
                  </div>
                </div>

                <!-- Today's Attendance -->
                <div class="p-3.5 rounded-xl bg-gradient-to-br from-[#DCEBE7]/40 to-white border border-[#DCEBE7] shadow-2xs gsap-dash-card">
                  <div class="flex items-center justify-between text-xs text-[#0E6E68]/70 font-medium mb-1">
                    <span>Today's Attendance</span>
                    <span class="material-symbols-outlined text-[#3FA79B] text-sm">how_to_reg</span>
                  </div>
                  <div class="text-xl font-extrabold text-[#063B39]">98.4%</div>
                  <div class="text-[11px] text-slate-500 font-medium mt-1">2,794 Present • 32 Remote</div>
                </div>
              </div>

              <!-- Live Leave Request Approvals widget -->
              <div class="p-3.5 rounded-xl bg-[#fafdfc] border border-[#DCEBE7] space-y-2.5 gsap-dash-card">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-[#063B39] flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[#0E6E68] text-sm">event_available</span>
                    Pending Approvals
                  </span>
                  <span class="text-[10px] text-[#0E6E68] font-bold bg-[#DCEBE7] px-2 py-0.5 rounded-full">2 Requests</span>
                </div>

                <div class="flex items-center justify-between bg-white p-2.5 rounded-lg border border-[#DCEBE7] shadow-2xs">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-[#0E6E68] text-white font-bold text-[10px] flex items-center justify-center">SC</div>
                    <div>
                      <div class="text-xs font-bold text-[#063B39]">Sarah Connor</div>
                      <div class="text-[10px] text-slate-500">Annual Leave • 3 Days</div>
                    </div>
                  </div>
                  <div class="flex gap-1.5">
                    <span class="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-md hover:bg-emerald-700 transition-colors cursor-pointer">Approve</span>
                  </div>
                </div>
              </div>

              <!-- Payroll Mini-Bar widget -->
              <div class="p-3.5 rounded-xl bg-gradient-to-r from-[#063B39] to-[#0E6E68] text-white space-y-2 shadow-md gsap-dash-card">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-200 font-medium flex items-center gap-1">
                    <span class="material-symbols-outlined text-[#3FA79B] text-sm">account_balance_wallet</span>
                    August Payroll Cycle
                  </span>
                  <span class="font-mono text-emerald-300 font-bold text-xs">$482,500.00</span>
                </div>
                <!-- Progress bar -->
                <div class="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-gradient-to-r from-[#3FA79B] to-[#DCEBE7] h-1.5 rounded-full w-[85%]"></div>
                </div>
                <div class="flex justify-between text-[10px] text-slate-300">
                  <span>Direct Deposit: 100% Ready</span>
                  <span class="text-[#DCEBE7]">Automated Tax Compliant</span>
                </div>
              </div>

            </div>

            <!-- Floating Micro-Badge 1: Top Performance -->
            <div class="hidden sm:flex absolute -bottom-5 -left-6 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-xl border border-[#DCEBE7] items-center gap-3 z-20 animate-soft-float">
              <div class="w-9 h-9 rounded-lg bg-[#DCEBE7] flex items-center justify-center text-[#0E6E68]">
                <span class="material-symbols-outlined text-xl">insights</span>
              </div>
              <div>
                <div class="text-xs font-bold text-[#063B39]">94% Goal Velocity</div>
                <div class="text-[10px] text-emerald-600 font-semibold">Q3 Targets on Track</div>
              </div>
            </div>

            <!-- Floating Micro-Badge 2: Instant Clock In -->
            <div class="hidden sm:flex absolute -top-5 -right-4 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-xl border border-[#DCEBE7] items-center gap-2 z-20 animate-soft-float-slow">
              <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <span class="material-symbols-outlined text-base">fingerprint</span>
              </div>
              <div class="pr-1">
                <div class="text-[11px] font-bold text-[#063B39]">Smart Geofence</div>
                <div class="text-[9px] text-slate-500">1-Touch Clock In</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 3. TRUSTED BY / STATISTICS SECTION         -->
      <!-- ========================================== -->
      <section class="relative z-10 py-16 bg-white border-y border-[#DCEBE7] stats-section">
        <div class="max-w-7xl mx-auto px-6 sm:px-10">
          
          <!-- Statistics Counters Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <!-- Metric 1: Employees Managed -->
            <div class="space-y-1 p-4 rounded-xl hover:bg-[#DCEBE7]/30 transition-colors stat-item">
              <div class="text-4xl sm:text-5xl font-extrabold text-[#0E6E68] font-heading tracking-tight">
                <span #statCount1 class="counter-num">10</span><span class="text-[#3FA79B]">K+</span>
              </div>
              <div class="text-sm font-bold text-[#063B39]">Employees Managed</div>
              <p class="text-xs text-[#0E6E68]/70">Empowering teams globally</p>
            </div>

            <!-- Metric 2: Businesses -->
            <div class="space-y-1 p-4 rounded-xl hover:bg-[#DCEBE7]/30 transition-colors stat-item">
              <div class="text-4xl sm:text-5xl font-extrabold text-[#0E6E68] font-heading tracking-tight">
                <span #statCount2 class="counter-num">500</span><span class="text-[#3FA79B]">+</span>
              </div>
              <div class="text-sm font-bold text-[#063B39]">Businesses</div>
              <p class="text-xs text-[#0E6E68]/70">From startups to enterprises</p>
            </div>

            <!-- Metric 3: Platform Reliability -->
            <div class="space-y-1 p-4 rounded-xl hover:bg-[#DCEBE7]/30 transition-colors stat-item">
              <div class="text-4xl sm:text-5xl font-extrabold text-[#0E6E68] font-heading tracking-tight">
                <span #statCount3 class="counter-num">99.9</span><span class="text-[#3FA79B]">%</span>
              </div>
              <div class="text-sm font-bold text-[#063B39]">Platform Reliability</div>
              <p class="text-xs text-[#0E6E68]/70">Guaranteed enterprise uptime</p>
            </div>

            <!-- Metric 4: HR Accessibility -->
            <div class="space-y-1 p-4 rounded-xl hover:bg-[#DCEBE7]/30 transition-colors stat-item">
              <div class="text-4xl sm:text-5xl font-extrabold text-[#0E6E68] font-heading tracking-tight">
                <span class="counter-num">24/7</span>
              </div>
              <div class="text-sm font-bold text-[#063B39]">HR Accessibility</div>
              <p class="text-xs text-[#0E6E68]/70">Seamless cloud availability</p>
            </div>

          </div>

          <!-- Enterprise Logos Ribbon -->
          <div class="mt-12 pt-8 border-t border-[#DCEBE7] flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60">
            <span class="text-xs font-bold uppercase tracking-widest text-[#0E6E68]/80 w-full text-center">Trusted by high-growth leaders worldwide</span>
            <div class="flex items-center gap-2 font-bold text-slate-700 text-lg tracking-tight"><span class="material-symbols-outlined text-[#0E6E68]">blur_on</span> NexusCorp</div>
            <div class="flex items-center gap-2 font-bold text-slate-700 text-lg tracking-tight"><span class="material-symbols-outlined text-[#0E6E68]">cloud_queue</span> CloudScale</div>
            <div class="flex items-center gap-2 font-bold text-slate-700 text-lg tracking-tight"><span class="material-symbols-outlined text-[#0E6E68]">polyline</span> Vertex Logistics</div>
            <div class="flex items-center gap-2 font-bold text-slate-700 text-lg tracking-tight"><span class="material-symbols-outlined text-[#0E6E68]">grain</span> GlobalTech</div>
            <div class="flex items-center gap-2 font-bold text-slate-700 text-lg tracking-tight"><span class="material-symbols-outlined text-[#0E6E68]">hub</span> OmniMedia</div>
          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 4. FEATURES SECTION                        -->
      <!-- ========================================== -->
      <section id="features" class="relative z-10 py-24 sm:py-32 px-6 sm:px-10 max-w-7xl mx-auto scroll-mt-20">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
            Comprehensive Capabilities
          </div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
            Everything Your HR Team Needs
          </h2>
          <p class="text-base sm:text-lg text-slate-600 leading-relaxed">
            Powerful tools designed to simplify everyday HR operations and help your people perform at their best.
          </p>
        </div>

        <!-- Feature Cards Grid (6 Modules) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 features-grid">
          
          <!-- Card 1: Employee Management -->
          <div class="workora-card p-8 rounded-2xl flex flex-col justify-between group feature-card">
            <div>
              <div class="w-14 h-14 rounded-2xl bg-[#DCEBE7] border border-[#DCEBE7] flex items-center justify-center text-[#0E6E68] mb-6 group-hover:bg-[#0E6E68] group-hover:text-white transition-all duration-300 shadow-sm">
                <span class="material-symbols-outlined text-3xl">badge</span>
              </div>
              <h3 class="text-xl font-bold text-[#063B39] mb-3 group-hover:text-[#0E6E68] transition-colors font-heading">
                Employee Management
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Manage employee information from one centralized platform. Maintain digital records, document vaults, hierarchy org trees, and zero-friction onboarding flows.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-[#DCEBE7] flex items-center justify-between text-xs font-bold text-[#0E6E68]">
              <span>Dynamic profiles &amp; records</span>
              <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>

          <!-- Card 2: Attendance & Time -->
          <div class="workora-card p-8 rounded-2xl flex flex-col justify-between group feature-card">
            <div>
              <div class="w-14 h-14 rounded-2xl bg-[#DCEBE7] border border-[#DCEBE7] flex items-center justify-center text-[#0E6E68] mb-6 group-hover:bg-[#0E6E68] group-hover:text-white transition-all duration-300 shadow-sm">
                <span class="material-symbols-outlined text-3xl">schedule</span>
              </div>
              <h3 class="text-xl font-bold text-[#063B39] mb-3 group-hover:text-[#0E6E68] transition-colors font-heading">
                Attendance &amp; Time
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Track attendance, working hours, shifts and schedules. Accurate biometrics, geofenced mobile clock-ins, overtime calculations, and automated late notifications.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-[#DCEBE7] flex items-center justify-between text-xs font-bold text-[#0E6E68]">
              <span>Real-time timesheets</span>
              <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>

          <!-- Card 3: Leave Management -->
          <div class="workora-card p-8 rounded-2xl flex flex-col justify-between group feature-card">
            <div>
              <div class="w-14 h-14 rounded-2xl bg-[#DCEBE7] border border-[#DCEBE7] flex items-center justify-center text-[#0E6E68] mb-6 group-hover:bg-[#0E6E68] group-hover:text-white transition-all duration-300 shadow-sm">
                <span class="material-symbols-outlined text-3xl">event_available</span>
              </div>
              <h3 class="text-xl font-bold text-[#063B39] mb-3 group-hover:text-[#0E6E68] transition-colors font-heading">
                Leave Management
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Simplify leave requests, approvals and holiday management. Multi-tier approval workflows, custom accrual policies, and instant balance synchronization.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-[#DCEBE7] flex items-center justify-between text-xs font-bold text-[#0E6E68]">
              <span>1-click manager approvals</span>
              <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>

          <!-- Card 4: Payroll Management -->
          <div class="workora-card p-8 rounded-2xl flex flex-col justify-between group feature-card">
            <div>
              <div class="w-14 h-14 rounded-2xl bg-[#DCEBE7] border border-[#DCEBE7] flex items-center justify-center text-[#0E6E68] mb-6 group-hover:bg-[#0E6E68] group-hover:text-white transition-all duration-300 shadow-sm">
                <span class="material-symbols-outlined text-3xl">payments</span>
              </div>
              <h3 class="text-xl font-bold text-[#063B39] mb-3 group-hover:text-[#0E6E68] transition-colors font-heading">
                Payroll Management
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Streamline payroll workflows and salary processing. Automated tax deductions, compliance filings, direct deposits, and downloadable digital payslips.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-[#DCEBE7] flex items-center justify-between text-xs font-bold text-[#0E6E68]">
              <span>100% Tax &amp; statutory compliance</span>
              <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>

          <!-- Card 5: Performance Management -->
          <div class="workora-card p-8 rounded-2xl flex flex-col justify-between group feature-card">
            <div>
              <div class="w-14 h-14 rounded-2xl bg-[#DCEBE7] border border-[#DCEBE7] flex items-center justify-center text-[#0E6E68] mb-6 group-hover:bg-[#0E6E68] group-hover:text-white transition-all duration-300 shadow-sm">
                <span class="material-symbols-outlined text-3xl">trending_up</span>
              </div>
              <h3 class="text-xl font-bold text-[#063B39] mb-3 group-hover:text-[#0E6E68] transition-colors font-heading">
                Performance Management
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Track employee goals, reviews and performance. Structured OKRs, 360-degree peer feedback, appraisal cycles, and career development roadmaps.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-[#DCEBE7] flex items-center justify-between text-xs font-bold text-[#0E6E68]">
              <span>Goal tracking &amp; 360 feedback</span>
              <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>

          <!-- Card 6: HR Analytics -->
          <div class="workora-card p-8 rounded-2xl flex flex-col justify-between group feature-card">
            <div>
              <div class="w-14 h-14 rounded-2xl bg-[#DCEBE7] border border-[#DCEBE7] flex items-center justify-center text-[#0E6E68] mb-6 group-hover:bg-[#0E6E68] group-hover:text-white transition-all duration-300 shadow-sm">
                <span class="material-symbols-outlined text-3xl">analytics</span>
              </div>
              <h3 class="text-xl font-bold text-[#063B39] mb-3 group-hover:text-[#0E6E68] transition-colors font-heading">
                HR Analytics
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Turn HR data into meaningful insights. Real-time dashboards on attrition, headcount forecasting, diversity metrics, and compensation trends.
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-[#DCEBE7] flex items-center justify-between text-xs font-bold text-[#0E6E68]">
              <span>Executive business intelligence</span>
              <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>

        </div>

      </section>

      <!-- ========================================== -->
      <!-- 5. PRODUCT SHOWCASE SECTION                -->
      <!-- ========================================== -->
      <section id="showcase" class="relative z-10 py-24 sm:py-32 bg-gradient-to-b from-[#DCEBE7]/40 via-white to-[#fafdfc] border-y border-[#DCEBE7] scroll-mt-20">
        <div class="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase shadow-2xs">
              Interactive SaaS Environment
            </div>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
              One Platform. Complete HR Visibility.
            </h2>
            <p class="text-base sm:text-lg text-slate-600">
              Experience a unified command center designed for modern human resource leaders.
            </p>
          </div>

          <!-- Large Product Showcase Dashboard UI Mockup -->
          <div class="showcase-container bg-white rounded-3xl border border-[#DCEBE7] shadow-[0_30px_90px_-20px_rgba(14,110,104,0.16)] overflow-hidden">
            
            <!-- Window Titlebar Mock -->
            <div class="bg-[#063B39] px-6 py-4 flex items-center justify-between text-white border-b border-[#063B39]/80">
              <div class="flex items-center gap-4">
                <div class="flex gap-2">
                  <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div class="h-4 w-px bg-[#0E6E68] hidden sm:block"></div>
                <div class="hidden sm:flex items-center gap-2 text-xs text-slate-200 font-medium">
                  <img src="/workoraLogo.png" alt="Workora" class="h-4 w-auto" />
                  <span>app.workora.io / Enterprise Dashboard</span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs bg-[#3FA79B]/20 text-[#3FA79B] px-3 py-1 rounded-full border border-[#3FA79B]/30 font-semibold">
                  Workora v2.4 • Live
                </span>
              </div>
            </div>

            <!-- Main Showcase Grid (Sidebar + Main Workspace) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
              
              <!-- Left Sidebar Navigation -->
              <div class="lg:col-span-3 bg-[#fafdfc] border-r border-[#DCEBE7] p-5 space-y-6 hidden sm:block">
                
                <!-- Workspace Selector -->
                <div class="flex items-center gap-3 p-2 rounded-xl bg-white border border-[#DCEBE7] shadow-2xs">
                  <img src="/workoraLogo.png" alt="Logo" class="h-7 w-auto" />
                  <div class="overflow-hidden">
                    <div class="text-xs font-extrabold text-[#063B39] truncate">Acme Global HQ</div>
                    <div class="text-[10px] text-[#0E6E68]/70">Enterprise Workspace</div>
                  </div>
                </div>

                <!-- Nav Menu Items -->
                <div class="space-y-1 text-xs font-semibold text-slate-600">
                  <div class="px-3 py-2 rounded-xl bg-[#0E6E68] text-white flex items-center gap-3 shadow-sm">
                    <span class="material-symbols-outlined text-base">dashboard</span>
                    <span>Dashboard Overview</span>
                  </div>
                  <div class="px-3 py-2 rounded-xl hover:bg-[#DCEBE7]/50 hover:text-[#0E6E68] flex items-center gap-3 transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-base">groups</span>
                    <span>Employees</span>
                  </div>
                  <div class="px-3 py-2 rounded-xl hover:bg-[#DCEBE7]/50 hover:text-[#0E6E68] flex items-center gap-3 transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-base">schedule</span>
                    <span>Attendance &amp; Shifts</span>
                  </div>
                  <div class="px-3 py-2 rounded-xl hover:bg-[#DCEBE7]/50 hover:text-[#0E6E68] flex items-center gap-3 transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-base">event_note</span>
                    <span>Leave Requests</span>
                  </div>
                  <div class="px-3 py-2 rounded-xl hover:bg-[#DCEBE7]/50 hover:text-[#0E6E68] flex items-center gap-3 transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-base">payments</span>
                    <span>Payroll &amp; Tax</span>
                  </div>
                  <div class="px-3 py-2 rounded-xl hover:bg-[#DCEBE7]/50 hover:text-[#0E6E68] flex items-center gap-3 transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-base">trending_up</span>
                    <span>Performance OKRs</span>
                  </div>
                  <div class="px-3 py-2 rounded-xl hover:bg-[#DCEBE7]/50 hover:text-[#0E6E68] flex items-center gap-3 transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-base">monitoring</span>
                    <span>HR Analytics</span>
                  </div>
                </div>

                <!-- Plan Usage Card -->
                <div class="p-3.5 rounded-2xl bg-[#DCEBE7]/60 border border-[#DCEBE7] text-xs space-y-2">
                  <div class="flex justify-between font-bold text-[#063B39]">
                    <span>Seats Used</span>
                    <span class="text-[#0E6E68]">2,840 / 3,000</span>
                  </div>
                  <div class="w-full bg-[#DCEBE7] rounded-full h-1.5 overflow-hidden">
                    <div class="bg-[#0E6E68] h-1.5 rounded-full w-[94%]"></div>
                  </div>
                  <span class="text-[10px] text-[#0E6E68]/70 block">Enterprise Tier Active</span>
                </div>

              </div>

              <!-- Main Dashboard Workspace -->
              <div class="lg:col-span-9 p-6 sm:p-8 space-y-6 bg-white">
                
                <!-- Workspace Topbar -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCEBE7]">
                  <div>
                    <h3 class="text-xl font-bold text-[#063B39] font-heading">Executive Workforce Overview</h3>
                    <p class="text-xs text-[#0E6E68]/70">Live operational sync across 8 international offices</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-sm">search</span>
                      <input 
                        type="text" 
                        placeholder="Search employee, team, tag..." 
                        class="pl-8 pr-4 py-1.5 text-xs bg-[#fafdfc] border border-[#DCEBE7] rounded-lg text-slate-700 w-44 sm:w-56 focus:outline-none focus:border-[#0E6E68]"
                        readonly
                      />
                    </div>
                    <button class="p-1.5 rounded-lg bg-[#DCEBE7] text-[#0E6E68] border border-[#DCEBE7] hover:bg-[#DCEBE7]/70 cursor-pointer">
                      <span class="material-symbols-outlined text-base">notifications</span>
                    </button>
                  </div>
                </div>

                <!-- Showcase Metrics Row -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 showcase-widget">
                  
                  <div class="p-4 rounded-xl bg-[#DCEBE7]/30 border border-[#DCEBE7]">
                    <span class="text-xs text-[#0E6E68]/70 font-medium">Headcount</span>
                    <div class="text-2xl font-extrabold text-[#063B39] mt-1">2,840</div>
                    <div class="text-[11px] text-emerald-600 font-semibold mt-0.5">+48 New this month</div>
                  </div>

                  <div class="p-4 rounded-xl bg-[#DCEBE7]/30 border border-[#DCEBE7]">
                    <span class="text-xs text-[#0E6E68]/70 font-medium">Attendance Rate</span>
                    <div class="text-2xl font-extrabold text-[#063B39] mt-1">98.4%</div>
                    <div class="text-[11px] text-[#0E6E68] font-semibold mt-0.5">Top 1% benchmark</div>
                  </div>

                  <div class="p-4 rounded-xl bg-[#DCEBE7]/30 border border-[#DCEBE7]">
                    <span class="text-xs text-[#0E6E68]/70 font-medium">Next Payroll</span>
                    <div class="text-2xl font-extrabold text-[#063B39] mt-1">Aug 31</div>
                    <div class="text-[11px] text-[#0E6E68] font-semibold mt-0.5">Automated batch ready</div>
                  </div>

                </div>

                <!-- Split Content: Attendance Chart Mock & Recent Directory -->
                <div class="grid grid-cols-1 md:grid-cols-12 gap-6 showcase-widget">
                  
                  <!-- Weekly Attendance Visualization -->
                  <div class="md:col-span-7 p-4 rounded-xl border border-[#DCEBE7] bg-[#fafdfc] space-y-3">
                    <div class="flex justify-between items-center text-xs font-bold text-[#063B39]">
                      <span>Weekly Attendance Trends</span>
                      <span class="text-slate-500 text-[10px]">Mon – Fri Avg</span>
                    </div>

                    <!-- Visual Chart Bars -->
                    <div class="h-32 flex items-end justify-between gap-3 pt-4 px-2">
                      <div class="flex-1 flex flex-col items-center gap-1.5">
                        <div class="w-full bg-[#0E6E68] rounded-t-md h-[92%]"></div>
                        <span class="text-[10px] text-slate-500">Mon</span>
                      </div>
                      <div class="flex-1 flex flex-col items-center gap-1.5">
                        <div class="w-full bg-[#0E6E68] rounded-t-md h-[96%]"></div>
                        <span class="text-[10px] text-slate-500">Tue</span>
                      </div>
                      <div class="flex-1 flex flex-col items-center gap-1.5">
                        <div class="w-full bg-[#0E6E68] rounded-t-md h-[98%]"></div>
                        <span class="text-[10px] text-slate-500">Wed</span>
                      </div>
                      <div class="flex-1 flex flex-col items-center gap-1.5">
                        <div class="w-full bg-[#0E6E68] rounded-t-md h-[95%]"></div>
                        <span class="text-[10px] text-slate-500">Thu</span>
                      </div>
                      <div class="flex-1 flex flex-col items-center gap-1.5">
                        <div class="w-full bg-[#3FA79B] rounded-t-md h-[94%]"></div>
                        <span class="text-[10px] text-slate-500">Fri</span>
                      </div>
                    </div>
                  </div>

                  <!-- Quick Employee Roster -->
                  <div class="md:col-span-5 p-4 rounded-xl border border-[#DCEBE7] bg-white space-y-3">
                    <div class="flex justify-between items-center text-xs font-bold text-[#063B39]">
                      <span>Recent Employees</span>
                      <span class="text-[#0E6E68] text-[10px] font-bold cursor-pointer hover:underline">View All</span>
                    </div>

                    <div class="space-y-2.5 text-xs">
                      <div class="flex items-center justify-between p-1.5 hover:bg-[#DCEBE7]/20 rounded-lg">
                        <div class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-full bg-[#0E6E68] text-white font-bold text-[9px] flex items-center justify-center">AR</div>
                          <div>
                            <div class="font-bold text-[#063B39]">Alex Rivera</div>
                            <div class="text-[10px] text-slate-400">Engineering</div>
                          </div>
                        </div>
                        <span class="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">Active</span>
                      </div>

                      <div class="flex items-center justify-between p-1.5 hover:bg-[#DCEBE7]/20 rounded-lg">
                        <div class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-full bg-[#3FA79B] text-white font-bold text-[9px] flex items-center justify-center">KL</div>
                          <div>
                            <div class="font-bold text-[#063B39]">Karen Lin</div>
                            <div class="text-[10px] text-slate-400">Product Design</div>
                          </div>
                        </div>
                        <span class="px-2 py-0.5 bg-[#DCEBE7] text-[#0E6E68] rounded-full text-[10px] font-bold">Remote</span>
                      </div>

                      <div class="flex items-center justify-between p-1.5 hover:bg-[#DCEBE7]/20 rounded-lg">
                        <div class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-full bg-[#063B39] text-white font-bold text-[9px] flex items-center justify-center">DM</div>
                          <div>
                            <div class="font-bold text-[#063B39]">David Miller</div>
                            <div class="text-[10px] text-slate-400">Finance &amp; Ops</div>
                          </div>
                        </div>
                        <span class="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">Active</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 6. HR WORKFLOW SECTION (4 Steps)           -->
      <!-- ========================================== -->
      <section class="relative z-10 py-24 sm:py-32 px-6 sm:px-10 max-w-7xl mx-auto workflow-section">
        
        <div class="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
            Simple 4-Step Process
          </div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
            How Workora Simplifies HR
          </h2>
          <p class="text-base sm:text-lg text-slate-600">
            From hire to retire, automate the entire employee lifecycle with precision and ease.
          </p>
        </div>

        <!-- 4-Step Timeline Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          <!-- Connecting Line for Desktop -->
          <div class="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-[#DCEBE7] via-[#3FA79B] to-[#DCEBE7] z-0"></div>

          <!-- Step 1: Add Your Team -->
          <div class="relative z-10 bg-white p-7 rounded-2xl border border-[#DCEBE7] shadow-2xs hover:shadow-md transition-all text-center md:text-left workflow-step">
            <div class="w-12 h-12 rounded-xl bg-[#DCEBE7] border border-[#DCEBE7] text-[#0E6E68] font-extrabold font-heading text-lg flex items-center justify-center mx-auto md:mx-0 mb-5 shadow-2xs">
              01
            </div>
            <h3 class="text-lg font-bold text-[#063B39] mb-2 font-heading">Add Your Team</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Create and manage comprehensive employee profiles, roles, and digital onboarding documents with automated invitation links.
            </p>
          </div>

          <!-- Step 2: Automate HR -->
          <div class="relative z-10 bg-white p-7 rounded-2xl border border-[#DCEBE7] shadow-2xs hover:shadow-md transition-all text-center md:text-left workflow-step">
            <div class="w-12 h-12 rounded-xl bg-[#DCEBE7] border border-[#DCEBE7] text-[#0E6E68] font-extrabold font-heading text-lg flex items-center justify-center mx-auto md:mx-0 mb-5 shadow-2xs">
              02
            </div>
            <h3 class="text-lg font-bold text-[#063B39] mb-2 font-heading">Automate HR</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Simplify attendance, time tracking, leave approvals, and payroll workflows without redundant manual spreadsheets.
            </p>
          </div>

          <!-- Step 3: Monitor Performance -->
          <div class="relative z-10 bg-white p-7 rounded-2xl border border-[#DCEBE7] shadow-2xs hover:shadow-md transition-all text-center md:text-left workflow-step">
            <div class="w-12 h-12 rounded-xl bg-[#DCEBE7] border border-[#DCEBE7] text-[#0E6E68] font-extrabold font-heading text-lg flex items-center justify-center mx-auto md:mx-0 mb-5 shadow-2xs">
              03
            </div>
            <h3 class="text-lg font-bold text-[#063B39] mb-2 font-heading">Monitor Performance</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Track employee goals, OKRs, regular 1-on-1 reviews, and organization-wide health metrics in real time.
            </p>
          </div>

          <!-- Step 4: Grow Your Business -->
          <div class="relative z-10 bg-white p-7 rounded-2xl border border-[#DCEBE7] shadow-2xs hover:shadow-md transition-all text-center md:text-left workflow-step">
            <div class="w-12 h-12 rounded-xl bg-[#DCEBE7] border border-[#DCEBE7] text-[#0E6E68] font-extrabold font-heading text-lg flex items-center justify-center mx-auto md:mx-0 mb-5 shadow-2xs">
              04
            </div>
            <h3 class="text-lg font-bold text-[#063B39] mb-2 font-heading">Grow Your Business</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Use actionable HR data, attrition forecasting, and cost analytics to make confident executive decisions.
            </p>
          </div>

        </div>

      </section>

      <!-- ========================================== -->
      <!-- 7. WHY WORKORA SECTION (4 Benefits)        -->
      <!-- ========================================== -->
      <section id="why-workora" class="relative z-10 py-24 sm:py-32 bg-white border-y border-[#DCEBE7] scroll-mt-20 why-section">
        <div class="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
              The Workora Advantage
            </div>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Built for Modern HR Teams
            </h2>
            <p class="text-base sm:text-lg text-slate-600">
              Engineered for speed, built for enterprise scale, and designed for employee delight.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- Benefit 1: Simple & Intuitive -->
            <div class="p-8 rounded-3xl bg-[#fafdfc] border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:bg-[#DCEBE7]/20 transition-all space-y-4 why-card">
              <div class="w-12 h-12 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl">touch_app</span>
              </div>
              <h3 class="text-2xl font-bold text-[#063B39] font-heading">Simple &amp; Intuitive</h3>
              <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
                Zero training required. An intuitive, frictionless interface that employees love using daily and HR managers master in minutes.
              </p>
            </div>

            <!-- Benefit 2: Secure & Reliable -->
            <div class="p-8 rounded-3xl bg-[#fafdfc] border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:bg-[#DCEBE7]/20 transition-all space-y-4 why-card">
              <div class="w-12 h-12 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl">verified_user</span>
              </div>
              <h3 class="text-2xl font-bold text-[#063B39] font-heading">Secure &amp; Reliable</h3>
              <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
                Enterprise-grade architecture with 99.9% guaranteed uptime, granular role permissions, continuous audits, and disaster-recovery safeguards.
              </p>
            </div>

            <!-- Benefit 3: Automated Workflows -->
            <div class="p-8 rounded-3xl bg-[#fafdfc] border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:bg-[#DCEBE7]/20 transition-all space-y-4 why-card">
              <div class="w-12 h-12 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl">bolt</span>
              </div>
              <h3 class="text-2xl font-bold text-[#063B39] font-heading">Automated Workflows</h3>
              <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
                Eliminate repetitive administrative chores. Workora automates shift reminders, leave accruals, tax calculations, and compliance alerts.
              </p>
            </div>

            <!-- Benefit 4: Powerful Insights -->
            <div class="p-8 rounded-3xl bg-[#fafdfc] border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:bg-[#DCEBE7]/20 transition-all space-y-4 why-card">
              <div class="w-12 h-12 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl">query_stats</span>
              </div>
              <h3 class="text-2xl font-bold text-[#063B39] font-heading">Powerful Insights</h3>
              <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
                Transform raw personnel records into real-time business intelligence to minimize turnover and optimize workforce budgeting.
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 8. SECURITY SECTION                        -->
      <!-- ========================================== -->
      <section id="security" class="relative z-10 py-24 sm:py-32 px-6 sm:px-10 max-w-7xl mx-auto scroll-mt-20 security-section">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div class="lg:col-span-6 space-y-6">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
              Enterprise Trust &amp; Privacy
            </div>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Your People Data. Protected.
            </h2>
            <p class="text-base sm:text-lg text-slate-600 leading-relaxed">
              We understand that human resource data is your company's most sensitive asset. Workora is architected with defense-in-depth protection at every tier.
            </p>

            <div class="space-y-4 pt-2">
              <div class="flex items-start gap-3.5">
                <div class="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-1">
                  <span class="material-symbols-outlined text-base">check</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-[#063B39]">Secure Access &amp; Multi-Factor Auth</h4>
                  <p class="text-xs text-[#0E6E68]/70">Enforce SSO, MFA, and biometric authentication protocols for all team members.</p>
                </div>
              </div>

              <div class="flex items-start gap-3.5">
                <div class="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-1">
                  <span class="material-symbols-outlined text-base">check</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-[#063B39]">Granular Role-Based Permissions (RBAC)</h4>
                  <p class="text-xs text-[#0E6E68]/70">Fine-grained access controls ensuring managers and admins see only what is permitted.</p>
                </div>
              </div>

              <div class="flex items-start gap-3.5">
                <div class="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-1">
                  <span class="material-symbols-outlined text-base">check</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-[#063B39]">End-to-End Data Encryption</h4>
                  <p class="text-xs text-[#0E6E68]/70">All records encrypted in transit (TLS 1.3) and at rest (AES-256) with strict key rotation.</p>
                </div>
              </div>

              <div class="flex items-start gap-3.5">
                <div class="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-1">
                  <span class="material-symbols-outlined text-base">check</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-[#063B39]">Privacy-First Compliance</h4>
                  <p class="text-xs text-[#0E6E68]/70">Compliant architecture supporting data retention limits, audit logging, and employee privacy rights.</p>
                </div>
              </div>
            </div>

          </div>

          <!-- Right Shield Security Graphic Card -->
          <div class="lg:col-span-6 flex justify-center">
            <div class="relative w-full max-w-md bg-gradient-to-br from-[#063B39] via-[#0E6E68] to-[#063B39] text-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#3FA79B]/20 overflow-hidden">
              
              <!-- Subtle glow background circle -->
              <div class="absolute -top-20 -right-20 w-60 h-60 bg-[#3FA79B]/20 rounded-full blur-3xl"></div>

              <div class="relative z-10 space-y-6 text-center">
                <div class="w-20 h-20 mx-auto rounded-3xl bg-[#3FA79B]/15 border border-[#3FA79B]/30 flex items-center justify-center text-[#3FA79B] shadow-inner">
                  <span class="material-symbols-outlined text-5xl">shield_lock</span>
                </div>

                <div class="space-y-2">
                  <h3 class="text-2xl font-bold font-heading">Enterprise Security Vault</h3>
                  <p class="text-xs text-slate-200 max-w-xs mx-auto">
                    Continuous real-time threat monitoring and encrypted database segregation.
                  </p>
                </div>

                <div class="pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-left">
                  <div class="p-3 bg-white/5 rounded-xl border border-white/10">
                    <div class="text-[10px] text-slate-300">Encryption Standard</div>
                    <div class="text-xs font-bold text-white mt-0.5">AES-256 / TLS 1.3</div>
                  </div>
                  <div class="p-3 bg-white/5 rounded-xl border border-white/10">
                    <div class="text-[10px] text-slate-300">Audit Status</div>
                    <div class="text-xs font-bold text-emerald-300 mt-0.5">Continuous Logs</div>
                  </div>
                </div>

                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Shield Protocol
                </div>
              </div>

            </div>
          </div>

        </div>

      </section>

      <!-- ========================================== -->
      <!-- 9. TESTIMONIALS SECTION                    -->
      <!-- ========================================== -->
      <section class="relative z-10 py-24 sm:py-32 bg-[#fafdfc] border-t border-[#DCEBE7] testimonials-section">
        <div class="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
              Customer Stories
            </div>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Loved by HR Teams
            </h2>
            <p class="text-base sm:text-lg text-slate-600">
              See how forward-thinking companies transform their operations with Workora.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <!-- Testimonial 1 -->
            <div class="workora-card p-8 rounded-2xl flex flex-col justify-between testimonial-card border border-[#DCEBE7]">
              <div class="space-y-4">
                <!-- Stars -->
                <div class="flex text-amber-400 text-base">
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                </div>
                <p class="text-sm text-slate-700 leading-relaxed italic">
                  "Workora cut our payroll processing time by 75% and completely eliminated the chaos of manual attendance tracking for our remote engineers."
                </p>
              </div>

              <div class="mt-8 pt-6 border-t border-[#DCEBE7] flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#0E6E68] text-white font-bold text-xs flex items-center justify-center">
                  ER
                </div>
                <div>
                  <h4 class="text-xs font-bold text-[#063B39]">Elena Rostova</h4>
                  <p class="text-[11px] text-[#0E6E68]/70">Chief People Officer, Horizon Tech</p>
                </div>
              </div>
            </div>

            <!-- Testimonial 2 -->
            <div class="workora-card p-8 rounded-2xl flex flex-col justify-between testimonial-card border border-[#DCEBE7]">
              <div class="space-y-4">
                <div class="flex text-amber-400 text-base">
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                </div>
                <p class="text-sm text-slate-700 leading-relaxed italic">
                  "Managing 1,500+ employees across four branch offices used to require four different tools. Workora brought everything together into one crystal clear dashboard."
                </p>
              </div>

              <div class="mt-8 pt-6 border-t border-[#DCEBE7] flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#3FA79B] text-white font-bold text-xs flex items-center justify-center">
                  MV
                </div>
                <div>
                  <h4 class="text-xs font-bold text-[#063B39]">Marcus Vance</h4>
                  <p class="text-[11px] text-[#0E6E68]/70">VP of People &amp; Culture, Strata Global</p>
                </div>
              </div>
            </div>

            <!-- Testimonial 3 -->
            <div class="workora-card p-8 rounded-2xl flex flex-col justify-between testimonial-card border border-[#DCEBE7]">
              <div class="space-y-4">
                <div class="flex text-amber-400 text-base">
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                </div>
                <p class="text-sm text-slate-700 leading-relaxed italic">
                  "The leave management and 1-click approvals saved our team countless hours every week. Our staff actually enjoys using the self-service mobile portal."
                </p>
              </div>

              <div class="mt-8 pt-6 border-t border-[#DCEBE7] flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#063B39] text-white font-bold text-xs flex items-center justify-center">
                  PS
                </div>
                <div>
                  <h4 class="text-xs font-bold text-[#063B39]">Priya Sharma</h4>
                  <p class="text-[11px] text-[#0E6E68]/70">Head of HR Operations, Lumina Health</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 10. CTA SECTION                            -->
      <!-- ========================================== -->
      <section id="contact" class="relative z-10 py-20 sm:py-28 px-6 sm:px-10 max-w-7xl mx-auto scroll-mt-20 cta-section">
        <div class="relative bg-gradient-to-br from-[#0E6E68] via-[#063B39] to-[#063B39] text-white rounded-3xl p-10 sm:p-16 text-center shadow-2xl overflow-hidden">
          
          <!-- Ambient Background Orbs inside CTA -->
          <div class="absolute top-0 right-0 w-96 h-96 bg-[#3FA79B]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 w-80 h-80 bg-[#DCEBE7]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 max-w-3xl mx-auto space-y-6">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#DCEBE7] text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Transform Your Workplace
            </div>
            
            <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight">
              Ready to Make HR Simpler?
            </h2>

            <p class="text-base sm:text-lg text-[#DCEBE7] leading-relaxed max-w-2xl mx-auto">
              Bring your HR operations together with Workora and give your team the tools they need to work smarter.
            </p>

            <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                routerLink="/login" 
                class="w-full sm:w-auto px-9 py-4 rounded-xl bg-white text-[#063B39] font-extrabold text-base shadow-xl hover:bg-[#DCEBE7] hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border-none"
              >
                <span>Get Started with Workora</span>
                <span class="material-symbols-outlined text-xl">arrow_forward</span>
              </a>
              <button 
                (click)="scrollToSection('showcase')"
                class="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold text-base transition-all cursor-pointer backdrop-blur-sm"
              >
                Schedule a Demo
              </button>
            </div>

            <div class="pt-4 text-xs text-[#DCEBE7]/80">
              No credit card required • Instant setup • 14-day full access trial
            </div>
          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 11. FOOTER                                 -->
      <!-- ========================================== -->
      <footer class="relative z-10 bg-white border-t border-[#DCEBE7] pt-16 pb-12 px-6 sm:px-10">
        <div class="max-w-7xl mx-auto">
          
          <div class="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-[#DCEBE7]">
            
            <!-- Brand Column (2 cols) -->
            <div class="col-span-2 space-y-4">
              <a (click)="scrollToTop()" class="flex items-center gap-3 cursor-pointer group">
                <img src="/workoraLogo.png" alt="Workora Logo" class="h-8 w-auto object-contain drop-shadow-xs" />
                <span class="text-xl font-extrabold text-[#063B39] font-heading">Workora</span>
              </a>
              <p class="text-xs text-slate-600 leading-relaxed max-w-sm">
                The modern Human Resource Management System built for agile companies. Streamline workforce operations, payroll, attendance, and employee success in one unified platform.
              </p>
              <div class="flex items-center gap-3 pt-2 text-slate-400">
                <a class="w-8 h-8 rounded-lg bg-[#DCEBE7]/40 hover:bg-[#DCEBE7] hover:text-[#0E6E68] flex items-center justify-center transition-colors cursor-pointer" aria-label="Globe">
                  <span class="material-symbols-outlined text-base">language</span>
                </a>
                <a class="w-8 h-8 rounded-lg bg-[#DCEBE7]/40 hover:bg-[#DCEBE7] hover:text-[#0E6E68] flex items-center justify-center transition-colors cursor-pointer" aria-label="Security">
                  <span class="material-symbols-outlined text-base">verified_user</span>
                </a>
                <a class="w-8 h-8 rounded-lg bg-[#DCEBE7]/40 hover:bg-[#DCEBE7] hover:text-[#0E6E68] flex items-center justify-center transition-colors cursor-pointer" aria-label="Terminal">
                  <span class="material-symbols-outlined text-base">terminal</span>
                </a>
              </div>
            </div>

            <!-- Product Links -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Product</h4>
              <ul class="space-y-2 text-xs text-slate-600">
                <li><a (click)="scrollToSection('features')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Employee Management</a></li>
                <li><a (click)="scrollToSection('features')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Attendance &amp; Time</a></li>
                <li><a (click)="scrollToSection('features')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Leave Management</a></li>
                <li><a (click)="scrollToSection('features')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Payroll Engine</a></li>
                <li><a (click)="scrollToSection('features')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Performance OKRs</a></li>
                <li><a (click)="scrollToSection('features')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">HR Analytics</a></li>
              </ul>
            </div>

            <!-- Company Links -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Company</h4>
              <ul class="space-y-2 text-xs text-slate-600">
                <li><a (click)="scrollToSection('why-workora')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">About Workora</a></li>
                <li><a (click)="scrollToSection('why-workora')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Leadership &amp; Values</a></li>
                <li><a (click)="scrollToSection('security')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Security &amp; Trust</a></li>
                <li><a (click)="scrollToSection('contact')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Contact Sales</a></li>
                <li><a class="hover:text-[#0E6E68] transition-colors cursor-pointer">Careers (We're Hiring)</a></li>
              </ul>
            </div>

            <!-- Resources & Legal -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Resources</h4>
              <ul class="space-y-2 text-xs text-slate-600">
                <li><a class="hover:text-[#0E6E68] transition-colors cursor-pointer">Documentation</a></li>
                <li><a class="hover:text-[#0E6E68] transition-colors cursor-pointer">API Reference</a></li>
                <li><a class="hover:text-[#0E6E68] transition-colors cursor-pointer">Privacy Policy</a></li>
                <li><a class="hover:text-[#0E6E68] transition-colors cursor-pointer">Terms of Service</a></li>
                <li><a class="hover:text-[#0E6E68] transition-colors cursor-pointer">System Status (99.9%)</a></li>
              </ul>
            </div>

          </div>

          <!-- Bottom Copyright -->
          <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              &copy; 2026 Workora. All rights reserved.
            </div>
            <div class="flex items-center gap-6">
              <a class="hover:text-[#0E6E68] transition-colors cursor-pointer">Privacy</a>
              <a class="hover:text-[#0E6E68] transition-colors cursor-pointer">Terms</a>
              <a class="hover:text-[#0E6E68] transition-colors cursor-pointer">Cookies</a>
              <a class="hover:text-[#0E6E68] transition-colors cursor-pointer">Security</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  `
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('navbarRef', { static: false }) navbarRef!: ElementRef<HTMLElement>;
  @ViewChild('statCount1', { static: false }) statCount1!: ElementRef<HTMLElement>;
  @ViewChild('statCount2', { static: false }) statCount2!: ElementRef<HTMLElement>;
  @ViewChild('statCount3', { static: false }) statCount3!: ElementRef<HTMLElement>;

  readonly isScrolled = signal<boolean>(false);
  readonly isMobileMenuOpen = signal<boolean>(false);

  private ctx: gsap.Context | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.isScrolled.set(scrollPos > 30);
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Setup GSAP Context for safe cleanup
    this.ctx = gsap.context(() => {
      
      // 1. HERO ENTRANCE TIMELINE
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Navbar entrance
      heroTl.from('.gsap-nav-item', {
        opacity: 0,
        y: -15,
        stagger: 0.08,
        duration: 0.6
      });

      // Hero Badge
      heroTl.from('.gsap-hero-badge', {
        opacity: 0,
        y: 20,
        duration: 0.6
      }, '-=0.3');

      // Hero Headline line-by-line reveal
      heroTl.from('.gsap-hero-title-line', {
        opacity: 0,
        y: 35,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power4.out'
      }, '-=0.4');

      // Hero Description
      heroTl.from('.gsap-hero-desc', {
        opacity: 0,
        y: 20,
        duration: 0.7
      }, '-=0.5');

      // Hero CTAs
      heroTl.from('.gsap-hero-cta', {
        opacity: 0,
        y: 20,
        scale: 0.95,
        stagger: 0.1,
        duration: 0.7,
        ease: 'back.out(1.4)'
      }, '-=0.5');

      // Hero Dashboard Mockup slide in from right with subtle perspective
      heroTl.from('.gsap-hero-dashboard', {
        opacity: 0,
        x: 60,
        duration: 1.0,
        ease: 'power3.out'
      }, '-=0.7');

      // Dashboard Sub-cards inside mockup
      heroTl.from('.gsap-dash-card', {
        opacity: 0,
        y: 15,
        stagger: 0.1,
        duration: 0.6
      }, '-=0.5');


      // 2. STATISTICS NUMBER COUNTERS (ScrollTrigger)
      ScrollTrigger.create({
        trigger: '.stats-section',
        start: 'top 80%',
        onEnter: () => {
          if (this.statCount1?.nativeElement) {
            this.animateCounter(this.statCount1.nativeElement, 0, 10, 1.5);
          }
          if (this.statCount2?.nativeElement) {
            this.animateCounter(this.statCount2.nativeElement, 0, 500, 2);
          }
          if (this.statCount3?.nativeElement) {
            this.animateCounter(this.statCount3.nativeElement, 0, 99.9, 2, 1);
          }
        },
        once: true
      });

      // 3. FEATURES CARDS STAGGERED REVEAL
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
      });

      // 4. PRODUCT SHOWCASE SECTION REVEAL
      gsap.from('.showcase-container', {
        scrollTrigger: {
          trigger: '#showcase',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        scale: 0.92,
        y: 40,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out'
      });

      gsap.from('.showcase-widget', {
        scrollTrigger: {
          trigger: '.showcase-container',
          start: 'top 70%',
          toggleActions: 'play none none none'
        },
        y: 25,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out'
      });

      // 5. HR WORKFLOW STEPS REVEAL
      gsap.from('.workflow-step', {
        scrollTrigger: {
          trigger: '.workflow-section',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        y: 35,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out'
      });

      // 6. WHY WORKORA BENEFITS REVEAL
      gsap.from('.why-card', {
        scrollTrigger: {
          trigger: '.why-section',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out'
      });

      // 7. SECURITY SECTION REVEAL
      gsap.from('.security-section', {
        scrollTrigger: {
          trigger: '.security-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      });

      // 8. TESTIMONIALS CARDS REVEAL
      gsap.from('.testimonial-card', {
        scrollTrigger: {
          trigger: '.testimonials-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out'
      });

      // 9. CTA SECTION REVEAL
      gsap.from('.cta-section', {
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        scale: 0.96,
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      });

    });
  }

  ngOnDestroy(): void {
    if (this.ctx) {
      this.ctx.revert(); // Revert all animations and kill ScrollTriggers
    }
  }

  /**
   * Smoothly animates a numeric value from start to end with configurable decimals.
   */
  private animateCounter(element: HTMLElement, start: number, end: number, duration: number, decimals: number = 0): void {
    const obj = { val: start };
    gsap.to(obj, {
      val: end,
      duration: duration,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = decimals > 0 ? obj.val.toFixed(decimals) : Math.floor(obj.val).toString();
      }
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(prev => !prev);
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  scrollToSection(sectionId: string): void {
    this.isMobileMenuOpen.set(false);
    
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }
}
