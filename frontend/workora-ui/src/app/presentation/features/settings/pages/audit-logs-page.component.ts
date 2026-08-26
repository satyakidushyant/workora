import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuditLogApiRepository } from '../../../../data/repositories/audit-log-api.repository';
import { AuditLog } from '../../../../domain/models/audit-log.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';

@Component({
  selector: 'app-audit-logs-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraEmptyStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">policy</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Security &amp; Audit Trail
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Immutable activity log capturing system state changes, authorization events, and IP addresses.
          </p>
        </div>

        <button 
          type="button" 
          (click)="onExportAuditLogs()"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-[#DCEBE7] transition-all shadow-2xs cursor-pointer">
          <span class="material-symbols-outlined text-base text-[#0E6E68]">file_download</span>
          <span>Export Audit Log</span>
        </button>
      </div>

      <!-- Controls -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DCEBE7] shadow-2xs">
        <div class="relative flex-1 max-w-md">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="onSearch()"
            placeholder="Search by actor email, entity name, or action..."
            class="w-full pl-9 pr-4 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
          />
        </div>

        <div class="flex items-center gap-2.5">
          <select 
            [(ngModel)]="selectedEntity" 
            (ngModelChange)="loadLogs()"
            class="px-3.5 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
            <option [ngValue]="undefined">All Entities</option>
            <option value="Employee">Employee</option>
            <option value="Role">Role &amp; Permissions</option>
            <option value="Department">Department</option>
            <option value="PayrollRun">Payroll Run</option>
            <option value="Asset">Asset</option>
          </select>

          <select 
            [(ngModel)]="selectedAction" 
            (ngModelChange)="loadLogs()"
            class="px-3.5 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
            <option [ngValue]="undefined">All Actions</option>
            <option value="Create">Create</option>
            <option value="Update">Update</option>
            <option value="Delete">Delete</option>
            <option value="Transfer">Transfer</option>
            <option value="Terminate">Terminate</option>
          </select>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden">
        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="6"></app-workora-skeleton>
          </div>
        } @else if (logs().length === 0) {
          <div class="p-12">
            <app-workora-empty-state 
              icon="verified_user" 
              title="No Audit Records Found"
              description="System change events will appear here once actions are performed."
            ></app-workora-empty-state>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                  <th class="py-3.5 px-5">Timestamp</th>
                  <th class="py-3.5 px-4">Actor</th>
                  <th class="py-3.5 px-4">Action</th>
                  <th class="py-3.5 px-4">Entity</th>
                  <th class="py-3.5 px-4">IP Address</th>
                  <th class="py-3.5 px-5 text-right">Payload</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DCEBE7]/70">
                @for (log of logs(); track log.id) {
                  <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                    <td class="py-3.5 px-5 font-mono text-[11px] text-slate-500">
                      {{ log.timestamp | date:'yyyy-MM-dd HH:mm:ss' }}
                    </td>
                    <td class="py-3.5 px-4 font-bold text-[#063B39]">
                      {{ log.actorEmail || 'System Process' }}
                    </td>
                    <td class="py-3.5 px-4">
                      <span 
                        [ngClass]="{
                          'bg-emerald-50 text-emerald-700 border-emerald-200': log.action.includes('Create') || log.action.includes('Add'),
                          'bg-blue-50 text-blue-700 border-blue-200': log.action.includes('Update') || log.action.includes('Transfer'),
                          'bg-rose-50 text-rose-700 border-rose-200': log.action.includes('Delete') || log.action.includes('Terminate')
                        }"
                        class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border">
                        {{ log.action }}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 font-bold text-[#0E6E68]">
                      {{ log.entityName }} #{{ log.entityId || '—' }}
                    </td>
                    <td class="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {{ log.ipAddress || '127.0.0.1' }}
                    </td>
                    <td class="py-3.5 px-5 text-right">
                      @if (log.oldValues || log.newValues) {
                        <button 
                          type="button" 
                          (click)="openDiffModal(log)"
                          class="px-2.5 py-1 rounded-lg bg-[#0E6E68]/10 text-[#0E6E68] hover:bg-[#0E6E68] hover:text-white text-[11px] font-bold transition-all cursor-pointer border-none">
                          View Diff
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

          <div class="p-4 border-t border-[#DCEBE7]">
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
        <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl border border-[#DCEBE7] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
              <div>
                <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                  Payload State Change: {{ log.entityName }} #{{ log.entityId }}
                </h3>
                <p class="text-xs text-slate-500">{{ log.action }} by {{ log.actorEmail || 'System' }}</p>
              </div>
              <button (click)="selectedLog.set(null)" class="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span class="text-[10px] font-bold uppercase text-slate-400 block mb-1">Previous Values</span>
                <pre class="p-3.5 bg-slate-900 text-slate-200 rounded-2xl text-[11px] font-mono overflow-auto max-h-60">{{ formatJson(log.oldValues) }}</pre>
              </div>
              <div>
                <span class="text-[10px] font-bold uppercase text-slate-400 block mb-1">New Values</span>
                <pre class="p-3.5 bg-slate-900 text-emerald-300 rounded-2xl text-[11px] font-mono overflow-auto max-h-60">{{ formatJson(log.newValues) }}</pre>
              </div>
            </div>

            <div class="flex items-center justify-end pt-3 border-t border-[#DCEBE7]">
              <button type="button" (click)="selectedLog.set(null)" class="px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border-none bg-transparent">
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

  readonly selectedLog = signal<AuditLog | null>(null);

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading.set(true);
    this.auditRepo.getAuditLogs({
      pageNumber: this.pageIndex(),
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      entityName: this.selectedEntity,
      action: this.selectedAction
    })
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: paged => {
        this.logs.set(paged.items);
        this.totalLogs.set(paged.totalCount);
        this.totalPages.set(paged.totalPages);
      },
      error: err => this.notificationService.showError(err.message || 'Failed to load audit logs.')
    });
  }

  onSearch(): void {
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
