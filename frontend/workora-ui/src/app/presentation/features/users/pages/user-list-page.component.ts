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
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * Enterprise HRMS User Management Page Component.
 * Styled with modern Workora SaaS design system, real-time filters, search,
 * user status management, password override, CRUD modal operations, and GSAP motion.
 */
@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, UserFormModalComponent, AdminResetPasswordModalComponent],
  template: `
    <div class="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full relative z-10">
      
      <!-- Top Navigation / Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 user-header">
        <div>
          <div class="flex items-center gap-2 text-xs text-[#0E6E68]/70 mb-1">
            <a routerLink="/dashboard" class="hover:text-[#0E6E68] transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">dashboard</span>
              <span>Dashboard</span>
            </a>
            <span>/</span>
            <span class="text-[#063B39] font-bold">User Management</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">User Directory</h1>
          <p class="text-xs sm:text-sm text-[#6B7F7C] mt-0.5">Manage system access, employee roles, and directory credentials.</p>
        </div>

        <button
          (click)="openCreateModal()"
          class="workora-btn-primary px-5 py-2.5 text-xs">
          <span class="material-symbols-outlined text-base">person_add</span>
          <span>Add User</span>
        </button>
      </div>

      <!-- Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 user-stats-grid">
        
        <div class="p-5 bg-white border border-[#DCEBE7] rounded-2xl shadow-sm flex items-center justify-between workora-card">
          <div>
            <p class="text-xs font-bold text-[#6B7F7C] uppercase tracking-wider">Total Users</p>
            <h3 class="text-2xl font-extrabold text-[#063B39] mt-1 font-heading">{{ totalUsersCount() }}</h3>
          </div>
          <div class="p-3 bg-[#DCEBE7] text-[#0E6E68] rounded-xl">
            <span class="material-symbols-outlined text-2xl">groups</span>
          </div>
        </div>

        <div class="p-5 bg-white border border-[#DCEBE7] rounded-2xl shadow-sm flex items-center justify-between workora-card">
          <div>
            <p class="text-xs font-bold text-[#6B7F7C] uppercase tracking-wider">Active Accounts</p>
            <h3 class="text-2xl font-extrabold text-emerald-600 mt-1 font-heading">{{ activeUsersCount() }}</h3>
          </div>
          <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <span class="material-symbols-outlined text-2xl">how_to_reg</span>
          </div>
        </div>

        <div class="p-5 bg-white border border-[#DCEBE7] rounded-2xl shadow-sm flex items-center justify-between workora-card">
          <div>
            <p class="text-xs font-bold text-[#6B7F7C] uppercase tracking-wider">Inactive Accounts</p>
            <h3 class="text-2xl font-extrabold text-rose-600 mt-1 font-heading">{{ inactiveUsersCount() }}</h3>
          </div>
          <div class="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <span class="material-symbols-outlined text-2xl">person_off</span>
          </div>
        </div>
      </div>

      <!-- Filter & Search Bar -->
      <div class="p-4 bg-white border border-[#DCEBE7] rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 workora-card">
        
        <!-- Filter Tabs -->
        <div class="flex items-center gap-1 bg-[#FAFCFB] border border-[#DCEBE7] p-1 rounded-xl w-full sm:w-auto">
          <button
            (click)="onFilterStatus(null)"
            class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer"
            [ngClass]="activeFilter() === null ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#0E6E68] bg-transparent'">
            All Users
          </button>
          <button
            (click)="onFilterStatus(true)"
            class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer"
            [ngClass]="activeFilter() === true ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-emerald-600 bg-transparent'">
            Active
          </button>
          <button
            (click)="onFilterStatus(false)"
            class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer"
            [ngClass]="activeFilter() === false ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-rose-600 bg-transparent'">
            Inactive
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative w-full sm:w-72">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange()"
            placeholder="Search by name or email..."
            class="workora-input pl-9 text-xs" />
          <span class="material-symbols-outlined text-slate-400 absolute left-3 top-2.5 text-base pointer-events-none">search</span>
        </div>
      </div>

      <!-- Table Container -->
      <div class="bg-white border border-[#DCEBE7] rounded-2xl shadow-sm overflow-hidden workora-card user-table-card">
        
        <!-- Subtle Loading Indicator Bar -->
        <div *ngIf="isLoading()" class="p-12 flex flex-col items-center justify-center gap-3 text-xs font-bold text-[#0E6E68]">
          <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
          <span>Loading user directory...</span>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading() && users().length === 0" class="p-16 text-center space-y-3">
          <div class="w-14 h-14 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-3xl">person_search</span>
          </div>
          <h4 class="text-sm font-bold text-[#063B39]">No Users Found</h4>
          <p class="text-xs text-[#6B7F7C] max-w-sm mx-auto">There are currently no user accounts matching your filter or search query.</p>
          <button (click)="openCreateModal()" class="workora-btn-primary px-4 py-2 text-xs">
            <span class="material-symbols-outlined text-sm">add</span>
            <span>Create New User</span>
          </button>
        </div>

        <!-- Data Table -->
        <div *ngIf="!isLoading() && users().length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#334155]">
            <thead class="bg-[#FAFCFB] border-b border-[#DCEBE7] text-[11px] font-bold text-[#0E6E68] uppercase tracking-wider">
              <tr>
                <th class="px-6 py-4">User</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4">Linked Employee</th>
                <th class="px-6 py-4">Created Date</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#DCEBE7]/60">
              <tr *ngFor="let u of users()" class="hover:bg-[#DCEBE7]/20 transition-colors group user-row">
                <!-- User Column -->
                <td class="px-6 py-3.5">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {{ getInitials(u.firstName, u.lastName) }}
                    </div>
                    <div>
                      <div class="font-bold text-[#063B39]">{{ u.fullName }}</div>
                      <div class="text-[11px] text-[#6B7F7C]">{{ u.email }}</div>
                    </div>
                  </div>
                </td>

                <!-- Status Column -->
                <td class="px-6 py-3.5">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                        [ngClass]="u.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'">
                    <span class="w-1.5 h-1.5 rounded-full mr-1.5" [ngClass]="u.isActive ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                    {{ u.isActive ? 'Active' : 'Deactivated' }}
                  </span>
                </td>

                <!-- Linked Employee Column -->
                <td class="px-6 py-3.5">
                  <span *ngIf="u.employeeId" class="px-2.5 py-1 bg-[#FAFCFB] border border-[#DCEBE7] text-slate-700 rounded-lg font-mono text-[11px]">
                    EMP-{{ u.employeeId }}
                  </span>
                  <span *ngIf="!u.employeeId" class="text-[11px] text-slate-400 italic">
                    Unlinked
                  </span>
                </td>

                <!-- Created Date Column -->
                <td class="px-6 py-3.5 text-[11px] text-[#6B7F7C]">
                  {{ u.createdAt | date:'mediumDate' }}
                </td>

                <!-- Actions Column -->
                <td class="px-6 py-3.5 text-right space-x-1">
                  <!-- Edit Button -->
                  <button
                    (click)="openEditModal(u)"
                    class="p-1.5 text-[#0E6E68] hover:text-[#063B39] hover:bg-[#DCEBE7]/50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                    title="Edit User">
                    <span class="material-symbols-outlined text-base">edit</span>
                  </button>

                  <!-- Toggle Status -->
                  <button
                    (click)="toggleStatus(u)"
                    class="p-1.5 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                    [ngClass]="u.isActive ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'"
                    [title]="u.isActive ? 'Deactivate Account' : 'Reactivate Account'">
                    <span class="material-symbols-outlined text-base">{{ u.isActive ? 'block' : 'check_circle' }}</span>
                  </button>

                  <!-- Reset Password Trigger -->
                  <button
                    (click)="openResetPasswordModal(u)"
                    class="p-1.5 text-[#0E6E68] hover:text-[#063B39] hover:bg-[#DCEBE7]/50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                    title="Reset Password">
                    <span class="material-symbols-outlined text-base">key</span>
                  </button>

                  <!-- Delete Button -->
                  <button
                    (click)="onDeleteUser(u)"
                    class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                    title="Delete User">
                    <span class="material-symbols-outlined text-base">delete</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div *ngIf="!isLoading() && users().length > 0" class="p-4 bg-[#FAFCFB] border-t border-[#DCEBE7] flex items-center justify-between text-xs text-[#6B7F7C]">
          <span>
            Showing Page <span class="text-[#063B39] font-bold">{{ pageNumber() }}</span> of <span class="text-[#063B39] font-bold">{{ totalPages() }}</span>
          </span>

          <div class="flex items-center gap-2">
            <button
              (click)="changePage(pageNumber() - 1)"
              [disabled]="pageNumber() <= 1"
              class="workora-btn-secondary px-3 py-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed">
              Previous
            </button>
            <button
              (click)="changePage(pageNumber() + 1)"
              [disabled]="pageNumber() >= totalPages()"
              class="workora-btn-secondary px-3 py-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>

      </div>

    </div>

    <!-- User Form Modal (Create / Edit) -->
    <app-user-form-modal
      *ngIf="showFormModal()"
      [userToEdit]="selectedUser()"
      [isSubmitting]="isSubmittingModal()"
      (save)="onSaveUser($event)"
      (cancel)="showFormModal.set(false)">
    </app-user-form-modal>

    <!-- Admin Reset Password Modal -->
    <app-admin-reset-password-modal
      *ngIf="showResetPasswordModal()"
      [targetUser]="selectedUser()"
      [isSubmitting]="isSubmittingModal()"
      (resetPassword)="onConfirmResetPassword($event)"
      (cancel)="showResetPasswordModal.set(false)">
    </app-admin-reset-password-modal>
  `
})
export class UserListPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly userRepo: IUserRepository = inject(USER_REPOSITORY);
  private readonly notificationService = inject(NotificationService);

  private ctx?: gsap.Context;

  users = signal<UserSummary[]>([]);
  isLoading = signal<boolean>(true);
  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);
  activeFilter = signal<boolean | null>(null);

  showFormModal = signal<boolean>(false);
  showResetPasswordModal = signal<boolean>(false);
  selectedUser = signal<UserSummary | null>(null);
  isSubmittingModal = signal<boolean>(false);

  searchQuery = '';
  private searchTimeout: any;

  totalUsersCount = signal<number>(0);
  activeUsersCount = signal<number>(0);
  inactiveUsersCount = signal<number>(0);

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

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
        stagger: 0.1,
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
        this.notificationService.showError(err?.message || 'Failed to load user accounts.');
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
          this.notificationService.showError(err?.message || 'Failed to update user profile.');
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
          this.notificationService.showError(err?.message || 'Failed to create user account.');
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
        this.notificationService.showError(err?.message || 'Failed to update user status.');
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
        this.notificationService.showError(err?.message || 'Failed to reset password.');
        this.isSubmittingModal.set(false);
      }
    });
  }

  onDeleteUser(user: UserSummary): void {
    if (confirm(`Are you sure you want to hard-delete user "${user.fullName}" (${user.email})?`)) {
      this.userRepo.deleteUser(user.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('User account deleted.');
          this.loadUsers();
        },
        error: (err: any) => {
          this.notificationService.showError(err?.message || 'Failed to delete user.');
        }
      });
    }
  }

  getInitials(firstName: string, lastName: string): string {
    const f = firstName ? firstName.charAt(0).toUpperCase() : '';
    const l = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${f}${l}` || 'U';
  }
}
