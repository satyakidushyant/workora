import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { SystemSettingsApiRepository } from '../../../../data/repositories/system-settings-api.repository';
import { SystemSetting } from '../../../../domain/models/system-settings.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';

type SettingsGroup = 'General' | 'WorkHours' | 'Security' | 'Payroll';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, WorkoraSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">tune</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              System Settings &amp; Preferences
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Configure global organization parameters, work schedules, locale, and security thresholds.
          </p>
        </div>

        <button 
          type="button" 
          (click)="onSaveSettings()"
          [disabled]="isSaving()"
          class="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer border-none">
          @if (isSaving()) {
            <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Saving...</span>
          } @else {
            <span class="material-symbols-outlined text-base">save</span>
            <span>Save Configuration</span>
          }
        </button>
      </div>

      <!-- Settings Layout -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <!-- Sidebar Navigation -->
        <div class="space-y-1">
          <button 
            type="button" 
            (click)="activeGroup.set('General')"
            [ngClass]="activeGroup() === 'General' ? 'bg-[#0E6E68] text-white shadow-xs font-bold' : 'text-slate-600 hover:bg-[#F4F8F7]'"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-lg">corporate_fare</span>
            <span>General &amp; Locale</span>
          </button>

          <button 
            type="button" 
            (click)="activeGroup.set('WorkHours')"
            [ngClass]="activeGroup() === 'WorkHours' ? 'bg-[#0E6E68] text-white shadow-xs font-bold' : 'text-slate-600 hover:bg-[#F4F8F7]'"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-lg">schedule</span>
            <span>Work Schedule</span>
          </button>

          <button 
            type="button" 
            (click)="activeGroup.set('Security')"
            [ngClass]="activeGroup() === 'Security' ? 'bg-[#0E6E68] text-white shadow-xs font-bold' : 'text-slate-600 hover:bg-[#F4F8F7]'"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-lg">lock_reset</span>
            <span>Security &amp; Auth</span>
          </button>

          <button 
            type="button" 
            (click)="activeGroup.set('Payroll')"
            [ngClass]="activeGroup() === 'Payroll' ? 'bg-[#0E6E68] text-white shadow-xs font-bold' : 'text-slate-600 hover:bg-[#F4F8F7]'"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-lg">payments</span>
            <span>Payroll Defaults</span>
          </button>
        </div>

        <!-- Settings Form Area -->
        <div class="md:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE7] shadow-xs space-y-6">
          @if (isLoading()) {
            <app-workora-skeleton type="table" [count]="3"></app-workora-skeleton>
          } @else {
            
            <!-- GENERAL GROUP -->
            @if (activeGroup() === 'General') {
              <div class="space-y-4 animate-in fade-in duration-150">
                <h3 class="text-sm font-extrabold text-[#063B39] border-b border-[#DCEBE7] pb-3">
                  Company Defaults &amp; Localization
                </h3>

                <div class="space-y-4">
                  <div>
                    <label class="block text-xs font-bold text-[#063B39] mb-1">Default Base Currency</label>
                    <input 
                      type="text" 
                      [(ngModel)]="settingsMap['general.currency']" 
                      placeholder="USD, EUR, INR, GBP"
                      class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-[#063B39] mb-1">Timezone Region</label>
                    <select 
                      [(ngModel)]="settingsMap['general.timezone']"
                      class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                      <option value="America/New_York">Eastern Time (US &amp; Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US &amp; Canada)</option>
                      <option value="Asia/Kolkata">India Standard Time (IST)</option>
                      <option value="Europe/London">Greenwich Mean Time (GMT / BST)</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-[#063B39] mb-1">System Language</label>
                    <select 
                      [(ngModel)]="settingsMap['general.locale']"
                      class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                      <option value="en-US">English (United States)</option>
                      <option value="en-GB">English (United Kingdom)</option>
                    </select>
                  </div>
                </div>
              </div>
            }

            <!-- WORK SCHEDULE GROUP -->
            @if (activeGroup() === 'WorkHours') {
              <div class="space-y-4 animate-in fade-in duration-150">
                <h3 class="text-sm font-extrabold text-[#063B39] border-b border-[#DCEBE7] pb-3">
                  Default Working Schedule
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-[#063B39] mb-1">Daily Work Hours</label>
                    <input 
                      type="number" 
                      [(ngModel)]="settingsMap['work.standard_hours']" 
                      class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-[#063B39] mb-1">Work Week Days</label>
                    <input 
                      type="number" 
                      [(ngModel)]="settingsMap['work.days_per_week']" 
                      class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-[#063B39] mb-1">Standard Shift Start</label>
                    <input 
                      type="time" 
                      [(ngModel)]="settingsMap['work.shift_start']" 
                      class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-[#063B39] mb-1">Standard Shift End</label>
                    <input 
                      type="time" 
                      [(ngModel)]="settingsMap['work.shift_end']" 
                      class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                    />
                  </div>
                </div>
              </div>
            }

            <!-- SECURITY GROUP -->
            @if (activeGroup() === 'Security') {
              <div class="space-y-4 animate-in fade-in duration-150">
                <h3 class="text-sm font-extrabold text-[#063B39] border-b border-[#DCEBE7] pb-3">
                  Authentication &amp; Security Policy
                </h3>

                <div class="space-y-4">
                  <div>
                    <label class="block text-xs font-bold text-[#063B39] mb-1">Session Timeout (Minutes)</label>
                    <input 
                      type="number" 
                      [(ngModel)]="settingsMap['security.session_timeout_minutes']" 
                      class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-[#063B39] mb-1">Max Failed Login Attempts Before Lockout</label>
                    <input 
                      type="number" 
                      [(ngModel)]="settingsMap['security.max_failed_logins']" 
                      class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                    />
                  </div>
                </div>
              </div>
            }

            <!-- PAYROLL GROUP -->
            @if (activeGroup() === 'Payroll') {
              <div class="space-y-4 animate-in fade-in duration-150">
                <h3 class="text-sm font-extrabold text-[#063B39] border-b border-[#DCEBE7] pb-3">
                  Payroll Cycle Defaults
                </h3>

                <div class="space-y-4">
                  <div>
                    <label class="block text-xs font-bold text-[#063B39] mb-1">Payroll Cycle Frequency</label>
                    <select 
                      [(ngModel)]="settingsMap['payroll.cycle_type']"
                      class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                      <option value="Monthly">Monthly</option>
                      <option value="BiWeekly">Bi-Weekly</option>
                      <option value="SemiMonthly">Semi-Monthly (15th &amp; Last Day)</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-[#063B39] mb-1">Disbursement Cutoff Day of Month</label>
                    <input 
                      type="number" 
                      [(ngModel)]="settingsMap['payroll.cutoff_day']" 
                      min="1" 
                      max="31"
                      class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                    />
                  </div>
                </div>
              </div>
            }

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

  settingsMap: Record<string, string> = {
    'general.currency': 'USD',
    'general.timezone': 'America/New_York',
    'general.locale': 'en-US',
    'work.standard_hours': '8',
    'work.days_per_week': '5',
    'work.shift_start': '09:00',
    'work.shift_end': '17:00',
    'security.session_timeout_minutes': '60',
    'security.max_failed_logins': '5',
    'payroll.cycle_type': 'Monthly',
    'payroll.cutoff_day': '25'
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
        error: () => {
          // Defaults are preserved if API returns empty
        }
      });
  }

  onSaveSettings(): void {
    this.isSaving.set(true);

    const items = Object.keys(this.settingsMap).map(k => ({
      key: k,
      value: this.settingsMap[k] || '',
      description: null,
      group: k.split('.')[0]
    }));

    this.settingsRepo.updateSettings({
      companyId: 1,
      settings: items
    })
    .pipe(finalize(() => this.isSaving.set(false)))
    .subscribe({
      next: () => this.notificationService.showSuccess('System settings updated successfully.'),
      error: err => this.notificationService.showError(err.message || 'Failed to save settings.')
    });
  }
}
