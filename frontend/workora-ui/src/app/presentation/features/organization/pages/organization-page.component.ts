import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { SuperAdminApiRepository } from '../../../../data/repositories/superadmin-api.repository';
import { TenantOrganization, SubscriptionPlan, SuperAdminMetrics } from '../../../../domain/models/superadmin.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraConfirmDialogComponent } from '../../../shared/components/workora-confirm-dialog.component';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';
import { IndianAddressFormComponent } from '../../../shared/components/indian-address-form.component';

const INDUSTRY_OPTIONS = [
  'Information Technology & Software',
  'Financial Services & FinTech',
  'Manufacturing & Industrial',
  'Healthcare & Pharmaceuticals',
  'Retail & E-Commerce',
  'Consulting & Professional Services',
  'Logistics & Supply Chain',
  'Education & EdTech',
  'Real Estate & Construction',
  'Hospitality & Tourism'
];

/**
 * Enterprise Organization Management Console.
 * Allows platform administrators and tenant stakeholders to manage client organizations,
 * monitor headcount and branch growth, and provision new customer workspaces.
 */
@Component({
  selector: 'app-organization-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraEmptyStateComponent,
    WorkoraConfirmDialogComponent,
    WorkoraSelectComponent,
    IndianAddressFormComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2.5 rounded-2xl bg-[#DDF7F2] text-[#087F73]">
              <span class="material-symbols-outlined text-2xl">domain</span>
            </span>
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#102A2A] tracking-tight font-heading">
                Organizations
              </h1>
              <p class="text-xs sm:text-sm text-[#718686] mt-0.5 font-medium">
                Manage organizations and their Workora workspace.
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button 
            type="button" 
            (click)="openCreateModal()"
            class="workora-btn-primary text-xs shadow-sm">
            <span class="material-symbols-outlined text-base">add_business</span>
            <span>+ Create Organization</span>
          </button>
        </div>
      </div>

      <!-- Quick Platform Health Cards (Real Database Driven) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="workora-card p-5 space-y-1.5 border-l-4 border-l-[#087F73]">
          <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Total Organizations</span>
          <p class="text-3xl font-extrabold text-[#102A2A] font-heading">{{ totalCount() }}</p>
          <p class="text-[11px] text-[#718686] font-medium">Customer enterprise workspaces</p>
        </div>

        <div class="workora-card p-5 space-y-1.5 border-l-4 border-l-[#16A085]">
          <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Active Workspaces</span>
          <p class="text-3xl font-extrabold text-[#16A085] font-heading">{{ activeCount() }}</p>
          <p class="text-[11px] text-[#16A085] font-semibold">Operational tenants</p>
        </div>

        <div class="workora-card p-5 space-y-1.5 border-l-4 border-l-[#0E9F8E]">
          <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Total Branches</span>
          <p class="text-3xl font-extrabold text-[#087F73] font-heading">{{ totalBranchesCount() }}</p>
          <p class="text-[11px] text-[#718686] font-medium">Headquarters &amp; regional offices</p>
        </div>

        <div class="workora-card p-5 space-y-1.5 border-l-4 border-l-[#168AAD]">
          <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Managed Personnel</span>
          <p class="text-3xl font-extrabold text-[#168AAD] font-heading">{{ totalEmployeesCount() }}</p>
          <p class="text-[11px] text-[#718686] font-medium">Total active employees</p>
        </div>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="workora-card p-4 space-y-3">
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <!-- Search Box -->
          <div class="relative flex-1 max-w-md">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (ngModelChange)="onSearch()"
              placeholder="Search organizations..." 
              class="w-full pl-10 pr-4 py-2.5 bg-[#F6FAF9] text-xs text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] focus:bg-white outline-none font-medium transition-all"
            />
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap items-center gap-2.5">
            <div class="w-44">
              <app-workora-select
                [(ngModel)]="selectedStatusFilter"
                (selectionChange)="onFilterChange()"
                [options]="statusOptions"
                [clearable]="true"
                placeholder="All Statuses"
                icon="filter_alt"
              ></app-workora-select>
            </div>

            <button
              type="button"
              (click)="loadOrganizations()"
              class="workora-btn-secondary !p-2.5"
              title="Refresh List">
              <span class="material-symbols-outlined text-lg">refresh</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Organizations Data Table -->
      <div class="workora-card overflow-hidden">
        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="5"></app-workora-skeleton>
          </div>
        } @else if (organizations().length === 0) {
          <div class="p-8">
            <app-workora-empty-state
              icon="domain_disabled"
              title="No organizations yet"
              description="Create your first organization to start managing your Workora HRMS workspace.">
              <button 
                type="button" 
                (click)="openCreateModal()"
                class="workora-btn-primary text-xs mt-2">
                <span class="material-symbols-outlined text-base">add_business</span>
                <span>+ Create Organization</span>
              </button>
            </app-workora-empty-state>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F6FAF9] border-b border-[#DDE9E6] text-[11px] font-extrabold uppercase tracking-wider text-[#102A2A]">
                  <th class="py-3.5 px-5">Organization / Legal Entity</th>
                  <th class="py-3.5 px-4">Code</th>
                  <th class="py-3.5 px-4">Primary Contact</th>
                  <th class="py-3.5 px-4 text-center">Branches</th>
                  <th class="py-3.5 px-4 text-center">Employees</th>
                  <th class="py-3.5 px-4">Plan</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-4">Created Date</th>
                  <th class="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DCEBE7]/70">
                @for (org of organizations(); track org.id) {
                  <tr class="hover:bg-[#F4F8F7]/50 transition-colors group cursor-pointer" (click)="goToDetail(org.id)">
                    
                    <!-- Organization & Legal Name -->
                    <td class="py-3.5 px-5">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#063B39] to-[#0E6E68] text-white font-extrabold text-xs flex items-center justify-center shadow-2xs shrink-0">
                          {{ org.code ? org.code.substring(0, 2).toUpperCase() : 'OR' }}
                        </div>
                        <div class="min-w-0">
                          <div class="font-extrabold text-[#063B39] group-hover:text-[#0E6E68] transition-colors truncate">
                            {{ org.name }}
                          </div>
                          <div class="text-[10px] text-slate-500 font-medium truncate">
                            {{ org.industry || org.registrationNumber || 'Corporate Tenant' }}
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Code -->
                    <td class="py-3.5 px-4 font-mono font-bold text-[#0E6E68]">
                      {{ org.code }}
                    </td>

                    <!-- Contact Person & Email -->
                    <td class="py-3.5 px-4">
                      <div class="flex flex-col leading-tight">
                        <span class="font-semibold text-slate-800">{{ org.primaryContactName || org.email || '-' }}</span>
                        <span class="text-[10px] text-slate-500 font-mono">{{ org.phone || org.email || '' }}</span>
                      </div>
                    </td>

                    <!-- Branches Count -->
                    <td class="py-3.5 px-4 text-center">
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-700 font-bold border border-teal-200/60">
                        <span class="material-symbols-outlined text-[13px]">location_city</span>
                        <span>{{ org.branchCount || 1 }}</span>
                      </span>
                    </td>

                    <!-- Employees Count -->
                    <td class="py-3.5 px-4 text-center">
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200">
                        <span class="material-symbols-outlined text-[13px]">group</span>
                        <span>{{ org.employeeCount || 0 }}</span>
                      </span>
                    </td>

                    <!-- Subscription Plan -->
                    <td class="py-3.5 px-4">
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                        {{ org.subscriptionPlan || 'Growth' }}
                      </span>
                    </td>

                    <!-- Status -->
                    <td class="py-3.5 px-4">
                      <span 
                        [ngClass]="org.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border inline-flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full" [ngClass]="org.isActive ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                        <span>{{ org.isActive ? 'Active' : 'Suspended' }}</span>
                      </span>
                    </td>

                    <!-- Created Date -->
                    <td class="py-3.5 px-4 text-slate-500 font-medium">
                      {{ org.createdAt | date:'mediumDate' }}
                    </td>

                    <!-- Actions -->
                    <td class="py-3.5 px-5 text-right" (click)="$event.stopPropagation()">
                      <div class="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          (click)="goToDetail(org.id)"
                          class="px-2.5 py-1 rounded-lg bg-[#F4F8F7] hover:bg-[#DCEBE7] text-[#063B39] text-[11px] font-bold transition-colors border border-[#DCEBE7] cursor-pointer"
                          title="View Details">
                          View
                        </button>

                        @if (org.isActive) {
                          <button
                            type="button"
                            (click)="onSuspend(org)"
                            class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition-colors border border-rose-200 cursor-pointer">
                            Suspend
                          </button>
                        } @else {
                          <button
                            type="button"
                            (click)="onReactivate(org)"
                            class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-colors border border-emerald-200 cursor-pointer">
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

          <!-- Pagination -->
          <div class="p-4 border-t border-[#DCEBE7] flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500">
              Showing {{ organizations().length }} of {{ totalCount() }} organizations
            </span>
            <app-workora-pagination
              [currentPage]="currentPage()"
              [totalItems]="totalCount()"
              [pageSize]="pageSize"
              (pageChange)="onPageChange($event)">
            </app-workora-pagination>
          </div>
        }
      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- REGISTER ORGANIZATION MODAL (MULTI-STEP INDIA-FIRST FORM)                 -->
    <!-- ========================================================================= -->
    @if (showCreateModal()) {
      <div class="workora-modal-overlay" (click)="closeCreateModal()">
        <div class="workora-modal-card max-w-2xl flex flex-col" (click)="$event.stopPropagation()">
          
          <!-- Modal Header -->
          <div class="p-5 sm:p-6 border-b border-[#DCEBE7] flex items-center justify-between bg-[#F4F8F7] shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#063B39] to-[#0E6E68] text-white flex items-center justify-center font-extrabold shadow-sm">
                <span class="material-symbols-outlined text-xl">add_business</span>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-extrabold text-[#063B39] font-heading">
                  Register Tenant Organization
                </h3>
                <p class="text-xs text-slate-500">
                  Step {{ currentStep() }} of 3: {{ getStepTitle(currentStep()) }}
                </p>
              </div>
            </div>

            <button 
              type="button" 
              (click)="closeCreateModal()"
              class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
              <span class="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <!-- Step Indicators -->
          <div class="px-6 py-3 bg-white border-b border-[#DCEBE7] grid grid-cols-3 gap-3 shrink-0">
            @for (step of [1, 2, 3]; track step) {
              <div class="flex items-center gap-2">
                <div 
                  [ngClass]="{
                    'bg-[#0E6E68] text-white': currentStep() === step,
                    'bg-emerald-100 text-emerald-800': currentStep() > step,
                    'bg-slate-100 text-slate-400': currentStep() < step
                  }"
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold transition-all shrink-0">
                  @if (currentStep() > step) {
                    <span class="material-symbols-outlined text-sm">check</span>
                  } @else {
                    <span>{{ step }}</span>
                  }
                </div>
                <span class="text-[11px] font-bold truncate hidden sm:inline"
                  [ngClass]="currentStep() >= step ? 'text-[#063B39]' : 'text-slate-400'">
                  {{ getStepTitle(step) }}
                </span>
              </div>
            }
          </div>

          <!-- Form Body -->
          <form [formGroup]="orgForm" class="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 bg-white custom-scrollbar">
            
            <!-- Step 1: Corporate & Legal Information -->
            @if (currentStep() === 1) {
              <div class="space-y-4 animate-in fade-in duration-150">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div class="sm:col-span-2">
                    <label class="workora-label">Organization / Company Name <span class="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      formControlName="name" 
                      placeholder="Company Name"
                      class="workora-input !py-2.5"
                    />
                    @if (isInvalid('name')) {
                      <p class="text-[11px] text-rose-500 mt-1">Company name is required (min 2 characters).</p>
                    }
                  </div>

                  <div>
                    <label class="workora-label">Organization Code (Unique) <span class="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      formControlName="code" 
                      placeholder="Organization Code"
                      class="workora-input !py-2.5 uppercase font-mono"
                    />
                    @if (isInvalid('code')) {
                      <p class="text-[11px] text-rose-500 mt-1">Uppercase alphanumeric code required (2-10 chars).</p>
                    }
                  </div>

                  <div>
                    <label class="workora-label">Industry Sector</label>
                    <app-workora-select
                      formControlName="industry"
                      [options]="industryOptions"
                      [searchable]="true"
                      placeholder="Select Industry"
                      icon="business"
                    ></app-workora-select>
                  </div>

                  <div>
                    <label class="workora-label">CIN / Registration Number</label>
                    <input 
                      type="text" 
                      formControlName="registrationNumber" 
                      placeholder="CIN / Registration Number"
                      class="workora-input !py-2.5 uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label class="workora-label">GSTIN / Corporate Tax ID</label>
                    <input 
                      type="text" 
                      formControlName="taxId" 
                      placeholder="GSTIN / Corporate Tax ID"
                      class="workora-input !py-2.5 uppercase font-mono"
                    />
                  </div>

                </div>
              </div>
            }

            <!-- Step 2: Primary Contact & Address -->
            @if (currentStep() === 2) {
              <div class="space-y-4 animate-in fade-in duration-150">
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="workora-label">Primary Admin Email <span class="text-rose-500">*</span></label>
                    <input 
                      type="email" 
                      formControlName="email" 
                      placeholder="Primary Admin Email"
                      class="workora-input !py-2.5"
                    />
                    @if (isInvalid('email')) {
                      <p class="text-[11px] text-rose-500 mt-1">Valid administrative corporate email is required.</p>
                    }
                  </div>

                  <div>
                    <label class="workora-label">Primary Mobile / Phone (+91)</label>
                    <input 
                      type="tel" 
                      formControlName="phone" 
                      placeholder="Primary Phone Number"
                      class="workora-input !py-2.5"
                    />
                  </div>

                  <div class="sm:col-span-2">
                    <label class="workora-label">Website URL</label>
                    <input 
                      type="url" 
                      formControlName="website" 
                      placeholder="Website URL"
                      class="workora-input !py-2.5"
                    />
                  </div>
                </div>

                <div class="pt-2">
                  <h4 class="text-xs font-extrabold text-[#063B39] uppercase tracking-wider mb-2">
                    Registered Office Address
                  </h4>
                  <app-indian-address-form
                    formControlName="address"
                    [required]="false">
                  </app-indian-address-form>
                </div>

              </div>
            }

            <!-- Step 3: Plan & Financial Defaults -->
            @if (currentStep() === 3) {
              <div class="space-y-4 animate-in fade-in duration-150">
                <div class="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2">
                  <div class="flex items-center gap-2 text-[#0E6E68] font-bold text-xs">
                    <span class="material-symbols-outlined text-base">verified</span>
                    <span>India-First SaaS Multi-Tenancy Provisioning</span>
                  </div>
                  <p class="text-[11px] text-slate-600 leading-relaxed">
                    Workora will automatically provision a <strong>Headquarters Branch</strong> and 
                    an <strong>Organization Administrator Account</strong> with Indian payroll configuration (April–March Financial Year, INR Currency).
                  </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="workora-label">Subscription Tier</label>
                    <app-workora-select
                      formControlName="subscriptionPlan"
                      [options]="planOptions"
                      placeholder="Select Subscription Tier"
                      icon="stars"
                    ></app-workora-select>
                  </div>

                  <div>
                    <label class="workora-label">Base Currency</label>
                    <input 
                      type="text" 
                      value="INR (₹) - Indian Rupee" 
                      disabled
                      class="workora-input !py-2.5 bg-slate-50 text-slate-600 font-bold"
                    />
                  </div>

                  <div>
                    <label class="workora-label">Financial Year Cycle</label>
                    <input 
                      type="text" 
                      value="April 1 to March 31" 
                      disabled
                      class="workora-input !py-2.5 bg-slate-50 text-slate-600 font-bold"
                    />
                  </div>

                  <div>
                    <label class="workora-label">Initial Admin Default Password</label>
                    <input 
                      type="text" 
                      value="Admin@123 (Change on first login)" 
                      disabled
                      class="workora-input !py-2.5 bg-slate-50 text-slate-500 font-mono text-xs"
                    />
                  </div>
                </div>

              </div>
            }

          </form>

          <!-- Modal Footer -->
          <div class="p-4 sm:p-5 border-t border-[#DCEBE7] bg-[#F4F8F7] flex items-center justify-between shrink-0">
            @if (currentStep() > 1) {
              <button 
                type="button" 
                (click)="currentStep.set(currentStep() - 1)"
                class="workora-btn-secondary text-xs">
                Back
              </button>
            } @else {
              <button 
                type="button" 
                (click)="closeCreateModal()"
                class="workora-btn-ghost text-xs">
                Cancel
              </button>
            }

            @if (currentStep() < 3) {
              <button 
                type="button" 
                (click)="goToNextStep()"
                class="workora-btn-primary text-xs">
                <span>Continue</span>
                <span class="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            } @else {
              <button 
                type="button" 
                (click)="submitCreate()"
                [disabled]="isSaving()"
                class="workora-btn-primary text-xs">
                @if (isSaving()) {
                  <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Provisioning...</span>
                } @else {
                  <span class="material-symbols-outlined text-base">domain_add</span>
                  <span>Create Organization</span>
                }
              </button>
            }
          </div>

        </div>
      </div>
    }

    <!-- Suspend/Reactivate Confirmation Dialog -->
    <app-workora-confirm-dialog
      [isOpen]="showConfirmDialog()"
      [title]="confirmTitle()"
      [message]="confirmMessage()"
      [confirmText]="confirmActionText()"
      [variant]="confirmVariant()"
      (confirm)="executeConfirmAction()"
      (cancel)="showConfirmDialog.set(false)">
    </app-workora-confirm-dialog>
  `
})
export class OrganizationPageComponent implements OnInit {
  private readonly superAdminRepo = inject(SuperAdminApiRepository);
  private readonly notificationService = inject(NotificationService);
  readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly organizations = signal<TenantOrganization[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly isSaving = signal<boolean>(false);
  readonly totalCount = signal<number>(0);
  readonly currentPage = signal<number>(1);
  readonly pageSize = 10;

  searchTerm = '';
  selectedStatusFilter: string | null = null;

  readonly showCreateModal = signal<boolean>(false);
  readonly currentStep = signal<number>(1);

  readonly showConfirmDialog = signal<boolean>(false);
  readonly confirmTitle = signal<string>('');
  readonly confirmMessage = signal<string>('');
  readonly confirmActionText = signal<string>('');
  readonly confirmVariant = signal<'danger' | 'warning' | 'info'>('warning');
  private pendingOrgAction: { type: 'suspend' | 'reactivate', org: TenantOrganization } | null = null;

  readonly statusOptions: WorkoraSelectOption[] = [
    { value: 'active', label: 'Active Organizations' },
    { value: 'suspended', label: 'Suspended Organizations' }
  ];

  readonly industryOptions: WorkoraSelectOption[] = INDUSTRY_OPTIONS.map(ind => ({
    value: ind,
    label: ind
  }));

  readonly planOptions: WorkoraSelectOption[] = [
    { value: 'Starter', label: 'Starter Tier (Up to 25 Employees)', sublabel: '₹3,499 / month' },
    { value: 'Growth', label: 'Growth Tier (Up to 250 Employees)', sublabel: '₹14,999 / month' },
    { value: 'Enterprise', label: 'Enterprise Tier (Unlimited Scaling & SLA)', sublabel: 'Custom Pricing' }
  ];

  readonly activeCount = computed(() => this.organizations().filter(o => o.isActive).length);
  readonly totalBranchesCount = computed(() => this.organizations().reduce((acc, o) => acc + (o.branchCount || 1), 0));
  readonly totalEmployeesCount = computed(() => this.organizations().reduce((acc, o) => acc + (o.employeeCount || 0), 0));

  readonly orgForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    code: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]{2,10}$/)]],
    industry: ['Information Technology & Software'],
    registrationNumber: [''],
    taxId: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    website: [''],
    address: [''],
    subscriptionPlan: ['Growth']
  });

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.isLoading.set(true);
    this.superAdminRepo.getOrganizations(this.currentPage(), this.pageSize, this.selectedStatusFilter || undefined)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: paged => {
          let items = paged.items || [];
          if (this.searchTerm.trim()) {
            const term = this.searchTerm.trim().toLowerCase();
            items = items.filter(o => 
              o.name.toLowerCase().includes(term) || 
              o.code.toLowerCase().includes(term)
            );
          }
          this.organizations.set(items);
          this.totalCount.set(paged.totalCount || items.length);
        },
        error: err => {
          this.notificationService.error(err.message || 'Failed to retrieve organizations.');
        }
      });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadOrganizations();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadOrganizations();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadOrganizations();
  }

  goToDetail(id: number): void {
    this.router.navigate(['/organization', id]);
  }

  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Company Identity';
      case 2: return 'Contact & Address';
      case 3: return 'Plan & Setup';
      default: return '';
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.orgForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  openCreateModal(): void {
    this.orgForm.reset({
      name: '',
      code: '',
      industry: 'Information Technology & Software',
      registrationNumber: '',
      taxId: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      subscriptionPlan: 'Growth'
    });
    this.currentStep.set(1);
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  goToNextStep(): void {
    if (this.currentStep() === 1) {
      this.orgForm.get('name')?.markAsTouched();
      this.orgForm.get('code')?.markAsTouched();
      if (this.orgForm.get('name')?.invalid || this.orgForm.get('code')?.invalid) return;
    } else if (this.currentStep() === 2) {
      this.orgForm.get('email')?.markAsTouched();
      if (this.orgForm.get('email')?.invalid) return;
    }
    this.currentStep.set(this.currentStep() + 1);
  }

  submitCreate(): void {
    if (this.orgForm.invalid) {
      this.orgForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const val = this.orgForm.value;

    this.superAdminRepo.registerOrganization({
      name: val.name.trim(),
      code: val.code.trim().toUpperCase(),
      registrationNumber: val.registrationNumber ? val.registrationNumber.trim() : null,
      taxId: val.taxId ? val.taxId.trim() : null,
      email: val.email ? val.email.trim().toLowerCase() : null,
      phone: val.phone ? val.phone.trim() : null,
      website: val.website ? val.website.trim() : null,
      fiscalYearStartMonth: 4, // India April-March
      currency: 'INR',
      address: val.address || null
    })
    .pipe(finalize(() => this.isSaving.set(false)))
    .subscribe({
      next: created => {
        this.notificationService.success(`Organization "${created.name}" registered successfully with default Headquarters branch.`);
        this.closeCreateModal();
        this.loadOrganizations();
      },
      error: err => {
        this.notificationService.error(err.message || 'Failed to register organization.');
      }
    });
  }

  onSuspend(org: TenantOrganization): void {
    this.pendingOrgAction = { type: 'suspend', org };
    this.confirmTitle.set(`Suspend ${org.name}?`);
    this.confirmMessage.set(`Are you sure you want to suspend "${org.name}" (${org.code})? Users in this tenant will temporarily lose access.`);
    this.confirmActionText.set('Suspend Organization');
    this.confirmVariant.set('danger');
    this.showConfirmDialog.set(true);
  }

  onReactivate(org: TenantOrganization): void {
    this.pendingOrgAction = { type: 'reactivate', org };
    this.confirmTitle.set(`Reactivate ${org.name}?`);
    this.confirmMessage.set(`Reactivating "${org.name}" will restore complete system access for tenant users.`);
    this.confirmActionText.set('Reactivate Organization');
    this.confirmVariant.set('info');
    this.showConfirmDialog.set(true);
  }

  executeConfirmAction(): void {
    if (!this.pendingOrgAction) return;

    const { type, org } = this.pendingOrgAction;
    this.showConfirmDialog.set(false);

    if (type === 'suspend') {
      this.superAdminRepo.suspendOrganization(org.id).subscribe({
        next: () => {
          this.notificationService.success(`Organization "${org.name}" has been suspended.`);
          this.loadOrganizations();
        },
        error: err => this.notificationService.error(err.message || 'Failed to suspend organization.')
      });
    } else {
      this.superAdminRepo.reactivateOrganization(org.id).subscribe({
        next: () => {
          this.notificationService.success(`Organization "${org.name}" has been reactivated.`);
          this.loadOrganizations();
        },
        error: err => this.notificationService.error(err.message || 'Failed to reactivate organization.')
      });
    }
  }
}
