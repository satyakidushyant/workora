import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { SystemSettingsApiRepository } from '../../../../data/repositories/system-settings-api.repository';
import { SettingEntry } from '../../../../domain/models/system-settings.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

type SettingsGroup = 'General' | 'WorkHours' | 'Security' | 'Payroll' | 'Notifications';

interface SettingsTab {
  id: SettingsGroup;
  label: string;
  subtitle: string;
  icon: string;
  badge?: string;
}

/**
 * Enterprise Settings & Platform Preferences Console for Workora.
 * Allows workspace administrators to configure organization locale, work schedules,
 * security thresholds, payroll cycles, and notification preferences.
 */
@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    WorkoraSkeletonComponent,
    WorkoraSelectComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-5 sm:space-y-6 w-full">
      
      <!-- Top Navigation & Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-1.5 text-xs text-[#718686] font-medium mb-1">
            <a routerLink="/dashboard" class="hover:text-[#087F73] transition-colors flex items-center gap-1 text-slate-500 font-semibold no-underline">
              <span class="material-symbols-outlined text-sm">dashboard</span>
              <span>Dashboard</span>
            </a>
            <span class="text-slate-300">/</span>
            <span class="text-[#102A2A] font-bold">System Settings</span>
          </div>

          <div class="flex items-center gap-2.5">
            <div class="p-2.5 rounded-2xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center shrink-0 shadow-xs">
              <span class="material-symbols-outlined text-2xl">tune</span>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#102A2A] tracking-tight font-heading">
                System Settings &amp; Preferences
              </h1>
              <p class="text-xs sm:text-sm text-[#718686] mt-0.5 font-medium">
                Configure global workspace parameters, working hours, security policies, and payroll preferences.
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <button 
            type="button" 
            (click)="onSaveSettings()"
            [disabled]="isSaving()"
            class="workora-btn-primary text-xs shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2">
            @if (isSaving()) {
              <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Saving Changes...</span>
            } @else {
              <span class="material-symbols-outlined text-base">save</span>
              <span>Save Configuration</span>
            }
          </button>
        </div>
      </div>

      <!-- Settings Layout Body -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        <!-- Left Vertical Navigation Tabs -->
        <div class="workora-card p-3 space-y-1">
          <div class="px-3 py-2 border-b border-[#DDE9E6] mb-1">
            <span class="text-[10px] font-extrabold text-[#718686] uppercase tracking-wider">Configuration Category</span>
          </div>

          @for (tab of settingsTabs; track tab.id) {
            <button 
              type="button" 
              (click)="activeGroup.set(tab.id)"
              [ngClass]="activeGroup() === tab.id 
                ? 'bg-gradient-to-r from-[#075E58] to-[#087F73] text-white shadow-xs font-bold' 
                : 'text-[#405656] hover:bg-[#DDF7F2]/40 hover:text-[#075E58]'"
              class="w-full text-left px-3.5 py-3 rounded-2xl text-xs transition-all flex items-center justify-between border-none bg-transparent cursor-pointer group">
              <div class="flex items-center gap-3 min-w-0">
                <span class="material-symbols-outlined text-lg shrink-0" [ngClass]="activeGroup() === tab.id ? 'text-[#64D8C8]' : 'text-[#087F73] group-hover:scale-110 transition-transform'">
                  {{ tab.icon }}
                </span>
                <div class="truncate">
                  <p class="font-bold text-xs leading-none truncate">{{ tab.label }}</p>
                  <p class="text-[10px] opacity-75 font-normal mt-1 truncate">{{ tab.subtitle }}</p>
                </div>
              </div>
              @if (tab.badge) {
                <span class="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white/20 text-white shrink-0">
                  {{ tab.badge }}
                </span>
              }
            </button>
          }
        </div>

        <!-- Right Main Settings Form Card -->
        <div class="lg:col-span-3 workora-card p-6 sm:p-8 space-y-6">
          
          @if (isLoading()) {
            <app-workora-skeleton type="table" [count]="3"></app-workora-skeleton>
          } @else {
            
            <!-- 1. GENERAL & LOCALE -->
            @if (activeGroup() === 'General') {
              <div class="space-y-6 animate-in fade-in duration-200">
                <div class="flex items-center justify-between border-b border-[#DDE9E6] pb-4">
                  <div>
                    <h2 class="text-base font-extrabold text-[#102A2A] font-heading flex items-center gap-2">
                      <span class="material-symbols-outlined text-[#087F73]">corporate_fare</span>
                      General &amp; Localization
                    </h2>
                    <p class="text-xs text-[#718686] mt-0.5">Manage base currency, timezones, date formats, and language settings.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  <!-- Currency Dropdown -->
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-[#102A2A]">Default Currency</label>
                    <app-workora-select
                      [options]="currencyOptions"
                      [ngModel]="settingsMap['general.currency']"
                      (selectionChange)="onSettingSelectChange('general.currency', $event)"
                      placeholder="Select Currency"
                      icon="payments">
                    </app-workora-select>
                    <p class="text-[10px] text-[#718686]">Used for company payroll reports and expense reimbursements.</p>
                  </div>

                  <!-- Timezone Dropdown -->
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-[#102A2A]">Organization Timezone</label>
                    <app-workora-select
                      [options]="timezoneOptions"
                      [ngModel]="settingsMap['general.timezone']"
                      (selectionChange)="onSettingSelectChange('general.timezone', $event)"
                      placeholder="Select Timezone"
                      icon="schedule">
                    </app-workora-select>
                    <p class="text-[10px] text-[#718686]">Controls attendance punches and automated email trigger times.</p>
                  </div>

                  <!-- Language Dropdown -->
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-[#102A2A]">System Default Language</label>
                    <app-workora-select
                      [options]="localeOptions"
                      [ngModel]="settingsMap['general.locale']"
                      (selectionChange)="onSettingSelectChange('general.locale', $event)"
                      placeholder="Select Language"
                      icon="translate">
                    </app-workora-select>
                  </div>

                  <!-- Date Format Dropdown -->
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-[#102A2A]">Date Display Format</label>
                    <app-workora-select
                      [options]="dateFormatOptions"
                      [ngModel]="settingsMap['general.date_format']"
                      (selectionChange)="onSettingSelectChange('general.date_format', $event)"
                      placeholder="Select Date Format"
                      icon="calendar_month">
                    </app-workora-select>
                  </div>

                </div>
              </div>
            }

            <!-- 2. WORK SCHEDULE & ATTENDANCE -->
            @if (activeGroup() === 'WorkHours') {
              <div class="space-y-6 animate-in fade-in duration-200">
                <div class="flex items-center justify-between border-b border-[#DDE9E6] pb-4">
                  <div>
                    <h2 class="text-base font-extrabold text-[#102A2A] font-heading flex items-center gap-2">
                      <span class="material-symbols-outlined text-[#087F73]">schedule</span>
                      Work Schedule &amp; Shift Timing
                    </h2>
                    <p class="text-xs text-[#718686] mt-0.5">Configure standard shift working hours, weekly days, and overtime policies.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-[#102A2A]">Standard Daily Work Hours</label>
                    <div class="relative flex items-center">
                      <span class="material-symbols-outlined absolute left-3.5 text-[#087F73] text-base pointer-events-none">timer</span>
                      <input 
                        type="number" 
                        [(ngModel)]="settingsMap['work.standard_hours']" 
                        min="1" max="24"
                        class="w-full h-10 pl-10 pr-4 bg-[#F6FAF9] text-xs font-semibold text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-[#102A2A]">Working Days per Week</label>
                    <div class="relative flex items-center">
                      <span class="material-symbols-outlined absolute left-3.5 text-[#087F73] text-base pointer-events-none">date_range</span>
                      <input 
                        type="number" 
                        [(ngModel)]="settingsMap['work.days_per_week']" 
                        min="1" max="7"
                        class="w-full h-10 pl-10 pr-4 bg-[#F6FAF9] text-xs font-semibold text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-[#102A2A]">Standard Shift Start Time</label>
                    <input 
                      type="time" 
                      [(ngModel)]="settingsMap['work.shift_start']" 
                      class="w-full h-10 px-4 bg-[#F6FAF9] text-xs font-semibold text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] outline-none transition-all"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-[#102A2A]">Standard Shift End Time</label>
                    <input 
                      type="time" 
                      [(ngModel)]="settingsMap['work.shift_end']" 
                      class="w-full h-10 px-4 bg-[#F6FAF9] text-xs font-semibold text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] outline-none transition-all"
                    />
                  </div>
                </div>

                <div class="p-4 bg-[#DDF7F2]/40 rounded-2xl border border-[#087F73]/20 flex items-center justify-between gap-4">
                  <div class="space-y-0.5">
                    <p class="text-xs font-bold text-[#075E58]">Automatic Attendance Overtime Threshold</p>
                    <p class="text-[11px] text-[#718686]">Calculate overtime hours automatically when employee punches exceed shift end time.</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" [(ngModel)]="settingsMap['work.auto_overtime']" class="sr-only peer">
                    <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#087F73]"></div>
                  </label>
                </div>
              </div>
            }

            <!-- 3. SECURITY & AUTHENTICATION -->
            @if (activeGroup() === 'Security') {
              <div class="space-y-6 animate-in fade-in duration-200">
                <div class="flex items-center justify-between border-b border-[#DDE9E6] pb-4">
                  <div>
                    <h2 class="text-base font-extrabold text-[#102A2A] font-heading flex items-center gap-2">
                      <span class="material-symbols-outlined text-[#087F73]">lock_reset</span>
                      Security &amp; Access Controls
                    </h2>
                    <p class="text-xs text-[#718686] mt-0.5">Define session expiration limits, failed login lockouts, and authentication policies.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-[#102A2A]">Idle Session Timeout (Minutes)</label>
                    <div class="relative flex items-center">
                      <span class="material-symbols-outlined absolute left-3.5 text-[#087F73] text-base pointer-events-none">hourglass_empty</span>
                      <input 
                        type="number" 
                        [(ngModel)]="settingsMap['security.session_timeout_minutes']" 
                        min="5" max="1440"
                        class="w-full h-10 pl-10 pr-4 bg-[#F6FAF9] text-xs font-semibold text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-[#102A2A]">Max Failed Logins Before Lockout</label>
                    <div class="relative flex items-center">
                      <span class="material-symbols-outlined absolute left-3.5 text-[#087F73] text-base pointer-events-none">gpp_bad</span>
                      <input 
                        type="number" 
                        [(ngModel)]="settingsMap['security.max_failed_logins']" 
                        min="3" max="10"
                        class="w-full h-10 pl-10 pr-4 bg-[#F6FAF9] text-xs font-semibold text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div class="p-4 bg-[#F6FAF9] rounded-2xl border border-[#DDE9E6] space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-xs font-bold text-[#102A2A]">Enforce Multi-Factor Authentication (MFA/2FA)</p>
                      <p class="text-[11px] text-[#718686]">Require all admin and manager roles to verify identity via 2FA code.</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" [(ngModel)]="settingsMap['security.enforce_mfa']" class="sr-only peer">
                      <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#087F73]"></div>
                    </label>
                  </div>
                </div>
              </div>
            }

            <!-- 4. PAYROLL DEFAULTS -->
            @if (activeGroup() === 'Payroll') {
              <div class="space-y-6 animate-in fade-in duration-200">
                <div class="flex items-center justify-between border-b border-[#DDE9E6] pb-4">
                  <div>
                    <h2 class="text-base font-extrabold text-[#102A2A] font-heading flex items-center gap-2">
                      <span class="material-symbols-outlined text-[#087F73]">payments</span>
                      Payroll &amp; Compensation Defaults
                    </h2>
                    <p class="text-xs text-[#718686] mt-0.5">Set organization salary payment cycles, cut-off dates, and disbursement options.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <!-- Payroll Frequency Dropdown -->
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-[#102A2A]">Payroll Cycle Frequency</label>
                    <app-workora-select
                      [options]="payrollCycleOptions"
                      [ngModel]="settingsMap['payroll.cycle_type']"
                      (selectionChange)="onSettingSelectChange('payroll.cycle_type', $event)"
                      placeholder="Select Cycle"
                      icon="calendar_view_month">
                    </app-workora-select>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-[#102A2A]">Monthly Disbursement Cut-off Day</label>
                    <div class="relative flex items-center">
                      <span class="material-symbols-outlined absolute left-3.5 text-[#087F73] text-base pointer-events-none">event_busy</span>
                      <input 
                        type="number" 
                        [(ngModel)]="settingsMap['payroll.cutoff_day']" 
                        min="1" max="31"
                        class="w-full h-10 pl-10 pr-4 bg-[#F6FAF9] text-xs font-semibold text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div class="p-4 bg-[#DDF7F2]/40 rounded-2xl border border-[#087F73]/20 flex items-center justify-between gap-4">
                  <div class="space-y-0.5">
                    <p class="text-xs font-bold text-[#075E58]">Auto-Generate &amp; Email Payslips upon Payroll Approval</p>
                    <p class="text-[11px] text-[#718686]">Automatically dispatch PDF payslips to employee registered email addresses once payroll run is completed.</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" [(ngModel)]="settingsMap['payroll.auto_email_payslips']" class="sr-only peer">
                    <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#087F73]"></div>
                  </label>
                </div>
              </div>
            }

            <!-- 5. NOTIFICATIONS & AI COPILOT -->
            @if (activeGroup() === 'Notifications') {
              <div class="space-y-6 animate-in fade-in duration-200">
                <div class="flex items-center justify-between border-b border-[#DDE9E6] pb-4">
                  <div>
                    <h2 class="text-base font-extrabold text-[#102A2A] font-heading flex items-center gap-2">
                      <span class="material-symbols-outlined text-[#087F73]">smart_toy</span>
                      AI Copilot &amp; Notifications
                    </h2>
                    <p class="text-xs text-[#718686] mt-0.5">Customize AI assistant behavior and system notification alerts.</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="p-4 bg-[#F6FAF9] rounded-2xl border border-[#DDE9E6] flex items-center justify-between gap-4">
                    <div>
                      <p class="text-xs font-bold text-[#102A2A]">Enable Workora AI Copilot Assistance</p>
                      <p class="text-[11px] text-[#718686]">Provide real-time HR insights, policy summaries, and automated task recommendations.</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" [(ngModel)]="settingsMap['ai.enabled']" class="sr-only peer">
                      <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#087F73]"></div>
                    </label>
                  </div>

                  <div class="p-4 bg-[#F6FAF9] rounded-2xl border border-[#DDE9E6] flex items-center justify-between gap-4">
                    <div>
                      <p class="text-xs font-bold text-[#102A2A]">Real-Time Email Alert Notifications</p>
                      <p class="text-[11px] text-[#718686]">Send instant email updates for leave approvals, expense submissions, and announcements.</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" [(ngModel)]="settingsMap['notifications.email_alerts']" class="sr-only peer">
                      <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#087F73]"></div>
                    </label>
                  </div>
                </div>
              </div>
            }

            <!-- Bottom Action Controls -->
            <div class="flex items-center justify-end gap-3 pt-5 border-t border-[#DDE9E6]">
              <button 
                type="button" 
                (click)="loadSettings()"
                class="workora-btn-secondary text-xs px-4 py-2.5">
                Reset Changes
              </button>
              
              <button 
                type="button" 
                (click)="onSaveSettings()"
                [disabled]="isSaving()"
                class="workora-btn-primary text-xs px-6 py-2.5 shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer">
                @if (isSaving()) {
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving...</span>
                } @else {
                  <span class="material-symbols-outlined text-base">save</span>
                  <span>Save Configuration</span>
                }
              </button>
            </div>

          }

        </div>

      </div>

    </div>
  `
})
export class SettingsPageComponent implements OnInit {
  private readonly settingsRepo = inject(SystemSettingsApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly activeGroup = signal<SettingsGroup>('General');
  readonly isLoading = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  readonly settingsTabs: SettingsTab[] = [
    { id: 'General', label: 'General & Locale', subtitle: 'Currency, timezone & language', icon: 'corporate_fare' },
    { id: 'WorkHours', label: 'Work Schedule', subtitle: 'Shifts, timings & overtime', icon: 'schedule' },
    { id: 'Security', label: 'Security & Auth', subtitle: 'Sessions, 2FA & lockouts', icon: 'lock_reset', badge: 'Active' },
    { id: 'Payroll', label: 'Payroll Defaults', subtitle: 'Frequency, cutoff & payslips', icon: 'payments' },
    { id: 'Notifications', label: 'AI & Notifications', subtitle: 'Copilot & email alerts', icon: 'smart_toy' }
  ];

  readonly currencyOptions: WorkoraSelectOption<string>[] = [
    { value: 'USD', label: 'USD ($) - US Dollar', icon: 'attach_money' },
    { value: 'INR', label: 'INR (₹) - Indian Rupee', icon: 'currency_rupee' },
    { value: 'EUR', label: 'EUR (€) - Euro', icon: 'euro' },
    { value: 'GBP', label: 'GBP (£) - British Pound', icon: 'currency_pound' },
    { value: 'AED', label: 'AED (د.إ) - UAE Dirham', icon: 'payments' }
  ];

  readonly timezoneOptions: WorkoraSelectOption<string>[] = [
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST - UTC+5:30)', sublabel: 'UTC+05:30', icon: 'schedule' },
    { value: 'America/New_York', label: 'Eastern Time (US & Canada - UTC-5)', sublabel: 'UTC-05:00', icon: 'schedule' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada - UTC-8)', sublabel: 'UTC-08:00', icon: 'schedule' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT / BST - UTC+0)', sublabel: 'UTC+00:00', icon: 'schedule' },
    { value: 'Asia/Singapore', label: 'Singapore Standard Time (SST - UTC+8)', sublabel: 'UTC+08:00', icon: 'schedule' },
    { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST - UTC+4)', sublabel: 'UTC+04:00', icon: 'schedule' }
  ];

  readonly localeOptions: WorkoraSelectOption<string>[] = [
    { value: 'en-US', label: 'English (United States)', sublabel: 'en-US', icon: 'translate' },
    { value: 'en-GB', label: 'English (United Kingdom / International)', sublabel: 'en-GB', icon: 'translate' },
    { value: 'hi-IN', label: 'Hindi (India)', sublabel: 'hi-IN', icon: 'translate' }
  ];

  readonly dateFormatOptions: WorkoraSelectOption<string>[] = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2026)', icon: 'calendar_month' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2026)', icon: 'calendar_month' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-12-31 ISO)', icon: 'calendar_month' }
  ];

  readonly payrollCycleOptions: WorkoraSelectOption<string>[] = [
    { value: 'Monthly', label: 'Monthly Cycle (End of Month)', icon: 'calendar_view_month' },
    { value: 'BiWeekly', label: 'Bi-Weekly (Every 2 Weeks)', icon: 'calendar_view_month' },
    { value: 'SemiMonthly', label: 'Semi-Monthly (15th & Last Day)', icon: 'calendar_view_month' }
  ];

  settingsMap: Record<string, any> = {
    'general.currency': 'USD',
    'general.timezone': 'Asia/Kolkata',
    'general.locale': 'en-US',
    'general.date_format': 'DD/MM/YYYY',
    'work.standard_hours': '8',
    'work.days_per_week': '5',
    'work.shift_start': '09:00',
    'work.shift_end': '17:00',
    'work.auto_overtime': true,
    'security.session_timeout_minutes': '60',
    'security.max_failed_logins': '5',
    'security.enforce_mfa': true,
    'payroll.cycle_type': 'Monthly',
    'payroll.cutoff_day': '25',
    'payroll.auto_email_payslips': true,
    'ai.enabled': true,
    'notifications.email_alerts': true
  };

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading.set(true);
    this.settingsRepo.getSettings(1)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: settings => {
          settings.forEach(s => {
            this.settingsMap[s.key] = s.value;
          });
        },
        error: err => this.notificationService.showError(err.message || 'Failed to load system settings.')
      });
  }

  onSettingSelectChange(key: string, val: any): void {
    const value = val !== null && val !== undefined && typeof val === 'object' && 'value' in val
      ? val.value
      : val;
    this.settingsMap[key] = value;
  }

  onSaveSettings(): void {
    this.isSaving.set(true);
    const items: SettingEntry[] = Object.keys(this.settingsMap).map(k => ({
      key: k,
      value: String(this.settingsMap[k] ?? ''),
      group: this.activeGroup(),
      description: `Config for ${k}`
    }));

    this.settingsRepo.updateSettings({
      companyId: 1,
      settings: items
    })
    .pipe(finalize(() => this.isSaving.set(false)))
    .subscribe({
      next: () => this.notificationService.showSuccess('System settings updated successfully.'),
      error: err => this.notificationService.showError(err.message || 'Failed to save system settings.')
    });
  }
}
