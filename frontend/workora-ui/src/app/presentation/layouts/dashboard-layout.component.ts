import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, HostListener, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

/**
 * Enterprise HRMS Dashboard Layout Shell.
 * Wraps all authenticated workspace features (/dashboard, /users, /change-password, etc.) inside the modern
 * Workora dark teal sidebar layout with top workspace header, notifications, user profile menu, and responsive mobile drawer.
 */
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="font-sans text-[#163331] bg-[#F4F8F7] min-h-screen relative overflow-x-hidden antialiased selection:bg-[#DCEBE7] selection:text-[#063B39] flex">
      
      <!-- Mobile Sidebar Backdrop Overlay -->
      @if (isMobileMenuOpen()) {
        <div 
          (click)="closeMobileMenu()" 
          class="fixed inset-0 bg-[#063B39]/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        ></div>
      }

      <!-- Side Navigation Bar (Desktop & Mobile Drawer) -->
      <aside 
        [ngClass]="{
          'translate-x-0 shadow-2xl': isMobileMenuOpen(),
          '-translate-x-full lg:translate-x-0': !isMobileMenuOpen()
        }"
        class="h-screen w-72 xs:w-64 fixed left-0 top-0 bg-[#063B39] text-white border-r border-[#063B39]/80 shadow-2xl flex flex-col py-5 z-50 transition-transform duration-300 ease-in-out sidebar-shell"
      >
        
        <!-- Brand Header with Official Workora Logo -->
        <div class="px-5 sm:px-6 mb-6 flex items-center justify-between sidebar-brand">
          <div class="flex items-center gap-3 cursor-pointer group" routerLink="/dashboard" (click)="closeMobileMenu()">
            <img 
              alt="Workora 3D Logo" 
              src="/workoraLogo.png" 
              class="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_4px_12px_rgba(63,167,155,0.45)] shrink-0"
            />
            <div>
              <h2 class="text-xl font-extrabold text-white tracking-tight font-heading leading-none">Workora</h2>
              <p class="text-[10px] font-bold text-[#3FA79B] uppercase tracking-wider mt-1">Enterprise HRMS</p>
            </div>
          </div>

          <!-- Close button on mobile -->
          <button 
            (click)="closeMobileMenu()" 
            class="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors border-none bg-transparent cursor-pointer"
            aria-label="Close menu"
          >
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 space-y-1.5 px-3 overflow-y-auto sidebar-nav">
          
          <div class="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#3FA79B]/80">Core Workspace</div>

          <!-- Dashboard Tab -->
          <a
            routerLink="/dashboard"
            (click)="closeMobileMenu()"
            routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
            [routerLinkActiveOptions]="{ exact: true }"
            class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
            <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">dashboard</span>
            <span>Dashboard</span>
          </a>

          <!-- User Directory Tab -->
          <a
            routerLink="/users"
            (click)="closeMobileMenu()"
            routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
            class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
            <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">manage_accounts</span>
            <span>User Directory</span>
          </a>

          <!-- Security & Settings Tab -->
          <a
            routerLink="/change-password"
            (click)="closeMobileMenu()"
            routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
            class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
            <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">security</span>
            <span>Security &amp; Password</span>
          </a>

          <div class="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#3FA79B]/80">HR Modules</div>

          <!-- Employees Directory (Preview) -->
          <a
            routerLink="/users"
            (click)="closeMobileMenu()"
            class="text-white/70 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
            <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:scale-105 transition-transform">groups</span>
            <span>Employees</span>
          </a>

          <!-- Attendance (Preview) -->
          <a
            (click)="onModulePreview('Attendance & Time Tracking')"
            class="text-white/70 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
            <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:scale-105 transition-transform">schedule</span>
            <span>Attendance</span>
            <span class="ml-auto text-[9px] px-1.5 py-0.5 rounded-md bg-white/10 text-[#3FA79B] font-bold">PRO</span>
          </a>

          <!-- Payroll (Preview) -->
          <a
            (click)="onModulePreview('Payroll & Compensation')"
            class="text-white/70 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
            <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:scale-105 transition-transform">payments</span>
            <span>Payroll</span>
            <span class="ml-auto text-[9px] px-1.5 py-0.5 rounded-md bg-white/10 text-[#3FA79B] font-bold">PRO</span>
          </a>
        </nav>

        <!-- User Profile & Action Footer -->
        <div class="px-3 mt-auto space-y-2 pt-4 border-t border-white/10 sidebar-footer">
          
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#3FA79B]/40 transition-colors">
            <div class="w-8 h-8 rounded-full bg-[#0E6E68] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-white/20">
              {{ getInitials(currentUser()?.firstName, currentUser()?.lastName) }}
            </div>
            <div class="overflow-hidden flex-1">
              <p class="text-xs font-bold text-white truncate leading-none">{{ currentUser()?.firstName || 'Admin' }} {{ currentUser()?.lastName || 'User' }}</p>
              <p class="text-[10px] text-[#3FA79B] font-semibold mt-0.5 truncate uppercase tracking-wider">{{ currentUser()?.roles?.[0] || 'Administrator' }}</p>
            </div>
          </div>

          <a 
            routerLink="/" 
            (click)="closeMobileMenu()"
            class="w-full py-2 px-3 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined text-base text-[#3FA79B]">home</span>
            <span>Public Showcase</span>
          </a>

          <button 
            (click)="onLogout()" 
            class="w-full text-rose-300 hover:bg-rose-900/40 hover:text-rose-200 flex items-center px-3 py-2 rounded-xl cursor-pointer transition-all text-xs font-bold border-none bg-transparent">
            <span class="material-symbols-outlined mr-2 text-base">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Canvas Wrapper -->
      <div class="flex-1 lg:ml-64 min-h-screen flex flex-col relative z-10 w-full min-w-0">
        
        <!-- TopNavBar Header -->
        <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DCEBE7] h-14 sm:h-16 flex items-center px-3 xs:px-4 sm:px-6 lg:px-8 shadow-xs dashboard-topbar">
          <div class="flex justify-between items-center w-full max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl mx-auto gap-2">
            
            <div class="flex items-center gap-2 sm:gap-4 md:gap-6 min-w-0">
              <!-- Mobile Hamburger Toggle -->
              <button 
                (click)="toggleMobileMenu()" 
                class="lg:hidden p-1.5 xs:p-2 rounded-xl text-[#063B39] hover:bg-[#DCEBE7]/50 border border-[#DCEBE7] transition-colors border-none bg-transparent cursor-pointer shrink-0"
                aria-label="Toggle navigation menu"
              >
                <span class="material-symbols-outlined text-xl sm:text-2xl flex items-center justify-center">menu</span>
              </button>

              <!-- Mobile Brand Logo in Topbar -->
              <div class="flex items-center gap-2 lg:hidden cursor-pointer" routerLink="/dashboard">
                <img src="/workoraLogo.png" alt="Workora" class="h-7 w-auto object-contain drop-shadow-xs" />
                <span class="font-extrabold text-[#063B39] text-base font-heading">Workora</span>
              </div>

              <!-- Breadcrumb Links -->
              <nav class="hidden md:flex items-center gap-3 text-xs font-semibold text-[#6B7F7C] shrink-0">
                <a routerLink="/dashboard" routerLinkActive="text-[#0E6E68] font-bold" [routerLinkActiveOptions]="{ exact: true }" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Overview</a>
                <span>•</span>
                <a routerLink="/users" routerLinkActive="text-[#0E6E68] font-bold" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Users</a>
                <span>•</span>
                <a routerLink="/change-password" routerLinkActive="text-[#0E6E68] font-bold" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Security</a>
              </nav>
            </div>

            <div class="flex items-center gap-2 sm:gap-4 relative shrink-0">
              <!-- Perfected Search Input -->
              <div class="relative hidden sm:block">
                <div class="relative flex items-center">
                  <span class="material-symbols-outlined absolute left-3.5 text-[#0E6E68]/70 pointer-events-none text-lg">search</span>
                  <input 
                    class="w-48 md:w-64 lg:w-72 bg-[#F4F8F7] hover:bg-white focus:bg-white text-xs text-[#063B39] placeholder-[#6B7F7C] font-medium pl-10 pr-12 py-2 rounded-full border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none transition-all shadow-2xs" 
                    placeholder="Search workspace..." 
                    type="text"
                  />
                  <div class="absolute right-2.5 flex items-center pointer-events-none">
                    <kbd class="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold text-[#6B7F7C] bg-white border border-[#DCEBE7] rounded-md shadow-2xs">
                      ⌘K
                    </kbd>
                  </div>
                </div>
              </div>

              <!-- Notifications -->
              <button 
                (click)="onNotificationClick()"
                class="hover:bg-[#DCEBE7]/50 rounded-xl p-1.5 xs:p-2 transition-all text-[#063B39] relative cursor-pointer border-none bg-transparent" 
                aria-label="Notifications"
              >
                <span class="material-symbols-outlined text-xl">notifications</span>
                <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0E6E68] rounded-full"></span>
              </button>

              <div class="h-5 w-px bg-[#DCEBE7] mx-0.5 hidden sm:block"></div>
              
              <!-- User Profile Dropdown Trigger -->
              <div class="relative">
                <button 
                  (click)="toggleProfileMenu($event)"
                  class="flex items-center gap-2 p-1 rounded-xl hover:bg-[#DCEBE7]/40 transition-colors border-none bg-transparent cursor-pointer"
                  aria-label="User profile menu"
                >
                  <div class="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-[#0E6E68] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:scale-105 transition-transform shrink-0">
                    {{ getInitials(currentUser()?.firstName, currentUser()?.lastName) }}
                  </div>
                  <div class="hidden lg:block text-left">
                    <p class="text-xs font-bold text-[#063B39] leading-none">{{ currentUser()?.firstName || 'Admin' }}</p>
                    <p class="text-[10px] text-[#6B7F7C] mt-0.5">Settings ▾</p>
                  </div>
                </button>

                <!-- Profile Dropdown Menu -->
                @if (isProfileMenuOpen()) {
                  <div 
                    (click)="$event.stopPropagation()"
                    class="absolute right-0 top-full mt-2 w-56 bg-white border border-[#DCEBE7] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div class="px-3 py-2 border-b border-[#DCEBE7] mb-1">
                      <p class="text-xs font-bold text-[#063B39]">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</p>
                      <p class="text-[10px] text-[#6B7F7C] truncate">{{ currentUser()?.email }}</p>
                    </div>

                    <a 
                      routerLink="/change-password" 
                      (click)="isProfileMenuOpen.set(false)"
                      class="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#163331] hover:bg-[#DCEBE7]/50 rounded-xl transition-colors cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-base text-[#0E6E68]">lock_reset</span>
                      <span>Security &amp; Password</span>
                    </a>

                    <a 
                      routerLink="/users" 
                      (click)="isProfileMenuOpen.set(false)"
                      class="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#163331] hover:bg-[#DCEBE7]/50 rounded-xl transition-colors cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-base text-[#0E6E68]">manage_accounts</span>
                      <span>User Directory</span>
                    </a>

                    <div class="h-px bg-[#DCEBE7] my-1"></div>

                    <button 
                      (click)="onLogout()"
                      class="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors border-none bg-transparent cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-base">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                }
              </div>

            </div>

          </div>
        </header>

        <!-- Routed Feature View -->
        <main class="flex-1 flex flex-col min-w-0">
          <router-outlet></router-outlet>
        </main>

      </div>

    </div>
  `
})
export class DashboardLayoutComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  readonly currentUser = this.authService.currentUser;
  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly isProfileMenuOpen = signal<boolean>(false);

  private ctx?: gsap.Context;

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.isProfileMenuOpen()) {
      this.isProfileMenuOpen.set(false);
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    this.ctx = gsap.context(() => {
      // Sidebar staggered entrance
      gsap.from('.sidebar-nav .nav-item', {
        x: -15,
        opacity: 0,
        stagger: 0.04,
        duration: 0.4,
        ease: 'power2.out'
      });

      // Topbar fade down
      gsap.from('.dashboard-topbar', {
        y: -10,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
      });
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.isProfileMenuOpen.update(v => !v);
  }

  onNotificationClick(): void {
    this.notificationService.showInfo('You have no new system notifications at this time.');
  }

  onModulePreview(moduleName: string): void {
    this.notificationService.showInfo(`${moduleName} module is connected to the backend catalog and enabled for enterprise tier.`);
  }

  getInitials(firstName?: string, lastName?: string): string {
    const f = firstName ? firstName.charAt(0).toUpperCase() : 'A';
    const l = lastName ? lastName.charAt(0).toUpperCase() : 'D';
    return `${f}${l}`;
  }

  onLogout(): void {
    this.isProfileMenuOpen.set(false);
    this.authService.logout().subscribe();
  }
}
