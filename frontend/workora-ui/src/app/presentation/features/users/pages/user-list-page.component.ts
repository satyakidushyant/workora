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
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraConfirmDialogComponent } from '../../../shared/components/workora-confirm-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * Enterprise HRMS User Management Page Component.
 * Styled with the unified Workora SaaS design system, real-time filters, search,
 * user status management, password override, CRUD modal operations, and GSAP motion.
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
    WorkoraEmptyStateComponent,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraConfirmDialogComponent
  ],
  template: `
    <div class="p-3.5 xs:p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl mx-auto w-full relative z-10">
      
      <!-- Top Navigation / Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 user-header">
        <div>
          <div class="flex items-center gap-1.5 xs:gap-2 text-[11px] xs:text-xs text-[#0E6E68] font-semibold mb-1">
            <a routerLink="/dashboard" class="hover:text-[#063B39] transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">dashboard</span>
              <span>Dashboard</span>
            </a>
            <span>/</span>
            <span class="text-[#063B39] font-bold">User Directory</span>
          </div>
          <h1 class="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">User Directory</h1>
          <p class="text-xs sm:text-sm text-[#6B7F7C] mt-0.5">Manage system access, corporate roles, directory permissions, and credential security.</p>
        </div>

        <button
          (click)="openCreateModal()"
          class="workora-btn-primary px-4 sm:px-5 py-2 sm:py-2.5 text-xs shadow-teal w-full sm:w-auto">
          <span class="material-symbols-outlined text-base">person_add</span>
          <span>Add User Account</span>
        </button>
      </div>

      <!-- Metric Cards (3 Cards) -->
      <div class="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 user-stats-grid">
        
        <div class="p-4 sm:p-5 bg-white border border-[#DCEBE7] rounded-2xl shadow-xs flex items-center justify-between workora-card">
          <div>
            <p class="text-[11px] sm:text-xs font-bold text-[#6B7F7C] uppercase tracking-wider">Total Accounts</p>
            <h3 class="text-xl sm:text-2xl font-extrabold text-[#063B39] mt-1 font-heading">{{ totalUsersCount() }}</h3>
          </div>
          <div class="p-2.5 sm:p-3 bg-[#DCEBE7] text-[#0E6E68] rounded-xl shrink-0">
            <span class="material-symbols-outlined text-xl sm:text-2xl">groups</span>
          </div>
        </div>

        <div class="p-4 sm:p-5 bg-white border border-[#DCEBE7] rounded-2xl shadow-xs flex items-center justify-between workora-card">
          <div>
            <p class="text-[11px] sm:text-xs font-bold text-[#6B7F7C] uppercase tracking-wider">Active Access</p>
            <h3 class="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1 font-heading">{{ activeUsersCount() }}</h3>
          </div>
          <div class="p-2.5 sm:p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <span class="material-symbols-outlined text-xl sm:text-2xl">how_to_reg</span>
          </div>
        </div>

        <div class="p-4 sm:p-5 bg-white border border-[#DCEBE7] rounded-2xl shadow-xs flex items-center justify-between workora-card">
          <div>
            <p class="text-[11px] sm:text-xs font-bold text-[#6B7F7C] uppercase tracking-wider">Deactivated</p>
            <h3 class="text-xl sm:text-2xl font-extrabold text-rose-600 mt-1 font-heading">{{ inactiveUsersCount() }}</h3>
          </div>
          <div class="p-2.5 sm:p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
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
            (click)="onFilterStatus(null)"
            class="flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer text-center"
            [ngClass]="activeFilter() === null ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#0E6E68] bg-transparent'">
            All Users
          </button>
          <button
            type="button"
            (click)="onFilterStatus(true)"
            class="flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer text-center"
            [ngClass]="activeFilter() === true ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-emerald-600 bg-transparent'">
            Active
          </button>
          <button
            type="button"
            (click)="onFilterStatus(false)"
            class="flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer text-center"
            [ngClass]="activeFilter() === false ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-rose-600 bg-transparent'">
            Inactive
          </button>
        </div>

        <!-- Search Input with Clear Action -->
        <div class="relative w-full sm:w-72">
          <span class="material-symbols-outlined text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">search</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange()"
            placeholder="Search by name or email..."
            class="workora-input pl-10 pr-9 text-xs !py-2.5" 
          />
          @if (searchQuery) {
            <button 
              type="button"
              (click)="clearSearch()"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs border-none bg-transparent cursor-pointer flex items-center justify-center p-0.5 rounded-full hover:bg-slate-100"
              aria-label="Clear search"
            >
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          }
        </div>
      </div>

      <!-- Table Container -->
      <div class="bg-white border border-[#DCEBE7] rounded-2xl shadow-xs overflow-hidden workora-card user-table-card">
        
        <!-- Loading State via Reusable Skeleton Component -->
        @if (isLoading()) {
          <app-workora-skeleton type="table" [count]="5"></app-workora-skeleton>
        }

        <!-- Empty State via Reusable Component -->
        @if (!isLoading() && users().length === 0) {
          <app-workora-empty-state
            icon="person_search"
            title="No Users Matching Query"
            description="There are currently no user accounts matching your active filter or search terms."
            actionLabel="Add New User"
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
                  <th>User Profile</th>
                  <th>Status</th>
                  <th>Linked Employee</th>
                  <th>Created Date</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (user of users(); track user.id) {
                  <tr>
                    <!-- User Profile & Avatar -->
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-[#0E6E68] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-white">
                          {{ getInitials(user.firstName, user.lastName) }}
                        </div>
                        <div>
                          <div class="font-bold text-[#063B39]">{{ user.fullName }}</div>
                          <div class="text-[11px] text-[#6B7F7C] mt-0.5">
                            <span>{{ user.email }}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Status Pill -->
                    <td>
                      @if (user.isActive) {
                        <span class="workora-badge-success">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Active</span>
                        </span>
                      } @else {
                        <span class="workora-badge-danger">
                          <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          <span>Inactive</span>
                        </span>
                      }
                    </td>

                    <!-- Linked Employee -->
                    <td>
                      @if (user.employeeId) {
                        <span class="inline-flex items-center gap-1 text-xs font-semibold text-[#0E6E68]">
                          <span class="material-symbols-outlined text-sm">badge</span>
                          <span>Linked (ID: {{ user.employeeId }})</span>
                        </span>
                      } @else {
                        <span class="text-[11px] text-slate-400 italic">Not Linked</span>
                      }
                    </td>

                    <!-- Created Date -->
                    <td class="text-[#6B7F7C] text-xs">
                      {{ user.createdAt | date:'mediumDate' }}
                    </td>

                    <!-- Action Buttons -->
                    <td class="text-right">
                      <div class="inline-flex items-center gap-1.5 justify-end">
                        <!-- Edit Button -->
                        <button
                          type="button"
                          (click)="openEditModal(user)"
                          class="workora-btn-icon !w-8 !h-8"
                          title="Edit User Profile"
                          aria-label="Edit user"
                        >
                          <span class="material-symbols-outlined text-base">edit</span>
                        </button>

                        <!-- Reset Password Button -->
                        <button
                          type="button"
                          (click)="openResetPasswordModal(user)"
                          class="workora-btn-icon !w-8 !h-8"
                          title="Reset Password"
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
                            {{ user.isActive ? 'block' : 'check_circle' }}
                          </span>
                        </button>

                        <!-- Delete Button -->
                        <button
                          type="button"
                          (click)="promptDeleteUser(user)"
                          class="workora-btn-icon workora-btn-icon-danger !w-8 !h-8"
                          title="Delete User"
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

          <!-- Reusable Pagination Component -->
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

    <!-- Admin Reset Password Modal -->
    @if (showResetPasswordModal()) {
      <app-admin-reset-password-modal
        [user]="selectedUser()"
        [isLoading]="isSubmittingModal()"
        (confirm)="onConfirmResetPassword($event)"
        (cancel)="showResetPasswordModal.set(false)"
      ></app-admin-reset-password-modal>
    }

    <!-- Destructive Delete Confirmation Dialog -->
    <app-workora-confirm-dialog
      [isOpen]="showDeleteConfirm()"
      title="Delete User Account?"
      [message]="deleteConfirmMessage"
      confirmText="Delete Account"
      cancelText="Cancel"
      variant="danger"
      [isLoading]="isDeletingUser()"
      (confirm)="confirmDeleteUser()"
      (cancel)="showDeleteConfirm.set(false)"
    ></app-workora-confirm-dialog>
  `
})
export class UserListPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly userRepo: IUserRepository = inject(USER_REPOSITORY);
  private readonly notificationService = inject(NotificationService);

  readonly users = signal<UserSummary[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly pageNumber = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalPages = signal<number>(1);
  readonly totalCount = signal<number>(0);

  searchQuery = '';
  private searchTimeout?: ReturnType<typeof setTimeout>;

  readonly activeFilter = signal<boolean | null>(null);

  readonly showFormModal = signal<boolean>(false);
  readonly showResetPasswordModal = signal<boolean>(false);
  readonly isSubmittingModal = signal<boolean>(false);
  readonly selectedUser = signal<UserSummary | null>(null);

  // Delete confirmation dialog signals
  readonly showDeleteConfirm = signal<boolean>(false);
  readonly isDeletingUser = signal<boolean>(false);
  userToDelete: UserSummary | null = null;
  deleteConfirmMessage = '';

  readonly totalUsersCount = signal<number>(0);
  readonly activeUsersCount = signal<number>(0);
  readonly inactiveUsersCount = signal<number>(0);

  private ctx?: gsap.Context;

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    this.ctx = gsap.context(() => {
      gsap.from('.user-header', {
        y: -15,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
      });

      gsap.from('.user-stats-grid > *', {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power3.out',
        delay: 0.1
      });
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  loadUsers(): void {
    this.isLoading.set(true);

    const queryParams: UserQueryParams = {
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      searchTerm: this.searchQuery.trim() || undefined,
      isActive: this.activeFilter()
    };

    this.userRepo.getUsers(queryParams).subscribe({
      next: (response: PagedResponse<UserSummary>) => {
        this.users.set(response.items);
        this.totalPages.set(response.totalPages);
        this.totalCount.set(response.totalCount);
        this.totalUsersCount.set(response.totalCount);

        const activeCount = response.items.filter((u: UserSummary) => u.isActive).length;
        this.activeUsersCount.set(activeCount);
        this.inactiveUsersCount.set(response.items.length - activeCount);

        this.isLoading.set(false);
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.message || 'Failed to load user accounts.';
        this.notificationService.showError(msg);
        this.isLoading.set(false);
      }
    });
  }

  onFilterStatus(status: boolean | null): void {
    this.activeFilter.set(status);
    this.pageNumber.set(1);
    this.loadUsers();
  }

  onSearchChange(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.pageNumber.set(1);
      this.loadUsers();
    }, 300);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.pageNumber.set(1);
    this.loadUsers();
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.pageNumber.set(newPage);
      this.loadUsers();
    }
  }

  openCreateModal(): void {
    this.selectedUser.set(null);
    this.showFormModal.set(true);
  }

  openEditModal(user: UserSummary): void {
    this.selectedUser.set(user);
    this.showFormModal.set(true);
  }

  openResetPasswordModal(user: UserSummary): void {
    this.selectedUser.set(user);
    this.showResetPasswordModal.set(true);
  }

  onSaveUser(payload: CreateUserParams | UpdateUserParams): void {
    this.isSubmittingModal.set(true);

    if ('id' in payload) {
      this.userRepo.updateUser(payload as UpdateUserParams).subscribe({
        next: () => {
          this.notificationService.showSuccess('User profile updated successfully.');
          this.isSubmittingModal.set(false);
          this.showFormModal.set(false);
          this.loadUsers();
        },
        error: (err: any) => {
          const msg = err?.error?.message || err?.message || 'Failed to update user profile.';
          this.notificationService.showError(msg);
          this.isSubmittingModal.set(false);
        }
      });
    } else {
      this.userRepo.createUser(payload as CreateUserParams).subscribe({
        next: () => {
          this.notificationService.showSuccess('User account created successfully.');
          this.isSubmittingModal.set(false);
          this.showFormModal.set(false);
          this.loadUsers();
        },
        error: (err: any) => {
          const msg = err?.error?.message || err?.message || 'Failed to create user account.';
          this.notificationService.showError(msg);
          this.isSubmittingModal.set(false);
        }
      });
    }
  }

  toggleStatus(user: UserSummary): void {
    const action$ = user.isActive
      ? this.userRepo.deactivateUser(user.id)
      : this.userRepo.activateUser(user.id);

    action$.subscribe({
      next: () => {
        const msg = user.isActive ? 'User account deactivated.' : 'User account reactivated.';
        this.notificationService.showSuccess(msg);
        this.loadUsers();
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.message || 'Failed to update user status.';
        this.notificationService.showError(msg);
      }
    });
  }

  onConfirmResetPassword(payload: AdminResetPasswordParams): void {
    this.isSubmittingModal.set(true);

    this.userRepo.adminResetPassword(payload).subscribe({
      next: () => {
        this.notificationService.showSuccess('Password reset successfully.');
        this.isSubmittingModal.set(false);
        this.showResetPasswordModal.set(false);
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.message || 'Failed to reset password.';
        this.notificationService.showError(msg);
        this.isSubmittingModal.set(false);
      }
    });
  }

  promptDeleteUser(user: UserSummary): void {
    this.userToDelete = user;
    this.deleteConfirmMessage = `Are you sure you want to permanently delete the user account for ${user.fullName} (${user.email})? This action cannot be undone.`;
    this.showDeleteConfirm.set(true);
  }

  confirmDeleteUser(): void {
    if (!this.userToDelete) return;

    this.isDeletingUser.set(true);
    this.userRepo.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('User account deleted.');
        this.isDeletingUser.set(false);
        this.showDeleteConfirm.set(false);
        this.userToDelete = null;
        this.loadUsers();
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.message || 'Failed to delete user.';
        this.notificationService.showError(msg);
        this.isDeletingUser.set(false);
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    const f = firstName ? firstName.charAt(0).toUpperCase() : '';
    const l = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${f}${l}` || 'U';
  }
}
