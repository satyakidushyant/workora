import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { OrganizationApiRepository } from '../../../../data/repositories/organization-api.repository';
import { SuperAdminApiRepository } from '../../../../data/repositories/superadmin-api.repository';
import { Branch, CreateBranchParams, UpdateBranchParams } from '../../../../domain/models/organization.model';
import { TenantOrganization } from '../../../../domain/models/superadmin.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraConfirmDialogComponent } from '../../../shared/components/workora-confirm-dialog.component';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';
import { IndianAddressFormComponent } from '../../../shared/components/indian-address-form.component';

@Component({
  selector: 'app-branches-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkoraSkeletonComponent,
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
              <span class="material-symbols-outlined text-2xl">location_city</span>
            </span>
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#102A2A] tracking-tight font-heading">
                Branches
              </h1>
              <p class="text-xs sm:text-sm text-[#718686] mt-0.5 font-medium">
                Manage physical corporate offices, facilities, and regional work sites.
              </p>
            </div>
          </div>
        </div>

        <button 
          type="button" 
          (click)="openCreateModal()"
          class="workora-btn-primary text-xs shadow-sm">
          <span class="material-symbols-outlined text-base">add_location_alt</span>
          <span>+ Add Branch</span>
        </button>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="workora-card p-4 space-y-3">
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div class="relative flex-1 max-w-md">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (ngModelChange)="onSearch()"
              placeholder="Search branches..." 
              class="w-full pl-10 pr-4 py-2.5 bg-[#F6FAF9] text-xs text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] focus:bg-white outline-none font-medium transition-all"
            />
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            @if (authService.hasRole('SuperAdmin') && orgOptions().length > 1) {
              <div class="w-52">
                <app-workora-select
                  [(ngModel)]="selectedOrgFilter"
                  (selectionChange)="onFilterChange()"
                  [options]="orgOptions()"
                  [clearable]="true"
                  placeholder="All Organizations"
                  icon="domain"
                ></app-workora-select>
              </div>
            }

            <div class="w-40">
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
              (click)="loadBranches()"
              class="workora-btn-secondary !p-2.5"
              title="Refresh List">
              <span class="material-symbols-outlined text-lg">refresh</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Branches Table -->
      <div class="workora-card overflow-hidden">
        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="4"></app-workora-skeleton>
          </div>
        } @else if (branches().length === 0) {
          <div class="p-8">
            <app-workora-empty-state
              icon="location_off"
              title="No branches yet"
              description="Create a branch office to organize your physical workspace.">
              <button 
                type="button" 
                (click)="openCreateModal()"
                class="workora-btn-primary text-xs mt-2">
                <span class="material-symbols-outlined text-base">add_location_alt</span>
                <span>+ Add Branch</span>
              </button>
            </app-workora-empty-state>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F6FAF9] border-b border-[#DDE9E6] text-[11px] font-extrabold uppercase tracking-wider text-[#102A2A]">
                  <th class="py-3.5 px-5">Branch Name</th>
                  <th class="py-3.5 px-4">Code</th>
                  <th class="py-3.5 px-4">Organization</th>
                  <th class="py-3.5 px-4">Branch Type</th>
                  <th class="py-3.5 px-4">Address / Location</th>
                  <th class="py-3.5 px-4">Timezone</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DCEBE7]/70">
                @for (branch of branches(); track branch.id) {
                  <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                    <td class="py-3.5 px-5 font-bold text-[#063B39]">
                      <div class="flex items-center gap-2.5">
                        <span class="material-symbols-outlined text-lg text-[#0E6E68]">
                          {{ branch.isHeadOffice ? 'domain' : 'location_city' }}
                        </span>
                        <span>{{ branch.name }}</span>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 font-mono font-bold text-[#0E6E68]">{{ branch.code }}</td>
                    <td class="py-3.5 px-4 font-semibold text-slate-700">{{ branch.companyName || 'Corporate Tenant' }}</td>
                    <td class="py-3.5 px-4">
                      @if (branch.isHeadOffice) {
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200">
                          Head Office
                        </span>
                      } @else {
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          Regional Branch
                        </span>
                      }
                    </td>
                    <td class="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {{ branch.address || branch.location || 'Main Office' }}
                    </td>
                    <td class="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{{ branch.timezone || 'Asia/Kolkata' }}</td>
                    <td class="py-3.5 px-4">
                      <span 
                        [ngClass]="branch.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border">
                        {{ branch.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="py-3.5 px-5 text-right">
                      <div class="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          (click)="openEditModal(branch)"
                          class="p-1 rounded-lg hover:bg-[#DCEBE7] text-[#063B39] transition-colors border-none bg-transparent cursor-pointer"
                          title="Edit Branch">
                          <span class="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          type="button"
                          (click)="confirmDelete(branch)"
                          class="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border-none bg-transparent cursor-pointer"
                          title="Delete Branch">
                          <span class="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

    </div>

    <!-- CREATE / EDIT BRANCH MODAL -->
    @if (showModal()) {
      <div class="workora-modal-overlay" (click)="closeModal()">
        <div class="workora-modal-card max-w-xl flex flex-col" (click)="$event.stopPropagation()">
          
          <div class="p-5 sm:p-6 border-b border-[#DCEBE7] flex items-center justify-between bg-[#F4F8F7] shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#063B39] to-[#0E6E68] text-white flex items-center justify-center font-extrabold shadow-sm">
                <span class="material-symbols-outlined text-xl">location_city</span>
              </div>
              <div>
                <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                  {{ editingBranchId() ? 'Update Branch Office' : 'Create Branch Office' }}
                </h3>
                <p class="text-xs text-slate-500">
                  Configure branch location, Indian physical address, and head office designation.
                </p>
              </div>
            </div>

            <button 
              type="button" 
              (click)="closeModal()"
              class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
              <span class="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <form [formGroup]="branchForm" class="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 bg-white custom-scrollbar">
            
            <div class="space-y-4">
              
              <!-- Organization Selection (if multiple) -->
              @if (orgOptions().length > 1 && !editingBranchId()) {
                <div>
                  <label class="workora-label">Organization <span class="text-rose-500">*</span></label>
                  <app-workora-select
                    formControlName="companyId"
                    [options]="orgOptions()"
                    placeholder="Select Organization"
                    icon="domain"
                  ></app-workora-select>
                </div>
              }

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="workora-label">Branch Name <span class="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    formControlName="name" 
                    placeholder="Branch Name"
                    class="workora-input !py-2.5"
                  />
                  @if (isInvalid('name')) {
                    <p class="text-[11px] text-rose-500 mt-1">Branch name is required (min 2 chars).</p>
                  }
                </div>

                <div>
                  <label class="workora-label">Branch Code <span class="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    formControlName="code" 
                    placeholder="Branch Code"
                    class="workora-input !py-2.5 uppercase font-mono"
                  />
                  @if (isInvalid('code')) {
                    <p class="text-[11px] text-rose-500 mt-1">Branch code is required.</p>
                  }
                </div>

                <div class="sm:col-span-2">
                  <label class="workora-label">Location / City Area</label>
                  <input 
                    type="text" 
                    formControlName="location" 
                    placeholder="Location / City Area"
                    class="workora-input !py-2.5"
                  />
                </div>
              </div>

              <!-- Indian Address -->
              <div class="pt-2">
                <h4 class="text-xs font-extrabold text-[#063B39] uppercase tracking-wider mb-2">
                  Physical Office Address
                </h4>
                <app-indian-address-form
                  formControlName="address"
                  [required]="false">
                </app-indian-address-form>
              </div>

              <div class="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="isHeadOfficeGlobal" 
                  formControlName="isHeadOffice"
                  class="w-4 h-4 rounded border-[#DCEBE7] text-[#0E6E68] focus:ring-[#0E6E68] cursor-pointer"
                />
                <label for="isHeadOfficeGlobal" class="text-xs font-bold text-[#063B39] cursor-pointer">
                  Designate as Primary Headquarters Office
                </label>
              </div>
            </div>

          </form>

          <div class="p-4 sm:p-5 border-t border-[#DCEBE7] bg-[#F4F8F7] flex items-center justify-between shrink-0">
            <button 
              type="button" 
              (click)="closeModal()"
              class="workora-btn-ghost text-xs">
              Cancel
            </button>

            <button 
              type="button" 
              (click)="submitForm()"
              [disabled]="isSaving()"
              class="workora-btn-primary text-xs">
              @if (isSaving()) {
                <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving...</span>
              } @else {
                <span class="material-symbols-outlined text-base">save</span>
                <span>{{ editingBranchId() ? 'Update Branch' : 'Create Branch' }}</span>
              }
            </button>
          </div>

        </div>
      </div>
    }

    <!-- Delete Confirmation Dialog -->
    <app-workora-confirm-dialog
      [isOpen]="showDeleteConfirm()"
      title="Delete Branch?"
      [message]="deleteMessage()"
      confirmText="Delete Branch"
      variant="danger"
      (confirm)="executeDelete()"
      (cancel)="showDeleteConfirm.set(false)">
    </app-workora-confirm-dialog>
  `
})
export class BranchesPageComponent implements OnInit {
  private readonly organizationRepo = inject(OrganizationApiRepository);
  private readonly superAdminRepo = inject(SuperAdminApiRepository);
  private readonly notificationService = inject(NotificationService);
  readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly branches = signal<Branch[]>([]);
  readonly organizations = signal<TenantOrganization[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly isSaving = signal<boolean>(false);

  searchTerm = '';
  selectedOrgFilter: number | null = null;
  selectedStatusFilter: string | null = null;

  readonly showModal = signal<boolean>(false);
  readonly editingBranchId = signal<number | null>(null);

  readonly showDeleteConfirm = signal<boolean>(false);
  readonly deleteMessage = signal<string>('');
  private pendingDeleteBranch: Branch | null = null;

  readonly statusOptions: WorkoraSelectOption[] = [
    { value: 'active', label: 'Active Branches' },
    { value: 'inactive', label: 'Inactive Branches' }
  ];

  readonly orgOptions = computed<WorkoraSelectOption[]>(() => {
    return this.organizations().map(o => ({
      value: o.id,
      label: o.name,
      sublabel: `Code: ${o.code}`
    }));
  });

  readonly branchForm: FormGroup = this.fb.group({
    companyId: [null],
    name: ['', [Validators.required, Validators.minLength(2)]],
    code: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]{2,10}$/)]],
    location: [''],
    address: [''],
    isHeadOffice: [false]
  });

  ngOnInit(): void {
    this.loadOrganizations();
    this.loadBranches();
  }

  loadOrganizations(): void {
    if (this.authService.hasRole('SuperAdmin')) {
      this.superAdminRepo.getOrganizations(1, 100).subscribe({
        next: paged => this.organizations.set(paged.items || []),
        error: () => this.organizations.set([])
      });
    } else {
      this.organizationRepo.getCompaniesList().subscribe({
        next: companies => {
          const tenantOrgs: TenantOrganization[] = companies.map(c => ({
            id: c.id,
            name: c.name,
            code: c.code,
            industry: 'General Enterprise',
            isActive: c.isActive ?? true,
            currency: c.currency || 'INR',
            createdAt: c.createdAt ? c.createdAt.toString() : new Date().toISOString()
          }));
          this.organizations.set(tenantOrgs);
        },
        error: () => this.organizations.set([])
      });
    }
  }

  loadBranches(): void {
    this.isLoading.set(true);
    this.organizationRepo.getBranches({ companyId: this.selectedOrgFilter || undefined, pageSize: 100 })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: paged => {
          let items = paged.items || [];
          if (this.searchTerm.trim()) {
            const term = this.searchTerm.trim().toLowerCase();
            items = items.filter(b => 
              b.name.toLowerCase().includes(term) || 
              b.code.toLowerCase().includes(term) ||
              (b.location && b.location.toLowerCase().includes(term))
            );
          }
          if (this.selectedStatusFilter === 'active') {
            items = items.filter(b => b.isActive);
          } else if (this.selectedStatusFilter === 'inactive') {
            items = items.filter(b => !b.isActive);
          }
          this.branches.set(items);
        },
        error: err => {
          this.notificationService.error(err.message || 'Failed to load branches.');
        }
      });
  }

  onSearch(): void {
    this.loadBranches();
  }

  onFilterChange(): void {
    this.loadBranches();
  }

  openCreateModal(): void {
    const orgs = this.organizations();
    const defaultOrgId = this.authService.currentUser()?.companyId || (orgs.length > 0 ? orgs[0].id : null);
    
    this.editingBranchId.set(null);
    this.branchForm.reset({
      companyId: defaultOrgId,
      name: '',
      code: '',
      location: '',
      address: '',
      isHeadOffice: false
    });
    this.showModal.set(true);
  }

  openEditModal(branch: Branch): void {
    this.editingBranchId.set(branch.id);
    this.branchForm.patchValue({
      companyId: branch.companyId,
      name: branch.name,
      code: branch.code,
      location: branch.location || '',
      address: branch.address || '',
      isHeadOffice: branch.isHeadOffice
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  isInvalid(controlName: string): boolean {
    const control = this.branchForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submitForm(): void {
    if (this.branchForm.invalid) {
      this.branchForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const val = this.branchForm.value;
    const orgs = this.organizations();
    const companyId = val.companyId || (orgs.length > 0 ? orgs[0].id : 1);

    if (this.editingBranchId()) {
      this.organizationRepo.updateBranch({
        id: this.editingBranchId()!,
        name: val.name.trim(),
        code: val.code.trim().toUpperCase(),
        location: val.location ? val.location.trim() : 'Main Office',
        address: val.address || null,
        timezone: 'Asia/Kolkata',
        isHeadOffice: !!val.isHeadOffice
      })
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success('Branch office updated successfully.');
          this.closeModal();
          this.loadBranches();
        },
        error: err => this.notificationService.error(err.message || 'Failed to update branch.')
      });
    } else {
      this.organizationRepo.createBranch({
        companyId: companyId,
        name: val.name.trim(),
        code: val.code.trim().toUpperCase(),
        location: val.location ? val.location.trim() : 'Main Office',
        address: val.address || null,
        timezone: 'Asia/Kolkata',
        isHeadOffice: !!val.isHeadOffice
      })
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success('Branch office created successfully.');
          this.closeModal();
          this.loadBranches();
        },
        error: err => this.notificationService.error(err.message || 'Failed to create branch.')
      });
    }
  }

  confirmDelete(branch: Branch): void {
    this.pendingDeleteBranch = branch;
    this.deleteMessage.set(`Are you sure you want to remove branch "${branch.name}" (${branch.code})?`);
    this.showDeleteConfirm.set(true);
  }

  executeDelete(): void {
    if (!this.pendingDeleteBranch) return;

    const id = this.pendingDeleteBranch.id;
    this.showDeleteConfirm.set(false);

    this.organizationRepo.deleteBranch(id).subscribe({
      next: () => {
        this.notificationService.success('Branch deleted successfully.');
        this.loadBranches();
      },
      error: err => this.notificationService.error(err.message || 'Failed to delete branch.')
    });
  }
}
