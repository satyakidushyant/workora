import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/**
 * Enterprise HRMS Dashboard Layout Shell.
 * Wraps all authenticated workspace features (/dashboard, /users, etc.) inside the sleek
 * executive spatial glassmorphism layout with left sidebar navigation, top header bar, and atmospheric background.
 */
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="dark selection:bg-primary/30 selection:text-on-primary font-body-md text-on-surface bg-[#0d1320] min-h-screen relative overflow-x-hidden antialiased">
      <!-- Atmospheric Background Glow Orbs -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div #orb1 class="mesh-orb orb-1"></div>
        <div #orb2 class="mesh-orb orb-2"></div>
        <div #orb3 class="mesh-orb orb-3"></div>
      </div>

      <!-- SideNavBar -->
      <aside class="h-screen w-64 fixed left-0 top-0 bg-surface-container-low/60 backdrop-blur-2xl border-r border-white/10 shadow-2xl flex flex-col py-6 z-[60]">
        <!-- Brand Header with User Logo -->
        <div class="px-6 mb-8 flex flex-col items-start gap-2 cursor-pointer" routerLink="/dashboard">
          <img alt="Workora Logo" class="h-10 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(77,142,255,0.5)]" src="/workora.png"/>
          <div>
            <h2 class="font-display-lg text-lg font-extrabold text-on-surface tracking-tight leading-tight">Workora Enterprise</h2>
            <p class="font-label-sm text-[10px] text-outline uppercase tracking-widest">HRMS SUITE</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 space-y-1.5 px-4">
          <!-- Overview Tab -->
          <a
            routerLink="/dashboard"
            routerLinkActive="bg-primary/15 text-primary border-r-4 border-primary font-bold shadow-lg shadow-primary/10"
            [routerLinkActiveOptions]="{ exact: true }"
            class="text-on-surface-variant hover:bg-white/5 hover:text-on-surface flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all">
            <span class="material-symbols-outlined mr-3 text-xl">dashboard</span>
            <span class="font-label-sm text-xs">Overview</span>
          </a>

          <!-- User Management Tab -->
          <a
            routerLink="/users"
            routerLinkActive="bg-primary/15 text-primary border-r-4 border-primary font-bold shadow-lg shadow-primary/10"
            class="text-on-surface-variant hover:bg-white/5 hover:text-on-surface flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all">
            <span class="material-symbols-outlined mr-3 text-xl">manage_accounts</span>
            <span class="font-label-sm text-xs font-semibold">User Management</span>
          </a>

          <!-- Analytics Tab -->
          <a
            routerLink="/analytics"
            routerLinkActive="bg-primary/15 text-primary border-r-4 border-primary font-bold shadow-lg shadow-primary/10"
            class="text-on-surface-variant hover:bg-white/5 hover:text-on-surface flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all">
            <span class="material-symbols-outlined mr-3 text-xl">monitoring</span>
            <span class="font-label-sm text-xs font-semibold">Analytics</span>
          </a>

          <!-- Employees Tab -->
          <a
            routerLink="/employees"
            routerLinkActive="bg-primary/15 text-primary border-r-4 border-primary font-bold shadow-lg shadow-primary/10"
            class="text-on-surface-variant hover:bg-white/5 hover:text-on-surface flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all">
            <span class="material-symbols-outlined mr-3 text-xl">group</span>
            <span class="font-label-sm text-xs font-semibold">Employees</span>
          </a>

          <!-- Settings Tab -->
          <a
            routerLink="/change-password"
            routerLinkActive="bg-primary/15 text-primary border-r-4 border-primary font-bold shadow-lg shadow-primary/10"
            class="text-on-surface-variant hover:bg-white/5 hover:text-on-surface flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all">
            <span class="material-symbols-outlined mr-3 text-xl">settings</span>
            <span class="font-label-sm text-xs font-semibold">Settings</span>
          </a>
        </nav>

        <!-- Sidebar Action Footer -->
        <div class="px-4 mt-auto space-y-3">
          <button (click)="onNewReport()" class="w-full button-glow bg-gradient-to-r from-primary-container to-secondary text-on-primary-container py-3 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20">
            <span class="material-symbols-outlined text-base">add</span>
            New Report
          </button>
          <div (click)="onLogout()" class="text-on-surface-variant hover:bg-error/15 hover:text-error flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all">
            <span class="material-symbols-outlined mr-3 text-xl">logout</span>
            <span class="font-label-sm text-xs font-semibold">Logout</span>
          </div>
        </div>
      </aside>

      <!-- Main Content Canvas Wrapper -->
      <main class="ml-64 min-h-screen flex flex-col relative z-10">
        <!-- TopNavBar Header -->
        <header class="fixed top-0 right-0 left-64 z-50 bg-surface-container-low/60 backdrop-blur-2xl border-b border-white/10 h-20 flex items-center px-8 shadow-lg">
          <div class="flex justify-between items-center w-full max-w-7xl mx-auto">
            <div class="flex items-center gap-8">
              <span class="font-display-lg text-2xl tracking-tight text-on-surface font-extrabold">Workora Workspace</span>
              <nav class="hidden md:flex items-center gap-6">
                <a routerLink="/dashboard" routerLinkActive="text-primary font-bold border-b-2 border-primary" [routerLinkActiveOptions]="{ exact: true }" class="text-on-surface-variant hover:text-on-surface transition-all text-xs cursor-pointer pb-1">Overview</a>
                <a routerLink="/users" routerLinkActive="text-primary font-bold border-b-2 border-primary" class="text-on-surface-variant hover:text-on-surface transition-all text-xs cursor-pointer pb-1">User Management</a>
                <a routerLink="/change-password" routerLinkActive="text-primary font-bold border-b-2 border-primary" class="text-on-surface-variant hover:text-on-surface transition-all text-xs cursor-pointer pb-1">Security</a>
              </nav>
            </div>

            <div class="flex items-center gap-4">
              <!-- Search Input -->
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-xl">search</span>
                <input 
                  class="bg-surface-container-lowest/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all w-64 text-on-surface" 
                  placeholder="Search workspace..." 
                  type="text"
                />
              </div>

              <!-- Notifications Toggle -->
              <button class="hover:bg-white/10 rounded-full p-2 transition-all text-on-surface-variant relative cursor-pointer">
                <span class="material-symbols-outlined text-xl">notifications</span>
                <span class="absolute top-2 right-2 w-2 h-2 bg-error rounded-full shadow-[0_0_8px_#ffb4ab]"></span>
              </button>

              <!-- Settings Direct Link -->
              <button routerLink="/change-password" class="hover:bg-white/10 rounded-full p-2 transition-all text-on-surface-variant cursor-pointer">
                <span class="material-symbols-outlined text-xl">settings</span>
              </button>

              <div class="h-6 w-[1px] bg-white/10 mx-2"></div>
              
              <!-- User Executive Profile Pill -->
              <div class="flex items-center gap-3 pl-2 cursor-pointer" routerLink="/change-password">
                <div class="text-right">
                  <p class="text-xs font-bold text-on-surface">{{ currentUser()?.firstName || 'Executive' }} {{ currentUser()?.lastName || 'Admin' }}</p>
                  <p class="text-[10px] text-primary opacity-90 uppercase tracking-widest font-semibold">{{ currentUser()?.roles?.[0] || 'SuperAdmin' }}</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1px] shadow-lg">
                  <div class="w-full h-full rounded-full bg-surface-container overflow-hidden flex items-center justify-center bg-indigo-900 text-indigo-200 font-bold text-xs">
                    {{ getInitials(currentUser()?.firstName, currentUser()?.lastName) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Nested Route Feature Container -->
        <div class="mt-20 flex-1 max-w-7xl mx-auto w-full">
          <router-outlet></router-outlet>
        </div>

        <!-- Dashboard Footer -->
        <footer class="bg-surface-container-lowest/40 backdrop-blur-2xl border-t border-white/10 w-full py-6 mt-auto">
          <div class="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-4 opacity-70">
            <p class="text-xs text-outline">© 2026 Workora Enterprise. All rights reserved.</p>
            <div class="flex gap-6">
              <a class="text-xs text-outline hover:text-primary transition-colors cursor-pointer">Privacy Policy</a>
              <a class="text-xs text-outline hover:text-primary transition-colors cursor-pointer">Terms of Service</a>
              <a class="text-xs text-outline hover:text-primary transition-colors cursor-pointer">Security Audit</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    .mesh-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      z-index: 0;
      opacity: 0.35;
      pointer-events: none;
      will-change: transform;
      transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .orb-1 {
      width: 550px;
      height: 550px;
      background: #4d8eff;
      top: -120px;
      right: -80px;
      animation: drift 22s infinite alternate ease-in-out;
    }

    .orb-2 {
      width: 650px;
      height: 650px;
      background: #b76dff;
      bottom: -180px;
      left: -120px;
      animation: drift 28s infinite alternate-reverse ease-in-out;
    }

    .orb-3 {
      width: 450px;
      height: 450px;
      background: #5de6ff;
      top: 35%;
      left: 25%;
      animation: drift 18s infinite alternate ease-in-out;
    }

    @keyframes drift {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(50px, 35px) scale(1.1); }
      100% { transform: translate(-30px, -20px) scale(0.95); }
    }

    .button-glow {
      box-shadow: 0 0 0px rgba(173, 198, 255, 0);
      transition: all 0.3s ease;
    }
    
    .button-glow:hover {
      box-shadow: 0 0 25px rgba(173, 198, 255, 0.35);
      transform: translateY(-1px);
    }
  `]
})
export class DashboardLayoutComponent implements AfterViewInit, OnDestroy {
  private readonly authService: AuthService = inject(AuthService) as AuthService;

  @ViewChild('orb1', { static: false }) orb1!: ElementRef<HTMLDivElement>;
  @ViewChild('orb2', { static: false }) orb2!: ElementRef<HTMLDivElement>;
  @ViewChild('orb3', { static: false }) orb3!: ElementRef<HTMLDivElement>;

  private mouseListener: ((e: MouseEvent) => void) | null = null;
  readonly currentUser = this.authService.currentUser;

  ngAfterViewInit(): void {
    this.initMouseInteractivity();
  }

  ngOnDestroy(): void {
    if (this.mouseListener) {
      window.removeEventListener('mousemove', this.mouseListener);
    }
  }

  private initMouseInteractivity(): void {
    this.mouseListener = (e: MouseEvent) => {
      const mouseX = (e.clientX / window.innerWidth) - 0.5;
      const mouseY = (e.clientY / window.innerHeight) - 0.5;

      if (this.orb1?.nativeElement) {
        this.orb1.nativeElement.style.transform = `translate(${mouseX * 25}px, ${mouseY * 25}px)`;
      }
      if (this.orb2?.nativeElement) {
        this.orb2.nativeElement.style.transform = `translate(${mouseX * -35}px, ${mouseY * -35}px)`;
      }
      if (this.orb3?.nativeElement) {
        this.orb3.nativeElement.style.transform = `translate(${mouseX * 15}px, ${mouseY * -15}px)`;
      }
    };

    window.addEventListener('mousemove', this.mouseListener);
  }

  getInitials(firstName?: string, lastName?: string): string {
    const f = firstName ? firstName.charAt(0).toUpperCase() : 'S';
    const l = lastName ? lastName.charAt(0).toUpperCase() : 'A';
    return `${f}${l}`;
  }

  onLogout(): void {
    this.authService.logout().subscribe();
  }

  onNewReport(): void {
    console.log('Generating new report...');
  }
}
