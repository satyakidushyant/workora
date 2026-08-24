import { 
  Component, 
  ElementRef, 
  AfterViewInit, 
  OnDestroy, 
  ViewChild, 
  signal, 
  HostListener, 
  Inject, 
  PLATFORM_ID, 
  computed, 
  NgZone 
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins safely
gsap.registerPlugin(ScrollTrigger);

interface FaqItem {
  question: string;
  answer: string;
}

interface Testimonial {
  quote: string;
  role: string;
  company: string;
  avatarBg: string;
  initials: string;
}

interface WorkflowStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

/**
 * Workora Landing Page Component.
 * Structured around a clear user journey:
 * 1. Hero Section & Product Message
 * 2. Why Workora? (The Problem vs The Solution)
 * 3. Built for Everyone (Role Switcher: HR, Managers, Employees)
 * 4. Core Features (6 clean capabilities)
 * 5. The Workora Difference (Comparison & Benefits)
 * 6. ROI / Business Impact (Interactive Estimator)
 * 7. How Workora Works (4-step onboarding journey)
 * 8. Security & Trust
 * 9. Testimonials
 * 10. Frequently Asked Questions (Accordion)
 * 11. Final CTA
 * 12. Enterprise Footer
 */
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div #pageContainerRef class="min-h-screen bg-[#fafdfc] text-[#063B39] font-sans antialiased selection:bg-[#DCEBE7] selection:text-[#063B39] relative">

      <!-- AMBIENT BACKGROUND GLOW ORBS -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div class="gsap-ambient-orb-1 absolute -top-40 -left-40 w-[620px] h-[620px] bg-[#3FA79B]/12 rounded-full blur-[140px] will-change-transform"></div>
        <div class="gsap-ambient-orb-2 absolute top-[35%] -right-40 w-[580px] h-[580px] bg-[#0E6E68]/10 rounded-full blur-[140px] will-change-transform"></div>
        <div class="gsap-ambient-orb-3 absolute top-[70%] left-[15%] w-[700px] h-[700px] bg-[#DCEBE7]/50 rounded-full blur-[160px] will-change-transform"></div>
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
          
          <!-- Logo & Brand Mark -->
          <a (click)="scrollToTop()" class="flex items-center gap-2 cursor-pointer group focus:outline-none py-1" aria-label="Workora Home">
            <img 
              src="/workoraLogo.png" 
              alt="Workora Logo" 
              class="h-9 xs:h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_4px_10px_rgba(14,110,104,0.25)]"
            />
            <span class="font-extrabold text-lg sm:text-xl tracking-tight text-[#063B39] font-heading hidden xs:inline">Workora</span>
          </a>

          <!-- Center Navigation Links -->
          <nav class="hidden md:flex items-center gap-5 lg:gap-7 text-xs lg:text-sm font-bold text-[#063B39]">
            <a (click)="scrollToSection('why-workora')" class="hover:text-[#0E6E68] transition-colors cursor-pointer py-1 relative group/link">
              <span>Why Workora</span>
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0E6E68] rounded-full group-hover/link:w-full transition-all duration-300"></span>
            </a>
            <a (click)="scrollToSection('roles')" class="hover:text-[#0E6E68] transition-colors cursor-pointer py-1 relative group/link">
              <span>By Role</span>
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0E6E68] rounded-full group-hover/link:w-full transition-all duration-300"></span>
            </a>
            <a (click)="scrollToSection('features')" class="hover:text-[#0E6E68] transition-colors cursor-pointer py-1 relative group/link">
              <span>Features</span>
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0E6E68] rounded-full group-hover/link:w-full transition-all duration-300"></span>
            </a>
            <a (click)="scrollToSection('difference')" class="hover:text-[#0E6E68] transition-colors cursor-pointer py-1 relative group/link">
              <span>Difference</span>
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0E6E68] rounded-full group-hover/link:w-full transition-all duration-300"></span>
            </a>
            <a (click)="scrollToSection('how-it-works')" class="hover:text-[#0E6E68] transition-colors cursor-pointer py-1 relative group/link">
              <span>How It Works</span>
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0E6E68] rounded-full group-hover/link:w-full transition-all duration-300"></span>
            </a>
            <a (click)="scrollToSection('faq')" class="hover:text-[#0E6E68] transition-colors cursor-pointer py-1 relative group/link">
              <span>FAQ</span>
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0E6E68] rounded-full group-hover/link:w-full transition-all duration-300"></span>
            </a>
          </nav>

          <!-- Right Action CTAs -->
          <div class="flex items-center gap-2 xs:gap-3">
            <a 
              routerLink="/login" 
              class="hidden sm:inline-flex text-xs lg:text-sm font-bold text-[#063B39] hover:text-[#0E6E68] hover:bg-[#DCEBE7]/50 px-3 sm:px-4 py-2 rounded-full transition-all cursor-pointer"
            >
              Sign In
            </a>
            <a 
              routerLink="/login" 
              class="inline-flex items-center justify-center gap-1.5 xs:gap-2 px-4 xs:px-5 py-2 xs:py-2.5 rounded-full bg-gradient-to-r from-[#0E6E68] to-[#063B39] text-white text-xs xs:text-sm font-extrabold shadow-md shadow-[#0E6E68]/20 hover:shadow-lg hover:shadow-[#0E6E68]/35 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
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
          <div class="flex items-center justify-between pb-3 border-b border-[#DCEBE7]/60">
            <div class="flex items-center gap-2">
              <img src="/workoraLogo.png" alt="Workora Logo" class="h-8 w-auto object-contain filter drop-shadow-md" />
              <span class="font-extrabold text-base text-[#063B39]">Workora</span>
            </div>
            <span class="text-xs text-[#0E6E68] font-bold bg-[#DCEBE7]/60 px-2.5 py-1 rounded-full">Workplace Management</span>
          </div>
          <nav class="flex flex-col space-y-2 font-semibold text-sm xs:text-base text-[#063B39]">
            <a (click)="scrollToSection('why-workora')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors cursor-pointer">Why Workora</a>
            <a (click)="scrollToSection('roles')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors cursor-pointer">By Role</a>
            <a (click)="scrollToSection('features')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors cursor-pointer">Features</a>
            <a (click)="scrollToSection('difference')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors cursor-pointer">Difference</a>
            <a (click)="scrollToSection('how-it-works')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors cursor-pointer">How It Works</a>
            <a (click)="scrollToSection('faq')" class="px-3 py-2 rounded-lg hover:bg-[#DCEBE7]/40 hover:text-[#0E6E68] transition-colors cursor-pointer">FAQ</a>
          </nav>
          <div class="pt-3 border-t border-[#DCEBE7] flex flex-col gap-2.5">
            <a routerLink="/login" (click)="isMobileMenuOpen.set(false)" class="w-full py-2.5 text-center font-bold text-[#063B39] bg-[#DCEBE7]/50 rounded-xl hover:bg-[#DCEBE7] text-xs xs:text-sm">Sign In</a>
            <a routerLink="/login" (click)="isMobileMenuOpen.set(false)" class="w-full py-2.5 text-center font-bold text-white bg-[#0E6E68] rounded-xl hover:bg-[#063B39] text-xs xs:text-sm shadow-md">Get Started</a>
          </div>
        </div>
      }

      <!-- ========================================== -->
      <!-- 2. HERO SECTION                            -->
      <!-- ========================================== -->
      <section 
        #heroSectionRef 
        id="home" 
        class="relative z-10 pt-28 xs:pt-32 sm:pt-40 pb-16 sm:pb-20 lg:pb-28 px-4 xs:px-6 sm:px-10 max-w-7xl 2xl:max-w-8xl mx-auto"
      >
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <!-- Hero Left Column: Clear, Focused Messaging -->
          <div class="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            <!-- Small Badge -->
            <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#DCEBE7]/80 border border-[#DCEBE7] shadow-2xs gsap-hero-badge will-change-transform">
              <span class="flex h-2.5 w-2.5 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3FA79B] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0E6E68]"></span>
              </span>
              <span class="text-xs sm:text-sm font-bold tracking-wide text-[#0E6E68]">The smarter way to manage your workplace</span>
            </div>

            <!-- Main Heading -->
            <h1 class="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#063B39] leading-[1.14] font-heading overflow-hidden">
              <span class="block gsap-hero-title-line will-change-transform">Work better.</span>
              <span class="block text-[#0E6E68] gsap-hero-title-line will-change-transform">Manage smarter.</span>
              <span class="block text-[#3FA79B] gsap-hero-title-line will-change-transform">Grow faster.</span>
            </h1>

            <!-- Supporting Text -->
            <p class="text-sm xs:text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 gsap-hero-desc will-change-transform">
              Workora brings HR, managers, and employees together in one simple platform. Manage people, time, tasks, leave, and everyday workplace operations without the usual complexity.
            </p>

            <!-- Primary & Secondary CTAs -->
            <div class="space-y-4">
              <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 xs:gap-4">
                <a 
                  routerLink="/login" 
                  class="w-full sm:w-auto px-8 xs:px-9 py-3.5 xs:py-4 rounded-xl bg-[#063B39] hover:bg-[#0E6E68] text-white font-bold text-sm xs:text-base shadow-xl shadow-[#063B39]/20 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer gsap-hero-cta will-change-transform"
                >
                  <span>Get Started</span>
                  <span class="material-symbols-outlined text-lg xs:text-xl">arrow_forward</span>
                </a>
                <button 
                  (click)="scrollToSection('product-message')"
                  class="w-full sm:w-auto px-7 xs:px-8 py-3.5 xs:py-4 rounded-xl bg-white text-[#063B39] font-bold text-sm xs:text-base border border-[#0E6E68]/30 hover:border-[#0E6E68] hover:bg-[#DCEBE7]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs gsap-hero-cta will-change-transform"
                >
                  <span class="material-symbols-outlined text-lg xs:text-xl text-[#0E6E68]">explore</span>
                  <span>Explore Workora</span>
                </button>
              </div>

              <!-- Small Trust Text -->
              <div class="pt-2 text-xs text-slate-500 font-medium gsap-hero-desc">
                Built for modern teams • Simple to use • Designed to scale
              </div>
            </div>

          </div>

          <!-- Hero Visual: Interactive Live Prototype Widget -->
          <div class="lg:col-span-5 relative mt-6 lg:mt-0">
            
            <div 
              #heroDashboardRef
              class="relative bg-white rounded-2xl sm:rounded-3xl border border-[#DCEBE7] shadow-[0_25px_60px_-15px_rgba(14,110,104,0.15)] p-4 sm:p-6 space-y-4 gsap-hero-dashboard will-change-transform"
            >
              
              <!-- Card Header -->
              <div class="flex items-center justify-between pb-3 border-b border-[#DCEBE7]">
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="w-8 h-8 rounded-xl bg-[#DCEBE7]/80 flex items-center justify-center p-1.5 shrink-0 text-[#0E6E68]">
                    <span class="material-symbols-outlined text-lg">spa</span>
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-xs font-bold text-[#063B39] leading-tight truncate">Team Workplace Hub</h3>
                    <span class="text-[10px] text-[#0E6E68] truncate block">All-in-one central operations</span>
                  </div>
                </div>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center gap-1 border border-emerald-200 shrink-0">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active &amp; Connected
                </span>
              </div>

              <!-- Interactive Tabs inside Mockup -->
              <div class="flex p-1 bg-[#F4F8F7] rounded-xl text-[11px] font-bold text-slate-600">
                <button 
                  (click)="heroTab.set('pto')" 
                  [ngClass]="heroTab() === 'pto' ? 'bg-white text-[#063B39] shadow-xs' : 'hover:text-[#063B39]'"
                  class="flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer"
                >
                  Leave &amp; Approvals
                </button>
                <button 
                  (click)="heroTab.set('attendance')" 
                  [ngClass]="heroTab() === 'attendance' ? 'bg-white text-[#063B39] shadow-xs' : 'hover:text-[#063B39]'"
                  class="flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer"
                >
                  Attendance &amp; Time
                </button>
                <button 
                  (click)="heroTab.set('payroll')" 
                  [ngClass]="heroTab() === 'payroll' ? 'bg-white text-[#063B39] shadow-xs' : 'hover:text-[#063B39]'"
                  class="flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer"
                >
                  People Records
                </button>
              </div>

              <!-- Tab Content 1: Leave & Approvals -->
              @if (heroTab() === 'pto') {
                <div class="p-3.5 rounded-xl bg-[#fafdfc] border border-[#DCEBE7] space-y-3 animate-in fade-in duration-200">
                  @if (!ptoApproved()) {
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-[#063B39] flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[#0E6E68] text-base">flight_takeoff</span>
                        Leave Request
                      </span>
                      <span class="text-[10px] text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Pending Manager Review</span>
                    </div>

                    <div class="flex items-center justify-between bg-white p-3 rounded-xl border border-[#DCEBE7] shadow-2xs gap-3">
                      <div class="flex items-center gap-2.5 min-w-0">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0E6E68] to-[#3FA79B] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          MC
                        </div>
                        <div class="min-w-0">
                          <div class="text-xs font-bold text-[#063B39] truncate">Maya Chen</div>
                          <div class="text-[11px] text-slate-500 truncate">Annual Leave • 3 Days</div>
                        </div>
                      </div>
                      <button 
                        (click)="approvePto()"
                        class="px-3 py-1.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1"
                      >
                        <span class="material-symbols-outlined text-xs">check</span>
                        <span>Approve</span>
                      </button>
                    </div>
                  } @else {
                    <div class="py-4 text-center space-y-2 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                      <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <span class="material-symbols-outlined text-lg">check_circle</span>
                      </div>
                      <div class="text-xs font-bold text-emerald-800">Approved &amp; Synced Across Team</div>
                      <div class="text-[10px] text-emerald-600">Zero back-and-forth emails required</div>
                      <button (click)="resetPto()" class="text-[10px] text-[#0E6E68] underline font-semibold hover:text-[#063B39] cursor-pointer">Reset</button>
                    </div>
                  }
                </div>
              }

              <!-- Tab Content 2: Attendance & Time -->
              @if (heroTab() === 'attendance') {
                <div class="p-3.5 rounded-xl bg-[#fafdfc] border border-[#DCEBE7] space-y-3 animate-in fade-in duration-200">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-[#063B39]">Today's Activity</span>
                    <span class="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">100% Visibility</span>
                  </div>
                  <div class="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div class="p-2 bg-white rounded-lg border border-[#DCEBE7]">
                      <div class="text-sm font-extrabold text-[#063B39]">On Site</div>
                      <div class="text-slate-500">Connected</div>
                    </div>
                    <div class="p-2 bg-white rounded-lg border border-[#DCEBE7]">
                      <div class="text-sm font-extrabold text-[#0E6E68]">Remote</div>
                      <div class="text-slate-500">Active</div>
                    </div>
                    <div class="p-2 bg-white rounded-lg border border-[#DCEBE7]">
                      <div class="text-sm font-extrabold text-amber-600">On Leave</div>
                      <div class="text-slate-500">Scheduled</div>
                    </div>
                  </div>
                </div>
              }

              <!-- Tab Content 3: People Records -->
              @if (heroTab() === 'payroll') {
                <div class="p-3.5 rounded-xl bg-gradient-to-br from-[#063B39] to-[#0E6E68] text-white space-y-2.5 shadow-md animate-in fade-in duration-200">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-200 font-medium flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[#3FA79B] text-sm">badge</span>
                      Central Workforce Vault
                    </span>
                    <span class="font-mono text-emerald-300 font-bold text-xs">Synced</span>
                  </div>
                  <div class="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                    <div class="bg-gradient-to-r from-[#3FA79B] to-[#DCEBE7] h-1.5 rounded-full w-[100%]"></div>
                  </div>
                  <div class="flex justify-between items-center text-[10px] text-slate-300">
                    <span class="flex items-center gap-1 text-emerald-300 font-semibold">
                      <span class="material-symbols-outlined text-xs">verified_user</span>
                      Protected &amp; Accessible
                    </span>
                    <span class="text-[#DCEBE7]">All Records Unified</span>
                  </div>
                </div>
              }

              <!-- Live Micro Highlight Strip -->
              <div class="flex items-center justify-between p-2.5 bg-[#DCEBE7]/40 rounded-xl text-xs text-[#063B39]">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm text-[#0E6E68]">hub</span>
                  <span class="font-semibold text-[11px]">One Central Place:</span>
                </div>
                <span class="font-extrabold text-[#0E6E68] text-[11px]">Zero Tool Juggling</span>
              </div>

            </div>

            <!-- Floating Micro Badges -->
            <div 
              #floatBadge1Ref
              class="hidden sm:flex absolute -bottom-5 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-[#DCEBE7] items-center gap-3 z-20 gsap-float-badge-1 will-change-transform"
            >
              <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] flex items-center justify-center text-[#0E6E68]">
                <span class="material-symbols-outlined text-xl">auto_mode</span>
              </div>
              <div>
                <div class="text-xs font-bold text-[#063B39]">Less Busywork</div>
                <div class="text-[10px] text-emerald-600 font-semibold">Everyday tasks made easy</div>
              </div>
            </div>

            <div 
              #floatBadge2Ref
              class="hidden sm:flex absolute -top-5 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border border-[#DCEBE7] items-center gap-2 z-20 gsap-float-badge-2 will-change-transform"
            >
              <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <span class="material-symbols-outlined text-base">task_alt</span>
              </div>
              <div class="pr-1">
                <div class="text-[11px] font-bold text-[#063B39]">One Single Home</div>
                <div class="text-[9px] text-slate-500">For your entire team</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 3. HERO PRODUCT MESSAGE                    -->
      <!-- ========================================== -->
      <section id="product-message" class="relative z-10 py-12 sm:py-16 bg-[#DCEBE7]/30 border-y border-[#DCEBE7] scroll-mt-20 gsap-product-msg">
        <div class="max-w-4xl mx-auto px-4 xs:px-6 sm:px-10 text-center space-y-4 sm:space-y-5">
          <h2 class="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-[#063B39] font-heading tracking-tight">
            Everything your team needs, in one place.
          </h2>
          <p class="text-sm xs:text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto">
            Stop switching between spreadsheets, messages, emails, and disconnected tools.
            Workora gives your entire organization one central place to manage everyday work — from employee information and attendance to leave, approvals, and team operations.
          </p>
          <div class="pt-2">
            <span class="inline-block px-5 py-2 rounded-full bg-white border border-[#DCEBE7] text-xs sm:text-sm font-extrabold text-[#0E6E68] shadow-xs">
              One platform. One source of truth. Less busywork.
            </span>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- 4. WHY WORKORA? (Problem vs Solution)      -->
      <!-- ========================================== -->
      <section id="why-workora" class="relative z-10 py-16 sm:py-24 bg-white border-b border-[#DCEBE7] scroll-mt-20">
        <div class="max-w-7xl 2xl:max-w-8xl mx-auto px-4 xs:px-6 sm:px-10">
          
          <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4 gsap-why-header">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
              Why Workora?
            </div>
            <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Your team should spend less time managing work — and more time doing it.
            </h2>
            <p class="text-xs xs:text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
              Traditional workplace management often means scattered information, repetitive tasks, and endless follow-ups.
              Workora brings everything together so your team can work with greater clarity and confidence.
            </p>
          </div>

          <!-- Side by Side Comparison Cards -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            
            <!-- The Old Way -->
            <div class="gsap-old-way p-6 sm:p-8 rounded-2xl bg-rose-50/40 border border-rose-200/70 space-y-5 hover:shadow-md transition-shadow will-change-transform">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <span class="material-symbols-outlined text-xl">warning</span>
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-bold text-rose-950 font-heading">The Old Way</h3>
                  <span class="text-xs text-rose-700 font-medium">Scattered, repetitive, and slow</span>
                </div>
              </div>

              <div class="space-y-4 pt-1">
                <div class="space-y-1">
                  <div class="text-xs sm:text-sm font-bold text-rose-950">Too many tools</div>
                  <p class="text-xs sm:text-sm text-rose-950/80 leading-relaxed">
                    Employee information lives across spreadsheets, emails, and different systems.
                  </p>
                </div>

                <div class="space-y-1">
                  <div class="text-xs sm:text-sm font-bold text-rose-950">Manual follow-ups</div>
                  <p class="text-xs sm:text-sm text-rose-950/80 leading-relaxed">
                    Managers spend valuable time chasing approvals, updates, and paperwork.
                  </p>
                </div>

                <div class="space-y-1">
                  <div class="text-xs sm:text-sm font-bold text-rose-950">Limited visibility</div>
                  <p class="text-xs sm:text-sm text-rose-950/80 leading-relaxed">
                    It is difficult to know what is happening across the organization.
                  </p>
                </div>
              </div>
            </div>

            <!-- The Workora Way -->
            <div class="gsap-workora-way p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#DCEBE7]/50 via-white to-emerald-50/40 border border-emerald-200/80 space-y-5 shadow-sm hover:shadow-lg transition-shadow will-change-transform">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#0E6E68] text-white flex items-center justify-center shadow-xs">
                  <span class="material-symbols-outlined text-xl">check_circle</span>
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-bold text-[#063B39] font-heading">The Workora Way</h3>
                  <span class="text-xs text-[#0E6E68] font-semibold">Connected, simple, and clear</span>
                </div>
              </div>

              <div class="space-y-4 pt-1">
                <div class="space-y-1">
                  <div class="text-xs sm:text-sm font-bold text-[#063B39]">Everything connected</div>
                  <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Keep your people, processes, and workplace information together.
                  </p>
                </div>

                <div class="space-y-1">
                  <div class="text-xs sm:text-sm font-bold text-[#063B39]">Less administration</div>
                  <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Automate repetitive work and simplify everyday HR operations.
                  </p>
                </div>

                <div class="space-y-1">
                  <div class="text-xs sm:text-sm font-bold text-[#063B39]">Clear visibility</div>
                  <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Give HR, managers, and employees the information they need, when they need it.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 5. BUILT FOR EVERYONE (By Role)            -->
      <!-- ========================================== -->
      <section id="roles" class="relative z-10 py-16 sm:py-24 px-4 xs:px-6 sm:px-10 max-w-7xl 2xl:max-w-8xl mx-auto scroll-mt-20">
        
        <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3 sm:space-y-4 gsap-roles-header">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
            Built for Everyone
          </div>
          <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
            One platform. Different experiences for every role.
          </h2>
          <p class="text-xs xs:text-sm sm:text-base lg:text-lg text-slate-600">
            Workora adapts to the way different people work, giving everyone the tools they actually need.
          </p>
        </div>

        <!-- Role Switcher Tabs -->
        <div class="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 gsap-role-tabs-wrap">
          <button 
            (click)="onRoleSelect('hr')"
            [ngClass]="selectedRole() === 'hr' ? 'bg-[#063B39] text-white shadow-md' : 'bg-white text-[#063B39] border border-[#DCEBE7] hover:bg-[#DCEBE7]/30'"
            class="gsap-role-tab px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-outlined text-lg">admin_panel_settings</span>
            <span>For HR</span>
          </button>

          <button 
            (click)="onRoleSelect('manager')"
            [ngClass]="selectedRole() === 'manager' ? 'bg-[#063B39] text-white shadow-md' : 'bg-white text-[#063B39] border border-[#DCEBE7] hover:bg-[#DCEBE7]/30'"
            class="gsap-role-tab px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-outlined text-lg">supervisor_account</span>
            <span>For Managers</span>
          </button>

          <button 
            (click)="onRoleSelect('employee')"
            [ngClass]="selectedRole() === 'employee' ? 'bg-[#063B39] text-white shadow-md' : 'bg-white text-[#063B39] border border-[#DCEBE7] hover:bg-[#DCEBE7]/30'"
            class="gsap-role-tab px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-outlined text-lg">badge</span>
            <span>For Employees</span>
          </button>
        </div>

        <!-- Role Details Panel -->
        <div class="gsap-role-card bg-white rounded-3xl border border-[#DCEBE7] p-6 sm:p-10 shadow-lg shadow-[#0E6E68]/5 max-w-5xl mx-auto will-change-transform">
          
          <div #roleContentRef class="gsap-role-content will-change-transform">
            
            <!-- For HR -->
            @if (selectedRole() === 'hr') {
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div class="lg:col-span-7 space-y-4">
                  <div class="inline-flex items-center gap-2 text-xs font-bold text-[#0E6E68] bg-[#DCEBE7]/60 px-3 py-1 rounded-full">
                    <span class="material-symbols-outlined text-sm">tune</span>
                    Workforce Command
                  </div>
                  <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] font-heading">
                    Take control of your entire workforce.
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Manage employee information, attendance, leave, policies, and everyday HR operations from one place.
                  </p>
                  
                  <div class="space-y-2.5 pt-2">
                    <div class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Key benefits:</div>
                    <ul class="space-y-2 text-xs sm:text-sm text-slate-700">
                      <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                        <span>Centralized employee information</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                        <span>Simplified HR processes</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                        <span>Easy attendance and leave management</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                        <span>Better workforce visibility</span>
                      </li>
                    </ul>
                  </div>

                  <div class="pt-3">
                    <a routerLink="/login" class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#063B39] text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#0E6E68] transition-colors cursor-pointer">
                      <span>Explore HR Features</span>
                      <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                  </div>
                </div>

                <div class="lg:col-span-5 bg-[#fafdfc] p-5 sm:p-6 rounded-2xl border border-[#DCEBE7] space-y-3">
                  <div class="flex items-center justify-between text-xs font-bold text-[#063B39] pb-2 border-b border-[#DCEBE7]">
                    <span>HR Operations Console</span>
                    <span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Unified</span>
                  </div>
                  <div class="space-y-2 text-xs">
                    <div class="p-3 bg-white rounded-xl border border-[#DCEBE7]">
                      <div class="font-bold text-[#063B39]">Employee Records</div>
                      <div class="text-[11px] text-slate-500">All profiles, policies, and contracts organized</div>
                    </div>
                    <div class="p-3 bg-white rounded-xl border border-[#DCEBE7]">
                      <div class="font-bold text-[#063B39]">Workforce Operations</div>
                      <div class="text-[11px] text-slate-500">Automated leave tracking &amp; approvals</div>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- For Managers -->
            @if (selectedRole() === 'manager') {
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div class="lg:col-span-7 space-y-4">
                  <div class="inline-flex items-center gap-2 text-xs font-bold text-[#0E6E68] bg-[#DCEBE7]/60 px-3 py-1 rounded-full">
                    <span class="material-symbols-outlined text-sm">speed</span>
                    Fast Approvals &amp; Team Clarity
                  </div>
                  <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] font-heading">
                    Spend less time chasing updates.
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Give managers a clear view of their teams, approvals, attendance, and day-to-day activities.
                  </p>
                  
                  <div class="space-y-2.5 pt-2">
                    <div class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Key benefits:</div>
                    <ul class="space-y-2 text-xs sm:text-sm text-slate-700">
                      <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                        <span>Faster approvals</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                        <span>Team visibility</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                        <span>Simple attendance tracking</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                        <span>Better decision-making</span>
                      </li>
                    </ul>
                  </div>

                  <div class="pt-3">
                    <a routerLink="/login" class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#063B39] text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#0E6E68] transition-colors cursor-pointer">
                      <span>Explore Manager Features</span>
                      <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                  </div>
                </div>

                <div class="lg:col-span-5 bg-[#fafdfc] p-5 sm:p-6 rounded-2xl border border-[#DCEBE7] space-y-3">
                  <div class="flex items-center justify-between text-xs font-bold text-[#063B39] pb-2 border-b border-[#DCEBE7]">
                    <span>Team Management</span>
                    <span class="text-[#0E6E68] bg-[#DCEBE7] px-2 py-0.5 rounded-full text-[10px]">Real-Time</span>
                  </div>
                  <div class="p-3 bg-white rounded-xl border border-[#DCEBE7] space-y-2 text-xs">
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-[#063B39]">Pending Requests</span>
                      <span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">1 Click Review</span>
                    </div>
                    <div class="text-[11px] text-slate-500">Review time-off and approvals in seconds without chasing paperwork.</div>
                  </div>
                </div>
              </div>
            }

            <!-- For Employees -->
            @if (selectedRole() === 'employee') {
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div class="lg:col-span-7 space-y-4">
                  <div class="inline-flex items-center gap-2 text-xs font-bold text-[#0E6E68] bg-[#DCEBE7]/60 px-3 py-1 rounded-full">
                    <span class="material-symbols-outlined text-sm">touch_app</span>
                    Empowered Self-Service
                  </div>
                  <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] font-heading">
                    Make everyday work simple.
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Employees get one easy place to manage their work-related needs without depending on HR for every small request.
                  </p>
                  
                  <div class="space-y-2.5 pt-2">
                    <div class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Key benefits:</div>
                    <ul class="space-y-2 text-xs sm:text-sm text-slate-700">
                      <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                        <span>Easy leave requests</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                        <span>Personal information access</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                        <span>Attendance visibility</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                        <span>Quick access to workplace information</span>
                      </li>
                    </ul>
                  </div>

                  <div class="pt-3">
                    <a routerLink="/login" class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#063B39] text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#0E6E68] transition-colors cursor-pointer">
                      <span>Explore Employee Features</span>
                      <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                  </div>
                </div>

                <div class="lg:col-span-5 bg-[#fafdfc] p-5 sm:p-6 rounded-2xl border border-[#DCEBE7] space-y-3">
                  <div class="flex items-center justify-between text-xs font-bold text-[#063B39] pb-2 border-b border-[#DCEBE7]">
                    <span>Employee Self-Service</span>
                    <span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Simple</span>
                  </div>
                  <div class="p-3 bg-white rounded-xl border border-[#DCEBE7] space-y-2 text-xs">
                    <div class="font-bold text-[#063B39]">Self-Service Hub</div>
                    <div class="text-[11px] text-slate-500">Request leave, check balances, and view attendance without waiting.</div>
                  </div>
                </div>
              </div>
            }

          </div>

        </div>

      </section>

      <!-- ========================================== -->
      <!-- 6. CORE FEATURES                           -->
      <!-- ========================================== -->
      <section id="features" class="relative z-10 py-16 sm:py-24 px-4 xs:px-6 sm:px-10 max-w-7xl 2xl:max-w-8xl mx-auto scroll-mt-20">
        
        <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4 gsap-features-header">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
            Core Features
          </div>
          <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
            Everything your workplace needs to run smoothly.
          </h2>
          <p class="text-xs xs:text-sm sm:text-base lg:text-lg text-slate-600">
            From everyday employee management to smarter workplace operations, Workora gives your organization the tools to stay organized.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Feature 1: Employee Management -->
          <div class="gsap-feature-card bg-white p-6 sm:p-7 rounded-3xl border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:shadow-xl transition-all space-y-4 group cursor-pointer will-change-transform">
            <div class="gsap-feature-icon w-12 h-12 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center group-hover:bg-[#0E6E68] group-hover:text-white transition-all shadow-xs will-change-transform">
              <span class="material-symbols-outlined text-2xl">badge</span>
            </div>
            <h3 class="text-lg font-bold text-[#063B39] font-heading group-hover:text-[#0E6E68] transition-colors">
              Employee Management
            </h3>
            <div class="text-xs font-semibold text-[#0E6E68]">
              Know your people. Manage them better.
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Keep employee information organized, accessible, and easy to manage.
            </p>
          </div>

          <!-- Feature 2: Attendance & Time -->
          <div class="gsap-feature-card bg-white p-6 sm:p-7 rounded-3xl border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:shadow-xl transition-all space-y-4 group cursor-pointer will-change-transform">
            <div class="gsap-feature-icon w-12 h-12 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center group-hover:bg-[#0E6E68] group-hover:text-white transition-all shadow-xs will-change-transform">
              <span class="material-symbols-outlined text-2xl">schedule</span>
            </div>
            <h3 class="text-lg font-bold text-[#063B39] font-heading group-hover:text-[#0E6E68] transition-colors">
              Attendance &amp; Time
            </h3>
            <div class="text-xs font-semibold text-[#0E6E68]">
              Know when your team is working.
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Make attendance and time tracking simple for employees and managers.
            </p>
          </div>

          <!-- Feature 3: Leave Management -->
          <div class="gsap-feature-card bg-white p-6 sm:p-7 rounded-3xl border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:shadow-xl transition-all space-y-4 group cursor-pointer will-change-transform">
            <div class="gsap-feature-icon w-12 h-12 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center group-hover:bg-[#0E6E68] group-hover:text-white transition-all shadow-xs will-change-transform">
              <span class="material-symbols-outlined text-2xl">event_available</span>
            </div>
            <h3 class="text-lg font-bold text-[#063B39] font-heading group-hover:text-[#0E6E68] transition-colors">
              Leave Management
            </h3>
            <div class="text-xs font-semibold text-[#0E6E68]">
              Leave requests without the back-and-forth.
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Employees can request leave while managers can review and approve it quickly.
            </p>
          </div>

          <!-- Feature 4: Approvals -->
          <div class="gsap-feature-card bg-white p-6 sm:p-7 rounded-3xl border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:shadow-xl transition-all space-y-4 group cursor-pointer will-change-transform">
            <div class="gsap-feature-icon w-12 h-12 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center group-hover:bg-[#0E6E68] group-hover:text-white transition-all shadow-xs will-change-transform">
              <span class="material-symbols-outlined text-2xl">task_alt</span>
            </div>
            <h3 class="text-lg font-bold text-[#063B39] font-heading group-hover:text-[#0E6E68] transition-colors">
              Approvals
            </h3>
            <div class="text-xs font-semibold text-[#0E6E68]">
              Move decisions forward faster.
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Simplify everyday approvals and eliminate unnecessary follow-ups.
            </p>
          </div>

          <!-- Feature 5: Reports & Insights -->
          <div class="gsap-feature-card bg-white p-6 sm:p-7 rounded-3xl border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:shadow-xl transition-all space-y-4 group cursor-pointer will-change-transform">
            <div class="gsap-feature-icon w-12 h-12 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center group-hover:bg-[#0E6E68] group-hover:text-white transition-all shadow-xs will-change-transform">
              <span class="material-symbols-outlined text-2xl">insights</span>
            </div>
            <h3 class="text-lg font-bold text-[#063B39] font-heading group-hover:text-[#0E6E68] transition-colors">
              Reports &amp; Insights
            </h3>
            <div class="text-xs font-semibold text-[#0E6E68]">
              Turn workplace data into better decisions.
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Get a clearer picture of your workforce with useful information and insights.
            </p>
          </div>

          <!-- Feature 6: Secure Access -->
          <div class="gsap-feature-card bg-white p-6 sm:p-7 rounded-3xl border border-[#DCEBE7] hover:border-[#0E6E68]/40 hover:shadow-xl transition-all space-y-4 group cursor-pointer will-change-transform">
            <div class="gsap-feature-icon w-12 h-12 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center group-hover:bg-[#0E6E68] group-hover:text-white transition-all shadow-xs will-change-transform">
              <span class="material-symbols-outlined text-2xl">shield</span>
            </div>
            <h3 class="text-lg font-bold text-[#063B39] font-heading group-hover:text-[#0E6E68] transition-colors">
              Secure Access
            </h3>
            <div class="text-xs font-semibold text-[#0E6E68]">
              Your workplace data deserves protection.
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Keep important employee and business information secure with controlled access.
            </p>
          </div>

        </div>

      </section>

      <!-- ========================================== -->
      <!-- 7. THE WORKORA DIFFERENCE                   -->
      <!-- ========================================== -->
      <section id="difference" class="relative z-10 py-16 sm:py-24 bg-white border-y border-[#DCEBE7] scroll-mt-20">
        <div class="max-w-7xl 2xl:max-w-8xl mx-auto px-4 xs:px-6 sm:px-10">
          
          <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4 gsap-difference-header">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
              The Workora Difference
            </div>
            <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Less administration. More productivity.
            </h2>
            <p class="text-xs xs:text-sm sm:text-base lg:text-lg text-slate-600">
              Workora is designed around one simple idea: workplace management should not feel complicated.
            </p>
          </div>

          <!-- Comparison Table / Grid -->
          <div class="max-w-4xl mx-auto bg-[#fafdfc] rounded-3xl border border-[#DCEBE7] overflow-hidden shadow-md gsap-difference-table">
            <div class="grid grid-cols-2 bg-[#063B39] text-white p-4 sm:p-5 text-xs sm:text-sm font-bold tracking-wide">
              <div class="flex items-center gap-2 text-rose-300">
                <span class="material-symbols-outlined text-sm sm:text-base">close</span>
                <span>Without Workora</span>
              </div>
              <div class="flex items-center gap-2 text-emerald-300">
                <span class="material-symbols-outlined text-sm sm:text-base">check</span>
                <span>With Workora</span>
              </div>
            </div>

            <div class="divide-y divide-[#DCEBE7] text-xs sm:text-sm">
              <div class="grid grid-cols-2 p-4 sm:p-5 hover:bg-white transition-colors">
                <div class="text-slate-600 pr-3">Scattered information</div>
                <div class="font-bold text-[#063B39]">Everything in one place</div>
              </div>
              <div class="grid grid-cols-2 p-4 sm:p-5 hover:bg-white transition-colors">
                <div class="text-slate-600 pr-3">Manual processes</div>
                <div class="font-bold text-[#063B39]">Simplified workflows</div>
              </div>
              <div class="grid grid-cols-2 p-4 sm:p-5 hover:bg-white transition-colors">
                <div class="text-slate-600 pr-3">Endless follow-ups</div>
                <div class="font-bold text-[#063B39]">Faster approvals</div>
              </div>
              <div class="grid grid-cols-2 p-4 sm:p-5 hover:bg-white transition-colors">
                <div class="text-slate-600 pr-3">Limited visibility</div>
                <div class="font-bold text-[#063B39]">Clear insights</div>
              </div>
              <div class="grid grid-cols-2 p-4 sm:p-5 hover:bg-white transition-colors">
                <div class="text-slate-600 pr-3">Repetitive administration</div>
                <div class="font-bold text-[#063B39]">More productive teams</div>
              </div>
            </div>
          </div>

          <!-- Highlight Banner -->
          <div class="mt-8 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#063B39] to-[#0E6E68] text-white text-center space-y-2 shadow-lg gsap-difference-highlight">
            <h3 class="text-lg sm:text-xl font-extrabold font-heading">
              Save time on the work behind the work.
            </h3>
            <p class="text-xs sm:text-sm text-[#DCEBE7] leading-relaxed max-w-2xl mx-auto">
              Let your team focus on people, projects, and growth instead of repetitive administrative tasks.
            </p>
          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 8. ROI / BUSINESS IMPACT                   -->
      <!-- ========================================== -->
      <section id="calculator" class="relative z-10 py-16 sm:py-24 bg-gradient-to-b from-white via-[#DCEBE7]/30 to-white border-b border-[#DCEBE7] scroll-mt-20">
        <div class="max-w-7xl 2xl:max-w-8xl mx-auto px-4 xs:px-6 sm:px-10">
          
          <div class="text-center max-w-3xl mx-auto mb-12 space-y-3 sm:space-y-4 gsap-calc-header">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase shadow-2xs">
              ROI &amp; Business Impact
            </div>
            <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
              See what your team could save.
            </h2>
            <p class="text-xs xs:text-sm sm:text-base lg:text-lg text-slate-600">
              Every hour spent on repetitive administration is time your team could spend on more valuable work.
              With Workora, organizations can reduce manual effort, improve processes, and give employees more time to focus on what matters.
            </p>
          </div>

          <!-- Calculator Container -->
          <div class="gsap-calc-card bg-white rounded-3xl border border-[#DCEBE7] shadow-xl p-6 sm:p-10 max-w-4xl mx-auto will-change-transform">
            
            <div class="space-y-8">
              
              <!-- Slider Control -->
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <label for="headcountSlider" class="text-sm sm:text-base font-bold text-[#063B39]">
                    Your Team Headcount:
                  </label>
                  <div class="flex items-center gap-1.5 bg-[#DCEBE7] px-4 py-1.5 rounded-2xl">
                    <span class="text-xl sm:text-2xl font-extrabold text-[#063B39] font-heading">{{ animatedEmployeeCount() }}</span>
                    <span class="text-xs font-bold text-[#0E6E68]">Employees</span>
                  </div>
                </div>

                <input 
                  id="headcountSlider"
                  type="range" 
                  min="10" 
                  max="1000" 
                  step="5"
                  [ngModel]="employeeCount()"
                  (ngModelChange)="onEmployeeCountChange($event)"
                  class="w-full h-3 bg-[#DCEBE7] rounded-lg appearance-none cursor-pointer accent-[#0E6E68]"
                />
                
                <div class="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>10 (Startup)</span>
                  <span>250 (Mid-Market)</span>
                  <span>500 (Growth)</span>
                  <span>1,000+ (Enterprise)</span>
                </div>
              </div>

              <!-- Output Metrics Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t border-[#DCEBE7]">
                
                <div class="gsap-calc-metric p-4 sm:p-5 rounded-2xl bg-[#fafdfc] border border-[#DCEBE7] text-center space-y-1 will-change-transform">
                  <span class="text-xs text-[#0E6E68] font-bold">Hours Saved</span>
                  <div class="text-2xl sm:text-3xl font-extrabold text-[#063B39] font-heading">
                    {{ animatedHoursSaved() }} hrs / mo
                  </div>
                  <p class="text-[10px] text-slate-500">Reduce repetitive administrative work.</p>
                </div>

                <div class="gsap-calc-metric p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-1 will-change-transform">
                  <span class="text-xs text-emerald-800 font-bold">Faster Approvals</span>
                  <div class="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-heading">
                    Instant
                  </div>
                  <p class="text-[10px] text-emerald-600 font-medium">Keep everyday decisions moving.</p>
                </div>

                <div class="gsap-calc-metric p-4 sm:p-5 rounded-2xl bg-[#fafdfc] border border-[#DCEBE7] text-center space-y-1 will-change-transform">
                  <span class="text-xs text-[#0E6E68] font-bold">Better Productivity</span>
                  <div class="text-2xl sm:text-3xl font-extrabold text-[#063B39] font-heading">
                    High Impact
                  </div>
                  <p class="text-[10px] text-slate-500">Give teams more time for meaningful work.</p>
                </div>

              </div>

              <!-- Reassurance CTA -->
              <div class="bg-[#DCEBE7]/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div class="flex items-center gap-2.5 text-[#063B39]">
                  <span class="material-symbols-outlined text-[#0E6E68] text-xl">insights</span>
                  <span><strong>Calculate your potential savings</strong> and see the difference Workora makes.</span>
                </div>
                <a routerLink="/login" class="px-5 py-2.5 bg-[#063B39] text-white font-bold rounded-xl hover:bg-[#0E6E68] transition-colors shrink-0">
                  Calculate Your Potential Savings
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 9. HOW WORKORA WORKS                       -->
      <!-- ========================================== -->
      <section id="how-it-works" class="relative z-10 py-16 sm:py-24 px-4 xs:px-6 sm:px-10 max-w-7xl 2xl:max-w-8xl mx-auto scroll-mt-20">
        
        <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4 gsap-steps-header">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
            How Workora Works
          </div>
          <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
            Simple from day one.
          </h2>
          <p class="text-xs xs:text-sm sm:text-base lg:text-lg text-slate-600">
            Getting started takes minutes, not months. Here is how your entire team gets on the same page.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (step of steps; track step.number) {
            <div class="gsap-step-card bg-white p-6 sm:p-7 rounded-3xl border border-[#DCEBE7] space-y-4 hover:shadow-lg transition-all will-change-transform">
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-[#0E6E68] bg-[#DCEBE7]/70 px-3 py-1 rounded-full">
                  {{ step.number }}
                </span>
                <span class="material-symbols-outlined text-[#0E6E68] text-2xl">{{ step.icon }}</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] font-heading">
                {{ step.title }}
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ step.description }}
              </p>
            </div>
          }
        </div>

      </section>

      <!-- ========================================== -->
      <!-- 10. SECURITY SECTION                       -->
      <!-- ========================================== -->
      <section id="security" class="relative z-10 py-16 sm:py-24 bg-white border-y border-[#DCEBE7] scroll-mt-20">
        <div class="max-w-7xl 2xl:max-w-8xl mx-auto px-4 xs:px-6 sm:px-10">
          
          <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4 gsap-security-header">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
              Security
            </div>
            <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Your people. Your data. Your trust.
            </h2>
            <p class="text-xs xs:text-sm sm:text-base lg:text-lg text-slate-600">
              Employee and business information is important. Workora is designed with security and controlled access in mind, helping organizations keep sensitive workplace information protected.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            
            <div class="gsap-security-card p-6 sm:p-7 rounded-3xl bg-[#fafdfc] border border-[#DCEBE7] space-y-3 will-change-transform">
              <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">admin_panel_settings</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] font-heading">Controlled Access</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                People only see the information relevant to their role.
              </p>
            </div>

            <div class="gsap-security-card p-6 sm:p-7 rounded-3xl bg-[#fafdfc] border border-[#DCEBE7] space-y-3 will-change-transform">
              <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">lock</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] font-heading">Secure Information</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Keep important workplace data protected.
              </p>
            </div>

            <div class="gsap-security-card p-6 sm:p-7 rounded-3xl bg-[#fafdfc] border border-[#DCEBE7] space-y-3 will-change-transform">
              <div class="w-10 h-10 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">verified_user</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-[#063B39] font-heading">Reliable Platform</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Built to support modern organizations as they grow.
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 11. TESTIMONIALS                           -->
      <!-- ========================================== -->
      <section id="testimonials" class="relative z-10 py-16 sm:py-24 px-4 xs:px-6 sm:px-10 max-w-7xl 2xl:max-w-8xl mx-auto scroll-mt-20">
        <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4 gsap-testimonials-header">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
            Testimonials
          </div>
          <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
            Built for the people who keep businesses moving.
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          @for (item of testimonials; track item.role) {
            <div class="gsap-testimonial-card p-6 sm:p-8 rounded-3xl bg-white border border-[#DCEBE7] flex flex-col justify-between space-y-6 hover:shadow-lg transition-all will-change-transform">
              <div class="space-y-4">
                <div class="text-amber-500 flex gap-1">
                  <span class="material-symbols-outlined text-sm">star</span>
                  <span class="material-symbols-outlined text-sm">star</span>
                  <span class="material-symbols-outlined text-sm">star</span>
                  <span class="material-symbols-outlined text-sm">star</span>
                  <span class="material-symbols-outlined text-sm">star</span>
                </div>
                <p class="text-xs sm:text-sm text-[#063B39] font-medium leading-relaxed italic">
                  “{{ item.quote }}”
                </p>
              </div>

              <div class="flex items-center gap-3 pt-4 border-t border-[#DCEBE7]">
                <div class="w-10 h-10 rounded-full {{ item.avatarBg }} text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {{ item.initials }}
                </div>
                <div>
                  <div class="text-xs sm:text-sm font-bold text-[#063B39]">{{ item.role }}</div>
                  <div class="text-[11px] text-slate-500">{{ item.company }}</div>
                </div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- ========================================== -->
      <!-- 12. FREQUENTLY ASKED QUESTIONS (FAQ)       -->
      <!-- ========================================== -->
      <section id="faq" class="relative z-10 py-16 sm:py-24 px-4 xs:px-6 sm:px-10 max-w-4xl mx-auto scroll-mt-20">
        
        <div class="text-center max-w-3xl mx-auto mb-12 space-y-3 sm:space-y-4 gsap-faq-header">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE7]/70 border border-[#DCEBE7] text-[#0E6E68] text-xs font-bold tracking-wide uppercase">
            FAQ
          </div>
          <h2 class="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B39] tracking-tight font-heading">
            Frequently Asked Questions
          </h2>
        </div>

        <!-- Fully Animated Reactive Accordion List -->
        <div class="space-y-3.5 gsap-faq-list">
          @for (faq of faqs; track $index) {
            <div class="gsap-faq-item bg-white rounded-2xl border border-[#DCEBE7] overflow-hidden transition-all duration-200 hover:shadow-md shadow-2xs">
              <button 
                type="button"
                (click)="toggleFaq($index)"
                class="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#063B39] hover:text-[#0E6E68] transition-colors cursor-pointer select-none focus:outline-none"
                [attr.aria-expanded]="isFaqOpen($index)"
              >
                <span class="pr-2 leading-snug">{{ faq.question }}</span>
                <span 
                  class="material-symbols-outlined text-2xl text-[#0E6E68] transition-transform duration-300 transform flex items-center justify-center shrink-0" 
                  [style.transform]="isFaqOpen($index) ? 'rotate(180deg)' : 'rotate(0deg)'"
                >
                  expand_more
                </span>
              </button>

              <!-- Universally Supported Smooth Height & Opacity Transition -->
              <div 
                class="transition-all duration-300 ease-in-out overflow-hidden"
                [style.maxHeight]="isFaqOpen($index) ? '320px' : '0px'"
                [style.opacity]="isFaqOpen($index) ? '1' : '0'"
                [style.visibility]="isFaqOpen($index) ? 'visible' : 'hidden'"
              >
                <div class="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-[#DCEBE7]/60 pt-3.5">
                  {{ faq.answer }}
                </div>
              </div>
            </div>
          }
        </div>

      </section>

      <!-- ========================================== -->
      <!-- 13. FINAL CTA CONTAINER                    -->
      <!-- ========================================== -->
      <section id="contact" class="relative z-10 py-16 sm:py-24 px-4 xs:px-6 sm:px-10 max-w-7xl 2xl:max-w-8xl mx-auto scroll-mt-20 gsap-cta-section">
        <div class="relative bg-gradient-to-br from-[#063B39] via-[#0E6E68] to-[#063B39] text-white rounded-3xl p-8 sm:p-14 lg:p-20 text-center shadow-2xl overflow-hidden border border-[#3FA79B]/30 gsap-cta-card will-change-transform">
          
          <div class="gsap-cta-orb-1 absolute -top-32 -left-32 w-80 h-80 bg-[#3FA79B]/20 rounded-full blur-3xl pointer-events-none will-change-transform"></div>
          <div class="gsap-cta-orb-2 absolute -bottom-32 -right-32 w-80 h-80 bg-[#DCEBE7]/20 rounded-full blur-3xl pointer-events-none will-change-transform"></div>

          <div class="relative z-10 max-w-3xl mx-auto space-y-6">
            <div class="gsap-cta-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3FA79B]/20 border border-[#3FA79B]/40 text-[#DCEBE7] text-xs font-bold uppercase tracking-wider will-change-transform">
              Ready to work smarter?
            </div>
            
            <h2 class="gsap-cta-title text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white will-change-transform">
              Give your team a better way to work.
            </h2>

            <p class="gsap-cta-desc text-xs xs:text-sm sm:text-base lg:text-lg text-[#DCEBE7] leading-relaxed max-w-2xl mx-auto will-change-transform">
              Bring your people, processes, and workplace operations together with Workora.<br class="hidden sm:inline" />
              Less complexity. Less administration. More time for what matters.
            </p>

            <div class="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <a 
                routerLink="/login" 
                class="gsap-cta-btn w-full sm:w-auto px-8 sm:px-10 py-4 rounded-xl bg-white hover:bg-[#DCEBE7] text-[#063B39] font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 will-change-transform"
              >
                <span>Get Started</span>
                <span class="material-symbols-outlined text-lg sm:text-xl">arrow_forward</span>
              </a>
              <a 
                routerLink="/login" 
                class="gsap-cta-btn w-full sm:w-auto px-7 sm:px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base transition-all cursor-pointer border border-white/20 flex items-center justify-center gap-2 will-change-transform"
              >
                <span class="material-symbols-outlined text-base">support_agent</span>
                <span>Talk to Our Team</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- 14. FOOTER                                 -->
      <!-- ========================================== -->
      <footer class="relative z-10 bg-white border-t border-[#DCEBE7] pt-12 sm:pt-16 pb-8 sm:pb-12 px-4 xs:px-6 sm:px-10 gsap-footer">
        <div class="max-w-7xl 2xl:max-w-8xl mx-auto">
          
          <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-10 sm:pb-12 border-b border-[#DCEBE7]">
            
            <!-- Brand Column -->
            <div class="col-span-1 xs:col-span-2 space-y-4 gsap-footer-col">
              <a (click)="scrollToTop()" class="flex items-center gap-2.5 cursor-pointer group">
                <img src="/workoraLogo.png" alt="Workora Logo" class="h-8 w-auto object-contain drop-shadow-xs transition-transform group-hover:scale-105" />
                <span class="text-xl font-extrabold text-[#063B39] font-heading">Workora</span>
              </a>
              <div class="text-xs font-bold text-[#063B39]">Work better. Manage smarter.</div>
              <p class="text-xs text-slate-600 leading-relaxed max-w-sm">
                A simpler way to manage people, processes, and everyday work.
              </p>
            </div>

            <!-- Product Links -->
            <div class="space-y-3 gsap-footer-col">
              <h4 class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Product</h4>
              <ul class="space-y-2 text-xs text-slate-600">
                <li><a (click)="scrollToSection('features')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Features</a></li>
                <li><a (click)="scrollToSection('roles')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">HR</a></li>
                <li><a (click)="scrollToSection('roles')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Managers</a></li>
                <li><a (click)="scrollToSection('roles')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Employees</a></li>
                <li><a (click)="scrollToSection('security')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Security</a></li>
              </ul>
            </div>

            <!-- Company Links -->
            <div class="space-y-3 gsap-footer-col">
              <h4 class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Company</h4>
              <ul class="space-y-2 text-xs text-slate-600">
                <li><a (click)="scrollToSection('why-workora')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">About</a></li>
                <li><a routerLink="/login" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Contact</a></li>
                <li><a routerLink="/login" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Careers</a></li>
                <li><a routerLink="/login" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Resources</a></li>
              </ul>
            </div>

            <!-- Support Links -->
            <div class="space-y-3 gsap-footer-col">
              <h4 class="text-xs font-bold text-[#063B39] uppercase tracking-wider">Support</h4>
              <ul class="space-y-2 text-xs text-slate-600">
                <li><a routerLink="/login" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Help Center</a></li>
                <li><a (click)="scrollToSection('faq')" class="hover:text-[#0E6E68] transition-colors cursor-pointer">FAQs</a></li>
                <li><a routerLink="/login" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Contact Support</a></li>
              </ul>
            </div>

          </div>

          <!-- Bottom Copyright -->
          <div class="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 sm:gap-4 gsap-footer-bottom">
            <div>
              &copy; 2026 Workora. All rights reserved.
            </div>
            <div class="flex items-center gap-4 text-slate-600">
              <a class="hover:text-[#0E6E68] transition-colors cursor-pointer">Privacy Policy</a>
              <span>•</span>
              <a class="hover:text-[#0E6E68] transition-colors cursor-pointer">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  `
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pageContainerRef', { static: false }) pageContainerRef!: ElementRef<HTMLElement>;
  @ViewChild('navbarRef', { static: false }) navbarRef!: ElementRef<HTMLElement>;
  @ViewChild('heroSectionRef', { static: false }) heroSectionRef!: ElementRef<HTMLElement>;
  @ViewChild('heroDashboardRef', { static: false }) heroDashboardRef!: ElementRef<HTMLElement>;
  @ViewChild('roleContentRef', { static: false }) roleContentRef!: ElementRef<HTMLElement>;
  @ViewChild('floatBadge1Ref', { static: false }) floatBadge1Ref!: ElementRef<HTMLElement>;
  @ViewChild('floatBadge2Ref', { static: false }) floatBadge2Ref!: ElementRef<HTMLElement>;

  // Reactive state signals
  readonly isScrolled = signal<boolean>(false);
  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly heroTab = signal<'pto' | 'attendance' | 'payroll'>('pto');
  readonly ptoApproved = signal<boolean>(false);
  readonly selectedRole = signal<'hr' | 'manager' | 'employee'>('hr');
  readonly employeeCount = signal<number>(65);

  // Reactive FAQ Accordion signal
  readonly openFaqSet = signal<Set<number>>(new Set([0]));

  // Animated display values for ROI interpolator
  readonly animatedEmployeeCount = signal<number>(65);
  readonly animatedHoursSaved = signal<number>(27);

  // Computed ROI statistics
  readonly monthlyHoursSaved = computed(() => {
    return Math.round(this.employeeCount() * 0.42);
  });

  // Steps data
  readonly steps: WorkflowStep[] = [
    {
      number: 'Step 01',
      title: 'Set Up Your Organization',
      description: 'Bring your people and workplace information into one platform.',
      icon: 'domain'
    },
    {
      number: 'Step 02',
      title: 'Connect Your Teams',
      description: 'Give HR, managers, and employees the right tools for their roles.',
      icon: 'groups'
    },
    {
      number: 'Step 03',
      title: 'Simplify Everyday Work',
      description: 'Manage attendance, leave, approvals, and workplace processes from one place.',
      icon: 'tune'
    },
    {
      number: 'Step 04',
      title: 'Grow With Confidence',
      description: 'Use better visibility and insights to make smarter decisions as your organization grows.',
      icon: 'trending_up'
    }
  ];

  // Authentic human testimonials data
  readonly testimonials: Testimonial[] = [
    {
      quote: "Workora has made our everyday HR processes much easier. Our team spends less time managing paperwork and more time supporting employees.",
      role: "HR Manager",
      company: "Growing Business",
      avatarBg: "bg-[#0E6E68]",
      initials: "HR"
    },
    {
      quote: "Approvals and team management are much simpler now. Everyone knows what they need to do and where to find it.",
      role: "Operations Manager",
      company: "Technology Company",
      avatarBg: "bg-[#3FA79B]",
      initials: "OM"
    },
    {
      quote: "I don't have to depend on HR for every small request anymore. Everything I need is right there.",
      role: "Employee",
      company: "Workora Customer",
      avatarBg: "bg-[#063B39]",
      initials: "EM"
    }
  ];

  // Honest, straightforward FAQ items
  readonly faqs: FaqItem[] = [
    {
      question: "What is Workora?",
      answer: "Workora is a workplace management platform that helps organizations manage employees, attendance, leave, approvals, and everyday HR operations in one place."
    },
    {
      question: "Who can use Workora?",
      answer: "Workora is designed for HR teams, managers, employees, and organizations of different sizes."
    },
    {
      question: "Can employees use Workora directly?",
      answer: "Yes. Employees get their own experience where they can access relevant information and manage everyday requests."
    },
    {
      question: "Can managers manage their teams?",
      answer: "Yes. Managers can view their teams, handle approvals, monitor attendance, and manage day-to-day responsibilities."
    },
    {
      question: "Is Workora suitable for growing companies?",
      answer: "Yes. Workora is designed to simplify workplace management today while giving organizations room to grow."
    },
    {
      question: "Is my organization's information secure?",
      answer: "Workora is designed with controlled access and security-focused practices to help protect workplace information."
    }
  ];

  // GSAP Lifecycle & Cleanup References
  private ctx: gsap.Context | null = null;
  private mm: gsap.MatchMedia | null = null;
  private animTimer: any = null;
  private mouseMoveListener: ((e: MouseEvent) => void) | null = null;
  private mouseLeaveListener: (() => void) | null = null;
  private calcTween: gsap.core.Tween | null = null;
  private calcProxy = { count: 65, hours: 27 };

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private ngZone: NgZone
  ) { }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.isScrolled.set(scrollPos > 30);
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.animTimer = setTimeout(() => {
      this.initGsapArchitecture();
    }, 50);
  }

  ngOnDestroy(): void {
    if (this.animTimer) clearTimeout(this.animTimer);
    if (this.calcTween) this.calcTween.kill();

    this.cleanupMouseListeners();

    if (this.mm) {
      this.mm.revert();
      this.mm = null;
    }

    if (this.ctx) {
      this.ctx.revert();
      this.ctx = null;
    }
  }

  // =========================================================================
  // GLOBAL GSAP ARCHITECTURE & MATCHMEDIA SYSTEM
  // =========================================================================

  private initGsapArchitecture(): void {
    const rootEl = this.pageContainerRef?.nativeElement || document.body;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) {
      this.initReducedMotionFallback();
      return;
    }

    this.ctx = gsap.context(() => {
      this.mm = gsap.matchMedia();

      // 1. DESKTOP & LAPTOP
      this.mm.add('(min-width: 1024px)', () => {
        this.initHeroAnimations(true);
        this.initSectionTimelines(true);
        this.initCardAnimations();
        this.initCardTiltAnimations();
      });

      // 2. MOBILE & TABLET
      this.mm.add('(max-width: 1023px)', () => {
        this.initHeroAnimations(false);
        this.initSectionTimelines(false);
        this.initFloatingAnimations();
      });

      // Refresh ScrollTrigger positions after all animations are defined
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);

    }, rootEl);
  }

  // =========================================================================
  // 1. HERO ANIMATIONS
  // =========================================================================

  private initHeroAnimations(isDesktop: boolean): void {
    const heroTl = gsap.timeline({
      defaults: {
        ease: 'power3.out'
      },
      onComplete: () => {
        if (isDesktop) {
          this.initHeroParallax();
          this.initFloatingAnimations();
        }
      }
    });

    // 1. Navbar entrance
    if (this.navbarRef?.nativeElement) {
      heroTl.fromTo(
        this.navbarRef.nativeElement,
        { y: -25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }

    // 2. Hero Badge Pill
    heroTl.fromTo(
      '.gsap-hero-badge',
      { y: 15, opacity: 0, scale: 0.94 },
      { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.4)' },
      0.05
    );

    // 3. Main Headline Lines
    heroTl.fromTo(
      '.gsap-hero-title-line',
      { y: isDesktop ? 35 : 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power4.out' },
      0.1
    );

    // 4. Description Story
    heroTl.fromTo(
      '.gsap-hero-desc',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'power3.out' },
      0.2
    );

    // 5. CTA Buttons
    heroTl.fromTo(
      '.gsap-hero-cta',
      { y: 15, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.06, duration: 0.5, ease: 'back.out(1.2)' },
      0.25
    );

    // 6. Hero Dashboard Card Entrance
    if (this.heroDashboardRef?.nativeElement) {
      heroTl.fromTo(
        this.heroDashboardRef.nativeElement,
        { x: isDesktop ? 40 : 0, y: isDesktop ? 0 : 20, opacity: 0, scale: 0.96 },
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'power3.out' },
        0.15
      );
    }

    // 7. Floating Badges Entrance
    heroTl.fromTo(
      ['.gsap-float-badge-1', '.gsap-float-badge-2'],
      { opacity: 0, scale: 0.88, y: 10 },
      { opacity: 1, scale: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'back.out(1.4)' },
      0.35
    );
  }

  // =========================================================================
  // 2. HERO MOUSE PARALLAX
  // =========================================================================

  private initHeroParallax(): void {
    const heroEl = this.heroSectionRef?.nativeElement;
    const dashEl = this.heroDashboardRef?.nativeElement;
    if (!heroEl || !dashEl) return;

    const setDashX = gsap.quickTo(dashEl, 'x', { duration: 0.6, ease: 'power2.out' });
    const setDashY = gsap.quickTo(dashEl, 'y', { duration: 0.6, ease: 'power2.out' });
    const setDashRotY = gsap.quickTo(dashEl, 'rotationY', { duration: 0.7, ease: 'power2.out' });
    const setDashRotX = gsap.quickTo(dashEl, 'rotationX', { duration: 0.7, ease: 'power2.out' });

    const badgeEl = heroEl.querySelector('.gsap-hero-badge');
    const setBadgeX = badgeEl ? gsap.quickTo(badgeEl, 'x', { duration: 0.8, ease: 'power2.out' }) : null;
    const setBadgeY = badgeEl ? gsap.quickTo(badgeEl, 'y', { duration: 0.8, ease: 'power2.out' }) : null;

    const orb1 = document.querySelector('.gsap-ambient-orb-1');
    const orb2 = document.querySelector('.gsap-ambient-orb-2');
    const setOrb1X = orb1 ? gsap.quickTo(orb1, 'x', { duration: 1.2, ease: 'power2.out' }) : null;
    const setOrb1Y = orb1 ? gsap.quickTo(orb1, 'y', { duration: 1.2, ease: 'power2.out' }) : null;
    const setOrb2X = orb2 ? gsap.quickTo(orb2, 'x', { duration: 1.4, ease: 'power2.out' }) : null;
    const setOrb2Y = orb2 ? gsap.quickTo(orb2, 'y', { duration: 1.4, ease: 'power2.out' }) : null;

    this.ngZone.runOutsideAngular(() => {
      this.mouseMoveListener = (e: MouseEvent) => {
        const rect = heroEl.getBoundingClientRect();
        if (
          e.clientX < rect.left - 80 ||
          e.clientX > rect.right + 80 ||
          e.clientY < rect.top - 80 ||
          e.clientY > rect.bottom + 80
        ) {
          return;
        }

        const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

        setDashX(relX * -10);
        setDashY(relY * -8);
        setDashRotY(relX * -2);
        setDashRotX(relY * 1.5);

        if (setBadgeX && setBadgeY) {
          setBadgeX(relX * 5);
          setBadgeY(relY * 3);
        }

        if (setOrb1X && setOrb1Y) {
          setOrb1X(relX * 18);
          setOrb1Y(relY * 14);
        }
        if (setOrb2X && setOrb2Y) {
          setOrb2X(relX * -15);
          setOrb2Y(relY * -12);
        }
      };

      this.mouseLeaveListener = () => {
        setDashX(0);
        setDashY(0);
        setDashRotY(0);
        setDashRotX(0);
        if (setBadgeX && setBadgeY) {
          setBadgeX(0);
          setBadgeY(0);
        }
        if (setOrb1X && setOrb1Y) {
          setOrb1X(0);
          setOrb1Y(0);
        }
        if (setOrb2X && setOrb2Y) {
          setOrb2X(0);
          setOrb2Y(0);
        }
      };

      window.addEventListener('mousemove', this.mouseMoveListener, { passive: true });
      heroEl.addEventListener('mouseleave', this.mouseLeaveListener, { passive: true });
    });
  }

  // =========================================================================
  // 3. CARD 3D TILT ANIMATIONS
  // =========================================================================

  private initCardTiltAnimations(): void {
    const ctaCard = document.querySelector('.gsap-cta-card') as HTMLElement;
    if (!ctaCard) return;

    const setCtaRotY = gsap.quickTo(ctaCard, 'rotationY', { duration: 0.5, ease: 'power2.out' });
    const setCtaRotX = gsap.quickTo(ctaCard, 'rotationX', { duration: 0.5, ease: 'power2.out' });

    this.ngZone.runOutsideAngular(() => {
      ctaCard.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = ctaCard.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        setCtaRotY(x * 2.2);
        setCtaRotX(y * -2.2);
      }, { passive: true });

      ctaCard.addEventListener('mouseleave', () => {
        setCtaRotY(0);
        setCtaRotX(0);
      }, { passive: true });
    });
  }

  // =========================================================================
  // 4. FLOATING ELEMENTS
  // =========================================================================

  private initFloatingAnimations(): void {
    gsap.to('.gsap-float-badge-1', {
      y: -7,
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.gsap-float-badge-2', {
      y: 6,
      duration: 4.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.4
    });

    gsap.to('.gsap-ambient-orb-1', {
      x: 16,
      y: 12,
      duration: 9.0,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.gsap-ambient-orb-2', {
      x: -14,
      y: -10,
      duration: 11.0,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.0
    });
  }

  // =========================================================================
  // 5. UNIFIED SECTION REVEAL SYSTEM (Fail-Proof ScrollTrigger Timelines)
  // =========================================================================

  private initSectionTimelines(isDesktop: boolean): void {
    const yOffset = isDesktop ? 25 : 15;

    // Helper to build a clean unified timeline per section
    const buildSectionTl = (triggerId: string) => {
      return gsap.timeline({
        scrollTrigger: {
          trigger: triggerId,
          start: 'top 88%',
          once: true
        },
        defaults: { ease: 'power3.out' }
      });
    };

    // 1. Product Message Banner
    const msgTl = buildSectionTl('#product-message');
    msgTl.fromTo(
      '#product-message h2, #product-message p, #product-message span',
      { y: yOffset, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.55 }
    );

    // 2. Section: Why Workora
    const whyTl = buildSectionTl('#why-workora');
    whyTl.fromTo(
      '.gsap-why-header > *',
      { y: yOffset, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 }
    )
    .fromTo(
      ['.gsap-old-way', '.gsap-workora-way'],
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.55 },
      '-=0.25'
    );

    // 3. Section: By Role
    const rolesTl = buildSectionTl('#roles');
    rolesTl.fromTo(
      '.gsap-roles-header > *',
      { y: yOffset, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 }
    )
    .fromTo(
      '.gsap-role-tab',
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.05, duration: 0.4 },
      '-=0.25'
    )
    .fromTo(
      '.gsap-role-card',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.2'
    );

    // 4. Section: Core Features
    const featTl = buildSectionTl('#features');
    featTl.fromTo(
      '.gsap-features-header > *',
      { y: yOffset, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 }
    )
    .fromTo(
      '.gsap-feature-card',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 },
      '-=0.25'
    );

    // 5. Section: The Workora Difference
    const diffTl = buildSectionTl('#difference');
    diffTl.fromTo(
      '.gsap-difference-header > *',
      { y: yOffset, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 }
    )
    .fromTo(
      '.gsap-difference-table',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55 },
      '-=0.25'
    )
    .fromTo(
      '.gsap-difference-highlight',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.2'
    );

    // 6. Section: ROI Calculator
    const calcTl = buildSectionTl('#calculator');
    calcTl.fromTo(
      '.gsap-calc-header > *',
      { y: yOffset, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 }
    )
    .fromTo(
      '.gsap-calc-card',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55 },
      '-=0.25'
    );

    // 7. Section: How Workora Works
    const stepsTl = buildSectionTl('#how-it-works');
    stepsTl.fromTo(
      '.gsap-steps-header > *',
      { y: yOffset, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 }
    )
    .fromTo(
      '.gsap-step-card',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.07, duration: 0.5 },
      '-=0.25'
    );

    // 8. Section: Security
    const secTl = buildSectionTl('#security');
    secTl.fromTo(
      '.gsap-security-header > *',
      { y: yOffset, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 }
    )
    .fromTo(
      '.gsap-security-card',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.07, duration: 0.5 },
      '-=0.25'
    );

    // 9. Section: Testimonials
    const testTl = buildSectionTl('#testimonials');
    testTl.fromTo(
      '.gsap-testimonials-header > *',
      { y: yOffset, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 }
    )
    .fromTo(
      '.gsap-testimonial-card',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.07, duration: 0.5 },
      '-=0.25'
    );

    // 10. Section: FAQ (Header & All Items reveal TOGETHER)
    const faqTl = buildSectionTl('#faq');
    faqTl.fromTo(
      '.gsap-faq-header > *',
      { y: yOffset, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 }
    )
    .fromTo(
      '.gsap-faq-item',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.45 },
      '-=0.25'
    );

    // 11. Section: Final CTA
    const ctaTl = buildSectionTl('#contact');
    ctaTl.fromTo(
      '.gsap-cta-card',
      { y: 25, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6 }
    )
    .fromTo(
      '.gsap-cta-badge',
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.3)' },
      '-=0.3'
    )
    .fromTo(
      '.gsap-cta-title',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.25'
    )
    .fromTo(
      '.gsap-cta-desc',
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45 },
      '-=0.25'
    )
    .fromTo(
      '.gsap-cta-btn',
      { y: 12, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.45, ease: 'back.out(1.2)' },
      '-=0.2'
    );

    // 12. Section: Footer
    const footerTl = buildSectionTl('footer');
    footerTl.fromTo(
      '.gsap-footer-col',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 }
    )
    .fromTo(
      '.gsap-footer-bottom',
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.2'
    );
  }

  // =========================================================================
  // 6. CARD HOVER & INTERACTIVE MICRO-ANIMATIONS
  // =========================================================================

  private initCardAnimations(): void {
    const cards = document.querySelectorAll('.gsap-feature-card, .gsap-step-card');
    cards.forEach((card) => {
      const icon = card.querySelector('.gsap-feature-icon');

      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -6, scale: 1.015, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        if (icon) gsap.to(icon, { scale: 1.08, rotation: 2, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        if (icon) gsap.to(icon, { scale: 1, rotation: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      });
    });
  }

  // =========================================================================
  // 7. ACCESSIBILITY FALLBACK (Prefers-Reduced-Motion)
  // =========================================================================

  private initReducedMotionFallback(): void {
    gsap.set([
      this.navbarRef?.nativeElement,
      '.gsap-hero-badge',
      '.gsap-hero-title-line',
      '.gsap-hero-desc',
      '.gsap-hero-cta',
      '.gsap-hero-dashboard',
      '.gsap-float-badge-1',
      '.gsap-float-badge-2',
      '#product-message *',
      '.gsap-why-header > *',
      '.gsap-old-way',
      '.gsap-workora-way',
      '.gsap-roles-header > *',
      '.gsap-role-tab',
      '.gsap-role-card',
      '.gsap-features-header > *',
      '.gsap-feature-card',
      '.gsap-difference-header > *',
      '.gsap-difference-table',
      '.gsap-difference-highlight',
      '.gsap-calc-header > *',
      '.gsap-calc-card',
      '.gsap-steps-header > *',
      '.gsap-step-card',
      '.gsap-security-header > *',
      '.gsap-security-card',
      '.gsap-testimonials-header > *',
      '.gsap-testimonial-card',
      '.gsap-faq-header > *',
      '.gsap-faq-item',
      '.gsap-cta-card',
      '.gsap-cta-badge',
      '.gsap-cta-title',
      '.gsap-cta-desc',
      '.gsap-cta-btn',
      '.gsap-footer-col',
      '.gsap-footer-bottom'
    ], {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
      clearProps: 'all'
    });
  }

  // =========================================================================
  // 8. INTERACTIVE EVENT HANDLERS & NUMERIC INTERPOLATION
  // =========================================================================

  /**
   * Toggles FAQ item open/closed with individual toggle state
   */
  toggleFaq(index: number): void {
    this.openFaqSet.update(set => {
      const next = new Set(set);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  /**
   * Helper to check if a specific FAQ index is currently expanded
   */
  isFaqOpen(index: number): boolean {
    return this.openFaqSet().has(index);
  }

  /**
   * Smoothly animates role panel when switching between HR, Manager, Employee
   */
  onRoleSelect(role: 'hr' | 'manager' | 'employee'): void {
    if (this.selectedRole() === role) return;

    this.selectedRole.set(role);

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (this.roleContentRef?.nativeElement) {
          gsap.fromTo(
            this.roleContentRef.nativeElement,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out', overwrite: 'auto' }
          );
        }
      }, 10);
    }
  }

  /**
   * Smoothly interpolates numerical values when ROI slider is adjusted
   */
  onEmployeeCountChange(value: any): void {
    const num = Number(value) || 10;
    this.employeeCount.set(num);

    if (!isPlatformBrowser(this.platformId)) {
      this.animatedEmployeeCount.set(num);
      this.animatedHoursSaved.set(this.monthlyHoursSaved());
      return;
    }

    if (this.calcTween) this.calcTween.kill();

    const targetCount = num;
    const targetHours = Math.round(targetCount * 0.42);

    this.calcTween = gsap.to(this.calcProxy, {
      count: targetCount,
      hours: targetHours,
      duration: 0.32,
      ease: 'power2.out',
      onUpdate: () => {
        this.animatedEmployeeCount.set(Math.round(this.calcProxy.count));
        this.animatedHoursSaved.set(Math.round(this.calcProxy.hours));
      }
    });

    gsap.fromTo(
      '.gsap-calc-metric',
      { scale: 1 },
      { scale: 1.015, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: 'auto' }
    );
  }

  approvePto(): void {
    this.ptoApproved.set(true);
  }

  resetPto(): void {
    this.ptoApproved.set(false);
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

        // Trigger ScrollTrigger recalculation
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 400);
      }
    }
  }

  private cleanupMouseListeners(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.mouseMoveListener) {
      window.removeEventListener('mousemove', this.mouseMoveListener);
      this.mouseMoveListener = null;
    }

    if (this.mouseLeaveListener && this.heroSectionRef?.nativeElement) {
      this.heroSectionRef.nativeElement.removeEventListener('mouseleave', this.mouseLeaveListener);
      this.mouseLeaveListener = null;
    }
  }
}
