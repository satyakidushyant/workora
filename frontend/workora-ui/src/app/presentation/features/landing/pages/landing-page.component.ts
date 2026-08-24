import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild, signal, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Workora Enterprise HRMS Landing Page Component.
 * Complete 10-section implementation per Workora Master Prompt:
 * 1. Navbar
 * 2. Hero Section & Stylized Dashboard Mockup
 * 3. Product Preview Showcase
 * 4. HRMS Features Section (8 Capabilities)
 * 5. Workforce Statistics Section (Animated Counters)
 * 6. How Workora Works (3-Step Process)
 * 7. Benefits Section (6 Key Advantages)
 * 8. Security / Trust Section (#063B39 Dark Vault)
 * 9. Final CTA Section (#DCEBE7 Light Mint Container)
 * 10. Enterprise Footer
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
      <!-- 1. FLOATING GLASS CAPSULE NAVBAR           -->
      <!-- ========================================== -->
      <header class="fixed top-2 xs:top-3 sm:top-5 inset-x-0 z-50 px-3 xs:px-4 sm:px-8 max-w-7xl 2xl:max-w-8xl mx-auto">
        <div 
          #navbarRef 
          [ngClass]="{
            'bg-white/95 backdrop-blur-2xl shadow-[0_14px_35px_-10px_rgba(14,110,104,0.16)] border-[#DCEBE7] py-2 sm:py-2.5': isScrolled(),
            'bg-white/85 backdrop-blur-xl shadow-[0_8px_25px_-5px_rgba(14,110,104,0.08)] border-white/90 py-2 xs:py-2.5 sm:py-3': !isScrolled()
          }"
          class="w-full border rounded-full px-3 xs:px-5 sm:px-8 flex items-center justify-between transition-all duration-300"
        >
          
          <!-- Big Sharp 3D Logo Only (Brand Text Removed) -->
          <a (click)="scrollToTop()" class="flex items-center cursor-pointer group focus:outline-none py-1" aria-label="Workora Home">
            <img 
              src="/workoraLogo.png" 
              alt="Workora 3D Logo" 
              class="h-9 xs:h-10 sm:h-12 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_4px_10px_rgba(14,110,104,0.25)] group-hover:drop-shadow-[0_6px_16px_rgba(63,167,155,0.4)]"
            />
          </a>

          <!-- Center Navigation Links -->
          <nav class="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm font-bold text-[#063B39]">
            <a (click)="scrollToSection('showcase')" class="hover:text-[#0E6E68] transition-colors cursor-pointer py-1 relative group/link">
              <span>Product</span>
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0E6E68] rounded-full group-hover/link:w-full transition-all duration-300"></span>
            </a>
            <a (click)="scrollToSection('features')" class="hover:text-[#0E6E68] transition-colors cursor-pointer py-1 relative group/link">
              <span>Features</span>
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0E6E68] rounded-full group-hover/link:w-full transition-all duration-300"></span>
            </a>
            <a (click)="scrollToSection('how-it-works')" class="hover:text-[#0E6E68] transition-colors cursor-pointer py-1 relative group/link">
              <span>Solutions</span>
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0E6E68] rounded-full group-hover/link:w-full transition-all duration-300"></span>
            </a>
            <a (click)="scrollToSection('security')" class="hover:text-[#0E6E68] transition-colors cursor-pointer py-1 relative group/link">
              <span>Security</span>
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0E6E68] rounded-full group-hover/link:w-full transition-all duration-300"></span>
            </a>
          </nav>

          <!-- Right Action CTAs -->
          <div class="flex items-center gap-2 xs:gap-3">
            <a 
              routerLink="/login" 
              class="hidden sm:inline-flex text-xs lg:text-sm font-bold text-[#063B39] hover:text-[#0E6E68] hover:bg-[#DCEBE7]/50 px-3 sm:px-4 py-2 rounded-full transition-all cursor-pointer"
            >
              Login
            </a>
            <a 
              routerLink="/login" 
              class="inline-flex items-center justify-center gap-1.5 xs:gap-2 px-3.5 xs:px-5 py-2 xs:py-2.5 rounded-full bg-gradient-to-r from-[#0E6E68] to-[#063B39] text-white text-xs xs:text-sm font-extrabold shadow-md shadow-[#0E6E68]/20 hover:shadow-lg hover:shadow-[#0E6E68]/35 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <span class="material-symbols-outlined text-sm xs:text-base">arrow_forward</span>
            </a>

            <!-- Mobile Hamburger Button -->
            <button 
              (click)="toggleMobileMenu()"
              class="md:hidden p-1.5 xs:p-2 rounded-full text-[#063B39] hover:bg-[#DCEBE7]/50 transition-colors bg-transparent cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <span class="material-symbols-outlined text-xl xs:text-2xl flex items-center justify-center">
                {{ isMobileMenuOpen() ? 'close' : 'menu' }}
              </span>
            </button>
          </div>
        </div>
      </header>

      <!-- Mobile Dropdown Menu -->
      @if (isMobileMenuOpen()) {
        <div class="md:hidden fixed top-16 xs:top-20 left-3 right-3 xs:left-4 xs:right-4 bg-white/95 backdrop-blur-2xl rounded-3xl p-5 xs:p-6 shadow-2xl border border-[#DCEBE7] z-50 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
          <div class="flex justify-center pb-2 border-b border-[#DCEBE7]/60">
            <img src="/workoraLogo.png" alt="Workora Logo" class="h-10 xs:h-12 w-auto object-contain filter drop-shadow-md" />
          </div>
          <nav class="flex flex-col space-y-2.5 font-semibold text-sm xs:text-base text-[#063B39]">
            <a (click)="scrollToSection('showcase')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors cursor-pointer">Product</a>
            <a (click)="scrollToSection('features')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors cursor-pointer">Features</a>
            <a (click)="scrollToSection('how-it-works')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors cursor-pointer">Solutions</a>
            <a (click)="scrollToSection('security')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors cursor-pointer">Security</a>
          </nav>
          <div class="pt-3 border-t border-[#DCEBE7] flex flex-col gap-2.5">
            <a routerLink="/login" (click)="isMobileMenuOpen.set(false)" class="w-full py-2.5 text-center font-bold text-[#063B39] bg-[#DCEBE7]/50 rounded-xl hover:bg-[#DCEBE7] text-xs xs:text-sm">Login</a>
            <a routerLink="/login" (click)="isMobileMenuOpen.set(false)" class="w-full py-2.5 text-center font-bold text-white bg-[#0E6E68] rounded-xl hover:bg-[#063B39] text-xs xs:text-sm shadow-md">Get Started</a>
          </div>
        </div>
      }

      <!-- ========================================== -->
      <!-- 2. HERO SECTION                            -->
      <!-- ========================================== -->
      <section id="home" class="relative z-10 pt-28 xs:pt-32 sm:pt-40 pb-16 sm:pb-20 lg:pb-32 px-4 xs:px-6 sm:px-10 max-w-7xl 2xl:max-w-8xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <!-- Hero Left Column: Copy & CTAs -->
          <div class="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            <!-- Small Eyebrow -->
            <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] shadow-2xs gsap-hero-badge">
              <span class="flex h-2.5 w-2.5 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3FA79B] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0E6E68]"></span>
              </span>
              <span class="text-xs sm:text-sm font-bold tracking-wide text-[#0E6E68] uppercase">SMART WORKFORCE MANAGEMENT</span>
            </div>

            <!-- Main Heading -->
            <h1 class="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#063B39] leading-[1.15] font-heading">
              <span class="block gsap-hero-title-line">Empower Your People.</span>
              <span class="block text-[#0E6E68] gsap-hero-title-line">Simplify Your Work.</span>
            </h1>

            <!-- Supporting Text -->
            <p class="text-sm xs:text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 gsap-hero-desc">
              Workora brings employee management, workforce operations and HR workflows together in one simple, secure platform.
            </p>

            <!-- CTA Buttons -->
            <div class="space-y-4">
              <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 xs:gap-4">
                <a 
                  routerLink="/login" 
                  class="w-full sm:w-auto px-6 xs:px-8 py-3.5 xs:py-4 rounded-xl bg-[#063B39] hover:bg-[#0E6E68] text-white font-bold text-sm xs:text-base shadow-xl shadow-[#063B39]/20 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer gsap-hero-cta"
                >
                  <span>Get Started</span>
                  <span class="material-symbols-outlined text-lg xs:text-xl">arrow_forward</span>
                </a>
                <button 
                  (click)="scrollToSection('features')"
                  class="w-full sm:w-auto px-6 xs:px-8 py-3.5 xs:py-4 rounded-xl bg-white text-[#063B39] font-bold text-sm xs:text-base border border-[#0E6E68]/30 hover:border-[#0E6E68] hover:bg-[#DCEBE7]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm gsap-hero-cta"
                >
                  <span class="material-symbols-outlined text-lg xs:text-xl text-[#0E6E68]">dashboard_customize</span>
                  <span>Explore Platform</span>
                </button>
              </div>

              <!-- Micro Trust Indicators -->
              <div class="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 xs:gap-6 text-xs text-slate-500 font-medium gsap-hero-desc">
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

          <!-- Hero Visual: Right Column Dashboard Preview -->
          <div class="lg:col-span-5 relative mt-6 lg:mt-0">
            
            <!-- Dashboard Mockup Card -->
            <div class="relative bg-white rounded-2xl border border-[#DCEBE7] shadow-[0_25px_60px_-15px_rgba(14,110,104,0.15)] p-3.5 xs:p-5 space-y-3.5 xs:space-y-4 gsap-hero-dashboard">
              
              <!-- Dashboard Header bar -->
              <div class="flex items-center justify-between pb-3 border-b border-[#DCEBE7]">
                <div class="flex items-center gap-2 xs:gap-2.5 min-w-0">
                  <div class="w-8 h-8 rounded-lg bg-[#DCEBE7]/80 flex items-center justify-center p-1 shrink-0">
                    <img src="/workoraLogo.png" alt="Icon" class="h-6 w-auto object-contain" />
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-xs font-bold text-[#063B39] leading-none truncate">Workora Command Center</h3>
                    <span class="text-[10px] text-[#0E6E68] truncate block">Live Organization Pulse</span>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center gap-1 border border-emerald-200/60 shrink-0">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Operational
                </span>
              </div>

              <!-- Top Metrics Grid (1 col on 360px, 2 col on 375px+) -->
              <div class="grid grid-cols-1 xs:grid-cols-2 gap-2.5 xs:gap-3">
                <!-- Employee Metric -->
                <div class="p-3 xs:p-3.5 rounded-xl bg-gradient-to-br from-[#DCEBE7]/60 to-white border border-[#DCEBE7] shadow-2xs gsap-dash-card">
                  <div class="flex items-center justify-between text-xs text-[#0E6E68] font-medium mb-1">
                    <span>Active Employees</span>
                    <span class="material-symbols-outlined text-[#0E6E68] text-sm">groups</span>
                  </div>
                  <div class="text-lg xs:text-xl font-extrabold text-[#063B39]">2,840</div>
                  <div class="flex items-center gap-1 text-[10px] xs:text-[11px] text-emerald-600 font-semibold mt-1">
                    <span class="material-symbols-outlined text-xs">trending_up</span>
                    <span>+12.4% this quarter</span>
                  </div>
                </div>

                <!-- Today's Attendance -->
                <div class="p-3 xs:p-3.5 rounded-xl bg-gradient-to-br from-[#DCEBE7]/40 to-white border border-[#DCEBE7] shadow-2xs gsap-dash-card">
                  <div class="flex items-center justify-between text-xs text-[#0E6E68] font-medium mb-1">
                    <span>Attendance Rate</span>
                    <span class="material-symbols-outlined text-[#3FA79B] text-sm">how_to_reg</span>
                  </div>
                  <div class="text-lg xs:text-xl font-extrabold text-[#063B39]">98.4%</div>
                  <div class="text-[10px] xs:text-[11px] text-slate-500 font-medium mt-1">2,794 Present • 32 Remote</div>
                </div>
              </div>

              <!-- Live Leave Request Approvals Widget -->
              <div class="p-3 xs:p-3.5 rounded-xl bg-[#fafdfc] border border-[#DCEBE7] space-y-2.5 gsap-dash-card">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-[#063B39] flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[#0E6E68] text-sm">event_available</span>
                    Pending Approvals
                  </span>
                  <span class="text-[10px] text-[#0E6E68] font-bold bg-[#DCEBE7] px-2 py-0.5 rounded-full">2 Requests</span>
                </div>

                <div class="flex items-center justify-between bg-white p-2 xs:p-2.5 rounded-lg border border-[#DCEBE7] shadow-2xs gap-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <div class="w-7 h-7 rounded-full bg-[#0E6E68] text-white font-bold text-[10px] flex items-center justify-center shrink-0">SC</div>
                    <div class="min-w-0">
                      <div class="text-xs font-bold text-[#063B39] truncate">Sarah Connor</div>
                      <div class="text-[10px] text-slate-500 truncate">Annual Leave • 3 Days</div>
                    </div>
                  </div>
                  <span class="px-2.5 py-1 bg-[#0E6E68] text-white text-[10px] font-bold rounded-md hover:bg-[#063B39] transition-colors cursor-pointer shrink-0">Approve</span>
                </div>
              </div>

              <!-- Payroll Mini-Bar Widget -->
              <div class="p-3 xs:p-3.5 rounded-xl bg-gradient-to-r from-[#063B39] to-[#0E6E68] text-white space-y-2 shadow-md gsap-dash-card">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-200 font-medium flex items-center gap-1 truncate">
                    <span class="material-symbols-outlined text-[#3FA79B] text-sm shrink-0">account_balance_wallet</span>
                    August Payroll
                  </span>
                  <span class="font-mono text-emerald-300 font-bold text-xs shrink-0">$482,500.00</span>
                </div>
                <div class="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-gradient-to-r from-[#3FA79B] to-[#DCEBE7] h-1.5 rounded-full w-[85%]"></div>
                </div>
                <div class="flex justify-between text-[10px] text-slate-300">
                  <span>Direct Deposit: 100% Ready</span>
                  <span class="text-[#DCEBE7]">Tax Compliant</span>
                </div>
              </div>

            </div>

            <!-- Floating Micro Badges (Visible on tablet & desktop) -->
            <div class="hidden sm:flex absolute -bottom-5 -left-6 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-xl border border-[#DCEBE7] items-center gap-3 z-20 animate-soft-float">
              <div class="w-9 h-9 rounded-lg bg-[#DCEBE7] flex items-center justify-center text-[#0E6E68]">
                <span class="material-symbols-outlined text-xl">insights</span>
              </div>
              <div>
                <div class="text-xs font-bold text-[#063B39]">94% Goal Velocity</div>
                <div class="text-[10px] text-emerald-600 font-semibold">Q3 Targets on Track</div>
              </div>
            </div>

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
      <!-- 3. PRODUCT PREVIEW SHOWCASE                -->
      <!-- ========================================== -->
      <section id="showcase" class="relative z-10 py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-[#DCEBE7]/40 via-white to-[#fafdfc] border-y border-[#DCEBE7] scroll-mt-20">
        <div class="max-w-7xl 2xl:max-w-8xl mx-auto px-4 xs:px-6 sm:px-10">
          
          <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase shadow-2xs">
              Interactive Platform Showcase
            </div>
            <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Everything You Need to Manage Your Workforce
            </h2>
            <p class="text-xs xs:text-sm sm:text-base lg:text-lg text-slate-600">
              Experience a unified enterprise command center designed for modern human resource leaders.
            </p>
          </div>

          <!-- Product Showcase Mockup Card -->
          <div class="showcase-container bg-white rounded-2xl sm:rounded-3xl border border-[#DCEBE7] shadow-[0_30px_90px_-20px_rgba(14,110,104,0.16)] overflow-hidden">
            
            <!-- Window Header -->
            <div class="bg-[#063B39] px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between text-white border-b border-[#063B39]/80">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="flex gap-1.5 sm:gap-2">
                  <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500"></div>
                  <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400"></div>
                  <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div class="h-4 w-px bg-[#0E6E68] hidden sm:block"></div>
                <div class="hidden sm:flex items-center gap-2 text-xs text-slate-200 font-medium">
                  <img src="/workoraLogo.png" alt="Workora" class="h-4 w-auto" />
                  <span>app.workora.io / Enterprise Dashboard</span>
                </div>
              </div>
              <span class="text-[10px] sm:text-xs bg-[#3FA79B]/20 text-[#3FA79B] px-2.5 sm:px-3 py-1 rounded-full border border-[#3FA79B]/30 font-semibold">
                Workora v2.4 • Active
              </span>
            </div>

            <!-- Main Showcase Grid (Sidebar + Main Workspace) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] sm:min-h-[560px]">
              
              <!-- Sidebar (Hidden on mobile, visible on desktop/large tablet) -->
              <div class="lg:col-span-3 bg-[#fafdfc] border-r border-[#DCEBE7] p-5 space-y-6 hidden lg:block">
                
                <div class="flex items-center gap-3 p-2 rounded-xl bg-white border border-[#DCEBE7]">
                  <img src="/workoraLogo.png" alt="Logo" class="h-7 w-auto" />
                  <div class="overflow-hidden">
                    <div class="text-xs font-extrabold text-[#063B39] truncate">Acme Global HQ</div>
                    <div class="text-[10px] text-[#0E6E68]">Enterprise Workspace</div>
                  </div>
                </div>

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
                    <span>Attendance</span>
                  </div>
                  <div class="px-3 py-2 rounded-xl hover:bg-[#DCEBE7]/50 hover:text-[#0E6E68] flex items-center gap-3 transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-base">event_note</span>
                    <span>Leave Requests</span>
                  </div>
                  <div class="px-3 py-2 rounded-xl hover:bg-[#DCEBE7]/50 hover:text-[#0E6E68] flex items-center gap-3 transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-base">payments</span>
                    <span>Payroll</span>
                  </div>
                  <div class="px-3 py-2 rounded-xl hover:bg-[#DCEBE7]/50 hover:text-[#0E6E68] flex items-center gap-3 transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-base">trending_up</span>
                    <span>Performance</span>
                  </div>
                </div>

                <div class="p-3.5 rounded-2xl bg-[#DCEBE7]/60 border border-[#DCEBE7] text-xs space-y-2">
                  <div class="flex justify-between font-bold text-[#063B39]">
                    <span>Seats Used</span>
                    <span class="text-[#0E6E68]">2,840 / 3,000</span>
                  </div>
                  <div class="w-full bg-[#DCEBE7] rounded-full h-1.5 overflow-hidden">
                    <div class="bg-[#0E6E68] h-1.5 rounded-full w-[94%]"></div>
                  </div>
                </div>

              </div>

              <!-- Main Workspace -->
              <div class="lg:col-span-9 p-4 xs:p-6 sm:p-8 space-y-5 sm:space-y-6 bg-white">
                
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#DCEBE7]">
                  <div>
                    <h3 class="text-lg sm:text-xl font-bold text-[#063B39] font-heading">Executive Workforce Overview</h3>
                    <p class="text-[11px] sm:text-xs text-[#0E6E68]">Live operational sync across 8 international offices</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="relative w-full sm:w-auto">
                      <span class="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-sm pointer-events-none">search</span>
                      <input 
                        type="text" 
                        placeholder="Search employee, team..." 
                        class="pl-8 pr-4 py-1.5 text-xs bg-[#fafdfc] border border-[#DCEBE7] rounded-lg text-slate-700 w-full sm:w-56 focus:outline-none focus:border-[#0E6E68]"
                        readonly
                      />
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 showcase-widget">
                  <div class="p-3.5 sm:p-4 rounded-xl bg-[#DCEBE7]/30 border border-[#DCEBE7]">
                    <span class="text-xs text-[#0E6E68] font-medium">Total Headcount</span>
                    <div class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-1">2,840</div>
                    <div class="text-[10px] sm:text-[11px] text-emerald-600 font-semibold mt-0.5">+48 New this month</div>
                  </div>

                  <div class="p-3.5 sm:p-4 rounded-xl bg-[#DCEBE7]/30 border border-[#DCEBE7]">
                    <span class="text-xs text-[#0E6E68] font-medium">Attendance Rate</span>
                    <div class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-1">98.4%</div>
                    <div class="text-[10px] sm:text-[11px] text-[#0E6E68] font-semibold mt-0.5">Top 1% benchmark</div>
                  </div>

                  <div class="p-3.5 sm:p-4 rounded-xl bg-[#DCEBE7]/30 border border-[#DCEBE7] col-span-1 xs:col-span-2 md:col-span-1">
                    <span class="text-xs text-[#0E6E68] font-medium">Next Payroll</span>
                    <div class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-1">Aug 31</div>
                    <div class="text-[10px] sm:text-[11px] text-[#0E6E68] font-semibold mt-0.5">Automated batch ready</div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 showcase-widget">
                  <div class="md:col-span-7 p-3.5 sm:p-4 rounded-xl border border-[#DCEBE7] bg-[#fafdfc] space-y-3">
                    <div class="flex justify-between items-center text-xs font-bold text-[#063B39]">
                      <span>Weekly Attendance Trends</span>
                      <span class="text-slate-500 text-[10px]">Mon – Fri Avg</span>
                    </div>

                    <div class="h-28 sm:h-32 flex items-end justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 px-1 sm:px-2">
                      <div class="flex-1 flex flex-col items-center gap-1.5"><div class="w-full bg-[#0E6E68] rounded-t-md h-[92%]"></div><span class="text-[9px] sm:text-[10px] text-slate-500">Mon</span></div>
                      <div class="flex-1 flex flex-col items-center gap-1.5"><div class="w-full bg-[#0E6E68] rounded-t-md h-[96%]"></div><span class="text-[9px] sm:text-[10px] text-slate-500">Tue</span></div>
                      <div class="flex-1 flex flex-col items-center gap-1.5"><div class="w-full bg-[#0E6E68] rounded-t-md h-[98%]"></div><span class="text-[9px] sm:text-[10px] text-slate-500">Wed</span></div>
                      <div class="flex-1 flex flex-col items-center gap-1.5"><div class="w-full bg-[#0E6E68] rounded-t-md h-[95%]"></div><span class="text-[9px] sm:text-[10px] text-slate-500">Thu</span></div>
                      <div class="flex-1 flex flex-col items-center gap-1.5"><div class="w-full bg-[#3FA79B] rounded-t-md h-[94%]"></div><span class="text-[9px] sm:text-[10px] text-slate-500">Fri</span></div>
                    </div>
                  </div>

                  <div class="md:col-span-5 p-3.5 sm:p-4 rounded-xl border border-[#DCEBE7] bg-white space-y-3">
                    <div class="flex justify-between items-center text-xs font-bold text-[#063B39]">
                      <span>Recent Employees</span>
                      <span class="text-[#0E6E68] text-[10px] font-bold">View All</span>
                    </div>

                    <div class="space-y-2.5 text-xs">
                      <div class="flex items-center justify-between p-1.5 hover:bg-[#DCEBE7]/20 rounded-lg">
                        <div class="flex items-center gap-2 min-w-0">
                          <div class="w-6 h-6 rounded-full bg-[#0E6E68] text-white font-bold text-[9px] flex items-center justify-center shrink-0">AR</div>
                          <div class="min-w-0"><div class="font-bold text-[#063B39] truncate">Alex Rivera</div><div class="text-[10px] text-slate-400 truncate">Engineering</div></div>
                        </div>
                        <span class="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold shrink-0">Active</span>
                      </div>

                      <div class="flex items-center justify-between p-1.5 hover:bg-[#DCEBE7]/20 rounded-lg">
                        <div class="flex items-center gap-2 min-w-0">
                          <div class="w-6 h-6 rounded-full bg-[#3FA79B] text-white font-bold text-[9px] flex items-center justify-center shrink-0">KL</div>
                          <div class="min-w-0"><div class="font-bold text-[#063B39] truncate">Karen Lin</div><div class="text-[10px] text-slate-400 truncate">Product Design</div></div>
                        </div>
                        <span class="px-2 py-0.5 bg-[#DCEBE7] text-[#0E6E68] rounded-full text-[10px] font-bold shrink-0">Remote</span>
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
      <!-- 4. FEATURES SECTION (8 Capabilities)       -->
      <!-- ========================================== -->
      <section id="features" class="relative z-10 py-16 sm:py-24 lg:py-32 px-4 xs:px-6 sm:px-10 max-w-7xl 2xl:max-w-8xl mx-auto scroll-mt-20">
        
        <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
            Comprehensive HR Suite
          </div>
          <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
            Everything HR Needs. In One Platform.
          </h2>
          <p class="text-xs xs:text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
            Powerful tools designed to simplify everyday HR operations and help your workforce perform at their best.
          </p>
        </div>

        <!-- 8 Feature Cards Grid (1 col on mobile, 2 cols on tablet, 4 cols on desktop) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 features-grid">
          
          <!-- Card 1: Employee Management -->
          <div class="workora-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all feature-card">
            <div>
              <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-[#0E6E68] group-hover:text-white transition-all shadow-xs">
                <span class="material-symbols-outlined text-2xl group-hover:scale-105 transition-transform">badge</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] mb-2 group-hover:text-[#0E6E68] transition-colors font-heading">
                Employee Management
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Centralized records, digital document vaults, org charts, and zero-friction onboarding flows.
              </p>
            </div>
          </div>

          <!-- Card 2: Attendance & Time -->
          <div class="workora-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all feature-card">
            <div>
              <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-[#0E6E68] group-hover:text-white transition-all shadow-xs">
                <span class="material-symbols-outlined text-2xl group-hover:scale-105 transition-transform">schedule</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] mb-2 group-hover:text-[#0E6E68] transition-colors font-heading">
                Attendance &amp; Time
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Track hours, shifts, geofenced mobile clock-ins, biometric sync, and overtime calculations.
              </p>
            </div>
          </div>

          <!-- Card 3: Leave Management -->
          <div class="workora-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all feature-card">
            <div>
              <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-[#0E6E68] group-hover:text-white transition-all shadow-xs">
                <span class="material-symbols-outlined text-2xl group-hover:scale-105 transition-transform">event_available</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] mb-2 group-hover:text-[#0E6E68] transition-colors font-heading">
                Leave Management
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Multi-tier approval workflows, custom accrual policies, and instant balance synchronization.
              </p>
            </div>
          </div>

          <!-- Card 4: Payroll Management -->
          <div class="workora-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all feature-card">
            <div>
              <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-[#0E6E68] group-hover:text-white transition-all shadow-xs">
                <span class="material-symbols-outlined text-2xl group-hover:scale-105 transition-transform">payments</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] mb-2 group-hover:text-[#0E6E68] transition-colors font-heading">
                Payroll Management
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Automated tax calculations, statutory filings, direct deposit batches, and digital payslips.
              </p>
            </div>
          </div>

          <!-- Card 5: Performance Management -->
          <div class="workora-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all feature-card">
            <div>
              <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-[#0E6E68] group-hover:text-white transition-all shadow-xs">
                <span class="material-symbols-outlined text-2xl group-hover:scale-105 transition-transform">trending_up</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] mb-2 group-hover:text-[#0E6E68] transition-colors font-heading">
                Performance Management
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Structured OKRs, 360-degree peer feedback reviews, appraisal cycles, and career roadmaps.
              </p>
            </div>
          </div>

          <!-- Card 6: HR Analytics & Reports -->
          <div class="workora-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all feature-card">
            <div>
              <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-[#0E6E68] group-hover:text-white transition-all shadow-xs">
                <span class="material-symbols-outlined text-2xl group-hover:scale-105 transition-transform">analytics</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] mb-2 group-hover:text-[#0E6E68] transition-colors font-heading">
                Reports &amp; Analytics
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Real-time executive dashboards on attrition, headcount forecasting, and compensation trends.
              </p>
            </div>
          </div>

          <!-- Card 7: User Management -->
          <div class="workora-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all feature-card">
            <div>
              <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-[#0E6E68] group-hover:text-white transition-all shadow-xs">
                <span class="material-symbols-outlined text-2xl group-hover:scale-105 transition-transform">manage_accounts</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] mb-2 group-hover:text-[#0E6E68] transition-colors font-heading">
                User Management
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Granular administrator roles, team permissions, multi-department scoping, and user provisioning.
              </p>
            </div>
          </div>

          <!-- Card 8: Secure Access -->
          <div class="workora-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all feature-card">
            <div>
              <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-[#0E6E68] group-hover:text-white transition-all shadow-xs">
                <span class="material-symbols-outlined text-2xl group-hover:scale-105 transition-transform">security</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] mb-2 group-hover:text-[#0E6E68] transition-colors font-heading">
                Secure Access
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                SSO integration, multi-factor authentication, audit logging, and SOC2 compliant architecture.
              </p>
            </div>
          </div>

        </div>

      </section>

      <!-- ========================================== -->
      <!-- 5. WORKFORCE STATISTICS SECTION            -->
      <!-- ========================================== -->
      <section class="relative z-10 py-12 sm:py-16 bg-white border-y border-[#DCEBE7] stats-section">
        <div class="max-w-7xl 2xl:max-w-8xl mx-auto px-4 xs:px-6 sm:px-10">
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            
            <div class="space-y-1 p-2.5 sm:p-4 rounded-xl hover:bg-[#DCEBE7]/30 transition-colors stat-item">
              <div class="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-[#0E6E68] font-heading tracking-tight">
                <span #statCount1 class="counter-num">10</span><span class="text-[#3FA79B]">K+</span>
              </div>
              <div class="text-xs sm:text-sm font-bold text-[#063B39]">Employees Managed</div>
              <p class="text-[11px] sm:text-xs text-[#0E6E68]">Empowering teams globally</p>
            </div>

            <div class="space-y-1 p-2.5 sm:p-4 rounded-xl hover:bg-[#DCEBE7]/30 transition-colors stat-item">
              <div class="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-[#0E6E68] font-heading tracking-tight">
                <span #statCount2 class="counter-num">500</span><span class="text-[#3FA79B]">+</span>
              </div>
              <div class="text-xs sm:text-sm font-bold text-[#063B39]">Organizations</div>
              <p class="text-[11px] sm:text-xs text-[#0E6E68]">Built for growing teams</p>
            </div>

            <div class="space-y-1 p-2.5 sm:p-4 rounded-xl hover:bg-[#DCEBE7]/30 transition-colors stat-item">
              <div class="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-[#0E6E68] font-heading tracking-tight">
                <span #statCount3 class="counter-num">99.9</span><span class="text-[#3FA79B]">%</span>
              </div>
              <div class="text-xs sm:text-sm font-bold text-[#063B39]">Platform Reliability</div>
              <p class="text-[11px] sm:text-xs text-[#0E6E68]">Guaranteed enterprise uptime</p>
            </div>

            <div class="space-y-1 p-2.5 sm:p-4 rounded-xl hover:bg-[#DCEBE7]/30 transition-colors stat-item">
              <div class="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-[#0E6E68] font-heading tracking-tight">
                <span class="counter-num">24/7</span>
              </div>
              <div class="text-xs sm:text-sm font-bold text-[#063B39]">Access</div>
              <p class="text-[11px] sm:text-xs text-[#0E6E68]">Seamless cloud availability</p>
            </div>

          </div>

          <div class="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#DCEBE7] flex flex-wrap items-center justify-center gap-6 sm:gap-14 opacity-60">
            <span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#0E6E68] w-full text-center">Trusted by high-growth leaders worldwide</span>
            <div class="flex items-center gap-1.5 sm:gap-2 font-bold text-slate-700 text-sm sm:text-lg tracking-tight"><span class="material-symbols-outlined text-[#0E6E68]">blur_on</span> NexusCorp</div>
            <div class="flex items-center gap-1.5 sm:gap-2 font-bold text-slate-700 text-sm sm:text-lg tracking-tight"><span class="material-symbols-outlined text-[#0E6E68]">cloud_queue</span> CloudScale</div>
            <div class="flex items-center gap-1.5 sm:gap-2 font-bold text-slate-700 text-sm sm:text-lg tracking-tight"><span class="material-symbols-outlined text-[#0E6E68]">polyline</span> Vertex Logistics</div>
            <div class="flex items-center gap-1.5 sm:gap-2 font-bold text-slate-700 text-lg tracking-tight"><span class="material-symbols-outlined text-[#0E6E68]">grain</span> GlobalTech</div>
            <div class="flex items-center gap-1.5 sm:gap-2 font-bold text-slate-700 text-lg tracking-tight"><span class="material-symbols-outlined text-[#0E6E68]">hub</span> OmniMedia</div>
          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 6. HOW WORKORA WORKS (3-Step Process)      -->
      <!-- ========================================== -->
      <section id="how-it-works" class="relative z-10 py-16 sm:py-24 lg:py-32 px-4 xs:px-6 sm:px-10 max-w-7xl 2xl:max-w-8xl mx-auto workflow-section scroll-mt-20">
        
        <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-20 space-y-3 sm:space-y-4">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
            Simple 3-Step Process
          </div>
          <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
            How Workora Works
          </h2>
          <p class="text-xs xs:text-sm sm:text-base lg:text-lg text-slate-600">
            Automate your workforce lifecycle from day one with three simple steps.
          </p>
        </div>

        <!-- 3-Step Process Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          
          <!-- Connecting Line for Desktop -->
          <div class="hidden md:block absolute top-14 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#DCEBE7] via-[#3FA79B] to-[#DCEBE7] z-0"></div>

          <!-- Step 01 -->
          <div class="relative z-10 bg-white p-6 sm:p-8 rounded-2xl border border-[#DCEBE7] shadow-2xs hover:shadow-md transition-all text-center md:text-left workflow-step">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#DCEBE7] border border-[#DCEBE7] text-[#0E6E68] font-extrabold font-heading text-lg sm:text-xl flex items-center justify-center mx-auto md:mx-0 mb-4 sm:mb-6 shadow-2xs">
              01
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-[#063B39] mb-2 sm:mb-3 font-heading">Set Up Your Organization</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Import team members, configure custom roles, department structures, and digital onboarding flows in minutes.
            </p>
          </div>

          <!-- Step 02 -->
          <div class="relative z-10 bg-white p-6 sm:p-8 rounded-2xl border border-[#DCEBE7] shadow-2xs hover:shadow-md transition-all text-center md:text-left workflow-step">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#DCEBE7] border border-[#DCEBE7] text-[#0E6E68] font-extrabold font-heading text-lg sm:text-xl flex items-center justify-center mx-auto md:mx-0 mb-4 sm:mb-6 shadow-2xs">
              02
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-[#063B39] mb-2 sm:mb-3 font-heading">Manage Your Workforce</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Streamline attendance, time tracking, leave approvals, and payroll cycles without redundant manual spreadsheets.
            </p>
          </div>

          <!-- Step 03 -->
          <div class="relative z-10 bg-white p-6 sm:p-8 rounded-2xl border border-[#DCEBE7] shadow-2xs hover:shadow-md transition-all text-center md:text-left workflow-step">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#DCEBE7] border border-[#DCEBE7] text-[#0E6E68] font-extrabold font-heading text-lg sm:text-xl flex items-center justify-center mx-auto md:mx-0 mb-4 sm:mb-6 shadow-2xs">
              03
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-[#063B39] mb-2 sm:mb-3 font-heading">Grow With Better Insights</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Utilize real-time HR analytics, headcount forecasts, and performance OKRs to make confident executive decisions.
            </p>
          </div>

        </div>

      </section>

      <!-- ========================================== -->
      <!-- 7. BENEFITS SECTION (6 Key Advantages)     -->
      <!-- ========================================== -->
      <section id="why-workora" class="relative z-10 py-16 sm:py-24 lg:py-32 bg-white border-y border-[#DCEBE7] scroll-mt-20 why-section">
        <div class="max-w-7xl 2xl:max-w-8xl mx-auto px-4 xs:px-6 sm:px-10">
          
          <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
              The Workora Advantage
            </div>
            <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Built for Modern Teams
            </h2>
            <p class="text-xs xs:text-sm sm:text-base lg:text-lg text-slate-600">
              Engineered for speed, built for enterprise scale, and designed for human-centered technology.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            
            <!-- Benefit 1 -->
            <div class="p-6 sm:p-7 rounded-2xl bg-[#fafdfc] border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:bg-[#DCEBE7]/20 transition-all space-y-3 why-card">
              <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">hub</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] font-heading">Centralized Employee Management</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Keep all workforce records, documents, and org hierarchies in one single source of truth.
              </p>
            </div>

            <!-- Benefit 2 -->
            <div class="p-6 sm:p-7 rounded-2xl bg-[#fafdfc] border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:bg-[#DCEBE7]/20 transition-all space-y-3 why-card">
              <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">bolt</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] font-heading">Simplified HR Workflows</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Automate leave approvals, shift scheduling, and payroll disbursements without friction.
              </p>
            </div>

            <!-- Benefit 3 -->
            <div class="p-6 sm:p-7 rounded-2xl bg-[#fafdfc] border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:bg-[#DCEBE7]/20 transition-all space-y-3 why-card">
              <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">insights</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] font-heading">Faster Workforce Decisions</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Transform personnel data into real-time executive reports to guide headcount planning.
              </p>
            </div>

            <!-- Benefit 4 -->
            <div class="p-6 sm:p-7 rounded-2xl bg-[#fafdfc] border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:bg-[#DCEBE7]/20 transition-all space-y-3 why-card">
              <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">verified_user</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] font-heading">Secure Access</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Protect sensitive employee records with role-based permissions and encrypted data stores.
              </p>
            </div>

            <!-- Benefit 5 -->
            <div class="p-6 sm:p-7 rounded-2xl bg-[#fafdfc] border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:bg-[#DCEBE7]/20 transition-all space-y-3 why-card">
              <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">trending_up</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] font-heading">Scalable Architecture</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Built to support your team from 50 to 50,000+ employees without performance degradation.
              </p>
            </div>

            <!-- Benefit 6 -->
            <div class="p-6 sm:p-7 rounded-2xl bg-[#fafdfc] border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:bg-[#DCEBE7]/20 transition-all space-y-3 why-card">
              <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">visibility</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] font-heading">Better Visibility</h3>
              <p class="text-xs text-[#6B7F7C] leading-relaxed">
                Clear organization-wide health metrics and real-time attendance status dashboards.
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 8. SECURITY / TRUST SECTION (#063B39 Dark) -->
      <!-- ========================================== -->
      <section id="security" class="relative z-10 py-16 sm:py-24 lg:py-32 bg-[#063B39] text-white scroll-mt-20 security-section">
        <div class="max-w-7xl 2xl:max-w-8xl mx-auto px-4 xs:px-6 sm:px-10">
          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            <div class="lg:col-span-6 space-y-5 sm:space-y-6">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3FA79B]/20 border border-[#3FA79B]/30 text-[#DCEBE7] text-xs font-bold tracking-wide uppercase">
                Enterprise Trust &amp; Privacy
              </div>
              <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
                Secure by Design
              </h2>
              <p class="text-xs xs:text-sm sm:text-base lg:text-lg text-[#DCEBE7] leading-relaxed">
                Workora is engineered with enterprise-grade data protection, strict privacy compliance, and defense-in-depth infrastructure.
              </p>

              <div class="space-y-3.5 sm:space-y-4 pt-2">
                <div class="flex items-start gap-3 sm:gap-3.5">
                  <div class="p-1 rounded-full bg-[#3FA79B]/20 text-[#3FA79B] mt-1 border border-[#3FA79B]/40 shrink-0">
                    <span class="material-symbols-outlined text-base">check</span>
                  </div>
                  <div>
                    <h4 class="text-xs sm:text-sm font-bold text-white">Secure Authentication</h4>
                    <p class="text-[11px] sm:text-xs text-[#DCEBE7]/80">Enforce SAML SSO, Multi-Factor Auth (MFA), and encrypted sessions.</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 sm:gap-3.5">
                  <div class="p-1 rounded-full bg-[#3FA79B]/20 text-[#3FA79B] mt-1 border border-[#3FA79B]/40 shrink-0">
                    <span class="material-symbols-outlined text-base">check</span>
                  </div>
                  <div>
                    <h4 class="text-xs sm:text-sm font-bold text-white">Role-Based Access Control (RBAC)</h4>
                    <p class="text-[11px] sm:text-xs text-[#DCEBE7]/80">Granular permissions ensuring managers and admins see only authorized data.</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 sm:gap-3.5">
                  <div class="p-1 rounded-full bg-[#3FA79B]/20 text-[#3FA79B] mt-1 border border-[#3FA79B]/40 shrink-0">
                    <span class="material-symbols-outlined text-base">check</span>
                  </div>
                  <div>
                    <h4 class="text-xs sm:text-sm font-bold text-white">Protected Workforce Data</h4>
                    <p class="text-[11px] sm:text-xs text-[#DCEBE7]/80">End-to-end encryption in transit (TLS 1.3) and at rest (AES-256).</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 sm:gap-3.5">
                  <div class="p-1 rounded-full bg-[#3FA79B]/20 text-[#3FA79B] mt-1 border border-[#3FA79B]/40 shrink-0">
                    <span class="material-symbols-outlined text-base">check</span>
                  </div>
                  <div>
                    <h4 class="text-xs sm:text-sm font-bold text-white">Enterprise-Ready Architecture</h4>
                    <p class="text-[11px] sm:text-xs text-[#DCEBE7]/80">Continuous vulnerability scans, automated backups, and 99.9% SLA uptime.</p>
                  </div>
                </div>
              </div>

            </div>

            <!-- Right Graphic -->
            <div class="lg:col-span-6 flex justify-center">
              <div class="relative w-full max-w-md bg-gradient-to-br from-[#0E6E68] via-[#063B39] to-[#063B39] text-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-[#3FA79B]/30 overflow-hidden">
                <div class="relative z-10 space-y-5 sm:space-y-6 text-center">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-[#3FA79B]/20 border border-[#3FA79B]/40 flex items-center justify-center text-[#3FA79B] shadow-inner">
                    <span class="material-symbols-outlined text-4xl sm:text-5xl">shield_lock</span>
                  </div>

                  <div class="space-y-1.5 sm:space-y-2">
                    <h3 class="text-xl sm:text-2xl font-bold font-heading text-white">Enterprise Security Vault</h3>
                    <p class="text-xs text-[#DCEBE7] max-w-xs mx-auto">
                      Continuous real-time threat monitoring and encrypted database segregation.
                    </p>
                  </div>

                  <div class="pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-left">
                    <div class="p-2.5 sm:p-3 bg-white/5 rounded-xl border border-white/10">
                      <div class="text-[9px] sm:text-[10px] text-slate-300">Encryption Standard</div>
                      <div class="text-[11px] sm:text-xs font-bold text-white mt-0.5">AES-256 / TLS 1.3</div>
                    </div>
                    <div class="p-2.5 sm:p-3 bg-white/5 rounded-xl border border-white/10">
                      <div class="text-[9px] sm:text-[10px] text-slate-300">Audit Status</div>
                      <div class="text-[11px] sm:text-xs font-bold text-emerald-300 mt-0.5">Continuous Logs</div>
                    </div>
                  </div>

                  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] sm:text-xs font-semibold border border-emerald-400/30">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Active Security Protocol
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 9. FINAL CTA SECTION (#DCEBE7 Light Mint)  -->
      <!-- ========================================== -->
      <section id="contact" class="relative z-10 py-16 sm:py-24 lg:py-28 px-4 xs:px-6 sm:px-10 max-w-7xl 2xl:max-w-8xl mx-auto scroll-mt-20 cta-section">
        <div class="relative bg-[#DCEBE7] text-[#063B39] rounded-2xl sm:rounded-3xl p-6 xs:p-8 sm:p-12 lg:p-16 text-center shadow-xl border border-[#0E6E68]/20 overflow-hidden">
          
          <div class="relative z-10 max-w-3xl mx-auto space-y-5 sm:space-y-6">
            <div class="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/80 border border-[#0E6E68]/20 text-[#0E6E68] text-xs font-bold uppercase tracking-wider">
              Transform Your Workforce
            </div>
            
            <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading leading-tight text-[#063B39]">
              Ready to Simplify Workforce Management?
            </h2>

            <p class="text-xs xs:text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto">
              Bring your people, processes and workforce operations together with Workora.
            </p>

            <div class="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <a 
                routerLink="/login" 
                class="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl bg-[#063B39] hover:bg-[#0E6E68] text-white font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border-none"
              >
                <span>Get Started</span>
                <span class="material-symbols-outlined text-lg sm:text-xl">arrow_forward</span>
              </a>
              <button 
                (click)="scrollToSection('showcase')"
                class="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-white border border-[#0E6E68]/30 hover:border-[#0E6E68] hover:bg-white/90 text-[#063B39] font-bold text-sm sm:text-base transition-all cursor-pointer shadow-xs"
              >
                Contact Sales
              </button>
            </div>

            <div class="pt-2 text-[11px] sm:text-xs text-[#0E6E68] font-medium">
              No credit card required • Instant setup • 14-day trial
            </div>
          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 10. FOOTER                                 -->
      <!-- ========================================== -->
      <footer class="relative z-10 bg-white border-t border-[#DCEBE7] pt-12 sm:pt-16 pb-8 sm:pb-12 px-4 xs:px-6 sm:px-10">
        <div class="max-w-7xl 2xl:max-w-8xl mx-auto">
          
          <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-10 sm:pb-12 border-b border-[#DCEBE7]">
            
            <!-- Brand Column -->
            <div class="col-span-1 xs:col-span-2 space-y-4">
              <a (click)="scrollToTop()" class="flex items-center gap-3 cursor-pointer group">
                <img src="/workoraLogo.png" alt="Workora Logo" class="h-8 w-auto object-contain drop-shadow-xs" />
                <span class="text-xl font-extrabold text-[#063B39] font-heading">Workora</span>
              </a>
              <p class="text-xs text-slate-600 leading-relaxed max-w-sm">
                Workora is an intelligent, unified HRMS SaaS platform empowering modern enterprises with streamlined employee management, payroll, attendance, and analytics.
              </p>
            </div>

            <!-- Product Links -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Product</h4>
              <ul class="space-y-2 text-xs text-slate-600">
                <li><a (click)="scrollToSection('showcase')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Platform Overview</a></li>
                <li><a (click)="scrollToSection('features')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Features</a></li>
                <li><a (click)="scrollToSection('how-it-works')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Solutions</a></li>
                <li><a (click)="scrollToSection('security')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Security</a></li>
              </ul>
            </div>

            <!-- Company Links -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Company</h4>
              <ul class="space-y-2 text-xs text-slate-600">
                <li><a (click)="scrollToSection('why-workora')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">About Workora</a></li>
                <li><a (click)="scrollToSection('security')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Security &amp; Trust</a></li>
                <li><a (click)="scrollToSection('contact')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Contact Sales</a></li>
              </ul>
            </div>

            <!-- Legal Links -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Legal</h4>
              <ul class="space-y-2 text-xs text-slate-600">
                <li><a class="hover:text-[#0E6E68] transition-colors cursor-pointer">Privacy Policy</a></li>
                <li><a class="hover:text-[#0E6E68] transition-colors cursor-pointer">Terms of Service</a></li>
                <li><a class="hover:text-[#0E6E68] transition-colors cursor-pointer">System Status (99.9%)</a></li>
              </ul>
            </div>

          </div>

          <!-- Bottom Copyright -->
          <div class="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 sm:gap-4">
            <div>
              &copy; 2026 Workora. All rights reserved.
            </div>
            <div class="flex items-center gap-6">
              <span class="text-[#0E6E68] font-semibold">Enterprise Ready</span>
              <span>•</span>
              <span class="text-emerald-600 font-semibold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Systems Operational
              </span>
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
  private animTimer: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.isScrolled.set(scrollPos > 30);
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Small delay ensures Angular DOM template is settled before GSAP measures elements
    this.animTimer = setTimeout(() => {
      this.ctx = gsap.context(() => {

        // 1. HERO ENTRANCE TIMELINE
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        if (this.navbarRef?.nativeElement) {
          heroTl.from(this.navbarRef.nativeElement, { opacity: 0, y: -20, duration: 0.6 });
        }

        heroTl.from('.gsap-hero-badge', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
          .from('.gsap-hero-title-line', { opacity: 0, y: 35, stagger: 0.12, duration: 0.7, ease: 'power4.out' }, '-=0.3')
          .from('.gsap-hero-desc', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
          .from('.gsap-hero-cta', { opacity: 0, y: 20, scale: 0.95, stagger: 0.1, duration: 0.6, ease: 'back.out(1.4)' }, '-=0.4')
          .from('.gsap-hero-dashboard', { opacity: 0, x: 50, duration: 0.8, ease: 'power3.out' }, '-=0.6')
          .from('.gsap-dash-card', { opacity: 0, y: 15, stagger: 0.08, duration: 0.5 }, '-=0.4');

        // 2. STATISTICS NUMBER COUNTERS
        ScrollTrigger.create({
          trigger: '.stats-section',
          start: 'top 85%',
          onEnter: () => {
            if (this.statCount1?.nativeElement) this.animateCounter(this.statCount1.nativeElement, 0, 10, 1.5);
            if (this.statCount2?.nativeElement) this.animateCounter(this.statCount2.nativeElement, 0, 500, 2);
            if (this.statCount3?.nativeElement) this.animateCounter(this.statCount3.nativeElement, 0, 99.9, 2, 1);
          },
          once: true
        });

        // 3. FEATURES CARDS REVEAL
        const featureCards = gsap.utils.toArray<HTMLElement>('.feature-card');
        if (featureCards.length > 0) {
          gsap.fromTo(featureCards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        // 4. PRODUCT SHOWCASE REVEAL
        const showcaseEl = document.querySelector('.showcase-container');
        if (showcaseEl) {
          gsap.fromTo(showcaseEl,
            { opacity: 0, y: 40, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '#showcase',
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        const showcaseWidgets = gsap.utils.toArray<HTMLElement>('.showcase-widget');
        if (showcaseWidgets.length > 0) {
          gsap.fromTo(showcaseWidgets,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.showcase-container',
                start: 'top 75%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        // 5. WORKFLOW STEPS REVEAL
        const steps = gsap.utils.toArray<HTMLElement>('.workflow-step');
        if (steps.length > 0) {
          gsap.fromTo(steps,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.12,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.workflow-section',
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        // 6. BENEFITS REVEAL
        const whyCards = gsap.utils.toArray<HTMLElement>('.why-card');
        if (whyCards.length > 0) {
          gsap.fromTo(whyCards,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.why-section',
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        // 7. SECURITY SECTION REVEAL
        const securityEl = document.querySelector('.security-section');
        if (securityEl) {
          gsap.fromTo(securityEl,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.security-section',
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        // 8. CTA SECTION REVEAL
        const ctaEl = document.querySelector('.cta-section');
        if (ctaEl) {
          gsap.fromTo(ctaEl,
            { opacity: 0, scale: 0.96, y: 30 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        ScrollTrigger.refresh();
      });
    }, 150);
  }

  ngOnDestroy(): void {
    if (this.animTimer) clearTimeout(this.animTimer);
    if (this.ctx) this.ctx.revert();
  }

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
