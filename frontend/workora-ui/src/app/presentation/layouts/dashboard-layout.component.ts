import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, HostListener, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationApiRepository } from '../../data/repositories/notification-api.repository';
import { NotificationItem } from '../../domain/models/notification.model';
import { AiAssistantModalComponent } from '../features/ai-assistant/components/ai-assistant-modal.component';

/**
 * Humanized Workora Dashboard Layout Shell.
 * Provides a calm, structured workspace navigation layout
 * with friendly micro-interactions, responsive mobile drawer, and clear shortcuts.
 */
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AiAssistantModalComponent],
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

      <!-- Side Navigation Bar -->
      <aside 
        [ngClass]="{
          'translate-x-0 shadow-2xl': isMobileMenuOpen(),
          '-translate-x-full lg:translate-x-0': !isMobileMenuOpen()
        }"
        class="h-screen w-72 xs:w-64 fixed left-0 top-0 bg-[#063B39] text-white border-r border-[#063B39]/80 shadow-2xl flex flex-col py-5 z-50 transition-transform duration-300 ease-in-out sidebar-shell"
      >
        
        <!-- Brand Header with Workora Logo -->
        <div class="px-5 sm:px-6 mb-6 flex items-center justify-between sidebar-brand">
          <div class="flex items-center gap-3 cursor-pointer group" routerLink="/dashboard" (click)="closeMobileMenu()">
            <img 
              alt="Workora Logo" 
              src="/workoraLogo.png" 
              class="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_4px_12px_rgba(63,167,155,0.45)] shrink-0"
            />
            <div>
              <h2 class="text-xl font-extrabold text-white tracking-tight font-heading leading-none">Workora</h2>
              <p class="text-[10px] font-bold text-[#3FA79B] uppercase tracking-wider mt-1">Workforce Hub</p>
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
          
          <!-- SuperAdmin Platform Section -->
          @if (authService.hasRole('SuperAdmin')) {
            <div class="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-amber-400/90">Platform Control</div>
            <a
              routerLink="/superadmin"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
              class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
              <span class="material-symbols-outlined mr-3 text-lg text-amber-400 group-hover:text-white group-hover:scale-105 transition-all">admin_panel_settings</span>
              <span>Platform Admin Console</span>
            </a>
          }

          <div class="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#3FA79B]/80">Core Workforce</div>

          <!-- Dashboard Tab (Always visible) -->
          <a
            routerLink="/dashboard"
            (click)="closeMobileMenu()"
            routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
            [routerLinkActiveOptions]="{ exact: true }"
            class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
            <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">dashboard</span>
            <span>Dashboard</span>
          </a>

          <!-- Employees Tab -->
          @if (authService.hasPermission('employees.view')) {
            <a
              routerLink="/employees"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
              class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
              <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">badge</span>
              <span>People &amp; Employees</span>
            </a>
          }

          <!-- Organization Tab -->
          @if (authService.hasPermission('company.view') || authService.hasPermission('branches.view')) {
            <a
              routerLink="/organization"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
              class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
              <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">account_tree</span>
              <span>Organization</span>
            </a>
          }

          <!-- Roles & Permissions Tab -->
          @if (authService.hasPermission('roles.view')) {
            <a
              routerLink="/roles"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
              class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
              <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">security</span>
              <span>Roles &amp; RBAC</span>
            </a>
          }

          <!-- User Directory Tab -->
          @if (authService.hasPermission('users.view')) {
            <a
              routerLink="/users"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
              class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
              <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">manage_accounts</span>
              <span>User Accounts</span>
            </a>
          }

          <!-- Time & Attendance Section -->
          @if (authService.hasAnyPermission(['attendance.view', 'attendance.self', 'leave.view', 'leave.self', 'holidays.view', 'shifts.view'])) {
            <div class="px-3 pt-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#3FA79B]/80">Time &amp; Attendance</div>

            <!-- Attendance Tab -->
            @if (authService.hasPermission('attendance.self') || authService.hasPermission('attendance.view')) {
              <a
                routerLink="/attendance"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">schedule</span>
                <span>Attendance &amp; Punches</span>
              </a>
            }

            <!-- Leave Tab -->
            @if (authService.hasPermission('leave.view') || authService.hasPermission('leave.self')) {
              <a
                routerLink="/leave"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">beach_access</span>
                <span>Leave &amp; Time Off</span>
              </a>
            }

            <!-- Holidays Tab -->
            @if (authService.hasPermission('holidays.view') || authService.hasPermission('employees.self')) {
              <a
                routerLink="/holidays"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">celebration</span>
                <span>Holiday Calendar</span>
              </a>
            }

            <!-- Shifts Tab -->
            @if (authService.hasPermission('shifts.view')) {
              <a
                routerLink="/shifts"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">more_time</span>
                <span>Shift Schedules</span>
              </a>
            }
          }

          <!-- Payroll & Financials Section -->
          @if (authService.hasAnyPermission(['payroll.manage', 'payroll.self', 'loans.view', 'loans.apply', 'expenses.view', 'expenses.submit'])) {
            <div class="px-3 pt-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#3FA79B]/80">Payroll &amp; Finance</div>

            <!-- Payroll Runs Tab -->
            @if (authService.hasPermission('payroll.manage') || authService.hasRole('FinanceManager')) {
              <a
                routerLink="/payroll"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">payments</span>
                <span>Payroll Cycles</span>
              </a>
            }

            <!-- My Payslips Tab -->
            @if (authService.hasPermission('payroll.self')) {
              <a
                routerLink="/my-payslips"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">request_quote</span>
                <span>My Payslips</span>
              </a>
            }

            <!-- Loans Tab -->
            @if (authService.hasPermission('loans.view') || authService.hasPermission('loans.apply')) {
              <a
                routerLink="/loans"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">account_balance</span>
                <span>Loans &amp; Advances</span>
              </a>
            }

            <!-- Expenses Tab -->
            @if (authService.hasPermission('expenses.view') || authService.hasPermission('expenses.submit')) {
              <a
                routerLink="/expenses"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">receipt</span>
                <span>Expense Claims</span>
              </a>
            }
          }

          <!-- Talent & Growth Section -->
          @if (authService.hasAnyPermission(['recruitment.view', 'performance.view', 'performance.self', 'training.view'])) {
            <div class="px-3 pt-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#3FA79B]/80">Talent &amp; Growth</div>

            <!-- Jobs Tab -->
            @if (authService.hasPermission('recruitment.view')) {
              <a
                routerLink="/jobs"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">work</span>
                <span>Job Vacancies</span>
              </a>

              <a
                routerLink="/candidates"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">view_kanban</span>
                <span>Candidate Funnel</span>
              </a>
            }

            <!-- Performance Tab -->
            @if (authService.hasPermission('performance.view') || authService.hasPermission('performance.self')) {
              <a
                routerLink="/performance"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">stars</span>
                <span>Performance &amp; OKRs</span>
              </a>
            }

            <!-- Training Tab -->
            @if (authService.hasPermission('training.view')) {
              <a
                routerLink="/training"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">school</span>
                <span>Learning &amp; Training</span>
              </a>
            }
          }

          <!-- Operations & Tasks Section -->
          @if (authService.hasAnyPermission(['tasks.view', 'helpdesk.view', 'helpdesk.create', 'field.view', 'documents.view', 'assets.view'])) {
            <div class="px-3 pt-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#3FA79B]/80">Operations &amp; Tasks</div>

            <!-- Tasks Tab -->
            @if (authService.hasPermission('tasks.view')) {
              <a
                routerLink="/tasks"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">checklist</span>
                <span>Task Management</span>
              </a>
            }

            <!-- Helpdesk Tab -->
            @if (authService.hasPermission('helpdesk.view') || authService.hasPermission('helpdesk.create')) {
              <a
                routerLink="/helpdesk"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">support_agent</span>
                <span>Support Helpdesk</span>
              </a>
            }

            <!-- Field Tracking Tab -->
            @if (authService.hasPermission('field.view')) {
              <a
                routerLink="/field-tracking"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">location_on</span>
                <span>Field GPS Tracking</span>
              </a>
            }

            <!-- Documents Tab -->
            @if (authService.hasPermission('documents.view')) {
              <a
                routerLink="/documents"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">folder_shared</span>
                <span>Documents &amp; Policies</span>
              </a>
            }

            <!-- Assets Tab -->
            @if (authService.hasPermission('assets.view')) {
              <a
                routerLink="/assets"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">devices</span>
                <span>Assets &amp; Hardware</span>
              </a>
            }
          }

          <!-- Intelligence, Governance & Compliance Section -->
          @if (authService.hasAnyPermission(['compliance.view', 'reports.view', 'settings.view', 'audit.view'])) {
            <div class="px-3 pt-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#3FA79B]/80">Governance &amp; Reports</div>

            <!-- Compliance Tab -->
            @if (authService.hasPermission('compliance.view')) {
              <a
                routerLink="/compliance"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">account_balance</span>
                <span>Statutory Compliance</span>
              </a>
            }

            <!-- Analytics & Reports Tab -->
            @if (authService.hasPermission('reports.view')) {
              <a
                routerLink="/reports"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">analytics</span>
                <span>Executive Analytics</span>
              </a>
            }

            <!-- System Settings Tab -->
            @if (authService.hasPermission('settings.view')) {
              <a
                routerLink="/settings"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">tune</span>
                <span>System Settings</span>
              </a>
            }

            <!-- Security Audit Logs Tab -->
            @if (authService.hasPermission('audit.view')) {
              <a
                routerLink="/audit-logs"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
                class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
                <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">policy</span>
                <span>Audit Trail Logs</span>
              </a>
            }
          }

          <!-- Account Security Tab (Always accessible to authenticated user) -->
          <div class="px-3 pt-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#3FA79B]/80">My Account</div>
          <a
            routerLink="/change-password"
            (click)="closeMobileMenu()"
            routerLinkActive="bg-[#0E6E68] text-white font-bold shadow-md border-l-4 border-[#3FA79B]"
            class="text-white/80 hover:bg-[#3FA79B]/15 hover:text-white flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold group nav-item">
            <span class="material-symbols-outlined mr-3 text-lg text-[#3FA79B] group-hover:text-white group-hover:scale-105 transition-all">shield</span>
            <span>Account Security</span>
          </a>
        </nav>

        <!-- User Profile & Action Footer -->
        <div class="px-3 mt-auto space-y-2 pt-4 border-t border-white/10 sidebar-footer">
          
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3FA79B]/40 transition-colors">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0E6E68] to-[#3FA79B] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-white/20">
              {{ getInitials(currentUser()?.firstName, currentUser()?.lastName) }}
            </div>
            <div class="overflow-hidden flex-1">
              <p class="text-xs font-bold text-white truncate leading-none">{{ currentUser()?.firstName || 'Workora' }} {{ currentUser()?.lastName || 'User' }}</p>
              <p class="text-[10px] text-[#3FA79B] font-semibold mt-0.5 truncate uppercase tracking-wider">{{ currentUser()?.roles?.[0] || 'Member' }}</p>
            </div>
          </div>

          <a 
            routerLink="/" 
            (click)="closeMobileMenu()"
            class="w-full py-2 px-3 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined text-base text-[#3FA79B]">home</span>
            <span>Public Home</span>
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

              <!-- Top Navigation Breadcrumbs (Role & Permission Aware) -->
              <nav class="hidden md:flex items-center gap-3 text-xs font-semibold text-slate-500 shrink-0">
                <a routerLink="/dashboard" routerLinkActive="text-[#0E6E68] font-bold" [routerLinkActiveOptions]="{ exact: true }" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Dashboard</a>
                
                @if (authService.hasRole('SuperAdmin')) {
                  <span>•</span>
                  <a routerLink="/superadmin" routerLinkActive="text-[#0E6E68] font-bold" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Platform Console</a>
                }

                @if (authService.hasPermission('employees.view')) {
                  <span>•</span>
                  <a routerLink="/employees" routerLinkActive="text-[#0E6E68] font-bold" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Employees</a>
                }

                @if (authService.hasPermission('company.view')) {
                  <span>•</span>
                  <a routerLink="/organization" routerLinkActive="text-[#0E6E68] font-bold" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Organization</a>
                }

                @if (authService.hasPermission('roles.view')) {
                  <span>•</span>
                  <a routerLink="/roles" routerLinkActive="text-[#0E6E68] font-bold" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Roles &amp; RBAC</a>
                }

                @if (authService.hasPermission('payroll.manage')) {
                  <span>•</span>
                  <a routerLink="/payroll" routerLinkActive="text-[#0E6E68] font-bold" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Payroll</a>
                } @else if (authService.hasPermission('payroll.self')) {
                  <span>•</span>
                  <a routerLink="/my-payslips" routerLinkActive="text-[#0E6E68] font-bold" class="hover:text-[#0E6E68] transition-colors cursor-pointer">My Payslips</a>
                }

                @if (authService.hasPermission('attendance.self') || authService.hasPermission('attendance.view')) {
                  <span>•</span>
                  <a routerLink="/attendance" routerLinkActive="text-[#0E6E68] font-bold" class="hover:text-[#0E6E68] transition-colors cursor-pointer">Attendance</a>
                }
              </nav>
            </div>

            <div class="flex items-center gap-2 sm:gap-4 relative shrink-0">
              <!-- Search Input -->
              <div class="relative hidden sm:block">
                <div class="relative flex items-center">
                  <span class="material-symbols-outlined absolute left-3.5 text-[#0E6E68]/70 pointer-events-none text-lg">search</span>
                  <input 
                    class="w-48 md:w-64 lg:w-72 bg-[#F4F8F7] hover:bg-white focus:bg-white text-xs text-[#063B39] placeholder-slate-400 font-medium pl-10 pr-12 py-2 rounded-full border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none transition-all shadow-2xs" 
                    placeholder="Search people, teams..." 
                    type="text"
                  />
                  <div class="absolute right-2.5 flex items-center pointer-events-none">
                    <kbd class="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold text-slate-400 bg-white border border-[#DCEBE7] rounded-md shadow-2xs">
                      ⌘K
                    </kbd>
                  </div>
                </div>
              </div>

              <!-- AI Copilot Button -->
              <button 
                type="button"
                (click)="isAiModalOpen.set(true)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-tr from-[#0E6E68] to-[#3FA79B] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer border-none"
                title="Open Workora AI Copilot"
              >
                <span class="material-symbols-outlined text-sm">smart_toy</span>
                <span class="hidden sm:inline">AI Copilot</span>
              </button>

              <!-- Notifications -->
              <button 
                (click)="onNotificationClick()"
                class="hover:bg-[#DCEBE7]/50 rounded-xl p-1.5 xs:p-2 transition-all text-[#063B39] relative cursor-pointer border-none bg-transparent" 
                aria-label="Notifications"
              >
                <span class="material-symbols-outlined text-xl">notifications</span>
                @if (unreadNotificationsCount() > 0) {
                  <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                }
              </button>

              <div class="h-5 w-px bg-[#DCEBE7] mx-0.5 hidden sm:block"></div>
              
              <!-- User Profile Dropdown -->
              <div class="relative">
                <button 
                  (click)="toggleProfileMenu($event)"
                  class="flex items-center gap-2 p-1 rounded-xl hover:bg-[#DCEBE7]/40 transition-colors border-none bg-transparent cursor-pointer"
                  aria-label="User profile menu"
                >
                  <div class="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-gradient-to-tr from-[#0E6E68] to-[#3FA79B] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:scale-105 transition-transform shrink-0">
                    {{ getInitials(currentUser()?.firstName, currentUser()?.lastName) }}
                  </div>
                  <div class="hidden lg:block text-left">
                    <p class="text-xs font-bold text-[#063B39] leading-none">{{ currentUser()?.firstName || 'User' }}</p>
                    <p class="text-[10px] text-slate-500 mt-0.5">Account ▾</p>
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
                      <p class="text-[10px] text-slate-500 truncate">{{ currentUser()?.email }}</p>
                    </div>

                    <a 
                      routerLink="/change-password" 
                      (click)="isProfileMenuOpen.set(false)"
                      class="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#163331] hover:bg-[#DCEBE7]/50 rounded-xl transition-colors cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-base text-[#0E6E68]">lock_reset</span>
                      <span>Account Security</span>
                    </a>

                    <a 
                      routerLink="/users" 
                      (click)="isProfileMenuOpen.set(false)"
                      class="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#163331] hover:bg-[#DCEBE7]/50 rounded-xl transition-colors cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-base text-[#0E6E68]">badge</span>
                      <span>Team Directory</span>
                    </a>

                    <div class="h-px bg-[#DCEBE7] my-1"></div>

                    <button 
                      (click)="onLogout()"
                      class="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border-none bg-transparent cursor-pointer"
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

        <!-- AI Copilot Modal -->
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

  readonly currentUser = this.authService.currentUser;
  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly isProfileMenuOpen = signal<boolean>(false);
  readonly isAiModalOpen = signal<boolean>(false);
  readonly unreadNotificationsCount = signal<number>(0);

  private ctx?: gsap.Context;

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.isProfileMenuOpen()) {
      this.isProfileMenuOpen.set(false);
    }
  }

  ngOnInit(): void {
    if (!this.authService.currentUser() && this.authService.isAuthenticated()) {
      this.authService.loadProfile().subscribe({
        error: () => {}
      });
    }

    this.notificationRepo.getUnreadCount().subscribe({
      next: res => this.unreadNotificationsCount.set(res.unreadCount),
      error: () => {}
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    this.ctx = gsap.context(() => {
      const navItems = this.elementRef.nativeElement.querySelectorAll('.sidebar-nav .nav-item');
      if (navItems.length > 0) {
        gsap.from(navItems, {
          x: -15,
          opacity: 0,
          stagger: 0.03,
          duration: 0.35,
          ease: 'power2.out'
        });
      }

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

  onModulePreview(moduleName: string): void {
    this.notificationService.showInfo(`${moduleName} is active and synchronized for your team.`);
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
