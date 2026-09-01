import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { RolePermissionApiRepository } from '../../../../data/repositories/role-permission-api.repository';
import {
  Role,
  RoleDetail,
  ModulePermissions,
  CreateRoleParams,
  UpdateRoleParams,
  CloneRoleParams
} from '../../../../domain/models/role-permission.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraConfirmDialogComponent } from '../../../shared/components/workora-confirm-dialog.component';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';
import { RoleFormModalComponent } from '../components/role-form-modal.component';
import { CloneRoleModalComponent } from '../components/clone-role-modal.component';
import { PermissionMatrixModalComponent } from '../components/permission-matrix-modal.component';

/**
 * Enterprise Workora Role-Based Access Control (RBAC) & Security Matrix Console.
 * Unified design system matching SuperAdmin, Organizations, and Audit Trail modules.
 */
@Component({
  selector: 'app-role-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraEmptyStateComponent,
    WorkoraConfirmDialogComponent,
    WorkoraSelectComponent,
    RoleFormModalComponent,
    CloneRoleModalComponent,
    PermissionMatrixModalComponent
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
            <span class="text-[#102A2A] font-bold">Roles &amp; RBAC</span>
          </div>

          <div class="flex items-center gap-2.5">
            <div class="p-2.5 rounded-2xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center shrink-0 shadow-xs">
              <span class="material-symbols-outlined text-2xl">admin_panel_settings</span>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#102A2A] tracking-tight font-heading">
                Roles &amp; Permissions (RBAC)
              </h1>
              <p class="text-xs sm:text-sm text-[#718686] mt-0.5 font-medium">
                Define security roles, govern access barriers, and configure granular system permissions.
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <button 
            type="button" 
            (click)="openCreateRoleModal()"
            class="workora-btn-primary text-xs shadow-md flex items-center gap-2 cursor-pointer">
            <span class="material-symbols-outlined text-base">add_moderator</span>
            <span>+ Create Custom Role</span>
          </button>
        </div>
      </div>

      <!-- Quick KPI Strip (4 Equal Height Metric Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        <!-- Total Roles -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-[#087F73] flex flex-col justify-between min-h-[116px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Total Roles</span>
            <span class="w-9 h-9 rounded-xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">shield_person</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-[#102A2A] font-heading leading-tight my-0.5">{{ totalRoles() }}</p>
            <p class="text-[11px] text-[#718686] font-medium">Configured security roles</p>
          </div>
        </div>

        <!-- System Core Roles -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-blue-500 flex flex-col justify-between min-h-[116px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Core System Roles</span>
            <span class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">lock</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-blue-700 font-heading leading-tight my-0.5">{{ systemRolesCount() }}</p>
            <p class="text-[11px] text-blue-600 font-semibold">Built-in immutable roles</p>
          </div>
        </div>

        <!-- Custom Roles -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-[#16A085] flex flex-col justify-between min-h-[116px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Custom Roles</span>
            <span class="w-9 h-9 rounded-xl bg-teal-50 text-[#16A085] flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">verified_user</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-[#16A085] font-heading leading-tight my-0.5">{{ customRolesCount() }}</p>
            <p class="text-[11px] text-[#718686] font-medium">Tenant-tailored roles</p>
          </div>
        </div>

        <!-- Member Assignments -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-purple-500 flex flex-col justify-between min-h-[116px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">User Assignments</span>
            <span class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">group</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-purple-700 font-heading leading-tight my-0.5">{{ totalAssignedUsers() }}</p>
            <p class="text-[11px] text-[#718686] font-medium">Active role mappings</p>
          </div>
        </div>

      </div>

      <!-- Filter Toolbar (Standardized 40px Height Controls & Uniform Grid) -->
      <div class="workora-card p-4 sm:p-5 space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          
          <!-- 1. Search Box -->
          <div class="relative w-full">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
              search
            </span>
            <input 
              type="text" 
              [ngModel]="searchTerm" 
              (ngModelChange)="onSearchChange($event)"
              (keydown.escape)="clearSearch()"
              placeholder="Search roles by name or description..."
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

          <!-- 2. Role Category Filter -->
          <div class="w-full">
            <app-workora-select
              [options]="roleTypeOptions"
              [ngModel]="selectedRoleType"
              (selectionChange)="onRoleTypeChange($event)"
              [clearable]="true"
              placeholder="All Role Types"
              icon="category">
            </app-workora-select>
          </div>

        </div>

        <!-- Reset Active Filters Bar -->
        @if (searchTerm || selectedRoleType) {
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

      <!-- Roles Grid Cards -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          @for (i of [1,2,3,4,5,6]; track i) {
            <app-workora-skeleton type="card"></app-workora-skeleton>
          }
        </div>
      } @else if (filteredRoles().length === 0) {
        <div class="workora-card p-12">
          <app-workora-empty-state 
            icon="admin_panel_settings" 
            title="No Security Roles Found"
            description="No roles match your current search query or filter selection."
            actionLabel="+ Create Custom Role"
            (actionClick)="openCreateRoleModal()"
          ></app-workora-empty-state>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          @for (role of filteredRoles(); track role.id) {
            <div class="workora-card p-5 sm:p-6 flex flex-col justify-between group hover:border-[#087F73]/40 transition-all shadow-xs hover:shadow-md">
              <div class="space-y-3">
                
                <!-- Card Header with Badges -->
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-2xs"
                      [ngClass]="role.isSystemRole ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-[#DDF7F2] text-[#087F73] border border-[#087F73]/20'">
                      <span class="material-symbols-outlined text-xl">
                        {{ role.isSystemRole ? 'lock' : 'verified_user' }}
                      </span>
                    </div>
                    <div class="min-w-0">
                      <h3 class="font-extrabold text-sm text-[#102A2A] font-heading truncate">{{ role.name }}</h3>
                      <p class="text-[10px] text-slate-400 font-mono">ID: #{{ role.id }}</p>
                    </div>
                  </div>

                  @if (role.isSystemRole) {
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 shrink-0">
                      System Core
                    </span>
                  } @else {
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      Custom Role
                    </span>
                  }
                </div>

                <!-- Description -->
                <p class="text-xs text-[#718686] line-clamp-2 leading-relaxed min-h-[36px]">
                  {{ role.description || 'Standard access governance role configured for platform members.' }}
                </p>

                <!-- Stats Badges -->
                <div class="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#DDE9E6]/60">
                  <div class="p-2.5 bg-[#F6FAF9] rounded-xl border border-[#DDE9E6] flex items-center gap-2">
                    <span class="material-symbols-outlined text-base text-[#087F73]">group</span>
                    <div>
                      <p class="text-[10px] text-[#718686] font-bold uppercase tracking-wider">Members</p>
                      <p class="text-xs font-extrabold text-[#102A2A]">{{ role.userCount }} Assigned</p>
                    </div>
                  </div>

                  <div class="p-2.5 bg-[#F6FAF9] rounded-xl border border-[#DDE9E6] flex items-center gap-2">
                    <span class="material-symbols-outlined text-base text-[#16A085]">shield</span>
                    <div>
                      <p class="text-[10px] text-[#718686] font-bold uppercase tracking-wider">Permissions</p>
                      <p class="text-xs font-extrabold text-[#102A2A]">{{ role.permissionCount }} Active</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Action Buttons -->
              <div class="flex items-center justify-between pt-3.5 mt-3.5 border-t border-[#DDE9E6]">
                <!-- Matrix Permissions Button -->
                <button 
                  type="button" 
                  (click)="openPermissionMatrix(role)"
                  class="px-3 py-1.5 rounded-xl bg-[#DDF7F2] hover:bg-[#087F73] text-[#087F73] hover:text-white text-xs font-bold transition-all cursor-pointer border border-[#087F73]/20 shadow-2xs inline-flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-sm">shield_lock</span>
                  <span>Permissions</span>
                </button>

                <div class="flex items-center gap-1.5">
                  <!-- Clone Button -->
                  <button 
                    type="button" 
                    (click)="openCloneModal(role)"
                    class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#087F73] hover:bg-[#DDF7F2] transition-colors border-none bg-transparent cursor-pointer"
                    title="Clone Role">
                    <span class="material-symbols-outlined text-base">content_copy</span>
                  </button>

                  <!-- Edit & Delete (Custom Roles only) -->
                  @if (!role.isSystemRole) {
                    <button 
                      type="button" 
                      (click)="openEditRoleModal(role)"
                      class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#087F73] hover:bg-[#DDF7F2] transition-colors border-none bg-transparent cursor-pointer"
                      title="Edit Role">
                      <span class="material-symbols-outlined text-base">edit</span>
                    </button>
                    
                    <button 
                      type="button" 
                      (click)="promptDeleteRole(role)"
                      class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border-none bg-transparent cursor-pointer"
                      title="Delete Role">
                      <span class="material-symbols-outlined text-base">delete</span>
                    </button>
                  }
                </div>
              </div>

            </div>
          }
        </div>

        <!-- Pagination -->
        <div class="workora-card p-4 sm:p-5 overflow-hidden">
          <app-workora-pagination
            [pageNumber]="pageIndex()"
            [totalPages]="totalPages()"
            [totalCount]="totalRoles()"
            [pageSize]="pageSize"
            (pageChange)="onPageChange($event)"
          ></app-workora-pagination>
        </div>
      }

      <!-- Modals -->
      @if (isRoleModalOpen()) {
        <app-role-form-modal
          [role]="selectedRole()"
          [isSubmitting]="isSubmittingModal()"
          (closeModal)="isRoleModalOpen.set(false)"
          (saveRole)="onSaveRole($event)"
        ></app-role-form-modal>
      }

      @if (isCloneModalOpen()) {
        <app-clone-role-modal
          [role]="selectedRole()"
          [isSubmitting]="isSubmittingModal()"
          (closeModal)="isCloneModalOpen.set(false)"
          (cloneRole)="onCloneRole($event)"
        ></app-clone-role-modal>
      }

      @if (isMatrixModalOpen()) {
        <app-permission-matrix-modal
          [roleDetail]="activeRoleDetail()"
          [moduleGroups]="permissionCatalog()"
          [isSubmitting]="isSubmittingModal()"
          (closeModal)="isMatrixModalOpen.set(false)"
          (savePermissions)="onSaveRolePermissions($event)"
        ></app-permission-matrix-modal>
      }

      <!-- Confirmation Dialog -->
      @if (confirmDialogState(); as dialog) {
        <app-workora-confirm-dialog
          [isOpen]="true"
          [title]="dialog.title"
          [message]="dialog.message"
          [confirmText]="dialog.confirmText || 'Delete'"
          variant="danger"
          (confirm)="dialog.onConfirm()"
          (cancel)="confirmDialogState.set(null)"
        ></app-workora-confirm-dialog>
      }

    </div>
  `
})
export class RoleListPageComponent implements OnInit {
  private readonly roleRepo = inject(RolePermissionApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly roles = signal<Role[]>([]);
  readonly totalRoles = signal<number>(0);
  readonly pageIndex = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly isLoading = signal<boolean>(false);
  readonly pageSize = 9;

  searchTerm = '';
  selectedRoleType?: string;

  readonly roleTypeOptions: WorkoraSelectOption<string>[] = [
    { value: 'system', label: 'System Core Roles', icon: 'lock' },
    { value: 'custom', label: 'Custom Defined Roles', icon: 'verified_user' }
  ];

  // Permissions Catalog
  readonly permissionCatalog = signal<ModulePermissions[]>([]);

  // Computed metrics
  readonly systemRolesCount = computed<number>(() => {
    return this.roles().filter(r => r.isSystemRole).length;
  });

  readonly customRolesCount = computed<number>(() => {
    return this.roles().filter(r => !r.isSystemRole).length;
  });

  readonly totalAssignedUsers = computed<number>(() => {
    return this.roles().reduce((acc, curr) => acc + (curr.userCount || 0), 0);
  });

  readonly filteredRoles = computed<Role[]>(() => {
    let result = this.roles();
    if (this.selectedRoleType === 'system') {
      result = result.filter(r => r.isSystemRole);
    } else if (this.selectedRoleType === 'custom') {
      result = result.filter(r => !r.isSystemRole);
    }
    return result;
  });

  // Modals & Active Role Detail
  readonly isRoleModalOpen = signal<boolean>(false);
  readonly selectedRole = signal<Role | null>(null);
  readonly isCloneModalOpen = signal<boolean>(false);
  readonly isMatrixModalOpen = signal<boolean>(false);
  readonly activeRoleDetail = signal<RoleDetail | null>(null);
  readonly isSubmittingModal = signal<boolean>(false);

  readonly confirmDialogState = signal<{
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  private searchDebounceTimer?: any;

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissionsCatalog();
  }

  loadRoles(): void {
    this.isLoading.set(true);
    this.roleRepo.getRoles({
      pageNumber: this.pageIndex(),
      pageSize: this.pageSize,
      searchTerm: this.searchTerm?.trim() || undefined
    })
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: paged => {
        this.roles.set(paged.items || []);
        this.totalRoles.set(paged.totalCount || 0);
        this.totalPages.set(paged.totalPages || 1);
      },
      error: err => this.notificationService.showError(err.message || 'Failed to load roles list.')
    });
  }

  loadPermissionsCatalog(): void {
    this.roleRepo.getPermissions().subscribe({
      next: groups => this.permissionCatalog.set(groups),
      error: err => console.warn('Permissions catalog fetch notice:', err)
    });
  }

  onRoleTypeChange(val: any): void {
    const roleType = val !== null && val !== undefined && typeof val === 'object' && 'value' in val
      ? val.value
      : (val || undefined);
    this.selectedRoleType = roleType;
  }

  onSearchChange(val: string): void {
    this.searchTerm = val || '';
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    if (!this.searchTerm.trim()) {
      this.pageIndex.set(1);
      this.loadRoles();
      return;
    }
    this.searchDebounceTimer = setTimeout(() => {
      this.pageIndex.set(1);
      this.loadRoles();
    }, 250);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.pageIndex.set(1);
    this.loadRoles();
  }

  resetAllFilters(): void {
    this.searchTerm = '';
    this.selectedRoleType = undefined;
    this.pageIndex.set(1);
    this.loadRoles();
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.loadRoles();
  }

  openCreateRoleModal(): void {
    this.selectedRole.set(null);
    this.isRoleModalOpen.set(true);
  }

  openEditRoleModal(role: Role): void {
    this.selectedRole.set(role);
    this.isRoleModalOpen.set(true);
  }

  openCloneModal(role: Role): void {
    this.selectedRole.set(role);
    this.isCloneModalOpen.set(true);
  }

  openPermissionMatrix(role: Role): void {
    this.isLoading.set(true);
    this.roleRepo.getRoleById(role.id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: roleDetail => {
          this.activeRoleDetail.set(roleDetail);
          this.isMatrixModalOpen.set(true);
        },
        error: err => this.notificationService.showError(err.message || 'Failed to fetch role permissions.')
      });
  }

  onSaveRole(params: CreateRoleParams | UpdateRoleParams): void {
    this.isSubmittingModal.set(true);
    const obs = 'id' in params
      ? this.roleRepo.updateRole(params)
      : this.roleRepo.createRole(params);

    obs.pipe(finalize(() => this.isSubmittingModal.set(false))).subscribe({
      next: () => {
        this.isRoleModalOpen.set(false);
        this.notificationService.showSuccess('Role saved successfully.');
        this.loadRoles();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to save role.')
    });
  }

  onCloneRole(params: CloneRoleParams): void {
    this.isSubmittingModal.set(true);
    this.roleRepo.cloneRole(params)
      .pipe(finalize(() => this.isSubmittingModal.set(false)))
      .subscribe({
        next: () => {
          this.isCloneModalOpen.set(false);
          this.notificationService.showSuccess('Role cloned successfully.');
          this.loadRoles();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to clone role.')
      });
  }

  onSaveRolePermissions(payload: { roleId: number; permissionIds: number[] }): void {
    this.isSubmittingModal.set(true);
    this.roleRepo.setRolePermissions({
      roleId: payload.roleId,
      permissionIds: payload.permissionIds
    })
    .pipe(finalize(() => this.isSubmittingModal.set(false)))
    .subscribe({
      next: () => {
        this.isMatrixModalOpen.set(false);
        this.notificationService.showSuccess('Role permissions updated successfully.');
        this.loadRoles();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to update permissions.')
    });
  }

  promptDeleteRole(role: Role): void {
    this.confirmDialogState.set({
      title: `Delete Role: ${role.name}`,
      message: `Are you sure you want to delete "${role.name}"? This action cannot be undone.`,
      onConfirm: () => {
        this.roleRepo.deleteRole(role.id).subscribe({
          next: () => {
            this.confirmDialogState.set(null);
            this.notificationService.showSuccess('Role deleted successfully.');
            this.loadRoles();
          },
          error: err => this.notificationService.showError(err.message || 'Failed to delete role.')
        });
      }
    });
  }
}
