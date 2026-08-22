import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../core/services/auth.service';

/**
 * Enterprise HRMS Dashboard Layout Shell.
 * Wraps all authenticated workspace features (/dashboard, /users, etc.) inside the modern
 * Workora dark sidebar layout with responsive mobile drawer and GSAP transitions.
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
          class="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        ></div>
      }

      <!-- Side Navigation Bar (Desktop & Mobile Drawer) -->
      <aside 
        [ngClass]="{
          'translate-x-0': isMobileMenuOpen(),
          '-translate-x-full lg:translate-x-0': !isMobileMenuOpen()
        }"
        class="h-screen w-64 fixed left-0 top-0 bg-[#063B39] text-white border-r border-[#063B39]/80 shadow-xl flex flex-col py-5 z-50 transition-transform duration-300 ease-in-out"
      >
        
        <!-- Brand Header with Official Workora Logo -->
        <div class="px-6 mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3 cursor-pointer group" routerLink="/dashboard">
            <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md p-1.5 flex items-center justify-center shadow-sm border border-white/10">
              <img alt="Workora Logo" class="h-7 w-auto object-contain transition-transform group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(63,167,155,0.4)]" src="/workoraLogo.png"/>
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-white tracking-tight font-heading leading-none">Workora</h2>
              <p class="text-[10px] font-bold text-[#3FA79B] uppercase tracking-wider mt-0.5">Enterprise HRMS</p>
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
        <nav class="flex-1 space-y-1.5 px-3 overflow-y-auto">
          
          <div class="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#3FA79B]/80">Core Modules</div>

          <!-- Dashboard Tab -->
          <a
            routerLink="/dashboard"
            (click)="closeMobileMenu()"
            routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md"
            [routerLinkActiveOptions]="{ exact: true }"
            class="text-white/80 hover:bg-white/10 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group">
            <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white transition-colors">dashboard</span>
            <span>Dashboard</span>
          </a>

          <!-- User Management Tab -->
          <a
            routerLink="/users"
            (click)="closeMobileMenu()"
            routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md"
            class="text-white/80 hover:bg-white/10 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group">
            <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white transition-colors">manage_accounts</span>
            <span>User Management</span>
          </a>

          <!-- Security & Settings Tab -->
          <a
            routerLink="/change-password"
            (click)="closeMobileMenu()"
            routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md"
            class="text-white/80 hover:bg-white/10 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group">
            <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white transition-colors">security</span>
            <span>Security &amp; Password</span>
          </a>

          <div class="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#3FA79B]/80">HR Operations</div>

          <a
            routerLink="/dashboard"
            (click)="closeMobileMenu()"
            class="text-white/70 hover:bg-white/10 hover:text-white flex items-center px-3.5 py-2 rounded-xl cursor-pointer transition-all text-xs font-semibold group opacity-75">
            <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B]">groups</span>
            <span>Employees</span>
          </a>

          <a
            routerLink="/dashboard"
            (click)="closeMobileMenu()"
            class="text-white/70 hover:bg-white/10 hover:text-white flex items-center px-3.5 py-2 rounded-xl cursor-pointer transition-all text-xs font-semibold group opacity-75">
            <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B]">schedule</span>
            <span>Attendance</span>
          </a>

          <a
            routerLink="/dashboard"
            (click)="closeMobileMenu()"
            class="text-white/70 hover:bg-white/10 hover:text-white flex items-center px-3.5 py-2 rounded-xl cursor-pointer transition-all text-xs font-semibold group opacity-75">
            <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B]">payments</span>
            <span>Payroll</span>
          </a>
        </nav>

        <!-- User Profile & Action Footer -->
        <div class="px-3 mt-auto space-y-2 pt-4 border-t border-white/10">
          
          <div class="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <div class="w-8 h-8 rounded-full bg-[#0E6E68] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {{ getInitials(currentUser()?.firstName, currentUser()?.lastName) }}
            </div>
            <div class="overflow-hidden">
              <p class="text-xs font-bold text-white truncate leading-none">{{ currentUser()?.firstName || 'Admin' }} {{ currentUser()?.lastName || 'User' }}</p>
              <p class="text-[10px] text-[#3FA79B] uppercase font-semibold mt-0.5 truncate">{{ currentUser()?.roles?.[0] || 'Administrator' }}</p>
            </div>
          </div>

          <a 
            routerLink="/" 
            class="w-full py-2 px-3 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined text-base text-[#3FA79B]">home</span>
            <span>Landing Page</span>
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
      <div class="flex-1 lg:ml-64 min-h-screen flex flex-col relative z-10 w-full">
        
        <!-- TopNavBar Header -->
        <header class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#DCEBE7] h-16 flex items-center px-4 sm:px-8 shadow-xs">
          <div class="flex justify-between items-center w-full max-w-7xl mx-auto">
            
            <div class="flex items-center gap-3 sm:gap-6">
              <!-- Mobile Hamburger Toggle -->
              <button 
                (click)="toggleMobileMenu()" 
                class="lg:hidden p-2 rounded-xl text-[#063B39] hover:bg-[#DCEBE7]/50 border border-[#DCEBE7] transition-colors border-none bg-transparent cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                <span class="material-symbols-outlined text-2xl">menu</span>
              </button>

              <div class="hidden sm:block">
                <span class="text-sm font-extrabold text-[#063B39] font-heading">Workspace</span>
              </div>
              
              <nav class="hidden md:flex items-center gap-3 text-xs font-semibold text-[#6B7F7C]">
                <a routerLink="/dashboard" routerLinkActive="text-[#0E6E68] font-bold" [routerLinkActiveOptions]="{ exact: true }" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Overview</a>
                <span>•</span>
                <a routerLink="/users" routerLinkActive="text-[#0E6E68] font-bold" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Users</a>
                <span>•</span>
                <a routerLink="/change-password" routerLinkActive="text-[#0E6E68] font-bold" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Security</a>
              </nav>
            </div>

            <div class="flex items-center gap-3 sm:gap-4">
              <!-- Search Input -->
              <div class="relative hidden sm:block">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">search</span>
                <input 
                  class="workora-input py-1.5 pl-9 pr-4 text-xs w-48 sm:w-60" 
                  placeholder="Search workspace..." 
                  type="text"
                />
              </div>

              <!-- Notifications -->
              <button class="hover:bg-[#DCEBE7]/50 rounded-xl p-2 transition-all text-[#063B39] relative cursor-pointer border-none bg-transparent" aria-label="Notifications">
                <span class="material-symbols-outlined text-xl">notifications</span>
                <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0E6E68] rounded-full"></span>
              </button>

              <div class="h-5 w-px bg-[#DCEBE7] mx-0.5 hidden sm:block"></div>
              
              <!-- User Profile Pill -->
              <div class="flex items-center gap-2.5 pl-1 cursor-pointer" routerLink="/change-password">
                <div class="w-8 h-8 rounded-full bg-[#0E6E68] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {{ getInitials(currentUser()?.firstName, currentUser()?.lastName) }}
                </div>
              </div>
            </div>

          </div>
        </header>

        <!-- Routed Feature View -->
        <main class="flex-1 flex flex-col">
          <router-outlet></router-outlet>
        </main>

      </div>

    </div>
  `
})
export class DashboardLayoutComponent {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly isMobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  getInitials(firstName?: string, lastName?: string): string {
    const f = firstName ? firstName.charAt(0).toUpperCase() : 'A';
    const l = lastName ? lastName.charAt(0).toUpperCase() : 'D';
    return `${f}${l}`;
  }

  onLogout(): void {
    this.authService.logout().subscribe();
  }
}
