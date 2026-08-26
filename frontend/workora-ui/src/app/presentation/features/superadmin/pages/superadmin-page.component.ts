import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { SuperAdminApiRepository } from '../../../../data/repositories/superadmin-api.repository';
import { TenantOrganization, SubscriptionPlan, SuperAdminMetrics, RegisterOrganizationParams } from '../../../../domain/models/superadmin.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';

@Component({
  selector: 'app-superadmin-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkoraSkeletonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-purple-50 text-purple-700">
              <span class="material-symbols-outlined text-2xl">admin_panel_settings</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Platform Super Admin Console
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Multi-tenant management, organization provisioning, and platform MRR oversight.
          </p>
        </div>

        <button 
          type="button" 
          (click)="isRegisterModalOpen.set(true)"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
          <span class="material-symbols-outlined text-base">domain_add</span>
          <span>Register Tenant Organization</span>
        </button>
      </div>

      <!-- Platform Global Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white p-5 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Tenant Organizations</span>
          <p class="text-3xl font-extrabold text-[#063B39] font-heading">{{ metrics()?.totalOrganizations || 12 }}</p>
          <p class="text-[11px] text-emerald-600 font-bold">{{ metrics()?.activeOrganizations || 11 }} Active Enterprises</p>
        </div>

        <div class="bg-white p-5 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Recurring Revenue</span>
          <p class="text-3xl font-extrabold text-[#0E6E68] font-heading">\${{ (metrics()?.monthlyRecurringRevenue || 14850) | number }}</p>
          <p class="text-[11px] text-slate-500">Tier billing active</p>
        </div>

        <div class="bg-white p-5 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Subscribed Employees</span>
          <p class="text-3xl font-extrabold text-[#063B39] font-heading">{{ metrics()?.totalSubscribedUsers || 1420 | number }}</p>
          <p class="text-[11px] text-slate-500">Across all tenant branches</p>
        </div>

        <div class="bg-white p-5 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subscription Plans</span>
          <p class="text-3xl font-extrabold text-purple-700 font-heading">{{ plans().length || 3 }}</p>
          <p class="text-[11px] text-slate-500">Starter, Growth, Enterprise</p>
        </div>
      </div>

      <!-- Tenant Organizations Table -->
      <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden">
        <div class="p-5 border-b border-[#DCEBE7] flex items-center justify-between">
          <h3 class="text-sm font-extrabold text-[#063B39]">Provisioned Tenant Organizations</h3>
        </div>

        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="4"></app-workora-skeleton>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                  <th class="py-3.5 px-5">Organization</th>
                  <th class="py-3.5 px-4">Subdomain</th>
                  <th class="py-3.5 px-4">Admin Email</th>
                  <th class="py-3.5 px-4">Subscription Plan</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DCEBE7]/70">
                @for (org of organizations(); track org.id) {
                  <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                    <td class="py-3.5 px-5 font-bold text-[#063B39]">{{ org.name }}</td>
                    <td class="py-3.5 px-4 font-mono text-slate-600">{{ org.subdomain }}.workora.com</td>
                    <td class="py-3.5 px-4 font-mono text-slate-500">{{ org.adminEmail }}</td>
                    <td class="py-3.5 px-4 font-semibold text-purple-700">{{ org.subscriptionPlanName || 'Enterprise' }}</td>
                    <td class="py-3.5 px-4">
                      <span 
                        [ngClass]="org.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                        class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border">
                        {{ org.status }}
                      </span>
                    </td>
                    <td class="py-3.5 px-5 text-right">
                      @if (org.status === 'Active') {
                        <button 
                          type="button" 
                          (click)="onSuspendOrg(org.id)"
                          class="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition-all border-none cursor-pointer">
                          Suspend
                        </button>
                      } @else {
                        <button 
                          type="button" 
                          (click)="onReactivateOrg(org.id)"
                          class="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-all border-none cursor-pointer">
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

      <!-- Register Org Modal -->
      @if (isRegisterModalOpen()) {
        <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">Register Tenant</h3>
              <button type="button" (click)="isRegisterModalOpen.set(false)" class="text-slate-400 border-none bg-transparent cursor-pointer">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <form [formGroup]="orgForm" (ngSubmit)="onSaveOrg()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-[#063B39] mb-1">Company Name *</label>
                <input type="text" formControlName="name" class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs rounded-xl border border-[#DCEBE7] outline-none" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Slug *</label>
                  <input type="text" formControlName="slug" class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs rounded-xl border border-[#DCEBE7] outline-none" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Subdomain *</label>
                  <input type="text" formControlName="subdomain" class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs rounded-xl border border-[#DCEBE7] outline-none" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-[#063B39] mb-1">Admin Email *</label>
                <input type="email" formControlName="adminEmail" class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs rounded-xl border border-[#DCEBE7] outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-[#063B39] mb-1">Subscription Plan</label>
                <select formControlName="subscriptionPlanId" class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs rounded-xl border border-[#DCEBE7] outline-none">
                  @for (p of plans(); track p.id) {
                    <option [ngValue]="p.id">{{ p.name }} - \${{ p.monthlyPrice }}/mo</option>
                  }
                </select>
              </div>
              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#DCEBE7]">
                <button type="button" (click)="isRegisterModalOpen.set(false)" class="px-4 py-2 text-xs font-bold text-slate-600 border-none bg-transparent cursor-pointer">Cancel</button>
                <button type="submit" [disabled]="orgForm.invalid" class="px-5 py-2.5 rounded-xl bg-[#0E6E68] text-white text-xs font-bold border-none cursor-pointer">Provision Organization</button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class SuperAdminPageComponent implements OnInit {
  private readonly superAdminRepo = inject(SuperAdminApiRepository);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly organizations = signal<TenantOrganization[]>([]);
  readonly plans = signal<SubscriptionPlan[]>([]);
  readonly metrics = signal<SuperAdminMetrics | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly isRegisterModalOpen = signal<boolean>(false);

  readonly orgForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    slug: ['acme-corp', [Validators.required]],
    subdomain: ['acme', [Validators.required]],
    adminEmail: ['admin@acme.com', [Validators.required, Validators.email]],
    subscriptionPlanId: [1, [Validators.required]]
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.superAdminRepo.getOrganizations(1, 20)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: p => this.organizations.set(p.items),
        error: () => {}
      });

    this.superAdminRepo.getPlans().subscribe(p => {
      this.plans.set(p);
      if (p.length > 0) this.orgForm.patchValue({ subscriptionPlanId: p[0].id });
    });

    this.superAdminRepo.getMetrics().subscribe(m => this.metrics.set(m));
  }

  onSaveOrg(): void {
    if (this.orgForm.invalid) return;
    this.superAdminRepo.registerOrganization(this.orgForm.value).subscribe({
      next: () => {
        this.isRegisterModalOpen.set(false);
        this.notificationService.showSuccess('Tenant organization provisioned.');
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
