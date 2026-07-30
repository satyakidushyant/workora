import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

/**
 * Enterprise HRMS Smart Container Component for Dashboard page.
 * Spatial glassmorphism executive cockpit rendering real-time workforce metrics,
 * department resource distribution, personnel growth charts, audit logs, and account options,
 * styled with dark glass design system and atmospheric drift orbs without WebGL shaders.
 */
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dark selection:bg-primary/30 selection:text-on-primary font-body-md text-on-surface bg-[#0d1320] min-h-screen relative overflow-x-hidden antialiased">
      <!-- Atmospheric Background Glow Orbs (Pure CSS & Parallax Mouse Drift - No Shader) -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div #orb1 class="mesh-orb orb-1"></div>
        <div #orb2 class="mesh-orb orb-2"></div>
        <div #orb3 class="mesh-orb orb-3"></div>
      </div>

      <!-- SideNavBar -->
      <aside class="h-screen w-64 fixed left-0 top-0 bg-surface-container-low/60 backdrop-blur-2xl border-r border-white/10 shadow-2xl flex flex-col py-6 z-[60]">
        <!-- Brand Header with User Logo -->
        <div class="px-6 mb-8 flex flex-col items-start gap-2 cursor-pointer" routerLink="/">
          <img alt="Workora Logo" class="h-10 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(77,142,255,0.5)]" src="/workora.png"/>
          <div>
            <h2 class="font-display-lg text-lg font-extrabold text-on-surface tracking-tight leading-tight">Workora Enterprise</h2>
            <p class="font-label-sm text-[10px] text-outline uppercase tracking-widest">HRMS SUITE</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 space-y-1.5 px-4">
          <!-- Active Item: Overview -->
          <div routerLink="/dashboard" class="bg-primary/15 text-primary border-r-4 border-primary flex items-center px-4 py-3 rounded-l-xl cursor-pointer transition-all font-bold shadow-lg shadow-primary/10">
            <span class="material-symbols-outlined mr-3 text-xl">dashboard</span>
            <span class="font-label-sm text-xs">Overview</span>
          </div>
          <div class="text-on-surface-variant hover:bg-white/5 hover:text-on-surface flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all">
            <span class="material-symbols-outlined mr-3 text-xl">monitoring</span>
            <span class="font-label-sm text-xs font-semibold">Analytics</span>
          </div>
          <div class="text-on-surface-variant hover:bg-white/5 hover:text-on-surface flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all">
            <span class="material-symbols-outlined mr-3 text-xl">group</span>
            <span class="font-label-sm text-xs font-semibold">Employees</span>
          </div>
          <div routerLink="/auth/change-password" class="text-on-surface-variant hover:bg-white/5 hover:text-on-surface flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all">
            <span class="material-symbols-outlined mr-3 text-xl">settings</span>
            <span class="font-label-sm text-xs font-semibold">Settings</span>
          </div>
          <div class="text-on-surface-variant hover:bg-white/5 hover:text-on-surface flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all">
            <span class="material-symbols-outlined mr-3 text-xl">verified_user</span>
            <span class="font-label-sm text-xs font-semibold">Access Controls</span>
          </div>
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
              <span class="font-display-lg text-2xl tracking-tight text-on-surface font-extrabold">Dashboard</span>
              <nav class="hidden md:flex items-center gap-6">
                <a routerLink="/dashboard" class="text-primary font-bold border-b-2 border-primary pb-1 text-xs transition-all cursor-pointer">Overview</a>
                <a (click)="onNavItem('Personnel')" class="text-on-surface-variant hover:text-on-surface transition-colors text-xs cursor-pointer">Personnel</a>
                <a (click)="onNavItem('Payroll')" class="text-on-surface-variant hover:text-on-surface transition-colors text-xs cursor-pointer">Payroll</a>
                <a routerLink="/auth/change-password" class="text-on-surface-variant hover:text-on-surface transition-colors text-xs cursor-pointer">Security</a>
              </nav>
            </div>

            <div class="flex items-center gap-4">
              <!-- Search Input -->
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-xl">search</span>
                <input 
                  class="bg-surface-container-lowest/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all w-64 text-on-surface" 
                  placeholder="Search insights..." 
                  type="text"
                />
              </div>

              <!-- Notifications Toggle -->
              <button (click)="onNotificationClick()" class="hover:bg-white/10 rounded-full p-2 transition-all text-on-surface-variant relative cursor-pointer">
                <span class="material-symbols-outlined text-xl">notifications</span>
                <span class="absolute top-2 right-2 w-2 h-2 bg-error rounded-full shadow-[0_0_8px_#ffb4ab]"></span>
              </button>

              <!-- Settings Direct Link -->
              <button routerLink="/auth/change-password" class="hover:bg-white/10 rounded-full p-2 transition-all text-on-surface-variant cursor-pointer">
                <span class="material-symbols-outlined text-xl">settings</span>
              </button>

              <div class="h-6 w-[1px] bg-white/10 mx-2"></div>
              
              <!-- User Executive Profile Pill -->
              <div class="flex items-center gap-3 pl-2 cursor-pointer" routerLink="/auth/change-password">
                <div class="text-right">
                  <p class="text-xs font-bold text-on-surface">{{ currentUser()?.firstName || 'Executive' }} {{ currentUser()?.lastName || 'Admin' }}</p>
                  <p class="text-[10px] text-primary opacity-90 uppercase tracking-widest font-semibold">{{ currentUser()?.roles?.[0] || 'HQ DIVISION' }}</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1px] shadow-lg">
                  <div class="w-full h-full rounded-full bg-surface-container overflow-hidden">
                    <img 
                      alt="Executive User Profile" 
                      class="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTOtgnJ1iazPSVN_CGkal0WO-xZ256kSVtaQuE8On9sCfmywhu6A7LtowosQlVtxkMZ1aUZ5sE6l7L67yBLsbTVZfg3bVWgCtc-iRCMb37da-a8XEOKqnW6jG9vtB8GV7TeKGdNCkgr8FfdS7crvQTFiVNG7S8DzV3KCCsmUup8BYwtaxDNtSbRTpglJ7zBFzKra0ae1pnZED9Kn7NLDlQeBdxugIGWR9RuoO-o8XcNrFYsgwWdHEa"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Executive Analytics Canvas -->
        <div class="mt-20 p-8 space-y-8 flex-1 max-w-7xl mx-auto w-full">
          <!-- Bento Grid Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Total Workforce -->
            <div class="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 group">
              <div class="flex justify-between items-start mb-4">
                <div class="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <span class="material-symbols-outlined text-2xl">groups</span>
                </div>
                <span class="text-secondary text-xs font-bold bg-secondary/10 px-2.5 py-1 rounded-full border border-secondary/20">+12%</span>
              </div>
              <p class="text-outline text-xs uppercase tracking-wider font-semibold">Total Workforce</p>
              <h3 class="text-3xl font-display-lg text-on-surface mt-1 font-extrabold tracking-tight">1,284</h3>
              <div class="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-primary w-[75%] rounded-full shadow-[0_0_10px_rgba(173,198,255,0.6)]"></div>
              </div>
            </div>

            <!-- Monthly Payroll -->
            <div class="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300">
              <div class="flex justify-between items-start mb-4">
                <div class="p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary">
                  <span class="material-symbols-outlined text-2xl">payments</span>
                </div>
                <span class="text-on-surface-variant text-xs font-semibold">May 2026</span>
              </div>
              <p class="text-outline text-xs uppercase tracking-wider font-semibold">Monthly Payroll</p>
              <h3 class="text-3xl font-display-lg text-on-surface mt-1 font-extrabold tracking-tight">$4.2M</h3>
              <p class="text-on-surface-variant text-xs mt-2">Budget Utilization: <span class="text-secondary font-bold">92%</span></p>
            </div>

            <!-- Attendance Rate -->
            <div class="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300">
              <div class="flex justify-between items-start mb-4">
                <div class="p-3 rounded-xl bg-tertiary/10 border border-tertiary/20 text-tertiary">
                  <span class="material-symbols-outlined text-2xl">event_available</span>
                </div>
                <span class="text-secondary text-xs font-bold bg-secondary/10 px-2.5 py-1 rounded-full border border-secondary/20">Stable</span>
              </div>
              <p class="text-outline text-xs uppercase tracking-wider font-semibold">Attendance Rate</p>
              <h3 class="text-3xl font-display-lg text-on-surface mt-1 font-extrabold tracking-tight">98.4%</h3>
              <div class="flex items-center gap-1.5 mt-4">
                <div class="h-4 w-1 bg-tertiary rounded-full"></div>
                <div class="h-6 w-1 bg-tertiary rounded-full"></div>
                <div class="h-3 w-1 bg-tertiary rounded-full"></div>
                <div class="h-8 w-1 bg-tertiary rounded-full"></div>
                <div class="h-5 w-1 bg-tertiary rounded-full"></div>
                <div class="h-7 w-1 bg-tertiary rounded-full shadow-[0_0_8px_#ddb7ff]"></div>
                <span class="text-[10px] text-outline ml-2 font-semibold">Daily Average</span>
              </div>
            </div>

            <!-- Pending Requests -->
            <div class="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
              <div class="flex justify-between items-start mb-4">
                <div class="p-3 rounded-xl bg-error/15 border border-error/20 text-error">
                  <span class="material-symbols-outlined text-2xl">notification_important</span>
                </div>
                <span class="bg-error/20 border border-error/30 text-error text-[10px] font-bold px-2.5 py-1 rounded-full">ACTION REQUIRED</span>
              </div>
              <p class="text-outline text-xs uppercase tracking-wider font-semibold">Pending Requests</p>
              <h3 class="text-3xl font-display-lg text-on-surface mt-1 font-extrabold tracking-tight">24</h3>
              <p class="text-error text-xs mt-2 font-medium">12 Overdue Items</p>
            </div>
          </div>

          <!-- Growth & Allocation Charts Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Personnel Growth Chart -->
            <div class="glass-card col-span-2 p-8 rounded-2xl">
              <div class="flex justify-between items-center mb-8">
                <div>
                  <h4 class="font-headline-md text-xl font-bold text-on-surface">Personnel Growth</h4>
                  <p class="text-xs text-on-surface-variant mt-1">Annual projections vs. actual hiring rates</p>
                </div>
                <div class="flex gap-2">
                  <button (click)="onFilterQuarter('Q1')" [ngClass]="selectedQuarter() === 'Q1' ? 'bg-primary/20 text-primary border-primary/50' : 'bg-white/5 text-on-surface-variant border-transparent'" class="px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer">Q1</button>
                  <button (click)="onFilterQuarter('Q2')" [ngClass]="selectedQuarter() === 'Q2' ? 'bg-primary/20 text-primary border-primary/50' : 'bg-white/5 text-on-surface-variant border-transparent'" class="px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer">Q2</button>
                </div>
              </div>
              
              <!-- Visual Bar Chart Representation -->
              <div class="relative h-64 flex items-end gap-5 px-4">
                <div class="absolute inset-0 border-b border-white/5 flex flex-col justify-between py-2 pointer-events-none">
                  <div class="w-full border-t border-white/5"></div>
                  <div class="w-full border-t border-white/5"></div>
                  <div class="w-full border-t border-white/5"></div>
                </div>
                <div class="flex-1 bg-gradient-to-t from-primary/10 to-primary/50 rounded-t-xl h-[45%] transition-all hover:brightness-125 cursor-pointer relative group">
                  <div class="absolute -top-10 left-1/2 -translate-x-1/2 glass-card px-2 py-1 rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Jan: 84</div>
                </div>
                <div class="flex-1 bg-gradient-to-t from-primary/10 to-primary/50 rounded-t-xl h-[60%] transition-all hover:brightness-125 cursor-pointer relative group">
                  <div class="absolute -top-10 left-1/2 -translate-x-1/2 glass-card px-2 py-1 rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Feb: 102</div>
                </div>
                <div class="flex-1 bg-gradient-to-t from-primary/10 to-primary/50 rounded-t-xl h-[55%] transition-all hover:brightness-125 cursor-pointer relative group">
                  <div class="absolute -top-10 left-1/2 -translate-x-1/2 glass-card px-2 py-1 rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Mar: 96</div>
                </div>
                <div class="flex-1 bg-gradient-to-t from-primary/10 to-primary/50 rounded-t-xl h-[75%] transition-all hover:brightness-125 cursor-pointer relative group">
                  <div class="absolute -top-10 left-1/2 -translate-x-1/2 glass-card px-2 py-1 rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Apr: 118</div>
                </div>
                <div class="flex-1 bg-gradient-to-t from-secondary/20 to-secondary/70 rounded-t-xl h-[88%] transition-all hover:brightness-125 cursor-pointer relative group shadow-[0_0_15px_rgba(93,230,255,0.2)]">
                  <div class="absolute -top-10 left-1/2 -translate-x-1/2 glass-card px-2 py-1 rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">May: 142</div>
                </div>
                <div class="flex-1 bg-gradient-to-t from-secondary/20 to-secondary/70 rounded-t-xl h-[95%] transition-all hover:brightness-125 cursor-pointer relative group shadow-[0_0_15px_rgba(93,230,255,0.3)]">
                  <div class="absolute -top-10 left-1/2 -translate-x-1/2 glass-card px-2 py-1 rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Jun: 160</div>
                </div>
              </div>
              <div class="flex justify-between px-4 mt-4 text-[10px] text-outline font-bold tracking-wider">
                <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
              </div>
            </div>

            <!-- Department Allocation Donut -->
            <div class="glass-card p-8 rounded-2xl flex flex-col">
              <h4 class="font-headline-md text-xl font-bold text-on-surface">Department Allocation</h4>
              <p class="text-xs text-on-surface-variant mt-1 mb-8">Resource spend per division</p>
              <div class="flex-1 flex items-center justify-center relative">
                <!-- Donut Chart Ring -->
                <div class="w-48 h-48 rounded-full border-[14px] border-white/5 flex items-center justify-center relative">
                  <div class="absolute inset-0 rounded-full border-[14px] border-t-primary border-r-secondary border-b-tertiary border-l-transparent rotate-45 opacity-90 shadow-xl"></div>
                  <div class="text-center">
                    <span class="text-3xl font-display-lg text-on-surface font-extrabold block">64%</span>
                    <span class="text-[10px] text-outline uppercase tracking-widest font-semibold">Efficiency</span>
                  </div>
                </div>
              </div>
              <div class="space-y-3 mt-8">
                <div class="flex justify-between items-center text-xs">
                  <div class="flex items-center gap-2">
                    <div class="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_6px_#4d8eff]"></div>
                    <span class="text-on-surface-variant font-medium">Engineering</span>
                  </div>
                  <span class="text-on-surface font-bold">42%</span>
                </div>
                <div class="flex justify-between items-center text-xs">
                  <div class="flex items-center gap-2">
                    <div class="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_6px_#5de6ff]"></div>
                    <span class="text-on-surface-variant font-medium">Sales &amp; Marketing</span>
                  </div>
                  <span class="text-on-surface font-bold">31%</span>
                </div>
                <div class="flex justify-between items-center text-xs">
                  <div class="flex items-center gap-2">
                    <div class="w-2.5 h-2.5 rounded-full bg-tertiary shadow-[0_0_6px_#ddb7ff]"></div>
                    <span class="text-on-surface-variant font-medium">Operations</span>
                  </div>
                  <span class="text-on-surface font-bold">27%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Executive Audit Log List -->
          <div class="glass-card rounded-2xl overflow-hidden">
            <div class="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h4 class="font-headline-md text-xl font-bold text-on-surface">Executive Audit Log</h4>
                <p class="text-xs text-on-surface-variant mt-0.5">Real-time system events and operational changes</p>
              </div>
              <button (click)="onViewFullHistory()" class="text-primary font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer">
                View Full History
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div class="divide-y divide-white/5">
              <!-- Item 1 -->
              <div class="px-6 py-4 flex items-center justify-between group hover:bg-white/5 transition-all">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <span class="material-symbols-outlined">person_add</span>
                  </div>
                  <div>
                    <p class="text-on-surface text-sm font-medium">New Employee Onboarded: <span class="text-primary font-bold">Sarah Jenkins</span></p>
                    <p class="text-on-surface-variant text-xs">Senior Product Designer • Creative Division</p>
                  </div>
                </div>
                <span class="text-outline text-[10px] uppercase font-bold tracking-widest">2 MINS AGO</span>
              </div>

              <!-- Item 2 -->
              <div class="px-6 py-4 flex items-center justify-between group hover:bg-white/5 transition-all">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0">
                    <span class="material-symbols-outlined">security</span>
                  </div>
                  <div>
                    <p class="text-on-surface text-sm font-medium">Security Audit Completed</p>
                    <p class="text-on-surface-variant text-xs">All protocols verified for <span class="text-secondary font-bold">Node-04</span></p>
                  </div>
                </div>
                <span class="text-outline text-[10px] uppercase font-bold tracking-widest">45 MINS AGO</span>
              </div>

              <!-- Item 3 -->
              <div class="px-6 py-4 flex items-center justify-between group hover:bg-white/5 transition-all">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary shrink-0">
                    <span class="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <p class="text-on-surface text-sm font-medium">Payroll Approval Granted</p>
                    <p class="text-on-surface-variant text-xs">Batch <span class="text-tertiary font-bold">#4812</span> processed successfully</p>
                  </div>
                </div>
                <span class="text-outline text-[10px] uppercase font-bold tracking-widest">2 HOURS AGO</span>
              </div>
            </div>
          </div>
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
    .glass-card {
      background: rgba(26, 32, 44, 0.45);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: inset 1px 1px 0px rgba(255, 255, 255, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

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
export class DashboardPageComponent implements AfterViewInit, OnDestroy {
  private readonly authService: AuthService = inject(AuthService) as AuthService;

  @ViewChild('orb1', { static: false }) orb1!: ElementRef<HTMLDivElement>;
  @ViewChild('orb2', { static: false }) orb2!: ElementRef<HTMLDivElement>;
  @ViewChild('orb3', { static: false }) orb3!: ElementRef<HTMLDivElement>;

  private mouseListener: ((e: MouseEvent) => void) | null = null;

  /**
   * Signal tracking authenticated user details.
   */
  readonly currentUser = this.authService.currentUser;

  /**
   * Selected quarter filter signal for growth chart.
   */
  readonly selectedQuarter = signal<'Q1' | 'Q2'>('Q2');

  ngAfterViewInit(): void {
    this.initMouseInteractivity();
  }

  ngOnDestroy(): void {
    if (this.mouseListener) {
      window.removeEventListener('mousemove', this.mouseListener);
    }
  }

  /**
   * Mouse interaction listener for smooth background orb parallax drift.
   */
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

  /**
   * Filter quarter selection.
   */
  onFilterQuarter(q: 'Q1' | 'Q2'): void {
    this.selectedQuarter.set(q);
  }

  /**
   * Triggers user sign-out session termination.
   */
  onLogout(): void {
    this.authService.logout().subscribe();
  }

  /**
   * Placeholder triggers.
   */
  onNewReport(): void {
    console.log('Generating executive report...');
  }

  onNavItem(item: string): void {
    console.log(`Navigating to ${item}...`);
  }

  onNotificationClick(): void {
    console.log('Opening notifications drawer...');
  }

  onViewFullHistory(): void {
    console.log('Viewing full audit history log...');
  }
}
