import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { USER_REPOSITORY, IUserRepository } from '../../../../domain/repositories/i-user.repository';
import { UserSummary, UserQueryParams, CreateUserParams, UpdateUserParams, AdminResetPasswordParams } from '../../../../domain/models/user.model';
import { PagedResponse } from '../../../../domain/models/api-response.model';
import { UserFormModalComponent } from '../components/user-form-modal.component';
import { AdminResetPasswordModalComponent } from '../components/admin-reset-password-modal.component';
import { AssignRoleModalComponent } from '../components/assign-role-modal.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraConfirmDialogComponent } from '../../../shared/components/workora-confirm-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * Humanized Workora Team Directory & User Management Component.
 * Enables people managers and admins to manage team credentials,
 * directory roles, and permissions with empathetic UI cues and fast search.
 */
@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    UserFormModalComponent, 
    AdminResetPasswordModalComponent,
    AssignRoleModalComponent,
    WorkoraEmptyStateComponent,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraConfirmDialogComponent
  ],
  template: `
    <div class="p-3.5 xs:p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl mx-auto w-full">
      
      <!-- Top Navigation / Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 user-header">
        <div>
          <div class="flex items-center gap-1.5 xs:gap-2 text-[11px] xs:text-xs text-[#0E6E68] font-semibold mb-1">
            <a routerLink="/dashboard" class="hover:text-[#063B39] transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">dashboard</span>
              <span>Dashboard</span>
            </a>
            <span>/</span>
            <span class="text-[#063B39] font-bold">Team Directory</span>
          </div>
          <h1 class="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">Team Directory</h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-0.5">Manage team members, corporate roles, and login access.</p>
        </div>

        <button
          (click)="openCreateModal()"
          class="workora-btn-primary px-5 py-2.5 text-xs shadow-md w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer">
          <span class="material-symbols-outlined text-base">person_add</span>
          <span>Add Team Member</span>
        </button>
      </div>

      <!-- Metric Cards (3 Cards) -->
      <div class="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 user-stats-grid">
        
        <div class="p-4 sm:p-5 bg-white border border-[#DCEBE7] rounded-3xl shadow-xs flex items-center justify-between workora-card">
          <div>
            <p class="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total Accounts</p>
            <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-1 font-heading">{{ totalUsersCount() }}</h3>
          </div>
          <div class="p-3 bg-[#DCEBE7] text-[#0E6E68] rounded-2xl shrink-0">
            <span class="material-symbols-outlined text-xl sm:text-2xl">groups</span>
          </div>
        </div>

        <div class="p-4 sm:p-5 bg-white border border-[#DCEBE7] rounded-3xl shadow-xs flex items-center justify-between workora-card">
          <div>
            <p class="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Active Today</p>
            <h3 class="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1 font-heading">{{ activeUsersCount() }}</h3>
          </div>
          <div class="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
            <span class="material-symbols-outlined text-xl sm:text-2xl">how_to_reg</span>
          </div>
        </div>

        <div class="p-4 sm:p-5 bg-white border border-[#DCEBE7] rounded-3xl shadow-xs flex items-center justify-between workora-card">
          <div>
            <p class="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Inactive / Deactivated</p>
            <h3 class="text-xl sm:text-2xl font-extrabold text-slate-600 mt-1 font-heading">{{ inactiveUsersCount() }}</h3>
          </div>
          <div class="p-3 bg-slate-100 text-slate-500 rounded-2xl shrink-0">
            <span class="material-symbols-outlined text-xl sm:text-2xl">person_off</span>
          </div>
        </div>
      </div>

      <!-- Filter & Search Bar -->
      <div class="p-3.5 sm:p-4 bg-white border border-[#DCEBE7] rounded-2xl shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 workora-card">
        
        <!-- Filter Tabs -->
        <div class="flex items-center gap-1 bg-[#FAFCFB] border border-[#DCEBE7] p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            (click)="setFilter(null)"
            [ngClass]="activeFilter() === null ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-[#6B7F7C] hover:text-[#063B39] bg-transparent'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex-1 sm:flex-none text-center">
            All Members
          </button>
          <button
            type="button"
            (click)="setFilter(true)"
            [ngClass]="activeFilter() === true ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-[#6B7F7C] hover:text-[#063B39] bg-transparent'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex-1 sm:flex-none text-center">
            Active
          </button>
          <button
            type="button"
            (click)="setFilter(false)"
            [ngClass]="activeFilter() === false ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-[#6B7F7C] hover:text-[#063B39] bg-transparent'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex-1 sm:flex-none text-center">
            Inactive
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
            placeholder="Search by name or email..."
            class="workora-input pl-9 pr-4 text-xs !py-2 w-full"
          />
          <span class="material-symbols-outlined text-slate-400 absolute left-2.5 top-2.5 text-base pointer-events-none">search</span>
          @if (searchQuery) {
            <button
              (click)="clearSearch()"
              class="material-symbols-outlined text-slate-400 hover:text-slate-600 absolute right-2.5 top-2.5 text-base border-none bg-transparent cursor-pointer">
              close
            </button>
          }
        </div>
      </div>

      <!-- Users Table Card -->
      <div class="bg-white border border-[#DCEBE7] rounded-3xl shadow-xs overflow-hidden workora-card">
        
        <!-- Loading State -->
        @if (isLoading()) {
          <app-workora-skeleton type="table" [count]="5"></app-workora-skeleton>
        }

        <!-- Empty State -->
        @if (!isLoading() && users().length === 0) {
          <app-workora-empty-state
            icon="person_search"
            title="No Team Members Found"
            description="We couldn't find anyone matching your current search or filter. Try adjusting your search term or add a new team member."
            actionLabel="Add Team Member"
            actionIcon="person_add"
            (actionClicked)="openCreateModal()"
          ></app-workora-empty-state>
        }

        <!-- Data Table -->
        @if (!isLoading() && users().length > 0) {
          <div class="workora-table-responsive">
            <table class="workora-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Assigned Role</th>
                  <th>Status</th>
                  <th>Employee ID</th>
                  <th>Member Since</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (user of users(); track user.id) {
                  <tr>
                    <!-- User Profile & Avatar -->
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0E6E68] to-[#3FA79B] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-white">
                          {{ getInitials(user.firstName, user.lastName) }}
                        </div>
                        <div>
                          <div class="font-bold text-[#063B39]">{{ user.fullName }}</div>
                          <div class="text-[11px] text-slate-500 mt-0.5">
                            <span>{{ user.email }}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Assigned Role -->
                    <td>
                      @if (user.roles && user.roles.length > 0) {
                        @for (r of user.roles; track r) {
                          <span 
                            [ngClass]="{
                              'bg-purple-50 text-purple-700 border-purple-200': r === 'SuperAdmin',
                              'bg-emerald-50 text-emerald-700 border-emerald-200': r === 'HRAdmin',
                              'bg-blue-50 text-blue-700 border-blue-200': r === 'FinanceManager',
                              'bg-amber-50 text-amber-700 border-amber-200': r === 'Manager',
                              'bg-slate-50 text-slate-700 border-slate-200': r === 'Employee'
                            }"
                            class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border mr-1 inline-block">
                            {{ r }}
                          </span>
                        }
                      } @else {
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-50 text-slate-600 border border-slate-200">
                          Employee
                        </span>
                      }
                    </td>

                    <!-- Status Pill -->
                    <td>
                      @if (user.isActive) {
                        <span class="workora-badge-success">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Active</span>
                        </span>
                      } @else {
                        <span class="workora-badge-neutral">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          <span>Inactive</span>
                        </span>
                      }
                    </td>

                    <!-- Linked Employee -->
                    <td>
                      @if (user.employeeId) {
                        <span class="inline-flex items-center gap-1 text-xs font-semibold text-[#0E6E68]">
                          <span class="material-symbols-outlined text-sm">badge</span>
                          <span>ID: {{ user.employeeId }}</span>
                        </span>
                      } @else {
                        <span class="text-[11px] text-slate-400 italic">Direct User</span>
                      }
                    </td>

                    <!-- Created Date -->
                    <td class="text-slate-500 text-xs">
                      {{ user.createdAt | date:'mediumDate' }}
                    </td>

                    <!-- Action Buttons -->
                    <td class="text-right">
                      <div class="inline-flex items-center gap-1.5 justify-end">
                        <!-- Assign Role Button -->
                        <button
                          type="button"
                          (click)="openAssignRoleModal(user)"
                          class="workora-btn-icon !w-8 !h-8 text-[#0E6E68] hover:bg-[#DCEBE7]/50"
                          title="Assign Security Role"
                          aria-label="Assign security role"
                        >
                          <span class="material-symbols-outlined text-base">shield_person</span>
                        </button>

                        <!-- Edit Button -->
                        <button
                          type="button"
                          (click)="openEditModal(user)"
                          class="workora-btn-icon !w-8 !h-8"
                          title="Edit Profile"
                          aria-label="Edit user"
                        >
                          <span class="material-symbols-outlined text-base">edit</span>
                        </button>

                        <!-- Reset Password Button -->
                        <button
                          type="button"
                          (click)="openResetPasswordModal(user)"
                          class="workora-btn-icon !w-8 !h-8"
                          title="Set Password"
                          aria-label="Reset password"
                        >
                          <span class="material-symbols-outlined text-base">key</span>
                        </button>

                        <!-- Toggle Status Button -->
                        <button
                          type="button"
                          (click)="toggleStatus(user)"
                          class="workora-btn-icon !w-8 !h-8"
                          [title]="user.isActive ? 'Deactivate Account' : 'Activate Account'"
                          [attr.aria-label]="user.isActive ? 'Deactivate account' : 'Activate account'"
                        >
                          <span class="material-symbols-outlined text-base" [ngClass]="user.isActive ? 'text-amber-600' : 'text-emerald-600'">
                            {{ user.isActive ? 'pause_circle' : 'play_circle' }}
                          </span>
                        </button>

                        <!-- Delete Button -->
                        <button
                          type="button"
                          (click)="promptDeleteUser(user)"
                          class="workora-btn-icon workora-btn-icon-danger !w-8 !h-8"
                          title="Remove Account"
                          aria-label="Delete user"
                        >
                          <span class="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination Component -->
          <app-workora-pagination
            [pageNumber]="pageNumber()"
            [pageSize]="pageSize()"
            [totalCount]="totalCount()"
            [totalPages]="totalPages()"
            (pageChange)="changePage($event)"
          ></app-workora-pagination>
        }

      </div>

    </div>

    <!-- User Create / Edit Modal -->
    @if (showFormModal()) {
      <app-user-form-modal
        [user]="selectedUser()"
        [isLoading]="isSubmittingModal()"
        (save)="onSaveUser($event)"
        (cancel)="showFormModal.set(false)"
      ></app-user-form-modal>
    }

    <!-- Assign Security Role Modal -->
    @if (showAssignRoleModal()) {
      <app-assign-role-modal
        [user]="selectedUser()"
        [isSubmitting]="isSubmittingModal()"
        (assign)="onConfirmAssignRole($event)"
        (cancel)="showAssignRoleModal.set(false)">
      </app-assign-role-modal>
    }

    <!-- Admin Reset Password Modal -->
    @if (showResetPasswordModal()) {
      <app-admin-reset-password-modal
        [user]="selectedUser()"
        [isSubmitting]="isSubmittingModal()"
        (confirm)="onConfirmResetPassword($event)"
        (cancel)="showResetPasswordModal.set(false)"
      ></app-admin-reset-password-modal>
    }

    <!-- Confirm Delete Dialog -->
    @if (showDeleteConfirm()) {
      <app-workora-confirm-dialog
        [isOpen]="showDeleteConfirm()"
        title="Remove User Account"
        [message]="deleteConfirmMessage"
        confirmText="Remove Account"
        cancelText="Keep Account"
        variant="danger"
        [isLoading]="isDeletingUser()"
        (confirm)="confirmDeleteUser()"
        (cancel)="showDeleteConfirm.set(false)"
      ></app-workora-confirm-dialog>
    }
  `
})
export class UserListPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly userRepo = inject<IUserRepository>(USER_REPOSITORY);
  private readonly notificationService = inject(NotificationService);

  readonly users = signal<UserSummary[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isSubmittingModal = signal<boolean>(false);
  readonly isDeletingUser = signal<boolean>(false);

  readonly pageNumber = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalCount = signal<number>(0);
  readonly totalPages = signal<number>(1);

  readonly activeFilter = signal<boolean | null>(null);
  searchQuery = '';

  readonly totalUsersCount = signal<number>(0);
  readonly activeUsersCount = signal<number>(0);
  readonly inactiveUsersCount = signal<number>(0);

  readonly showFormModal = signal<boolean>(false);
  readonly showAssignRoleModal = signal<boolean>(false);
  readonly showResetPasswordModal = signal<boolean>(false);
  readonly showDeleteConfirm = signal<boolean>(false);

  readonly selectedUser = signal<UserSummary | null>(null);
  userToDelete: UserSummary | null = null;
  deleteConfirmMessage = '';

  private ctx?: gsap.Context;

  ngOnInit(): void {
    this.loadUsers();
    this.loadStats();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    this.ctx = gsap.context(() => {
      const el = this.elementRef.nativeElement;
      const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.3, clearProps: 'transform' } });

      if (el.querySelector('.user-header')) {
        tl.from('.user-header', { opacity: 0, y: -10, clearProps: 'transform' });
      }
      if (el.querySelector('.user-stats-grid')) {
        tl.from('.user-stats-grid .workora-card', { opacity: 0, y: 12, stagger: 0.08, clearProps: 'transform' }, '-=0.15');
      }
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    const params: UserQueryParams = {
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      searchTerm: this.searchQuery?.trim() || undefined,
      isActive: this.activeFilter()
    };

    this.userRepo.getUsers(params).subscribe({
      next: (res: PagedResponse<UserSummary>) => {
        this.isLoading.set(false);
        this.users.set(res.items || []);
        this.totalCount.set(res.totalCount || 0);
        this.totalPages.set(res.totalPages || 1);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || err?.message || 'Failed to load user directory.';
        this.notificationService.showError(msg);
      }
    });
  }

  loadStats(): void {
    this.userRepo.getUsers({ pageNumber: 1, pageSize: 1 }).subscribe({
      next: res => this.totalUsersCount.set(res.totalCount || 0),
      error: () => {}
    });

    this.userRepo.getUsers({ pageNumber: 1, pageSize: 1, isActive: true }).subscribe({
      next: res => this.activeUsersCount.set(res.totalCount || 0),
      error: () => {}
    });

    this.userRepo.getUsers({ pageNumber: 1, pageSize: 1, isActive: false }).subscribe({
      next: res => this.inactiveUsersCount.set(res.totalCount || 0),
      error: () => {}
    });
  }

  setFilter(filter: boolean | null): void {
    if (this.activeFilter() === filter) return;
    this.activeFilter.set(filter);
    this.pageNumber.set(1);
    this.loadUsers();
  }

  onSearch(): void {
    this.pageNumber.set(1);
    this.loadUsers();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearch();
  }

  changePage(page: number): void {
    this.pageNumber.set(page);
    this.loadUsers();
  }

  openCreateModal(): void {
    this.selectedUser.set(null);
    this.showFormModal.set(true);
  }

  openEditModal(user: UserSummary): void {
    this.selectedUser.set(user);
    this.showFormModal.set(true);
  }

  openAssignRoleModal(user: UserSummary): void {
    this.selectedUser.set(user);
    this.showAssignRoleModal.set(true);
  }

  openResetPasswordModal(user: UserSummary): void {
    this.selectedUser.set(user);
    this.showResetPasswordModal.set(true);
  }

  onConfirmAssignRole(event: { userId: number; roleId: number }): void {
    this.isSubmittingModal.set(true);
    this.userRepo.assignRoles({ userId: event.userId, roleIds: [event.roleId] }).subscribe({
      next: () => {
        this.isSubmittingModal.set(false);
        this.showAssignRoleModal.set(false);
        this.notificationService.showSuccess(`Role updated successfully for ${this.selectedUser()?.fullName || 'user'}.`);
        this.loadUsers();
      },
      error: (err: any) => {
        this.isSubmittingModal.set(false);
        const msg = err?.error?.message || err?.message || 'Failed to assign role.';
        this.notificationService.showError(msg);
      }
    });
  }

  onSaveUser(payload: CreateUserParams | UpdateUserParams): void {
    this.isSubmittingModal.set(true);

    if ('id' in payload) {
      this.userRepo.updateUser(payload).subscribe({
        next: (updatedUser) => {
          if (payload.roleId) {
            this.userRepo.assignRoles({ userId: updatedUser.id, roleIds: [payload.roleId] }).subscribe({
              next: () => {
                this.isSubmittingModal.set(false);
                this.showFormModal.set(false);
                this.notificationService.showSuccess('User profile and assigned role updated.');
                this.loadUsers();
              },
              error: () => {
                this.isSubmittingModal.set(false);
                this.showFormModal.set(false);
                this.loadUsers();
              }
            });
          } else {
            this.isSubmittingModal.set(false);
            this.showFormModal.set(false);
            this.notificationService.showSuccess('User profile updated successfully.');
            this.loadUsers();
          }
        },
        error: (err: any) => {
          this.isSubmittingModal.set(false);
          const msg = err?.error?.message || err?.message || 'Failed to update user profile.';
          this.notificationService.showError(msg);
        }
      });
    } else {
      const createPayload = payload as CreateUserParams;
      this.userRepo.createUser(createPayload).subscribe({
        next: (newUser: UserSummary) => {
          if (createPayload.roleId) {
            this.userRepo.assignRoles({ userId: newUser.id, roleIds: [createPayload.roleId] }).subscribe({
              next: () => {
                this.isSubmittingModal.set(false);
                this.showFormModal.set(false);
                this.notificationService.showSuccess('New team member added with assigned role!');
                this.loadUsers();
                this.loadStats();
              },
              error: () => {
                this.isSubmittingModal.set(false);
                this.showFormModal.set(false);
                this.loadUsers();
                this.loadStats();
              }
            });
          } else {
            this.isSubmittingModal.set(false);
            this.showFormModal.set(false);
            this.notificationService.showSuccess('New team member added to directory!');
            this.loadUsers();
            this.loadStats();
          }
        },
        error: (err: any) => {
          this.isSubmittingModal.set(false);
          const msg = err?.error?.message || err?.message || 'Failed to add team member.';
          this.notificationService.showError(msg);
        }
      });
    }
  }

  onConfirmResetPassword(payload: AdminResetPasswordParams): void {
    if (!this.selectedUser()) return;

    this.isSubmittingModal.set(true);
    this.userRepo.adminResetPassword(payload).subscribe({
      next: () => {
        this.isSubmittingModal.set(false);
        this.showResetPasswordModal.set(false);
        this.notificationService.showSuccess(`Password updated for ${this.selectedUser()!.fullName}.`);
      },
      error: (err: any) => {
        this.isSubmittingModal.set(false);
        const msg = err?.error?.message || err?.message || 'Failed to reset member password.';
        this.notificationService.showError(msg);
      }
    });
  }

  toggleStatus(user: UserSummary): void {
    const nextStatus = !user.isActive;
    const action$ = user.isActive 
      ? this.userRepo.deactivateUser(user.id) 
      : this.userRepo.activateUser(user.id);

    action$.subscribe({
      next: () => {
        this.notificationService.showSuccess(`Account ${nextStatus ? 'activated' : 'deactivated'} for ${user.fullName}.`);
        this.loadUsers();
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.message || 'Failed to change account status.';
        this.notificationService.showError(msg);
      }
    });
  }

  promptDeleteUser(user: UserSummary): void {
    this.userToDelete = user;
    this.deleteConfirmMessage = `Are you sure you want to remove ${user.fullName} (${user.email}) from the directory?`;
    this.showDeleteConfirm.set(true);
  }

  confirmDeleteUser(): void {
    if (!this.userToDelete) return;

    this.isDeletingUser.set(true);
    this.userRepo.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.isDeletingUser.set(false);
        this.showDeleteConfirm.set(false);
        this.notificationService.showSuccess(`Removed ${this.userToDelete!.fullName} from directory.`);
        this.userToDelete = null;
        this.loadUsers();
        this.loadStats();
      },
      error: (err: any) => {
        this.isDeletingUser.set(false);
        const msg = err?.error?.message || err?.message || 'Failed to remove team member.';
        this.notificationService.showError(msg);
      }
    });
  }

  getInitials(firstName?: string, lastName?: string): string {
    const f = firstName ? firstName.charAt(0).toUpperCase() : '';
    const l = lastName ? lastName.charAt(0).toUpperCase() : '';
    return f + l || 'U';
  }
}
