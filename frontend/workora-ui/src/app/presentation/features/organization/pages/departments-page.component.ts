import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { OrganizationApiRepository } from '../../../../data/repositories/organization-api.repository';
import { SuperAdminApiRepository } from '../../../../data/repositories/superadmin-api.repository';
import { Department } from '../../../../domain/models/organization.model';
import { TenantOrganization } from '../../../../domain/models/superadmin.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraConfirmDialogComponent } from '../../../shared/components/workora-confirm-dialog.component';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

@Component({
  selector: 'app-departments-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent,
    WorkoraConfirmDialogComponent,
    WorkoraSelectComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2.5 rounded-2xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">account_tree</span>
            </span>
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
                Departments Management
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                Configure corporate functional divisions, cost centers, and departmental hierarchy.
              </p>
            </div>
          </div>
        </div>

        <button 
          type="button" 
          (click)="openCreateModal()"
          class="workora-btn-primary text-xs shadow-md">
          <span class="material-symbols-outlined text-base">add</span>
          <span>Add Department</span>
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
              placeholder="Search by department name or code..."
              class="w-full pl-10 pr-4 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
          </div>

          <div class="flex items-center gap-2.5">
            <button
              type="button"
              (click)="loadDepartments()"
              class="workora-btn-secondary !p-2.5"
              title="Refresh List">
              <span class="material-symbols-outlined text-lg">refresh</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Departments Table -->
      <div class="workora-card overflow-hidden">
        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="4"></app-workora-skeleton>
          </div>
        } @else if (departments().length === 0) {
          <div class="p-8">
            <app-workora-empty-state
              icon="lan"
              title="No Departments Found"
              description="No operational departments configured yet. Create a department to structure your personnel.">
              <button 
                type="button" 
                (click)="openCreateModal()"
                class="workora-btn-primary text-xs mt-2">
                <span class="material-symbols-outlined text-base">add</span>
                <span>Add First Department</span>
              </button>
            </app-workora-empty-state>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F4F8F7] border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]">
                  <th class="py-3.5 px-5">Department Name</th>
                  <th class="py-3.5 px-4">Code</th>
                  <th class="py-3.5 px-4">Organization</th>
                  <th class="py-3.5 px-4">Designations</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DCEBE7]/70">
                @for (dept of departments(); track dept.id) {
                  <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                    <td class="py-3.5 px-5 font-bold text-[#063B39]">
                      <div class="flex items-center gap-2.5">
                        <span class="material-symbols-outlined text-lg text-[#0E6E68]">account_tree</span>
                        <span>{{ dept.name }}</span>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 font-mono font-bold text-[#0E6E68]">{{ dept.code }}</td>
                    <td class="py-3.5 px-4 font-semibold text-slate-700">{{ dept.companyName || 'Corporate Entity' }}</td>
                    <td class="py-3.5 px-4">
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                        {{ dept.designationsCount || 0 }} Roles
                      </span>
                    </td>
                    <td class="py-3.5 px-4">
                      <span 
                        [ngClass]="dept.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border">
                        {{ dept.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="py-3.5 px-5 text-right">
                      <div class="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          (click)="openEditModal(dept)"
                          class="p-1 rounded-lg hover:bg-[#DCEBE7] text-[#063B39] transition-colors border-none bg-transparent cursor-pointer"
                          title="Edit Department">
                          <span class="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          type="button"
                          (click)="confirmDelete(dept)"
                          class="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border-none bg-transparent cursor-pointer"
                          title="Delete Department">
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

    <!-- CREATE / EDIT DEPARTMENT MODAL -->
    @if (showModal()) {
      <div class="workora-modal-overlay" (click)="closeModal()">
        <div class="workora-modal-card max-w-lg flex flex-col" (click)="$event.stopPropagation()">
          
          <div class="p-5 sm:p-6 border-b border-[#DCEBE7] flex items-center justify-between bg-[#F4F8F7] shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#063B39] to-[#0E6E68] text-white flex items-center justify-center font-extrabold shadow-sm">
                <span class="material-symbols-outlined text-xl">account_tree</span>
              </div>
              <div>
                <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                  {{ editingDeptId() ? 'Update Department' : 'Create Department' }}
                </h3>
                <p class="text-xs text-slate-500">
                  Configure department title, division code, and description.
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

          <form [formGroup]="deptForm" class="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 bg-white custom-scrollbar">
            
            <div class="space-y-4">
              @if (orgOptions().length > 1 && !editingDeptId()) {
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

              <div>
                <label class="workora-label">Department Name <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="name" 
                  placeholder="Department Name"
                  class="workora-input !py-2.5"
                />
                @if (isInvalid('name')) {
                  <p class="text-[11px] text-rose-500 mt-1">Department name is required (min 2 chars).</p>
                }
              </div>

              <div>
                <label class="workora-label">Department Code <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="code" 
                  placeholder="Department Code"
                  class="workora-input !py-2.5 uppercase font-mono"
                />
                @if (isInvalid('code')) {
                  <p class="text-[11px] text-rose-500 mt-1">Department code is required.</p>
                }
              </div>

              <div>
                <label class="workora-label">Description (Optional)</label>
                <textarea 
                  formControlName="description" 
                  rows="3" 
                  placeholder="Briefly describe department scope and responsibilities..."
                  class="workora-input !py-2.5 resize-none">
                </textarea>
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
                <span>{{ editingDeptId() ? 'Update Department' : 'Create Department' }}</span>
              }
            </button>
          </div>

        </div>
      </div>
    }

    <!-- Delete Confirmation Dialog -->
    <app-workora-confirm-dialog
      [isOpen]="showDeleteConfirm()"
      title="Delete Department?"
      [message]="deleteMessage()"
      confirmText="Delete Department"
      variant="danger"
      (confirm)="executeDelete()"
      (cancel)="showDeleteConfirm.set(false)">
    </app-workora-confirm-dialog>
  `
})
export class DepartmentsPageComponent implements OnInit {
  private readonly organizationRepo = inject(OrganizationApiRepository);
  private readonly superAdminRepo = inject(SuperAdminApiRepository);
  private readonly notificationService = inject(NotificationService);
  readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly departments = signal<Department[]>([]);
  readonly organizations = signal<TenantOrganization[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly isSaving = signal<boolean>(false);

  searchTerm = '';
  readonly showModal = signal<boolean>(false);
  readonly editingDeptId = signal<number | null>(null);

  readonly showDeleteConfirm = signal<boolean>(false);
  readonly deleteMessage = signal<string>('');
  private pendingDeleteDept: Department | null = null;

  readonly orgOptions = computed<WorkoraSelectOption[]>(() => {
    return this.organizations().map(o => ({
      value: o.id,
      label: o.name,
      sublabel: `Code: ${o.code}`
    }));
  });

  readonly deptForm: FormGroup = this.fb.group({
    companyId: [null],
    name: ['', [Validators.required, Validators.minLength(2)]],
    code: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]{2,10}$/)]]
  });

  ngOnInit(): void {
    this.loadOrganizations();
    this.loadDepartments();
  }

  loadOrganizations(): void {
    this.superAdminRepo.getOrganizations(1, 100).subscribe({
      next: paged => this.organizations.set(paged.items || []),
      error: () => this.organizations.set([])
    });
  }

  loadDepartments(): void {
    this.isLoading.set(true);
    this.organizationRepo.getDepartments({ pageSize: 100 })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: paged => {
          let items = paged.items || [];
          if (this.searchTerm.trim()) {
            const term = this.searchTerm.trim().toLowerCase();
            items = items.filter(d => 
              d.name.toLowerCase().includes(term) || 
              d.code.toLowerCase().includes(term)
            );
          }
          this.departments.set(items);
        },
        error: err => {
          this.notificationService.error(err.message || 'Failed to load departments.');
        }
      });
  }

  onSearch(): void {
    this.loadDepartments();
  }

  openCreateModal(): void {
    const orgs = this.organizations();
    const defaultOrgId = orgs.length > 0 ? orgs[0].id : null;

    this.editingDeptId.set(null);
    this.deptForm.reset({
      companyId: defaultOrgId,
      name: '',
      code: '',
      description: ''
    });
    this.showModal.set(true);
  }

  openEditModal(dept: Department): void {
    this.editingDeptId.set(dept.id);
    this.deptForm.patchValue({
      companyId: dept.companyId,
      name: dept.name,
      code: dept.code
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  isInvalid(controlName: string): boolean {
    const control = this.deptForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submitForm(): void {
    if (this.deptForm.invalid) {
      this.deptForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const val = this.deptForm.value;
    const orgs = this.organizations();
    const companyId = val.companyId || (orgs.length > 0 ? orgs[0].id : 1);

    if (this.editingDeptId()) {
      this.organizationRepo.updateDepartment({
        id: this.editingDeptId()!,
        code: val.code.trim().toUpperCase(),
        name: val.name.trim()
      })
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success('Department updated successfully.');
          this.closeModal();
          this.loadDepartments();
        },
        error: err => this.notificationService.error(err.message || 'Failed to update department.')
      });
    } else {
      this.organizationRepo.createDepartment({
        companyId: companyId,
        code: val.code.trim().toUpperCase(),
        name: val.name.trim()
      })
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success('Department created successfully.');
          this.closeModal();
          this.loadDepartments();
        },
        error: err => this.notificationService.error(err.message || 'Failed to create department.')
      });
    }
  }

  confirmDelete(dept: Department): void {
    this.pendingDeleteDept = dept;
    this.deleteMessage.set(`Are you sure you want to remove department "${dept.name}" (${dept.code})?`);
    this.showDeleteConfirm.set(true);
  }

  executeDelete(): void {
    if (!this.pendingDeleteDept) return;

    const id = this.pendingDeleteDept.id;
    this.showDeleteConfirm.set(false);

    this.organizationRepo.deleteDepartment(id).subscribe({
      next: () => {
        this.notificationService.success('Department deleted successfully.');
        this.loadDepartments();
      },
      error: err => this.notificationService.error(err.message || 'Failed to delete department.')
    });
  }
}
