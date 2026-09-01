import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuditLogApiRepository } from '../../../../data/repositories/audit-log-api.repository';
import { AuditLog } from '../../../../domain/models/audit-log.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

/**
 * Enterprise Workora System Audit & Security Trail Console.
 * Logs immutable activities, entity state diffs, user authorizations, and IP signatures.
 */
@Component({
  selector: 'app-audit-logs-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraEmptyStateComponent,
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
            <span class="text-[#102A2A] font-bold">Security &amp; Audit Trail</span>
          </div>

          <div class="flex items-center gap-2.5">
            <div class="p-2.5 rounded-2xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center shrink-0 shadow-xs">
              <span class="material-symbols-outlined text-2xl">policy</span>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#102A2A] tracking-tight font-heading">
                Security &amp; Audit Trail
              </h1>
              <p class="text-xs sm:text-sm text-[#718686] mt-0.5 font-medium">
                Immutable activity log capturing system state changes, authorization events, and IP addresses.
              </p>
            </div>
          </div>
        </div>

        <!-- Export Action Button -->
        <div class="flex items-center gap-3">
          <button 
            type="button" 
            (click)="onExportAuditLogs()"
            class="workora-btn-primary text-xs shadow-md flex items-center gap-2 cursor-pointer">
            <span class="material-symbols-outlined text-base">file_download</span>
            <span>Export Audit Log</span>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Strip (3 Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        
        <!-- Total Events -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-[#087F73] flex flex-col justify-between min-h-[105px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Total Events</span>
            <span class="w-9 h-9 rounded-xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">history</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-[#102A2A] font-heading leading-tight my-0.5">{{ totalLogs() }}</p>
            <p class="text-[11px] text-[#718686] font-medium">Recorded audit transactions</p>
          </div>
        </div>

        <!-- System Health -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-emerald-500 flex flex-col justify-between min-h-[105px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Log Integrity</span>
            <span class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">verified_user</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-heading leading-tight my-0.5">100%</p>
            <p class="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Encrypted &amp; Tamper-Evident</span>
            </p>
          </div>
        </div>

        <!-- Active Actors -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-[#16A085] flex flex-col justify-between min-h-[105px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Current Page Records</span>
            <span class="w-9 h-9 rounded-xl bg-teal-50 text-[#16A085] flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">data_table</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-[#16A085] font-heading leading-tight my-0.5">{{ logs().length }}</p>
            <p class="text-[11px] text-[#718686] font-medium">Active view window</p>
          </div>
        </div>

      </div>

      <!-- Filter & Search Toolbar (Standardized 40px Height Controls & Uniform Grid) -->
      <div class="workora-card p-4 sm:p-5 space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          
          <!-- 1. Search Bar (Equal Height & Width) -->
          <div class="relative w-full">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
              search
            </span>
            <input 
              type="text" 
              [ngModel]="searchTerm" 
              (ngModelChange)="onSearchChange($event)"
              (keydown.escape)="clearSearch()"
              placeholder="Search by actor, entity or action..."
              class="w-full h-10 pl-10 pr-9 bg-[#F6FAF9] text-xs text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] focus:bg-white outline-none font-medium transition-all placeholder:text-[#718686]"
            />
            @if (searchTerm) {
              <button
                type="button"
                (click)="clearSearch()"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center"
                title="Clear search">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            }
          </div>

          <!-- 2. Entity Dropdown (Workora Select Component) -->
          <div class="w-full">
            <app-workora-select
              [options]="entityOptions"
              [ngModel]="selectedEntity"
              (selectionChange)="onEntityChange($event)"
              [clearable]="true"
              placeholder="All Entities"
              icon="category">
            </app-workora-select>
          </div>

          <!-- 3. Action Dropdown (Workora Select Component) -->
          <div class="w-full">
            <app-workora-select
              [options]="actionOptions"
              [ngModel]="selectedAction"
              (selectionChange)="onActionChange($event)"
              [clearable]="true"
              placeholder="All Actions"
              icon="bolt">
            </app-workora-select>
          </div>

        </div>

        <!-- Reset Active Filters Bar -->
        @if (searchTerm || selectedEntity || selectedAction) {
          <div class="flex items-center justify-between pt-2 border-t border-[#DDE9E6]/60 text-xs">
            <div class="flex items-center gap-1.5 text-[#718686]">
              <span class="material-symbols-outlined text-sm text-[#087F73]">filter_alt</span>
              <span class="font-medium">Active filters applied</span>
            </div>
            <button
              type="button"
              (click)="resetAllFilters()"
              class="h-8 px-3 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-sm">filter_alt_off</span>
              <span>Reset Filters</span>
            </button>
          </div>
        }
      </div>

      <!-- Logs Table -->
      <div class="workora-card overflow-hidden">
        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="6"></app-workora-skeleton>
          </div>
        } @else if (logs().length === 0) {
          <div class="p-12">
            <app-workora-empty-state 
              icon="verified_user" 
              title="No Audit Records Found"
              description="System change events will appear here once actions are performed or matching your filter."
            ></app-workora-empty-state>
          </div>
        } @else {
          <div class="workora-table-responsive">
            <table class="workora-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>IP Address</th>
                  <th class="text-right">Payload</th>
                </tr>
              </thead>
              <tbody>
                @for (log of logs(); track log.id) {
                  <tr class="hover:bg-[#F6FAF9]/80 transition-colors">
                    <!-- Timestamp -->
                    <td class="font-mono text-[11px] text-[#718686] font-semibold">
                      <div class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-[13px] text-slate-400">schedule</span>
                        <span>{{ log.timestamp | date:'yyyy-MM-dd HH:mm:ss' }}</span>
                      </div>
                    </td>

                    <!-- Actor Email -->
                    <td class="font-bold text-[#102A2A]">
                      <div class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm text-[#087F73]">account_circle</span>
                        <span>{{ log.actorEmail || 'System Process' }}</span>
                      </div>
                    </td>

                    <!-- Action Badge -->
                    <td>
                      <span 
                        [ngClass]="{
                          'bg-emerald-50 text-emerald-700 border-emerald-200': log.action.includes('Create') || log.action.includes('Add'),
                          'bg-blue-50 text-blue-700 border-blue-200': log.action.includes('Update') || log.action.includes('Transfer') || log.action.includes('Assign'),
                          'bg-rose-50 text-rose-700 border-rose-200': log.action.includes('Delete') || log.action.includes('Terminate') || log.action.includes('Remove'),
                          'bg-amber-50 text-amber-800 border-amber-200': log.action.includes('Reset') || log.action.includes('Deactivate')
                        }"
                        class="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold border inline-flex items-center gap-1 shadow-2xs">
                        <span class="material-symbols-outlined text-[12px]">
                          {{ (log.action.includes('Create') || log.action.includes('Add')) ? 'add_circle' : (log.action.includes('Delete') || log.action.includes('Remove')) ? 'delete' : 'edit' }}
                        </span>
                        <span>{{ log.action }}</span>
                      </span>
                    </td>

                    <!-- Entity -->
                    <td>
                      <div class="flex items-center gap-1 text-xs">
                        <span class="font-bold text-[#087F73]">{{ log.entityName }}</span>
                        @if (log.entityId) {
                          <span class="font-mono text-[10px] bg-[#EBF5F3] px-1.5 py-0.2 rounded font-semibold text-[#075E58]">#{{ log.entityId }}</span>
                        }
                      </div>
                    </td>

                    <!-- IP Address -->
                    <td class="font-mono text-[11px] text-[#718686]">
                      <span class="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 font-semibold">
                        {{ log.ipAddress || '127.0.0.1' }}
                      </span>
                    </td>

                    <!-- Diff Payload Button -->
                    <td class="text-right">
                      @if (log.oldValues || log.newValues) {
                        <button 
                          type="button" 
                          (click)="openDiffModal(log)"
                          class="px-2.5 py-1 rounded-lg bg-[#DDF7F2] hover:bg-[#087F73] text-[#087F73] hover:text-white text-[11px] font-bold transition-all cursor-pointer border border-[#087F73]/20 shadow-2xs inline-flex items-center gap-1">
                          <span class="material-symbols-outlined text-xs">difference</span>
                          <span>View Diff</span>
                        </button>
                      } @else {
                        <span class="text-slate-400 text-[11px]">—</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="p-4 sm:p-5 border-t border-[#DDE9E6] bg-[#F6FAF9]">
            <app-workora-pagination
              [pageNumber]="pageIndex()"
              [totalPages]="totalPages()"
              [totalCount]="totalLogs()"
              [pageSize]="pageSize"
              (pageChange)="onPageChange($event)"
            ></app-workora-pagination>
          </div>
        }
      </div>

      <!-- Diff Modal -->
      @if (selectedLog(); as log) {
        <div class="workora-modal-overlay" (click)="selectedLog.set(null)">
          <div class="workora-modal-card max-w-2xl" (click)="$event.stopPropagation()">
            <div class="workora-modal-header">
              <div>
                <h3 class="text-base font-extrabold text-[#102A2A] font-heading">
                  Payload State Change: {{ log.entityName }} #{{ log.entityId }}
                </h3>
                <p class="text-xs text-[#718686] mt-0.5">{{ log.action }} by {{ log.actorEmail || 'System' }}</p>
              </div>
              <button (click)="selectedLog.set(null)" class="text-slate-400 hover:text-[#102A2A] rounded-xl p-1.5 transition-colors border-none bg-transparent cursor-pointer">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div class="workora-modal-body space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span class="text-[10px] font-bold uppercase text-[#718686] block mb-1">Previous Values</span>
                  <pre class="p-3.5 bg-slate-900 text-slate-200 rounded-2xl text-[11px] font-mono overflow-auto max-h-60 custom-scrollbar">{{ formatJson(log.oldValues) }}</pre>
                </div>
                <div>
                  <span class="text-[10px] font-bold uppercase text-emerald-600 block mb-1">New Values</span>
                  <pre class="p-3.5 bg-slate-900 text-emerald-300 rounded-2xl text-[11px] font-mono overflow-auto max-h-60 custom-scrollbar">{{ formatJson(log.newValues) }}</pre>
                </div>
              </div>
            </div>

            <div class="workora-modal-footer">
              <button type="button" (click)="selectedLog.set(null)" class="workora-btn-secondary text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class AuditLogsPageComponent implements OnInit {
  private readonly auditRepo = inject(AuditLogApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly logs = signal<AuditLog[]>([]);
  readonly totalLogs = signal<number>(0);
  readonly pageIndex = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly isLoading = signal<boolean>(false);
  readonly pageSize = 12;

  searchTerm = '';
  selectedEntity?: string;
  selectedAction?: string;

  readonly entityOptions: WorkoraSelectOption<string>[] = [
    { value: 'Employee', label: 'Employee', icon: 'badge' },
    { value: 'User', label: 'User Account', icon: 'person' },
    { value: 'Role', label: 'Role & Permissions', icon: 'shield_person' },
    { value: 'Company', label: 'Organization', icon: 'corporate_fare' },
    { value: 'Department', label: 'Department', icon: 'domain' },
    { value: 'Branch', label: 'Branch', icon: 'store' },
    { value: 'PayrollRun', label: 'Payroll Run', icon: 'payments' },
    { value: 'Asset', label: 'Asset', icon: 'devices' }
  ];

  readonly actionOptions: WorkoraSelectOption<string>[] = [
    { value: 'Create', label: 'Create', icon: 'add_circle' },
    { value: 'Update', label: 'Update', icon: 'edit' },
    { value: 'Delete', label: 'Delete', icon: 'delete' },
    { value: 'Transfer', label: 'Transfer', icon: 'swap_horiz' },
    { value: 'Terminate', label: 'Terminate', icon: 'person_off' }
  ];

  readonly selectedLog = signal<AuditLog | null>(null);
  private searchDebounceTimer?: any;

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading.set(true);
    this.auditRepo.getAuditLogs({
      pageNumber: this.pageIndex(),
      pageSize: this.pageSize,
      searchTerm: this.searchTerm?.trim() || undefined,
      entityName: this.selectedEntity || undefined,
      action: this.selectedAction || undefined
    })
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: paged => {
        this.logs.set(paged.items || []);
        this.totalLogs.set(paged.totalCount || 0);
        this.totalPages.set(paged.totalPages || 1);
      },
      error: err => this.notificationService.showError(err.message || 'Failed to load audit logs.')
    });
  }

  onEntityChange(val: any): void {
    const entity = val !== null && val !== undefined && typeof val === 'object' && 'value' in val 
      ? val.value 
      : (val || undefined);
    this.selectedEntity = entity;
    this.pageIndex.set(1);
    this.loadLogs();
  }

  onActionChange(val: any): void {
    const action = val !== null && val !== undefined && typeof val === 'object' && 'value' in val 
      ? val.value 
      : (val || undefined);
    this.selectedAction = action;
    this.pageIndex.set(1);
    this.loadLogs();
  }

  onSearchChange(val: string): void {
    this.searchTerm = val || '';
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    if (!this.searchTerm.trim()) {
      this.pageIndex.set(1);
      this.loadLogs();
      return;
    }
    this.searchDebounceTimer = setTimeout(() => {
      this.pageIndex.set(1);
      this.loadLogs();
    }, 250);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.pageIndex.set(1);
    this.loadLogs();
  }

  resetAllFilters(): void {
    this.searchTerm = '';
    this.selectedEntity = undefined;
    this.selectedAction = undefined;
    this.pageIndex.set(1);
    this.loadLogs();
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.loadLogs();
  }

  openDiffModal(log: AuditLog): void {
    this.selectedLog.set(log);
  }

  formatJson(val?: string | null): string {
    if (!val) return 'None';
    try {
      return JSON.stringify(JSON.parse(val), null, 2);
    } catch {
      return val;
    }
  }

  onExportAuditLogs(): void {
    this.auditRepo.exportAuditLogs(1).subscribe({
      next: url => {
        window.open(url, '_blank');
        this.notificationService.showSuccess('Audit log exported.');
      },
      error: err => this.notificationService.showError(err.message || 'Failed to export audit logs.')
    });
  }
}
