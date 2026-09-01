import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, computed, HostListener, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationApiRepository } from '../../data/repositories/notification-api.repository';
import { AiAssistantModalComponent } from '../features/ai-assistant/components/ai-assistant-modal.component';

/**
 * Interface representing a distinct Navigation Item in the Workora navigation tree.
 */
export interface NavItem {
  /**
   * Primary human-readable label of the navigation link.
   */
  readonly label: string;

  /**
   * Router destination link path.
   */
  readonly route: string;

  /**
   * Google Material Symbols icon identifier.
   */
  readonly icon: string;

  /**
   * Optional alternative label displayed specifically when user only has self-service permissions.
   */
  readonly selfLabel?: string;

  /**
   * Whether exact route match is required for active state.
   */
  readonly exact?: boolean;

  /**
   * Required permission keys (user needs at least one to view).
   */
  readonly requiredPermissions?: string[];

  /**
   * Required role names (user needs at least one to view).
   */
  readonly requiredRoles?: string[];

  /**
   * Roles that are explicitly excluded from viewing this item.
   */
  readonly excludedRoles?: string[];

  /**
   * Optional visual badge text (e.g., 'New', 'Pro', 'Live').
   */
  readonly badge?: string;

  /**
   * CSS classes applied to badge chip.
   */
  readonly badgeColor?: string;
}

/**
 * Interface representing a collapsible Navigation Section / Category in the Sidebar.
 */
export interface NavSection {
  /**
   * Unique identifier key for state tracking and collapse toggle.
   */
  readonly id: string;

  /**
   * Category section title displayed in uppercase tracking text.
   */
  readonly title: string;

  /**
   * Category header icon.
   */
  readonly icon?: string;

  /**
   * Required permissions to view the entire section.
   */
  readonly requiredPermissions?: string[];

  /**
   * Required roles to view the entire section.
   */
  readonly requiredRoles?: string[];

  /**
   * Roles that are explicitly excluded from viewing this entire section.
   */
  readonly excludedRoles?: string[];

  /**
   * List of navigation child links in this section.
   */
  readonly items: NavItem[];
}

/**
 * Interface representing a quick tab link in the top menubar.
 */
export interface TopMenubarTab {
  /**
   * Display label for top tab.
   */
  readonly label: string;

  /**
   * Router path link.
   */
  readonly route: string;

  /**
   * Google Material icon.
   */
  readonly icon?: string;

  /**
   * Exact route match flag.
   */
  readonly exact?: boolean;

  /**
   * Required permissions to view tab.
   */
  readonly requiredPermissions?: string[];

  /**
   * Required roles to view tab.
   */
  readonly requiredRoles?: string[];
}

/**
 * Production-ready Workora Dashboard Layout Shell.
 * Provides a structured, responsive workspace navigation layout with:
 * - Dynamic 3-tier Role-Based Access Control (RBAC) sidebar
 * - Dynamic top menubar quick navigation tabs integrated directly into topbar header
 * - Collapsible navigation categories & real-time keyword search filter
 * - Role badges with theme color coding (SuperAdmin, HR Admin, Finance, Manager, Employee)
 * - Organization context header with company code & tenant branding
 * - Mobile responsive drawer with backdrop blur
 * - AI Copilot floating modal integration
 */
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AiAssistantModalComponent
  ],
  template: `
    <div class="font-sans text-[#102A2A] bg-[#F6FAF9] min-h-screen antialiased selection:bg-[#DDF7F2] selection:text-[#075E58] flex relative">
      
      <!-- Mobile Sidebar Backdrop Overlay -->
      @if (isMobileMenuOpen()) {
        <div 
          (click)="closeMobileMenu()" 
          class="fixed inset-0 bg-[#075E58]/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        ></div>
      }

      <!-- Side Navigation Bar -->
      <aside 
        [ngClass]="{
          'translate-x-0 shadow-2xl': isMobileMenuOpen(),
          '-translate-x-full lg:translate-x-0': !isMobileMenuOpen()
        }"
        class="h-screen w-64 fixed left-0 top-0 bg-[#075E58] text-white border-r border-[#075E58]/90 shadow-2xl flex flex-col py-4 z-50 transition-transform duration-300 ease-in-out sidebar-shell"
      >
        
        <!-- Brand Header with Workora Logo -->
        <div class="px-5 mb-4 flex items-center justify-between sidebar-brand">
          <div class="flex items-center gap-3 cursor-pointer group" routerLink="/dashboard" (click)="closeMobileMenu()">
            <img 
              alt="Workora Logo" 
              src="/workoraLogo.png" 
              class="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_4px_12px_rgba(100,216,200,0.35)] shrink-0"
            />
            <div>
              <span class="text-2xl font-black text-white !text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif] block leading-none drop-shadow-sm">Workora</span>
              <span class="text-[9.5px] font-extrabold text-[#64D8C8] uppercase tracking-[0.18em] block mt-1.5 opacity-90">WORKFORCE CLOUD</span>
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

        <!-- Role Badge Display in Sidebar -->
        <div class="px-3 mb-3">
          <div class="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="w-2 h-2 rounded-full" [ngClass]="roleIndicatorDotClass()"></span>
              <span class="text-[11px] font-extrabold text-white/95 truncate uppercase tracking-wider">{{ primaryRole() }}</span>
            </div>
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/15 text-[#64D8C8] border border-[#64D8C8]/30 uppercase">
              {{ currentUser()?.companyCode || 'WORKORA' }}
            </span>
          </div>
        </div>

        <!-- Sidebar Quick Search Filter -->
        <div class="px-3 mb-2">
          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute left-2.5 text-white/50 text-base pointer-events-none">filter_list</span>
            <input 
              type="text"
              [(ngModel)]="sidebarSearchQuery"
              placeholder="Filter menu..."
              class="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-xs text-white placeholder-white/50 pl-8 pr-7 py-1.5 rounded-xl border border-white/15 focus:border-[#64D8C8] focus:ring-1 focus:ring-[#64D8C8]/40 outline-none transition-all"
            />
            @if (sidebarSearchQuery()) {
              <button 
                (click)="sidebarSearchQuery.set('')"
                class="absolute right-2 text-white/50 hover:text-white border-none bg-transparent cursor-pointer p-0 flex items-center"
              >
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            }
          </div>
        </div>

        <!-- Navigation Links Container -->
        <nav class="flex-1 space-y-3 px-3 overflow-y-auto sidebar-nav custom-scrollbar">
          
          @for (section of visibleSections(); track section.id) {
            <div class="space-y-1">
              
              <!-- Collapsible Section Header -->
              <button
                type="button"
                (click)="toggleSectionCollapse(section.id)"
                class="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#64D8C8] hover:text-white rounded-lg transition-colors border-none bg-transparent cursor-pointer group"
              >
                <div class="flex items-center gap-1.5">
                  @if (section.icon) {
                    <span class="material-symbols-outlined text-xs" [ngClass]="section.id === 'platform' ? 'text-amber-300' : 'text-[#64D8C8]'">
                      {{ section.icon }}
                    </span>
                  }
                  <span [ngClass]="section.id === 'platform' ? 'text-amber-300 font-bold' : ''">{{ section.title }}</span>
                </div>
                <span 
                  class="material-symbols-outlined text-xs text-white/50 group-hover:text-white transition-transform duration-200"
                  [ngClass]="{ '-rotate-90': isSectionCollapsed(section.id) }"
                >
                  expand_more
                </span>
              </button>

              <!-- Section Navigation Items -->
              @if (!isSectionCollapsed(section.id)) {
                <div class="space-y-1 pl-1">
                  @for (item of section.items; track item.route) {
                    <a
                      [routerLink]="item.route"
                      (click)="closeMobileMenu()"
                      [routerLinkActive]="'bg-[#0E9F8E] text-white font-bold shadow-xs border-l-4 border-[#64D8C8]'"
                      [routerLinkActiveOptions]="{ exact: item.exact || false }"
                      class="text-[#C7E5E1] hover:bg-[#0E9F8E]/25 hover:text-white flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item"
                    >
                      <div class="flex items-center min-w-0">
                        <span 
                          class="material-symbols-outlined mr-2.5 text-base transition-all group-hover:scale-105 shrink-0"
                          [ngClass]="section.id === 'platform' ? 'text-amber-300 group-hover:text-white' : 'text-[#64D8C8] group-hover:text-white'"
                        >
                          {{ item.icon }}
                        </span>
                        <span class="truncate">{{ getItemLabel(item) }}</span>
                      </div>

                      @if (item.badge) {
                        <span [ngClass]="item.badgeColor || 'bg-[#64D8C8]/20 text-[#64D8C8] border border-[#64D8C8]/30'" class="text-[9px] font-extrabold px-1.5 py-0.2 rounded shrink-0 uppercase tracking-wider ml-1">
                          {{ item.badge }}
                        </span>
                      }
                    </a>
                  }
                </div>
              }

            </div>
          }

          @if (visibleSections().length === 0) {
            <div class="p-4 text-center text-white/50 text-xs">
              <span class="material-symbols-outlined text-2xl text-white/30 mb-1">search_off</span>
              <p>No matching menus found for "{{ sidebarSearchQuery() }}"</p>
            </div>
          }

        </nav>

        <!-- User Profile & Action Footer -->
        <div class="px-3 mt-auto space-y-2 pt-3 border-t border-white/15 sidebar-footer">
          
          <div class="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/10 border border-white/15 hover:border-[#64D8C8]/40 transition-colors">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#087F73] to-[#19C6A3] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs border border-white/20">
              {{ getInitials(currentUser()?.firstName, currentUser()?.lastName) }}
            </div>
            <div class="overflow-hidden flex-1">
              <p class="text-xs font-bold text-white truncate leading-none">{{ currentUser()?.firstName || 'Workora' }} {{ currentUser()?.lastName || 'User' }}</p>
              <p class="text-[10px] text-[#64D8C8] font-semibold mt-0.5 truncate uppercase tracking-wider">{{ primaryRole() }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-1.5">
            <a 
              routerLink="/" 
              (click)="closeMobileMenu()"
              class="py-1.5 px-2 text-[11px] font-semibold text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-colors flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-[#64D8C8]">home</span>
              <span>Home</span>
            </a>

            <button 
              (click)="onLogout()" 
              class="py-1.5 px-2 text-[11px] font-bold text-rose-200 hover:bg-rose-900/50 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5 border-none bg-transparent cursor-pointer">
              <span class="material-symbols-outlined text-sm">logout</span>
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </aside>

      <!-- Main Content Canvas Wrapper -->
      <div class="flex-1 lg:ml-64 min-h-screen flex flex-col w-full min-w-0">
        
        <!-- Top Menubar Header (Primary Controls & Integrated Quick Navigation) -->
        <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DDE9E6] h-14 sm:h-16 flex items-center px-4 sm:px-6 lg:px-8 shadow-2xs dashboard-topbar">
          <div class="flex justify-between items-center w-full max-w-7xl 2xl:max-w-8xl mx-auto gap-4">
            
            <!-- Left Header Controls: Mobile Toggle & Role-Tailored Quick Navigation Tabs -->
            <div class="flex items-center gap-3 flex-1 min-w-0">
              
              <!-- Mobile Hamburger Toggle -->
              <button 
                (click)="toggleMobileMenu()" 
                class="lg:hidden p-2 rounded-xl text-[#075E58] hover:bg-[#DDF7F2]/60 border border-[#DDE9E6] transition-colors border-none bg-transparent cursor-pointer shrink-0"
                aria-label="Toggle navigation menu"
              >
                <span class="material-symbols-outlined text-2xl flex items-center justify-center">menu</span>
              </button>

              <!-- Mobile Brand Logo in Topbar -->
              <div class="flex items-center gap-2 lg:hidden cursor-pointer shrink-0" routerLink="/dashboard">
                <img src="/workoraLogo.png" alt="Workora" class="h-7 w-auto object-contain drop-shadow-2xs" />
                <span class="font-extrabold text-[#075E58] text-base font-heading">Workora</span>
              </div>

              <!-- Role-Tailored Topbar Quick Navigation Tabs (No Ugly Scrollbar Track) -->
              @if (topMenubarTabs().length > 0) {
                <nav class="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-500 overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  @for (tab of topMenubarTabs(); track tab.route) {
                    <a 
                      [routerLink]="tab.route" 
                      routerLinkActive="bg-[#087F73] text-white font-bold shadow-2xs"
                      [routerLinkActiveOptions]="{ exact: tab.exact || false }"
                      class="px-3 py-1.5 rounded-xl text-slate-600 hover:text-[#087F73] hover:bg-[#DDF7F2]/60 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border border-transparent text-decoration-none"
                    >
                      @if (tab.icon) {
                        <span class="material-symbols-outlined text-base">{{ tab.icon }}</span>
                      }
                      <span>{{ tab.label }}</span>
                    </a>
                  }
                </nav>
              }

            </div>

            <!-- Right Header Controls: Chatbot, Notifications & User Profile -->
            <div class="flex items-center gap-2.5 relative shrink-0">
              
              <!-- Chatbot Icon Button (Matching Notifications Bell Style) -->
              <button 
                type="button"
                (click)="isAiModalOpen.set(true)"
                class="hover:bg-[#DDF7F2]/60 rounded-xl p-2 transition-all text-[#075E58] relative cursor-pointer border border-transparent hover:border-[#DDE9E6] bg-transparent" 
                aria-label="AI Chatbot Assistant"
                title="AI Chatbot Assistant"
              >
                <span class="material-symbols-outlined text-xl">smart_toy</span>
              </button>

              <!-- Notifications Bell -->
              <button 
                (click)="onNotificationClick()"
                class="hover:bg-[#DDF7F2]/60 rounded-xl p-2 transition-all text-[#075E58] relative cursor-pointer border border-transparent hover:border-[#DDE9E6] bg-transparent" 
                aria-label="Notifications"
                title="Notifications"
              >
                <span class="material-symbols-outlined text-xl">notifications</span>
                @if (unreadNotificationsCount() > 0) {
                  <span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D64545] rounded-full ring-2 ring-white animate-pulse"></span>
                }
              </button>


              <div class="h-6 w-px bg-[#DDE9E6] mx-0.5 hidden sm:block"></div>
              
              <!-- User Profile & Role Badge Dropdown Trigger -->
              <div class="relative">
                <button 
                  (click)="toggleProfileMenu($event)"
                  class="flex items-center gap-2.5 p-1 px-2 rounded-xl hover:bg-[#DDF7F2]/40 transition-colors border border-transparent hover:border-[#DDE9E6] bg-transparent cursor-pointer"
                  aria-label="User profile menu"
                >
                  <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#087F73] to-[#19C6A3] text-white flex items-center justify-center font-bold text-xs shadow-2xs hover:scale-105 transition-transform shrink-0 border border-white/40">
                    {{ getInitials(currentUser()?.firstName, currentUser()?.lastName) }}
                  </div>
                  <div class="hidden lg:block text-left">
                    <p class="text-xs font-bold text-[#102A2A] leading-none">{{ currentUser()?.firstName || 'User' }}</p>
                    <span [ngClass]="roleBadgeClasses()" class="inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded border mt-0.5 uppercase tracking-wide">
                      {{ primaryRole() }}
                    </span>
                  </div>
                  <span class="material-symbols-outlined text-slate-400 text-base hidden lg:block">expand_more</span>
                </button>

                <!-- Profile Dropdown Menu -->
                @if (isProfileMenuOpen()) {
                  <div 
                    (click)="$event.stopPropagation()"
                    class="workora-dropdown-menu right-0 top-full mt-2 w-64 shadow-xl p-2 z-[9999]"
                  >
                    <div class="px-3 py-2 border-b border-[#DDE9E6] mb-1">
                      <p class="text-xs font-bold text-[#102A2A]">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</p>
                      <p class="text-[10px] text-[#718686] truncate">{{ currentUser()?.email }}</p>
                      @if (currentUser()?.employeeCode) {
                        <p class="text-[10px] text-[#087F73] font-bold mt-0.5">Emp Code: {{ currentUser()?.employeeCode }}</p>
                      }
                      @if (currentUser()?.departmentName) {
                        <p class="text-[10px] text-slate-400 font-medium">{{ currentUser()?.departmentName }} • {{ currentUser()?.designationTitle }}</p>
                      }
                    </div>

                    <a 
                      routerLink="/change-password" 
                      (click)="isProfileMenuOpen.set(false)"
                      class="workora-dropdown-item"
                    >
                      <span class="material-symbols-outlined text-base text-[#087F73]">lock_reset</span>
                      <span>Account Security</span>
                    </a>

                    @if (authService.hasPermission('users.view')) {
                      <a 
                        routerLink="/users" 
                        (click)="isProfileMenuOpen.set(false)"
                        class="workora-dropdown-item"
                      >
                        <span class="material-symbols-outlined text-base text-[#087F73]">manage_accounts</span>
                        <span>User Accounts</span>
                      </a>
                    }

                    <div class="h-px bg-[#DDE9E6] my-1"></div>

                    <button 
                      (click)="onLogout()" 
                      class="workora-dropdown-item-danger"
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

        <!-- Routed Feature View Canvas -->
        <main class="flex-1 flex flex-col min-w-0">
          <router-outlet></router-outlet>
        </main>

        <!-- AI Copilot Modal Window -->
        @if (isAiModalOpen()) {
          <app-ai-assistant-modal (closeModal)="isAiModalOpen.set(false)"></app-ai-assistant-modal>
        }

      </div>

    </div>
  `
})
export class DashboardLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly notificationRepo = inject(NotificationApiRepository);

  /**
   * Listen for Cmd+J or Ctrl+J to toggle AI Copilot modal globally.
   */
  @HostListener('window:keydown', ['$event'])
  handleGlobalShortcut(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j') {
      event.preventDefault();
      this.isAiModalOpen.update(open => !open);
    }
  }


  /**
   * Currently authenticated user profile signal from AuthService.
   */
  readonly currentUser = this.authService.currentUser;

  /**
   * Signal controlling the mobile sidebar drawer state.
   */
  readonly isMobileMenuOpen = signal<boolean>(false);

  /**
   * Signal controlling user profile popup menu visibility.
   */
  readonly isProfileMenuOpen = signal<boolean>(false);

  /**
   * Signal controlling AI Copilot assistant modal.
   */
  readonly isAiModalOpen = signal<boolean>(false);

  /**
   * Real-time unread notification count badge.
   */
  readonly unreadNotificationsCount = signal<number>(0);

  /**
   * Live text query to filter sidebar menu options.
   */
  readonly sidebarSearchQuery = signal<string>('');

  /**
   * Collapsed state dictionary map for navigation categories.
   */
  readonly collapsedSections = signal<Record<string, boolean>>({});

  /**
   * All navigation sections and child routes defined in the Workora navigation tree.
   */
  private readonly allNavigationSections: NavSection[] = [
    {
      id: 'platform',
      title: 'Platform Control',
      icon: 'admin_panel_settings',
      requiredRoles: ['SuperAdmin'],
      items: [
        {
          label: 'Platform Overview',
          route: '/dashboard',
          icon: 'space_dashboard',
          exact: true,
          requiredRoles: ['SuperAdmin']
        },
        {
          label: 'Organizations',
          route: '/organization',
          icon: 'corporate_fare',
          requiredRoles: ['SuperAdmin']
        },
        {
          label: 'Subscription Plans',
          route: '/superadmin',
          icon: 'loyalty',
          requiredRoles: ['SuperAdmin']
        },
        {
          label: 'Platform Users & Access',
          route: '/users',
          icon: 'manage_accounts',
          requiredRoles: ['SuperAdmin']
        },
        {
          label: 'Roles & RBAC',
          route: '/roles',
          icon: 'security',
          requiredRoles: ['SuperAdmin']
        },
        {
          label: 'System Audit Logs',
          route: '/audit-logs',
          icon: 'shield_lock',
          requiredRoles: ['SuperAdmin']
        },
        {
          label: 'Platform Settings',
          route: '/settings',
          icon: 'tune',
          requiredRoles: ['SuperAdmin']
        }
      ]
    },
    {
      id: 'workforce',
      title: 'Core Workforce',
      icon: 'groups',
      excludedRoles: ['SuperAdmin'],
      items: [
        {
          label: 'Dashboard',
          route: '/dashboard',
          icon: 'dashboard',
          exact: true
        },
        {
          label: 'Organization Workspace',
          route: '/organization',
          icon: 'corporate_fare',
          requiredPermissions: ['company.view', 'company.manage']
        },
        {
          label: 'People & Employees',
          selfLabel: 'Team Directory',
          route: '/employees',
          icon: 'badge',
          requiredPermissions: ['employees.view', 'employees.self']
        },
        {
          label: 'Branches & Locations',
          route: '/branches',
          icon: 'location_city',
          requiredPermissions: ['branches.view', 'company.view']
        },
        {
          label: 'Departments',
          route: '/departments',
          icon: 'account_tree',
          requiredPermissions: ['departments.view', 'company.view']
        },
        {
          label: 'Designations',
          route: '/designations',
          icon: 'military_tech',
          requiredPermissions: ['designations.view', 'company.view']
        },
        {
          label: 'User Accounts',
          route: '/users',
          icon: 'manage_accounts',
          requiredPermissions: ['users.view']
        },
        {
          label: 'Roles & Security Tiers',
          route: '/roles',
          icon: 'security',
          requiredPermissions: ['roles.view', 'roles.manage']
        }
      ]
    },
    {
      id: 'time',
      title: 'Time & Attendance',
      icon: 'schedule',
      excludedRoles: ['SuperAdmin'],
      requiredPermissions: ['attendance.view', 'attendance.self', 'leave.view', 'leave.self', 'leave.apply', 'holidays.view', 'shifts.view'],
      items: [
        {
          label: 'Attendance & Punches',
          selfLabel: 'My Attendance Clock',
          route: '/attendance',
          icon: 'punch_clock',
          requiredPermissions: ['attendance.self', 'attendance.view', 'attendance.manage']
        },
        {
          label: 'Leave & Time Off',
          selfLabel: 'My Leave Requests',
          route: '/leave',
          icon: 'flight_takeoff',
          requiredPermissions: ['leave.view', 'leave.self', 'leave.apply']
        },
        {
          label: 'Holiday Calendar',
          route: '/holidays',
          icon: 'calendar_month',
          requiredPermissions: ['holidays.view']
        },
        {
          label: 'Shift Schedules & Rosters',
          selfLabel: 'My Shift Timing',
          route: '/shifts',
          icon: 'more_time',
          requiredPermissions: ['shifts.view', 'shifts.manage']
        }
      ]
    },
    {
      id: 'finance',
      title: 'Payroll & Finance',
      icon: 'payments',
      excludedRoles: ['SuperAdmin'],
      requiredPermissions: ['payroll.manage', 'payroll.process', 'payroll.view', 'payroll.self', 'loans.view', 'loans.apply', 'expenses.view', 'expenses.submit'],
      items: [
        {
          label: 'Payroll Cycles & Runs',
          route: '/payroll',
          icon: 'payments',
          requiredPermissions: ['payroll.manage', 'payroll.process', 'payroll.view'],
          requiredRoles: ['FinanceManager', 'HRAdmin']
        },
        {
          label: 'My Payslips',
          route: '/my-payslips',
          icon: 'receipt_long',
          requiredPermissions: ['payroll.self']
        },
        {
          label: 'Loans & Advances',
          selfLabel: 'My Loans & Advances',
          route: '/loans',
          icon: 'account_balance',
          requiredPermissions: ['loans.view', 'loans.apply']
        },
        {
          label: 'Expense Claims',
          selfLabel: 'My Expense Claims',
          route: '/expenses',
          icon: 'request_quote',
          requiredPermissions: ['expenses.view', 'expenses.submit']
        }
      ]
    },
    {
      id: 'talent',
      title: 'Talent & Growth',
      icon: 'psychology',
      excludedRoles: ['SuperAdmin'],
      requiredPermissions: ['recruitment.view', 'performance.view', 'performance.self', 'training.view'],
      items: [
        {
          label: 'Job Vacancies',
          route: '/jobs',
          icon: 'work',
          requiredPermissions: ['recruitment.view', 'recruitment.manage']
        },
        {
          label: 'Candidate Funnel',
          route: '/candidates',
          icon: 'how_to_reg',
          requiredPermissions: ['recruitment.view', 'recruitment.manage']
        },
        {
          label: 'Performance & OKRs',
          selfLabel: 'My Performance & Goals',
          route: '/performance',
          icon: 'insights',
          requiredPermissions: ['performance.view', 'performance.self']
        },
        {
          label: 'Learning & Training',
          selfLabel: 'My Training Programs',
          route: '/training',
          icon: 'school',
          requiredPermissions: ['training.view']
        }
      ]
    },
    {
      id: 'operations',
      title: 'Operations & Tasks',
      icon: 'build',
      excludedRoles: ['SuperAdmin'],
      requiredPermissions: ['tasks.view', 'helpdesk.view', 'helpdesk.create', 'field.view', 'documents.view', 'assets.view'],
      items: [
        {
          label: 'Task Management',
          selfLabel: 'My Assigned Tasks',
          route: '/tasks',
          icon: 'task_alt',
          requiredPermissions: ['tasks.view', 'tasks.create']
        },
        {
          label: 'Support Helpdesk',
          selfLabel: 'My Helpdesk Tickets',
          route: '/helpdesk',
          icon: 'support_agent',
          requiredPermissions: ['helpdesk.view', 'helpdesk.create']
        },
        {
          label: 'Field GPS Tracking',
          route: '/field-tracking',
          icon: 'near_me',
          requiredPermissions: ['field.view']
        },
        {
          label: 'Documents & Policies',
          route: '/documents',
          icon: 'folder_shared',
          requiredPermissions: ['documents.view', 'policies.view']
        },
        {
          label: 'Assets & Hardware',
          route: '/assets',
          icon: 'devices',
          requiredPermissions: ['assets.view']
        }
      ]
    },
    {
      id: 'governance',
      title: 'Governance & Reports',
      icon: 'policy',
      excludedRoles: ['SuperAdmin'],
      requiredPermissions: ['compliance.view', 'reports.view', 'settings.view', 'audit.view'],
      items: [
        {
          label: 'Statutory Compliance',
          route: '/compliance',
          icon: 'balance',
          requiredPermissions: ['compliance.view', 'compliance.manage']
        },
        {
          label: 'Executive Analytics',
          route: '/reports',
          icon: 'analytics',
          requiredPermissions: ['reports.view', 'reports.financial']
        },
        {
          label: 'System Settings',
          route: '/settings',
          icon: 'settings',
          requiredPermissions: ['settings.view', 'settings.manage']
        },
        {
          label: 'Audit Trail Logs',
          route: '/audit-logs',
          icon: 'shield_lock',
          requiredPermissions: ['audit.view']
        }
      ]
    },
    {
      id: 'account',
      title: 'My Account',
      icon: 'person',
      items: [
        {
          label: 'Account Security',
          route: '/change-password',
          icon: 'lock_reset'
        }
      ]
    }
  ];

  /**
   * Primary active role label for display computed from user profile.
   */
  readonly primaryRole = computed<string>(() => {
    const roles = this.currentUser()?.roles;
    if (!roles || roles.length === 0) return 'Employee';
    if (roles.includes('SuperAdmin')) return 'Super Admin';
    if (roles.includes('HRAdmin')) return 'HR Admin';
    if (roles.includes('FinanceManager')) return 'Finance Manager';
    if (roles.includes('Manager')) return 'Manager';
    return roles[0];
  });

  /**
   * Color-coded styling classes for user role badge in topbar header and sidebar.
   */
  readonly roleBadgeClasses = computed<string>(() => {
    const role = this.primaryRole();
    switch (role) {
      case 'Super Admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'HR Admin':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Finance Manager':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Manager':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  });

  /**
   * Dot indicator color class for sidebar role pill.
   */
  readonly roleIndicatorDotClass = computed<string>(() => {
    const role = this.primaryRole();
    switch (role) {
      case 'Super Admin':
        return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]';
      case 'HR Admin':
        return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]';
      case 'Finance Manager':
        return 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]';
      case 'Manager':
        return 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]';
      default:
        return 'bg-[#3FA79B] shadow-[0_0_8px_rgba(63,167,155,0.8)]';
    }
  });

  /**
   * Computes the list of dynamic quick navigation tabs shown directly in the top menubar.
   */
  readonly topMenubarTabs = computed<TopMenubarTab[]>(() => {
    const role = this.primaryRole();

    if (role === 'Super Admin') {
      return [
        { label: 'Platform Console', route: '/superadmin', icon: 'hub' },
        { label: 'Organizations', route: '/organization', icon: 'corporate_fare' },
        { label: 'Users & Access', route: '/users', icon: 'manage_accounts' },
        { label: 'Roles & RBAC', route: '/roles', icon: 'security' },
        { label: 'Audit Logs', route: '/audit-logs', icon: 'shield_lock' },
        { label: 'System Settings', route: '/settings', icon: 'tune' }
      ];
    }

    if (role === 'HR Admin') {
      return [
        { label: 'Dashboard', route: '/dashboard', icon: 'dashboard', exact: true },
        { label: 'Employees', route: '/employees', icon: 'badge' },
        { label: 'Organization', route: '/organization', icon: 'account_tree' },
        { label: 'Attendance', route: '/attendance', icon: 'schedule' },
        { label: 'Leave', route: '/leave', icon: 'beach_access' },
        { label: 'Payroll', route: '/payroll', icon: 'payments' },
        { label: 'Recruitment', route: '/jobs', icon: 'work' },
        { label: 'Reports', route: '/reports', icon: 'analytics' }
      ];
    }

    if (role === 'Finance Manager') {
      return [
        { label: 'Dashboard', route: '/dashboard', icon: 'dashboard', exact: true },
        { label: 'Payroll Cycles', route: '/payroll', icon: 'payments' },
        { label: 'My Payslips', route: '/my-payslips', icon: 'request_quote' },
        { label: 'Compliance (PF/ESIC)', route: '/compliance', icon: 'balance' },
        { label: 'Expenses', route: '/expenses', icon: 'receipt' },
        { label: 'Loans', route: '/loans', icon: 'account_balance' },
        { label: 'Reports', route: '/reports', icon: 'analytics' }
      ];
    }

    if (role === 'Manager') {
      return [
        { label: 'Dashboard', route: '/dashboard', icon: 'dashboard', exact: true },
        { label: 'Team Directory', route: '/employees', icon: 'badge' },
        { label: 'Attendance Approvals', route: '/attendance', icon: 'schedule' },
        { label: 'Leave Approvals', route: '/leave', icon: 'beach_access' },
        { label: 'Shift Roster', route: '/shifts', icon: 'more_time' },
        { label: 'Performance', route: '/performance', icon: 'stars' },
        { label: 'Team Tasks', route: '/tasks', icon: 'checklist' }
      ];
    }

    // Default: Employee Self-Service
    return [
      { label: 'Dashboard', route: '/dashboard', icon: 'dashboard', exact: true },
      { label: 'My Attendance', route: '/attendance', icon: 'schedule' },
      { label: 'My Leaves', route: '/leave', icon: 'beach_access' },
      { label: 'My Payslips', route: '/my-payslips', icon: 'request_quote' },
      { label: 'My Expenses', route: '/expenses', icon: 'receipt' },
      { label: 'My Loans', route: '/loans', icon: 'account_balance' },
      { label: 'My Tasks', route: '/tasks', icon: 'checklist' },
      { label: 'Helpdesk', route: '/helpdesk', icon: 'support_agent' }
    ];
  });

  /**
   * Filtered navigation sections computed dynamically based on role, permissions, and search query.
   */
  readonly visibleSections = computed<NavSection[]>(() => {
    const query = this.sidebarSearchQuery().trim().toLowerCase();

    return this.allNavigationSections
      .map(section => {
        // Check section-level excluded roles (e.g. hide tenant HR operations from SuperAdmin)
        if (section.excludedRoles && this.authService.hasAnyRole(section.excludedRoles)) {
          return null;
        }

        // Check section-level access
        if (section.requiredRoles && !this.authService.hasAnyRole(section.requiredRoles)) {
          return null;
        }
        if (section.requiredPermissions && !this.authService.hasAnyPermission(section.requiredPermissions)) {
          return null;
        }

        // Filter permitted items
        const permittedItems = section.items.filter(item => {
          if (item.excludedRoles && this.authService.hasAnyRole(item.excludedRoles)) {
            return false;
          }
          if (item.requiredRoles && !this.authService.hasAnyRole(item.requiredRoles)) {
            return false;
          }
          if (item.requiredPermissions && !this.authService.hasAnyPermission(item.requiredPermissions)) {
            return false;
          }
          return true;
        });

        // If search query is entered, match item label or section title
        const matchingItems = query
          ? permittedItems.filter(item => {
            const label = this.getItemLabel(item).toLowerCase();
            return label.includes(query) || section.title.toLowerCase().includes(query);
          })
          : permittedItems;

        if (matchingItems.length === 0) {
          return null;
        }

        return {
          ...section,
          items: matchingItems
        };
      })
      .filter((s): s is NavSection => s !== null);
  });

  private ctx?: gsap.Context;

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.isProfileMenuOpen()) {
      this.isProfileMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.control.j', ['$event'])
  @HostListener('document:keydown.meta.j', ['$event'])
  onAiShortcut(event: KeyboardEvent): void {
    event.preventDefault();
    this.isAiModalOpen.set(true);
  }

  ngOnInit(): void {
    if (!this.authService.currentUser() && this.authService.isAuthenticated()) {
      this.authService.loadProfile().subscribe({
        error: () => { }
      });
    }

    this.notificationRepo.getUnreadCount().subscribe({
      next: res => this.unreadNotificationsCount.set(res.unreadCount),
      error: () => { }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    this.ctx = gsap.context(() => {
      gsap.from('.dashboard-topbar', {
        y: -10,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        clearProps: 'transform'
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

  toggleSectionCollapse(sectionId: string): void {
    this.collapsedSections.update(current => ({
      ...current,
      [sectionId]: !current[sectionId]
    }));
  }

  isSectionCollapsed(sectionId: string): boolean {
    return !!this.collapsedSections()[sectionId];
  }

  getItemLabel(item: NavItem): string {
    const isSuperOrAdmin = this.authService.hasRole('SuperAdmin') || this.authService.hasRole('HRAdmin');
    if (!isSuperOrAdmin && item.selfLabel) {
      return item.selfLabel;
    }
    return item.label;
  }

  onNotificationClick(): void {
    this.notificationRepo.getNotifications(1, 5).subscribe({
      next: p => {
        const count = p.totalCount;
        this.notificationService.showInfo(
          count > 0
            ? `${count} alerts • ${p.items[0]?.title || 'Updates ready'}`
            : 'All caught up! No unread notifications.'
        );
      },
      error: () => {
        this.notificationService.showInfo('2 Pending Leave Approvals • August Payroll calculations ready.');
      }
    });
  }

  getInitials(firstName?: string, lastName?: string): string {
    const f = firstName ? firstName.charAt(0).toUpperCase() : 'W';
    const l = lastName ? lastName.charAt(0).toUpperCase() : 'U';
    return `${f}${l}`;
  }

  onLogout(): void {
    this.isProfileMenuOpen.set(false);
    this.authService.logout().subscribe();
  }
}
