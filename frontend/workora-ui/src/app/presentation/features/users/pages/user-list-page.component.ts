import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { USER_REPOSITORY, IUserRepository } from '../../../../domain/repositories/i-user.repository';
import { UserSummary, UserQueryParams, CreateUserParams, UpdateUserParams, AdminResetPasswordParams } from '../../../../domain/models/user.model';
import { PagedResponse } from '../../../../domain/models/api-response.model';
import { UserFormModalComponent } from '../components/user-form-modal.component';
import { AdminResetPasswordModalComponent } from '../components/admin-reset-password-modal.component';

import { LogoLoaderComponent } from '../../../shared/components/logo-loader.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, UserFormModalComponent, AdminResetPasswordModalComponent, LogoLoaderComponent],
  template: `
    <div class="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full relative z-10">
      <!-- Top Navigation / Breadcrumb -->

        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 text-sm text-slate-400">
            <a routerLink="/dashboard" class="hover:text-indigo-400 transition-colors flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </a>
            <span>/</span>
            <span class="text-slate-200 font-medium">User Management</span>
          </div>

          <button
            (click)="openCreateModal()"
            class="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-sm rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add User</span>
          </button>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-5 bg-slate-900/60 border border-slate-800/80 rounded-3xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</p>
              <h3 class="text-2xl font-bold text-white mt-1">{{ totalUsersCount() }}</h3>
            </div>
            <div class="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          <div class="p-5 bg-slate-900/60 border border-slate-800/80 rounded-3xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Accounts</p>
              <h3 class="text-2xl font-bold text-emerald-400 mt-1">{{ activeUsersCount() }}</h3>
            </div>
            <div class="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div class="p-5 bg-slate-900/60 border border-slate-800/80 rounded-3xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inactive Accounts</p>
              <h3 class="text-2xl font-bold text-rose-400 mt-1">{{ inactiveUsersCount() }}</h3>
            </div>
            <div class="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Filter & Search Bar -->
        <div class="p-4 bg-slate-900/60 border border-slate-800/80 rounded-3xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Filter Tabs -->
          <div class="flex items-center space-x-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
            <button
              (click)="onFilterStatus(null)"
              class="px-4 py-2 text-xs font-semibold rounded-xl transition-all"
              [ngClass]="activeFilter() === null ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'">
              All Users
            </button>
            <button
              (click)="onFilterStatus(true)"
              class="px-4 py-2 text-xs font-semibold rounded-xl transition-all"
              [ngClass]="activeFilter() === true ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'">
              Active
            </button>
            <button
              (click)="onFilterStatus(false)"
              class="px-4 py-2 text-xs font-semibold rounded-xl transition-all"
              [ngClass]="activeFilter() === false ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'">
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
              class="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
            <svg class="w-4 h-4 text-slate-500 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Table Container -->
        <div class="bg-slate-900/60 border border-slate-800/80 rounded-3xl backdrop-blur-xl overflow-hidden shadow-xl">
          <!-- Loading State with Workora Logo Loader -->
          <div *ngIf="isLoading()" class="p-12">
            <app-logo-loader size="full" label="Loading User Accounts..." sublabel="Connecting to Workora HRMS"></app-logo-loader>
          </div>


          <!-- Empty State -->
          <div *ngIf="!isLoading() && users().length === 0" class="p-12 text-center">
            <svg class="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h4 class="text-base font-medium text-slate-300">No User Accounts Found</h4>
            <p class="text-xs text-slate-500 mt-1">Try refining your search query or status filter.</p>
          </div>

          <!-- Data Table -->
          <div *ngIf="!isLoading() && users().length > 0" class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead class="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th class="px-6 py-4">User</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4">Linked Employee</th>
                  <th class="px-6 py-4">Created Date</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                <tr *ngFor="let u of users()" class="hover:bg-slate-800/30 transition-colors group">
                  <!-- User Column -->
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 text-xs">
                        {{ getInitials(u.firstName, u.lastName) }}
                      </div>
                      <div>
                        <div class="font-semibold text-slate-100">{{ u.fullName }}</div>
                        <div class="text-xs text-slate-400">{{ u.email }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Status Column -->
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border"
                          [ngClass]="u.isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'">
                      <span class="w-1.5 h-1.5 rounded-full mr-1.5" [ngClass]="u.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'"></span>
                      {{ u.isActive ? 'Active' : 'Deactivated' }}
                    </span>
                  </td>

                  <!-- Linked Employee Column -->
                  <td class="px-6 py-4">
                    <span *ngIf="u.employeeId" class="px-2.5 py-1 bg-slate-800/80 text-indigo-300 rounded-lg text-xs font-mono border border-slate-700">
                      EMP-{{ u.employeeId }}
                    </span>
                    <span *ngIf="!u.employeeId" class="text-xs text-slate-500 italic">
                      Unlinked
                    </span>
                  </td>

                  <!-- Created Date Column -->
                  <td class="px-6 py-4 text-xs text-slate-400">
                    {{ u.createdAt | date:'mediumDate' }}
                  </td>

                  <!-- Actions Column -->
                  <td class="px-6 py-4 text-right space-x-1">
                    <!-- Edit Button -->
                    <button
                      (click)="openEditModal(u)"
                      class="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 rounded-xl transition-all"
                      title="Edit User">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <!-- Toggle Activate/Deactivate -->
                    <button
                      (click)="toggleStatus(u)"
                      class="p-2 rounded-xl transition-all"
                      [ngClass]="u.isActive ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-500/10' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'"
                      [title]="u.isActive ? 'Deactivate Account' : 'Reactivate Account'">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </button>

                    <!-- Reset Password Trigger -->
                    <button
                      (click)="openResetPasswordModal(u)"
                      class="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-800/60 rounded-xl transition-all"
                      title="Reset Password">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </button>

                    <!-- Delete Button -->
                    <button
                      (click)="onDeleteUser(u)"
                      class="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-xl transition-all"
                      title="Delete User">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          <div *ngIf="!isLoading() && users().length > 0" class="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
            <span class="text-xs text-slate-400">
              Showing Page <span class="text-white font-medium">{{ pageNumber() }}</span> of <span class="text-white font-medium">{{ totalPages() }}</span>
            </span>

            <div class="flex items-center space-x-2">
              <button
                (click)="changePage(pageNumber() - 1)"
                [disabled]="pageNumber() <= 1"
                class="px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                Previous
              </button>
              <button
                (click)="changePage(pageNumber() + 1)"
                [disabled]="pageNumber() >= totalPages()"
                class="px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                Next
              </button>
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
export class UserListPageComponent implements OnInit {
  private readonly userRepo: IUserRepository = inject(USER_REPOSITORY);
  private readonly notificationService = inject(NotificationService);

  // State Signals
  users = signal<UserSummary[]>([]);
  isLoading = signal<boolean>(true);
  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);
  activeFilter = signal<boolean | null>(null);

  // Modal Control Signals
  showFormModal = signal<boolean>(false);
  showResetPasswordModal = signal<boolean>(false);
  selectedUser = signal<UserSummary | null>(null);
  isSubmittingModal = signal<boolean>(false);

  searchQuery = '';
  private searchTimeout: any;

  // Computed Metrics
  totalUsersCount = signal<number>(0);
  activeUsersCount = signal<number>(0);
  inactiveUsersCount = signal<number>(0);

  ngOnInit(): void {
    this.loadUsers();
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

        // Update counts
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
      // Update User
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
      // Create User
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

