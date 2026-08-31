import { Component, OnInit, inject, signal, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { SuperAdminApiRepository } from '../../../../data/repositories/superadmin-api.repository';
import { TenantOrganization, SubscriptionPlan, SuperAdminMetrics } from '../../../../domain/models/superadmin.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

@Component({
  selector: 'app-superadmin-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent,
    WorkoraSelectComponent
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
            Multi-tenant management, tenant organization provisioning, and platform operations oversight.
          </p>
        </div>

        <button 
          type="button" 
          (click)="openRegisterModal()"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
          <span class="material-symbols-outlined text-base">domain_add</span>
          <span>Register Tenant Organization</span>
        </button>
      </div>

      <!-- Platform Global Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white p-5 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Tenant Organizations</span>
          <p class="text-3xl font-extrabold text-[#063B39] font-heading">{{ metrics()?.totalOrganizations ?? organizations().length }}</p>
          <p class="text-[11px] text-emerald-600 font-bold">{{ metrics()?.activeOrganizations ?? organizations().length }} Active Enterprises</p>
        </div>

        <div class="bg-white p-5 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total System Users</span>
          <p class="text-3xl font-extrabold text-[#0E6E68] font-heading">{{ (metrics()?.totalSystemUsers ?? 0) | number }}</p>
          <p class="text-[11px] text-slate-500">Platform-wide user accounts</p>
        </div>

        <div class="bg-white p-5 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Managed Employees</span>
          <p class="text-3xl font-extrabold text-[#063B39] font-heading">{{ (metrics()?.totalEmployees ?? 0) | number }}</p>
          <p class="text-[11px] text-slate-500">Active tenant personnel</p>
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
          <span class="text-xs font-bold text-slate-500">{{ organizations().length }} Registered</span>
        </div>

        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="4"></app-workora-skeleton>
          </div>
        } @else if (organizations().length === 0) {
          <div class="p-8">
            <app-workora-empty-state
              title="No Tenant Organizations Yet"
              description="Click 'Register Tenant Organization' above to onboard your first enterprise customer.">
            </app-workora-empty-state>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                  <th class="py-3.5 px-5">Organization</th>
                  <th class="py-3.5 px-4">Code</th>
                  <th class="py-3.5 px-4">Email</th>
                  <th class="py-3.5 px-4">Phone</th>
                  <th class="py-3.5 px-4">Currency</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DCEBE7]/70">
                @for (org of organizations(); track org.id) {
                  <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                    <td class="py-3.5 px-5 font-bold text-[#063B39]">
                      <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-lg bg-[#DCEBE7] text-[#0E6E68] font-bold text-xs flex items-center justify-center">
                          {{ org.code ? org.code.substring(0, 2).toUpperCase() : 'OR' }}
                        </div>
                        <div>
                          <div class="font-bold text-[#063B39]">{{ org.name }}</div>
                          <div class="text-[10px] text-slate-400">{{ org.website || 'No website' }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 font-mono font-bold text-[#0E6E68]">{{ org.code }}</td>
                    <td class="py-3.5 px-4 font-mono text-slate-600">{{ org.email || '-' }}</td>
                    <td class="py-3.5 px-4 text-slate-600">{{ org.phone || '-' }}</td>
                    <td class="py-3.5 px-4 font-bold text-slate-600">{{ org.currency }}</td>
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
        <div class="workora-modal-overlay" (click)="isRegisterModalOpen.set(false)">
          <div class="workora-modal-card max-w-lg" (click)="$event.stopPropagation()">
            <div class="workora-modal-header">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined">domain_add</span>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-[#063B39] font-heading">Register Tenant Organization</h3>
                  <p class="text-xs text-slate-500">Provision a new enterprise tenant company profile</p>
                </div>
              </div>
              <button 
                type="button" 
                (click)="isRegisterModalOpen.set(false)" 
                class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form [formGroup]="orgForm" (ngSubmit)="onSaveOrg()" class="flex flex-col flex-1 overflow-hidden">
              <div class="workora-modal-body space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="sm:col-span-2">
                    <label class="workora-label">Company Legal Name <span class="text-rose-500">*</span></label>
                    <input type="text" formControlName="name" placeholder="e.g. Acme Technologies India Pvt Ltd" class="workora-input !py-2.5" />
                  </div>

                  <div>
                    <label class="workora-label">Company Code / Subdomain <span class="text-rose-500">*</span></label>
                    <input type="text" formControlName="code" placeholder="e.g. ACMETECH" class="workora-input !py-2.5 uppercase font-mono" />
                  </div>

                  <div>
                    <label class="workora-label">Base Currency <span class="text-rose-500">*</span></label>
                    <app-workora-select
                      formControlName="currency"
                      [options]="currencyOptions"
                      placeholder="Select Currency"
                      icon="payments"
                    ></app-workora-select>
                  </div>

                  <div>
                    <label class="workora-label">Primary Admin Email</label>
                    <input type="email" formControlName="email" placeholder="admin@company.com" class="workora-input !py-2.5" />
                  </div>

                  <div>
                    <label class="workora-label">Phone Number</label>
                    <input type="tel" formControlName="phone" placeholder="+91 98765 43210" class="workora-input !py-2.5" />
                  </div>

                  <div class="sm:col-span-2">
                    <label class="workora-label">Corporate Website</label>
                    <input type="url" formControlName="website" placeholder="https://company.com" class="workora-input !py-2.5" />
                  </div>
                </div>
              </div>

              <div class="workora-modal-footer">
                <button type="button" (click)="isRegisterModalOpen.set(false)" class="workora-btn-secondary">Cancel</button>
                <button type="submit" [disabled]="orgForm.invalid || isSubmitting()" class="workora-btn-primary">
                  @if (isSubmitting()) {
                    <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Provisioning...</span>
                  } @else {
                    <span class="material-symbols-outlined text-base">domain_add</span>
                    <span>Provision Organization</span>
                  }
                </button>
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
  readonly isSubmitting = signal<boolean>(false);
  readonly isRegisterModalOpen = signal<boolean>(false);

  readonly currencyOptions: WorkoraSelectOption<string>[] = [
    { value: 'INR', label: 'INR (₹)', sublabel: 'Indian Rupee', icon: 'currency_rupee', badge: 'INR', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'USD', label: 'USD ($)', sublabel: 'US Dollar', icon: 'attach_money', badge: 'USD', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'EUR', label: 'EUR (€)', sublabel: 'Euro', icon: 'euro', badge: 'EUR', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
    { value: 'GBP', label: 'GBP (£)', sublabel: 'British Pound', icon: 'currency_pound', badge: 'GBP', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'AED', label: 'AED (د.إ)', sublabel: 'UAE Dirham', icon: 'payments', badge: 'AED', badgeClass: 'bg-teal-50 text-teal-700 border-teal-200' },
    { value: 'SGD', label: 'SGD (S$)', sublabel: 'Singapore Dollar', icon: 'payments', badge: 'SGD', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' }
  ];

  readonly orgForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    currency: ['INR', [Validators.required]],
    email: ['', [Validators.email]],
    phone: [''],
    website: ['']
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isRegisterModalOpen()) {
      this.isRegisterModalOpen.set(false);
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  openRegisterModal(): void {
    this.orgForm.reset({ currency: 'INR' });
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

  onSaveOrg(): void {
    if (this.orgForm.invalid) return;

    this.isSubmitting.set(true);
    const formVal = this.orgForm.value;
    
    this.superAdminRepo.registerOrganization({
      name: formVal.name,
      code: formVal.code,
      currency: formVal.currency || 'INR',
      email: formVal.email || undefined,
      phone: formVal.phone || undefined,
      website: formVal.website || undefined
    })
    .pipe(finalize(() => this.isSubmitting.set(false)))
    .subscribe({
      next: () => {
        this.isRegisterModalOpen.set(false);
        this.orgForm.reset({ currency: 'INR' });
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
