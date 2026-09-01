import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { SuperAdminApiRepository } from '../../../../data/repositories/superadmin-api.repository';
import { TenantOrganization, SubscriptionPlan, SuperAdminMetrics } from '../../../../domain/models/superadmin.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraConfirmDialogComponent } from '../../../shared/components/workora-confirm-dialog.component';

@Component({
  selector: 'app-superadmin-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent,
    WorkoraConfirmDialogComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-5 sm:space-y-6 w-full">
      
      <!-- Top Navigation & Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs text-[#087F73] font-semibold mb-1">
            <a routerLink="/dashboard" class="hover:text-[#063B39] transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">dashboard</span>
              <span>Dashboard</span>
            </a>
            <span class="text-slate-400">/</span>
            <span class="text-[#102A2A] font-bold">Platform Console</span>
          </div>

          <div class="flex items-center gap-2.5">
            <div class="p-2.5 rounded-2xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center shrink-0 shadow-xs">
              <span class="material-symbols-outlined text-2xl">admin_panel_settings</span>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#102A2A] tracking-tight font-heading">
                Platform Super Admin Console
              </h1>
              <p class="text-xs sm:text-sm text-[#718686] mt-0.5 font-medium">
                Multi-tenant operations, global metrics, and SaaS subscription tiers.
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <a 
            routerLink="/organization"
            class="workora-btn-primary text-xs shadow-md flex items-center gap-2 text-decoration-none">
            <span class="material-symbols-outlined text-base">domain_add</span>
            <span>Manage Organizations</span>
          </a>
        </div>
      </div>

      <!-- Platform Global Metrics (4 Equal Height Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        <!-- Total Tenants -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-[#087F73] flex flex-col justify-between min-h-[116px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Total Tenants</span>
            <span class="w-9 h-9 rounded-xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">domain</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-[#102A2A] font-heading leading-tight my-0.5">{{ metrics()?.totalOrganizations ?? organizations().length }}</p>
            <p class="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{{ metrics()?.activeOrganizations ?? organizations().length }} Active Workspaces</span>
            </p>
          </div>
        </div>

        <!-- Platform Accounts -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-blue-500 flex flex-col justify-between min-h-[116px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Platform Accounts</span>
            <span class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">manage_accounts</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-blue-700 font-heading leading-tight my-0.5">{{ (metrics()?.totalSystemUsers ?? 0) | number }}</p>
            <p class="text-[11px] text-[#718686] font-medium">System user identities</p>
          </div>
        </div>

        <!-- Enrolled Personnel -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-[#16A085] flex flex-col justify-between min-h-[116px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Enrolled Personnel</span>
            <span class="w-9 h-9 rounded-xl bg-teal-50 text-[#16A085] flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">groups</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-[#16A085] font-heading leading-tight my-0.5">{{ (metrics()?.totalEmployees ?? 0) | number }}</p>
            <p class="text-[11px] text-[#718686] font-medium">Across all tenant companies</p>
          </div>
        </div>

        <!-- SaaS License Tiers -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-purple-500 flex flex-col justify-between min-h-[116px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">SaaS License Tiers</span>
            <span class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">stars</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-purple-700 font-heading leading-tight my-0.5">{{ plans().length || 3 }}</p>
            <p class="text-[11px] text-purple-600 font-bold">Starter, Growth &amp; Enterprise</p>
          </div>
        </div>

      </div>

      <!-- SaaS Subscription Tier Showcase -->
      <div class="workora-card p-6 bg-white space-y-4">
        <div class="flex items-center justify-between border-b border-[#DDE9E6] pb-3.5">
          <div>
            <h3 class="text-base font-extrabold text-[#102A2A] font-heading">
              SaaS Subscription Plans &amp; License Packages
            </h3>
            <p class="text-xs text-[#718686] mt-0.5">
              Configured enterprise multi-tenant tiers with statutory compliance modules.
            </p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
            Platform Standard
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <!-- Starter Tier -->
          <div class="p-5 rounded-2xl bg-[#F6FAF9] border border-[#DDE9E6] space-y-3 relative hover:border-[#087F73]/40 transition-colors">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-[#718686]">Starter Tier</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">Base</span>
            </div>
            <div>
              <p class="text-2xl font-extrabold text-[#102A2A] font-heading">₹4,999<span class="text-xs font-normal text-[#718686]"> / month</span></p>
              <p class="text-[11px] text-[#718686]">Ideal for small businesses up to 50 employees.</p>
            </div>
            <ul class="space-y-1.5 text-xs text-[#405656] pt-2 border-t border-[#DDE9E6]/60">
              <li class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm text-emerald-600">check</span> 1 Physical Branch</li>
              <li class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm text-emerald-600">check</span> Basic Leave &amp; Attendance</li>
              <li class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm text-emerald-600">check</span> Automated Salary Slips</li>
            </ul>
          </div>

          <!-- Growth Tier (Recommended) -->
          <div class="p-5 rounded-2xl bg-gradient-to-b from-[#F0FAF8] to-white border-2 border-[#087F73] space-y-3 relative shadow-xs">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-wider text-[#087F73]">Growth Tier</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#087F73] text-white">Popular</span>
            </div>
            <div>
              <p class="text-2xl font-extrabold text-[#102A2A] font-heading">₹14,999<span class="text-xs font-normal text-[#718686]"> / month</span></p>
              <p class="text-[11px] text-[#718686]">Complete multi-branch enterprise workforce.</p>
            </div>
            <ul class="space-y-1.5 text-xs text-[#405656] pt-2 border-t border-[#DDE9E6]/60">
              <li class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm text-emerald-600">check</span> Up to 250 Employees</li>
              <li class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm text-emerald-600">check</span> Multi-Branch Hierarchy</li>
              <li class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm text-emerald-600">check</span> Statutory PF, ESIC, PT &amp; TDS</li>
            </ul>
          </div>

          <!-- Enterprise Tier -->
          <div class="p-5 rounded-2xl bg-[#F6FAF9] border border-[#DDE9E6] space-y-3 relative hover:border-[#087F73]/40 transition-colors">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-purple-700">Enterprise Tier</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Custom</span>
            </div>
            <div>
              <p class="text-2xl font-extrabold text-purple-900 font-heading">₹39,999<span class="text-xs font-normal text-[#718686]"> / month</span></p>
              <p class="text-[11px] text-[#718686]">Unlimited scale with dedicated tenant clusters.</p>
            </div>
            <ul class="space-y-1.5 text-xs text-[#405656] pt-2 border-t border-[#DDE9E6]/60">
              <li class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm text-emerald-600">check</span> Unlimited Employees &amp; Branches</li>
              <li class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm text-emerald-600">check</span> Custom Statutory Challans</li>
              <li class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm text-emerald-600">check</span> 24/7 Dedicated Support SLA</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Provisioned Tenant Organizations Table -->
      <div class="workora-card overflow-hidden bg-white">
        <div class="p-5 border-b border-[#DDE9E6] flex items-center justify-between">
          <div>
            <h3 class="text-sm font-extrabold text-[#102A2A]">Provisioned Tenant Organizations</h3>
            <p class="text-[11px] text-[#718686]">Click any tenant to view dedicated profile, branches, and staff.</p>
          </div>
          <a routerLink="/organization" class="text-xs font-bold text-[#087F73] hover:underline flex items-center gap-1">
            <span>View in Organizations</span>
            <span class="material-symbols-outlined text-xs">arrow_forward</span>
          </a>
        </div>

        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="4"></app-workora-skeleton>
          </div>
        } @else if (organizations().length === 0) {
          <div class="p-8">
            <app-workora-empty-state
              title="No Tenant Organizations Yet"
              description="Navigate to Organizations to register and configure your first enterprise client."
              actionLabel="Go to Organizations"
              actionIcon="domain"
              (actionClicked)="goToOrganizations()">
            </app-workora-empty-state>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F6FAF9] border-b border-[#DDE9E6] text-[11px] font-extrabold uppercase tracking-wider text-[#102A2A]">
                  <th class="py-3.5 px-5">Organization</th>
                  <th class="py-3.5 px-4">Code</th>
                  <th class="py-3.5 px-4">Admin Email</th>
                  <th class="py-3.5 px-4">Phone</th>
                  <th class="py-3.5 px-4">Currency</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DDE9E6]/70">
                @for (org of organizations(); track org.id) {
                  <tr class="hover:bg-[#F6FAF9]/70 transition-colors">
                    <td class="py-3.5 px-5 font-bold text-[#102A2A]">
                      <a [routerLink]="['/organization', org.id]" class="flex items-center gap-2.5 text-decoration-none group">
                        <div class="w-8 h-8 rounded-xl bg-[#DDF7F2] text-[#087F73] font-bold text-xs flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                          {{ org.code ? org.code.substring(0, 2).toUpperCase() : 'OR' }}
                        </div>
                        <div>
                          <div class="font-bold text-[#102A2A] group-hover:text-[#087F73] transition-colors">{{ org.name }}</div>
                          <div class="text-[10px] text-[#718686] font-normal">{{ org.website || 'No website registered' }}</div>
                        </div>
                      </a>
                    </td>
                    <td class="py-3.5 px-4 font-mono font-bold text-[#087F73]">{{ org.code }}</td>
                    <td class="py-3.5 px-4 font-mono text-[#405656]">{{ org.email || '-' }}</td>
                    <td class="py-3.5 px-4 text-[#405656]">{{ org.phone || '-' }}</td>
                    <td class="py-3.5 px-4 font-bold text-[#405656]">{{ org.currency }}</td>
                    <td class="py-3.5 px-4">
                      <span 
                        [ngClass]="org.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border inline-flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full" [ngClass]="org.isActive ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                        <span>{{ org.isActive ? 'Active' : 'Suspended' }}</span>
                      </span>
                    </td>
                    <td class="py-3.5 px-5 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <a 
                          [routerLink]="['/organization', org.id]"
                          class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#DDF7F2] text-[#405656] hover:text-[#075E58] text-[11px] font-bold transition-colors text-decoration-none">
                          Manage
                        </a>

                        @if (org.isActive) {
                          <button 
                            type="button" 
                            (click)="requestSuspend(org)"
                            class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition-all border border-rose-200 cursor-pointer">
                            Suspend
                          </button>
                        } @else {
                          <button 
                            type="button" 
                            (click)="requestReactivate(org)"
                            class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-all border border-emerald-200 cursor-pointer">
                            Reactivate
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Confirmation Dialog -->
      @if (pendingActionOrg()) {
        <app-workora-confirm-dialog
          [isOpen]="true"
          [title]="dialogTitle()"
          [message]="dialogMessage()"
          [confirmText]="dialogConfirmText()"
          [variant]="dialogVariant()"
          [isLoading]="isProcessingAction()"
          (cancel)="pendingActionOrg.set(null)"
          (confirm)="confirmOrgAction()">
        </app-workora-confirm-dialog>
      }

    </div>
  `
})
export class SuperAdminPageComponent implements OnInit {
  private readonly superAdminRepo = inject(SuperAdminApiRepository);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly organizations = signal<TenantOrganization[]>([]);
  readonly plans = signal<SubscriptionPlan[]>([]);
  readonly metrics = signal<SuperAdminMetrics | null>(null);
  readonly isLoading = signal<boolean>(false);

  readonly pendingActionOrg = signal<TenantOrganization | null>(null);
  readonly actionType = signal<'suspend' | 'reactivate'>('suspend');
  readonly isProcessingAction = signal<boolean>(false);

  readonly dialogTitle = signal<string>('');
  readonly dialogMessage = signal<string>('');
  readonly dialogConfirmText = signal<string>('');
  readonly dialogVariant = signal<'danger' | 'info'>('danger');

  ngOnInit(): void {
    this.loadData();
  }

  goToOrganizations(): void {
    this.router.navigate(['/organization']);
  }

  loadData(): void {
    this.isLoading.set(true);
    this.superAdminRepo.getOrganizations(1, 50)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: p => this.organizations.set(p.items || []),
        error: () => this.organizations.set([])
      });

    this.superAdminRepo.getPlans().subscribe({
      next: p => this.plans.set(p || []),
      error: () => {}
    });

    this.superAdminRepo.getMetrics().subscribe({
      next: m => this.metrics.set(m),
      error: () => {}
    });
  }

  requestSuspend(org: TenantOrganization): void {
    this.pendingActionOrg.set(org);
    this.actionType.set('suspend');
    this.dialogTitle.set(`Suspend ${org.name}?`);
    this.dialogMessage.set(`Are you sure you want to suspend "${org.name}" (${org.code})? Tenant users will be blocked from signing in.`);
    this.dialogConfirmText.set('Suspend Organization');
    this.dialogVariant.set('danger');
  }

  requestReactivate(org: TenantOrganization): void {
    this.pendingActionOrg.set(org);
    this.actionType.set('reactivate');
    this.dialogTitle.set(`Reactivate ${org.name}?`);
    this.dialogMessage.set(`Reactivate "${org.name}"? Full system permissions and workspace access will be restored.`);
    this.dialogConfirmText.set('Reactivate Organization');
    this.dialogVariant.set('info');
  }

  confirmOrgAction(): void {
    const org = this.pendingActionOrg();
    if (!org) return;

    this.isProcessingAction.set(true);
    const type = this.actionType();

    if (type === 'suspend') {
      this.superAdminRepo.suspendOrganization(org.id)
        .pipe(finalize(() => {
          this.isProcessingAction.set(false);
          this.pendingActionOrg.set(null);
        }))
        .subscribe({
          next: () => {
            this.notificationService.success(`Organization "${org.name}" suspended.`);
            this.loadData();
          },
          error: err => this.notificationService.error(err.message || 'Failed to suspend organization.')
        });
    } else {
      this.superAdminRepo.reactivateOrganization(org.id)
        .pipe(finalize(() => {
          this.isProcessingAction.set(false);
          this.pendingActionOrg.set(null);
        }))
        .subscribe({
          next: () => {
            this.notificationService.success(`Organization "${org.name}" reactivated.`);
            this.loadData();
          },
          error: err => this.notificationService.error(err.message || 'Failed to reactivate organization.')
        });
    }
  }
}
