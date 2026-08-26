import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { RoleFormModalComponent } from '../components/role-form-modal.component';
import { CloneRoleModalComponent } from '../components/clone-role-modal.component';
import { PermissionMatrixModalComponent } from '../components/permission-matrix-modal.component';

/**
 * Smart Container Page for managing System & Custom Roles and RBAC Permissions Matrix.
 */
@Component({
  selector: 'app-role-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraEmptyStateComponent,
    WorkoraConfirmDialogComponent,
    RoleFormModalComponent,
    CloneRoleModalComponent,
    PermissionMatrixModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">admin_panel_settings</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Roles &amp; Permissions (RBAC)
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Define organizational security roles, assign granular capabilities, and govern access barriers.
          </p>
        </div>

        <button 
          type="button" 
          (click)="openCreateRoleModal()"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
          <span class="material-symbols-outlined text-base">add_moderator</span>
          <span>Create Custom Role</span>
        </button>
      </div>

      <!-- Controls & Search -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DCEBE7] shadow-2xs">
        <div class="relative flex-1 max-w-md">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="onSearch()"
            placeholder="Search roles by title or description..."
            class="w-full pl-9 pr-4 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
          />
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-slate-500">
            Total Roles: <span class="text-[#0E6E68] font-extrabold">{{ totalRoles() }}</span>
          </span>
        </div>
      </div>

      <!-- Roles Grid Cards -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (i of [1,2,3]; track i) {
            <app-workora-skeleton type="card"></app-workora-skeleton>
          }
        </div>
      } @else if (roles().length === 0) {
        <div class="bg-white rounded-3xl p-12 border border-[#DCEBE7] shadow-xs">
          <app-workora-empty-state 
            icon="admin_panel_settings" 
            title="No Roles Found"
            description="Create custom security roles or search by title."
            actionLabel="Create Role"
            (actionClick)="openCreateRoleModal()"
          ></app-workora-empty-state>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (role of roles(); track role.id) {
            <div class="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCEBE7] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <!-- Top Badge & Role Title -->
                <div class="flex items-start justify-between gap-3 mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl text-[#0E6E68] flex items-center justify-center font-bold"
                      [ngClass]="role.isSystemRole ? 'bg-blue-50 text-blue-700' : 'bg-[#3FA79B]/15 text-[#0E6E68]'">
                      <span class="material-symbols-outlined text-xl">
                        {{ role.isSystemRole ? 'lock' : 'verified_user' }}
                      </span>
                    </div>
                    <div>
                      <h3 class="font-extrabold text-sm text-[#063B39]">{{ role.name }}</h3>
                      <p class="text-[10px] text-slate-400">ID: #{{ role.id }}</p>
                    </div>
                  </div>

                  @if (role.isSystemRole) {
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
                      System Core
                    </span>
                  } @else {
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      Custom Role
                    </span>
                  }
                </div>

                <!-- Description -->
                <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[36px] mt-2">
                  {{ role.description || 'No specific description provided for this role.' }}
                </p>

                <!-- Stats Badges -->
                <div class="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#DCEBE7]/70">
                  <div class="p-2.5 bg-[#F4F8F7] rounded-xl border border-[#DCEBE7]/50 flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-base text-[#0E6E68]">group</span>
                    <div>
                      <p class="text-[10px] text-slate-500 font-bold uppercase">Users</p>
                      <p class="text-xs font-extrabold text-[#063B39]">{{ role.userCount }} Members</p>
                    </div>
                  </div>

                  <div class="p-2.5 bg-[#F4F8F7] rounded-xl border border-[#DCEBE7]/50 flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-base text-[#3FA79B]">shield</span>
                    <div>
                      <p class="text-[10px] text-slate-500 font-bold uppercase">Permissions</p>
                      <p class="text-xs font-extrabold text-[#063B39]">{{ role.permissionCount }} Active</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-between pt-4 mt-4 border-t border-[#DCEBE7]">
                <!-- Matrix button -->
                <button 
                  type="button" 
                  (click)="openPermissionMatrix(role)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E6E68]/10 hover:bg-[#0E6E68] text-[#0E6E68] hover:text-white text-xs font-bold transition-all cursor-pointer border-none">
                  <span class="material-symbols-outlined text-base">shield_lock</span>
                  <span>Permissions</span>
                </button>

                <div class="flex items-center gap-1">
                  <!-- Clone Button -->
                  <button 
                    type="button" 
                    (click)="openCloneModal(role)"
                    class="p-1.5 rounded-lg text-slate-500 hover:text-[#0E6E68] hover:bg-[#3FA79B]/10 transition-colors border-none bg-transparent cursor-pointer"
                    title="Clone Role">
                    <span class="material-symbols-outlined text-base">content_copy</span>
                  </button>

                  <!-- Edit (Custom only) -->
                  @if (!role.isSystemRole) {
                    <button 
                      type="button" 
                      (click)="openEditRoleModal(role)"
                      class="p-1.5 rounded-lg text-slate-500 hover:text-[#0E6E68] hover:bg-[#3FA79B]/10 transition-colors border-none bg-transparent cursor-pointer"
                      title="Edit Role">
                      <span class="material-symbols-outlined text-base">edit</span>
                    </button>
                    
                    <button 
                      type="button" 
                      (click)="promptDeleteRole(role)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border-none bg-transparent cursor-pointer"
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
        <div class="bg-white rounded-2xl p-4 border border-[#DCEBE7]">
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
  searchTerm = '';
  readonly pageSize = 9;

  // Permissions Catalog
  readonly permissionCatalog = signal<ModulePermissions[]>([]);

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

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissionsCatalog();
  }

  loadRoles(): void {
    this.isLoading.set(true);
    this.roleRepo.getRoles({
      pageNumber: this.pageIndex(),
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined
    })
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: paged => {
        this.roles.set(paged.items);
        this.totalRoles.set(paged.totalCount);
        this.totalPages.set(paged.totalPages);
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

  onSearch(): void {
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
