import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { SuperAdminApiRepository } from '../../../../data/repositories/superadmin-api.repository';
import { TenantOrganization, SubscriptionPlan, SuperAdminMetrics, RegisterOrganizationParams } from '../../../../domain/models/superadmin.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { RegisterOrganizationModalComponent } from '../components/register-organization-modal.component';

@Component({
  selector: 'app-superadmin-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent,
    RegisterOrganizationModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
              <span class="material-symbols-outlined text-2xl">admin_panel_settings</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#102A2A] tracking-tight font-heading">
              Platform Super Admin Console
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-[#718686] mt-1 font-medium">
            Multi-tenant management, tenant organization provisioning, and platform operations oversight.
          </p>
        </div>

        <button 
          type="button" 
          (click)="openRegisterModal()"
          class="workora-btn-primary px-5 py-2.5 text-xs shadow-md">
          <span class="material-symbols-outlined text-base">domain_add</span>
          <span>Register Tenant Organization</span>
        </button>
      </div>

      <!-- Platform Global Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white p-5 rounded-3xl border border-[#DDE9E6] shadow-xs space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#718686]">Total Tenant Organizations</span>
          <p class="text-3xl font-extrabold text-[#102A2A] font-heading">{{ metrics()?.totalOrganizations ?? organizations().length }}</p>
          <p class="text-[11px] text-emerald-600 font-bold">{{ metrics()?.activeOrganizations ?? organizations().length }} Active Enterprises</p>
        </div>

        <div class="bg-white p-5 rounded-3xl border border-[#DDE9E6] shadow-xs space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#718686]">Total System Users</span>
          <p class="text-3xl font-extrabold text-[#087F73] font-heading">{{ (metrics()?.totalSystemUsers ?? 0) | number }}</p>
          <p class="text-[11px] text-[#718686]">Platform-wide user accounts</p>
        </div>

        <div class="bg-white p-5 rounded-3xl border border-[#DDE9E6] shadow-xs space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#718686]">Managed Employees</span>
          <p class="text-3xl font-extrabold text-[#102A2A] font-heading">{{ (metrics()?.totalEmployees ?? 0) | number }}</p>
          <p class="text-[11px] text-[#718686]">Active tenant personnel</p>
        </div>

        <div class="bg-white p-5 rounded-3xl border border-[#DDE9E6] shadow-xs space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#718686]">Subscription Plans</span>
          <p class="text-3xl font-extrabold text-purple-700 font-heading">{{ plans().length || 3 }}</p>
          <p class="text-[11px] text-[#718686]">Starter, Growth, Enterprise</p>
        </div>
      </div>

      <!-- Tenant Organizations Table -->
      <div class="bg-white rounded-3xl border border-[#DDE9E6] shadow-xs overflow-hidden">
        <div class="p-5 border-b border-[#DDE9E6] flex items-center justify-between">
          <h3 class="text-sm font-extrabold text-[#102A2A]">Provisioned Tenant Organizations</h3>
          <span class="text-xs font-bold text-[#718686]">{{ organizations().length }} Registered</span>
        </div>

        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="4"></app-workora-skeleton>
          </div>
        } @else if (organizations().length === 0) {
          <div class="p-8">
            <app-workora-empty-state
              title="No Tenant Organizations Yet"
              description="Click 'Register Tenant Organization' above to onboard your first enterprise customer."
              actionLabel="Register Tenant Organization"
              actionIcon="domain_add"
              (actionClicked)="openRegisterModal()">
            </app-workora-empty-state>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F6FAF9] border-b border-[#DDE9E6] text-[11px] font-extrabold uppercase tracking-wider text-[#405656]">
                  <th class="py-3.5 px-5">Organization</th>
                  <th class="py-3.5 px-4">Code</th>
                  <th class="py-3.5 px-4">Email</th>
                  <th class="py-3.5 px-4">Phone</th>
                  <th class="py-3.5 px-4">Currency</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DDE9E6]/70">
                @for (org of organizations(); track org.id) {
                  <tr class="hover:bg-[#F6FAF9]/60 transition-colors">
                    <td class="py-3.5 px-5 font-bold text-[#102A2A]">
                      <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-xl bg-[#DDF7F2] text-[#087F73] font-bold text-xs flex items-center justify-center shadow-2xs">
                          {{ org.code ? org.code.substring(0, 2).toUpperCase() : 'OR' }}
                        </div>
                        <div>
                          <div class="font-bold text-[#102A2A]">{{ org.name }}</div>
                          <div class="text-[10px] text-[#718686]">{{ org.website || 'No website' }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 font-mono font-bold text-[#087F73]">{{ org.code }}</td>
                    <td class="py-3.5 px-4 font-mono text-[#405656]">{{ org.email || '-' }}</td>
                    <td class="py-3.5 px-4 text-[#405656]">{{ org.phone || '-' }}</td>
                    <td class="py-3.5 px-4 font-bold text-[#405656]">{{ org.currency }}</td>
                    <td class="py-3.5 px-4">
                      <span 
                        [ngClass]="org.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border">
                        {{ org.isActive ? 'Active' : 'Suspended' }}
                      </span>
                    </td>
                    <td class="py-3.5 px-5 text-right">
                      @if (org.isActive) {
                        <button 
                          type="button" 
                          (click)="onSuspendOrg(org.id)"
                          class="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition-all border border-rose-200 cursor-pointer">
                          Suspend
                        </button>
                      } @else {
                        <button 
                          type="button" 
                          (click)="onReactivateOrg(org.id)"
                          class="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-all border border-emerald-200 cursor-pointer">
                          Reactivate
                        </button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Register Org Modal (Teleported to body) -->
      @if (isRegisterModalOpen()) {
        <app-register-organization-modal
          [isSubmitting]="isSubmitting()"
          (save)="onSaveOrg($event)"
          (cancel)="isRegisterModalOpen.set(false)"
        ></app-register-organization-modal>
      }

    </div>
  `
})
export class SuperAdminPageComponent implements OnInit {
  private readonly superAdminRepo = inject(SuperAdminApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly organizations = signal<TenantOrganization[]>([]);
  readonly plans = signal<SubscriptionPlan[]>([]);
  readonly metrics = signal<SuperAdminMetrics | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly isRegisterModalOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.loadData();
  }

  openRegisterModal(): void {
    this.isRegisterModalOpen.set(true);
  }

  loadData(): void {
    this.isLoading.set(true);
    this.superAdminRepo.getOrganizations(1, 20)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: p => this.organizations.set(p.items),
        error: () => {}
      });

    this.superAdminRepo.getPlans().subscribe({
      next: p => this.plans.set(p),
      error: () => {}
    });

    this.superAdminRepo.getMetrics().subscribe({
      next: m => this.metrics.set(m),
      error: () => {}
    });
  }

  onSaveOrg(payload: RegisterOrganizationParams): void {
    this.isSubmitting.set(true);
    this.superAdminRepo.registerOrganization(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.isRegisterModalOpen.set(false);
          this.notificationService.showSuccess('Tenant organization provisioned successfully.');
          this.loadData();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to register organization.')
      });
  }

  onSuspendOrg(id: number): void {
    this.superAdminRepo.suspendOrganization(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Organization suspended.');
        this.loadData();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to suspend organization.')
    });
  }

  onReactivateOrg(id: number): void {
    this.superAdminRepo.reactivateOrganization(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Organization reactivated.');
        this.loadData();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to reactivate organization.')
    });
  }
}
