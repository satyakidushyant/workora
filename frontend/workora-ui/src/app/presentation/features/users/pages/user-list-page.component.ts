import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { USER_REPOSITORY, IUserRepository } from '../../../../domain/repositories/i-user.repository';
import { UserSummary, UserQueryParams, CreateUserParams, UpdateUserParams, AdminResetPasswordParams } from '../../../../domain/models/user.model';
import { Company } from '../../../../domain/models/organization.model';
import { PagedResponse } from '../../../../domain/models/api-response.model';
import { OrganizationApiRepository } from '../../../../data/repositories/organization-api.repository';
import { UserFormModalComponent } from '../components/user-form-modal.component';
import { AdminResetPasswordModalComponent } from '../components/admin-reset-password-modal.component';
import { AssignRoleModalComponent } from '../components/assign-role-modal.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraConfirmDialogComponent } from '../../../shared/components/workora-confirm-dialog.component';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * Enterprise Workora Team Directory & User Management Console.
 * Enables platform administrators and tenant managers to manage user credentials,
 * tenant organization allocations, directory security roles, and permissions with rich UI cues.
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
    WorkoraConfirmDialogComponent,
    WorkoraSelectComponent
  ],
  template: `
    <div class="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl 2xl:max-w-8xl mx-auto w-full">
      
      <!-- Top Navigation & Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 user-header">
        <div>
          <div class="flex items-center gap-2 text-xs text-[#087F73] font-semibold mb-1">
            <a routerLink="/dashboard" class="hover:text-[#063B39] transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">dashboard</span>
              <span>Dashboard</span>
            </a>
            <span class="text-slate-400">/</span>
            <span class="text-[#102A2A] font-bold">Team Directory</span>
          </div>

          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-2xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center shrink-0 shadow-xs">
              <span class="material-symbols-outlined text-2xl">manage_accounts</span>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#102A2A] tracking-tight font-heading">
                Team Directory &amp; User Accounts
              </h1>
              <p class="text-xs sm:text-sm text-[#718686] mt-0.5 font-medium">
                Manage tenant user credentials, employee profile links, security roles, and platform permissions.
              </p>
            </div>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="openCreateModal()"
            class="workora-btn-primary text-xs shadow-md">
            <span class="material-symbols-outlined text-base">person_add</span>
            <span>+ Add Team Member</span>
          </button>
        </div>
      </div>

      <!-- Quick Platform Stats Cards (4 Cards with Uniform Dimensions) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 user-stats-grid">
        
        <!-- Total Accounts -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-[#087F73] flex flex-col justify-between min-h-[116px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Total Accounts</span>
            <span class="w-9 h-9 rounded-xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">groups</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-[#102A2A] font-heading leading-tight my-0.5">{{ totalUsersCount() }}</p>
            <p class="text-[11px] text-[#718686] font-medium">Platform &amp; tenant members</p>
          </div>
        </div>

        <!-- Active Users -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-emerald-500 flex flex-col justify-between min-h-[116px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Active Accounts</span>
            <span class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">verified_user</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-heading leading-tight my-0.5">{{ activeUsersCount() }}</p>
            <p class="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Operational &amp; verified</span>
            </p>
          </div>
        </div>

        <!-- Inactive Users -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-slate-400 flex flex-col justify-between min-h-[116px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Deactivated</span>
            <span class="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">person_off</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-slate-700 font-heading leading-tight my-0.5">{{ inactiveUsersCount() }}</p>
            <p class="text-[11px] text-[#718686] font-medium">Suspended or locked logins</p>
          </div>
        </div>

        <!-- Organizations -->
        <div class="workora-card p-4 sm:p-5 border-l-4 border-l-[#16A085] flex flex-col justify-between min-h-[116px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Organizations</span>
            <span class="w-9 h-9 rounded-xl bg-teal-50 text-[#16A085] flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-lg">corporate_fare</span>
            </span>
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-extrabold text-[#16A085] font-heading leading-tight my-0.5">{{ companies().length }}</p>
            <p class="text-[11px] text-[#718686] font-medium">Provisioned workspaces</p>
          </div>
        </div>

      </div>

      <!-- Filter & Search Toolbar Card (All 4 Controls Have Equal Uniform Height & Proportions) -->
      <div class="workora-card p-4 sm:p-5 space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          
          <!-- 1. Search Bar (Equal Height & Width) -->
          <div class="relative w-full">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              [ngModel]="searchQuery"
              (ngModelChange)="onSearchInputChange($event)"
              (keydown.escape)="clearSearch()"
              placeholder="Search by name, email or code..."
              class="w-full h-10 pl-10 pr-9 bg-[#F6FAF9] text-xs text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] focus:bg-white outline-none font-medium transition-all placeholder:text-[#718686]"
            />
            @if (searchQuery) {
              <button
                type="button"
                (click)="clearSearch()"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center"
                title="Clear search">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            }
          </div>

          <!-- 2. Organization Dropdown (Equal Height & Width) -->
          <div class="w-full">
            <app-workora-select
              [options]="companyFilterOptions()"
              [ngModel]="selectedCompanyFilter()"
              (selectionChange)="onCompanyFilterChange($event)"
              [clearable]="true"
              placeholder="All Organizations"
              icon="corporate_fare">
            </app-workora-select>
          </div>

          <!-- 3. Security Role Dropdown (Equal Height & Width) -->
          <div class="w-full">
            <app-workora-select
              [options]="roleFilterOptions"
              [ngModel]="selectedRoleFilter()"
              (selectionChange)="onRoleFilterChange($event)"
              [clearable]="true"
              placeholder="All Security Roles"
              icon="shield_person">
            </app-workora-select>
          </div>

          <!-- 4. Status Filter Tabs (Equal Height & Width) -->
          <div class="h-10 flex items-center gap-1 bg-[#F6FAF9] border border-[#DDE9E6] p-1 rounded-xl w-full">
            <button
              type="button"
              (click)="setFilter(null)"
              [ngClass]="activeFilter() === null ? 'bg-[#087F73] text-white shadow-xs font-bold' : 'text-[#718686] hover:text-[#102A2A] font-semibold bg-transparent'"
              class="h-8 rounded-lg text-xs transition-all border-none cursor-pointer flex-1 flex items-center justify-center">
              All
            </button>
            <button
              type="button"
              (click)="setFilter(true)"
              [ngClass]="activeFilter() === true ? 'bg-[#087F73] text-white shadow-xs font-bold' : 'text-[#718686] hover:text-[#102A2A] font-semibold bg-transparent'"
              class="h-8 rounded-lg text-xs transition-all border-none cursor-pointer flex-1 flex items-center justify-center">
              Active
            </button>
            <button
              type="button"
              (click)="setFilter(false)"
              [ngClass]="activeFilter() === false ? 'bg-[#087F73] text-white shadow-xs font-bold' : 'text-[#718686] hover:text-[#102A2A] font-semibold bg-transparent'"
              class="h-8 rounded-lg text-xs transition-all border-none cursor-pointer flex-1 flex items-center justify-center">
              Inactive
            </button>
          </div>

        </div>

        <!-- Reset Active Filters Bar (If any filter is applied) -->
        @if (searchQuery || activeFilter() !== null || selectedCompanyFilter() !== null || selectedRoleFilter() !== null) {
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
              <span>Reset All Filters</span>
            </button>
          </div>
        }
      </div>

      <!-- Users Table Card -->
      <div class="workora-card overflow-hidden">
        
        <!-- Loading State -->
        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="5"></app-workora-skeleton>
          </div>
        }

        <!-- Empty State -->
        @if (!isLoading() && filteredUsers().length === 0) {
          <div class="p-8">
            <app-workora-empty-state
              icon="person_search"
              title="No Team Members Found"
              description="We couldn't find anyone matching your current search or filters. Try clearing your filters or add a new team member."
              actionLabel="Add Team Member"
              actionIcon="person_add"
              (actionClicked)="openCreateModal()"
            ></app-workora-empty-state>
          </div>
        }

        <!-- Data Table -->
        @if (!isLoading() && filteredUsers().length > 0) {
          <div class="workora-table-responsive">
            <table class="workora-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Organization &amp; Dept</th>
                  <th>Security Role</th>
                  <th>Status</th>
                  <th>Member Since</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (user of filteredUsers(); track user.id) {
                  <tr class="hover:bg-[#F6FAF9]/80 transition-colors">
                    <!-- User Profile & Avatar -->
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#075E58] to-[#087F73] text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs border border-white">
                          {{ getInitials(user.firstName, user.lastName) }}
                        </div>
                        <div>
                          <div class="font-extrabold text-[#102A2A] flex items-center gap-1.5">
                            <span>{{ user.fullName }}</span>
                            @if (user.isActive) {
                              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active Account"></span>
                            }
                          </div>
                          <div class="text-[11px] text-[#718686] font-medium flex items-center gap-1 mt-0.5">
                            <span class="material-symbols-outlined text-[13px]">mail</span>
                            <span>{{ user.email }}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Organization & Dept Column -->
                    <td>
                      @if (user.companyName) {
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <span class="material-symbols-outlined text-sm text-[#087F73]">corporate_fare</span>
                          <span class="font-bold text-xs text-[#102A2A]">{{ user.companyName }}</span>
                          @if (user.companyCode) {
                            <span class="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#DDF7F2] text-[#075E58] border border-[#087F73]/20 uppercase font-mono">{{ user.companyCode }}</span>
                          }
                        </div>
                        <div class="text-[11px] text-[#718686] font-medium mt-0.5 flex items-center gap-1.5">
                          <span>{{ user.departmentName || 'General Operations' }}</span>
                          @if (user.employeeCode) {
                            <span>•</span>
                            <span class="font-mono text-[10px] font-bold text-[#087F73] bg-[#EBF5F3] px-1.5 py-0.2 rounded">{{ user.employeeCode }}</span>
                          }
                        </div>
                      } @else {
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                          <span class="material-symbols-outlined text-xs">admin_panel_settings</span>
                          <span>Platform Administrator</span>
                        </span>
                      }
                    </td>

                    <!-- Assigned Role -->
                    <td>
                      @if (user.roles && user.roles.length > 0) {
                        <div class="flex flex-wrap gap-1">
                          @for (r of user.roles; track r) {
                            <span 
                              [ngClass]="{
                                'bg-purple-50 text-purple-700 border-purple-200': r === 'SuperAdmin',
                                'bg-teal-50 text-teal-800 border-teal-200': r === 'HRAdmin',
                                'bg-blue-50 text-blue-700 border-blue-200': r === 'FinanceManager',
                                'bg-amber-50 text-amber-800 border-amber-200': r === 'Manager',
                                'bg-slate-50 text-slate-700 border-slate-200': r === 'Employee'
                              }"
                              class="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold border inline-flex items-center gap-1 shadow-2xs">
                              <span class="material-symbols-outlined text-[12px]">
                                {{ r === 'SuperAdmin' ? 'shield_person' : r === 'HRAdmin' ? 'manage_accounts' : r === 'FinanceManager' ? 'payments' : r === 'Manager' ? 'supervisor_account' : 'person' }}
                              </span>
                              <span>{{ r }}</span>
                            </span>
                          }
                        </div>
                      } @else {
                        <span class="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-slate-50 text-slate-600 border border-slate-200">
                          Employee
                        </span>
                      }
                    </td>

                    <!-- Status Pill -->
                    <td>
                      @if (user.isActive) {
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Active</span>
                        </span>
                      } @else {
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          <span>Inactive</span>
                        </span>
                      }
                    </td>

                    <!-- Created Date -->
                    <td class="text-[#718686] text-xs font-medium">
                      <div class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-[13px] text-slate-400">calendar_today</span>
                        <span>{{ user.createdAt | date:'mediumDate' }}</span>
                      </div>
                    </td>

                    <!-- Action Buttons (Uniform 32x32px Dimensions) -->
                    <td class="text-right">
                      <div class="inline-flex items-center gap-1.5 justify-end">
                        
                        <!-- Assign Role Button -->
                        <button
                          type="button"
                          (click)="openAssignRoleModal(user)"
                          class="w-8 h-8 rounded-xl text-[#087F73] hover:bg-[#DDF7F2] transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center shrink-0"
                          title="Assign Security Role"
                          aria-label="Assign security role"
                        >
                          <span class="material-symbols-outlined text-[17px]">shield_person</span>
                        </button>

                        <!-- Edit Button -->
                        <button
                          type="button"
                          (click)="openEditModal(user)"
                          class="w-8 h-8 rounded-xl text-slate-500 hover:text-[#102A2A] hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center shrink-0"
                          title="Edit Profile"
                          aria-label="Edit user"
                        >
                          <span class="material-symbols-outlined text-[17px]">edit</span>
                        </button>

                        <!-- Reset Password Button -->
                        <button
                          type="button"
                          (click)="openResetPasswordModal(user)"
                          class="w-8 h-8 rounded-xl text-slate-500 hover:text-[#087F73] hover:bg-[#DDF7F2] transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center shrink-0"
                          title="Set Password"
                          aria-label="Reset password"
                        >
                          <span class="material-symbols-outlined text-[17px]">key</span>
                        </button>

                        <!-- Toggle Status Button -->
                        <button
                          type="button"
                          (click)="toggleStatus(user)"
                          class="w-8 h-8 rounded-xl transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center shrink-0"
                          [ngClass]="user.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'"
                          [title]="user.isActive ? 'Deactivate Account' : 'Activate Account'"
                          [attr.aria-label]="user.isActive ? 'Deactivate account' : 'Activate account'"
                        >
                          <span class="material-symbols-outlined text-[17px]">
                            {{ user.isActive ? 'pause_circle' : 'play_circle' }}
                          </span>
                        </button>

                        <!-- Delete Button -->
                        <button
                          type="button"
                          (click)="promptDeleteUser(user)"
                          class="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center shrink-0"
                          title="Remove Account"
                          aria-label="Delete user"
                        >
                          <span class="material-symbols-outlined text-[17px]">delete</span>
                        </button>

                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination Component -->
          <div class="p-4 sm:p-5 border-t border-[#DDE9E6] bg-[#F6FAF9]">
            <app-workora-pagination
              [pageNumber]="pageNumber()"
              [pageSize]="pageSize()"
              [totalCount]="totalCount()"
              [totalPages]="totalPages()"
              (pageChange)="changePage($event)"
            ></app-workora-pagination>
          </div>
        }

      </div>

      <!-- Modals -->
      @if (showFormModal()) {
        <app-user-form-modal
          [user]="selectedUser()"
          [isSubmitting]="isSubmittingModal()"
          (save)="onSaveUser($event)"
          (cancel)="showFormModal.set(false)"
        ></app-user-form-modal>
      }

      @if (showAssignRoleModal() && selectedUser()) {
        <app-assign-role-modal
          [user]="selectedUser()!"
          [isSubmitting]="isSubmittingModal()"
          (assign)="onConfirmAssignRole($event)"
          (cancel)="showAssignRoleModal.set(false)"
        ></app-assign-role-modal>
      }

      @if (showResetPasswordModal() && selectedUser()) {
        <app-admin-reset-password-modal
          [user]="selectedUser()!"
          [isSubmitting]="isSubmittingModal()"
          (resetPassword)="onConfirmResetPassword($event)"
          (cancel)="showResetPasswordModal.set(false)"
        ></app-admin-reset-password-modal>
      }

      <!-- Delete Confirmation Dialog -->
      <app-workora-confirm-dialog
        [isOpen]="showDeleteConfirm()"
        title="Delete User Account"
        [message]="deleteConfirmMessage"
        confirmText="Yes, Delete Account"
        variant="danger"
        (confirm)="onConfirmDeleteUser()"
        (cancel)="showDeleteConfirm.set(false)"
      ></app-workora-confirm-dialog>

    </div>
  `
})
export class UserListPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly userRepo = inject<IUserRepository>(USER_REPOSITORY);
  private readonly orgRepo = inject(OrganizationApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly users = signal<UserSummary[]>([]);
  readonly companies = signal<Company[]>([]);
  readonly selectedCompanyFilter = signal<number | null>(null);
  readonly selectedRoleFilter = signal<string | null>(null);

  readonly roleFilterOptions: WorkoraSelectOption<string>[] = [
    { value: 'SuperAdmin', label: 'SuperAdmin', icon: 'shield_person' },
    { value: 'HRAdmin', label: 'HRAdmin', icon: 'manage_accounts' },
    { value: 'FinanceManager', label: 'FinanceManager', icon: 'payments' },
    { value: 'Manager', label: 'Manager', icon: 'supervisor_account' },
    { value: 'Employee', label: 'Employee', icon: 'person' }
  ];

  readonly companyFilterOptions = computed<WorkoraSelectOption<number>[]>(() => {
    return this.companies().map(c => ({
      value: c.id,
      label: c.name,
      sublabel: c.code,
      icon: 'corporate_fare'
    }));
  });

  readonly filteredUsers = computed<UserSummary[]>(() => {
    const role = this.selectedRoleFilter();
    if (!role) return this.users();
    return this.users().filter(u => u.roles?.includes(role));
  });

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
    this.loadCompanies();
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

  loadCompanies(): void {
    this.orgRepo.getCompaniesList().subscribe({
      next: (list: Company[]) => this.companies.set(list || []),
      error: () => this.companies.set([])
    });
  }

  onCompanyFilterChange(val: any): void {
    const companyId = val !== null && val !== undefined && typeof val === 'object' && 'value' in val 
      ? (val.value ? Number(val.value) : null) 
      : (val !== null && val !== undefined && !isNaN(Number(val)) ? Number(val) : null);
    this.selectedCompanyFilter.set(companyId);
    this.pageNumber.set(1);
    this.loadUsers();
  }

  onRoleFilterChange(val: any): void {
    const role = val !== null && val !== undefined && typeof val === 'object' && 'value' in val 
      ? val.value 
      : (val || null);
    this.selectedRoleFilter.set(role);
  }

  loadUsers(): void {
    this.isLoading.set(true);
    const params: UserQueryParams = {
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      searchTerm: this.searchQuery?.trim() || undefined,
      isActive: this.activeFilter(),
      companyId: this.selectedCompanyFilter() || undefined
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

  private searchDebounceTimer?: any;

  setFilter(filter: boolean | null): void {
    if (this.activeFilter() === filter) return;
    this.activeFilter.set(filter);
    this.pageNumber.set(1);
    this.loadUsers();
  }

  onSearchInputChange(value: string): void {
    this.searchQuery = value || '';
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    if (!this.searchQuery.trim()) {
      this.pageNumber.set(1);
      this.loadUsers();
      return;
    }
    this.searchDebounceTimer = setTimeout(() => {
      this.pageNumber.set(1);
      this.loadUsers();
    }, 250);
  }

  onSearch(): void {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    this.pageNumber.set(1);
    this.loadUsers();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearch();
  }

  resetAllFilters(): void {
    this.searchQuery = '';
    this.activeFilter.set(null);
    this.selectedCompanyFilter.set(null);
    this.selectedRoleFilter.set(null);
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
          this.isSubmittingModal.set(false);
          this.showFormModal.set(false);
          this.notificationService.showSuccess('New team member added with assigned role!');
          this.loadUsers();
          this.loadStats();
        },
        error: (err: any) => {
          this.isSubmittingModal.set(false);
          const msg = err?.error?.message || err?.message || 'Failed to create user.';
          this.notificationService.showError(msg);
        }
      });
    }
  }

  onConfirmResetPassword(event: AdminResetPasswordParams): void {
    this.isSubmittingModal.set(true);
    this.userRepo.adminResetPassword(event).subscribe({
      next: () => {
        this.isSubmittingModal.set(false);
        this.showResetPasswordModal.set(false);
        this.notificationService.showSuccess(`Password updated for ${this.selectedUser()?.fullName || 'user'}.`);
      },
      error: (err: any) => {
        this.isSubmittingModal.set(false);
        const msg = err?.error?.message || err?.message || 'Failed to reset password.';
        this.notificationService.showError(msg);
      }
    });
  }

  toggleStatus(user: UserSummary): void {
    const action$ = user.isActive ? this.userRepo.deactivateUser(user.id) : this.userRepo.activateUser(user.id);
    action$.subscribe({
      next: () => {
        const statusLabel = user.isActive ? 'deactivated' : 'activated';
        this.notificationService.showSuccess(`User account ${statusLabel} successfully.`);
        this.loadUsers();
        this.loadStats();
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.message || 'Failed to toggle account status.';
        this.notificationService.showError(msg);
      }
    });
  }

  promptDeleteUser(user: UserSummary): void {
    this.userToDelete = user;
    this.deleteConfirmMessage = `Are you sure you want to permanently delete user account "${user.fullName}" (${user.email})? This action cannot be undone.`;
    this.showDeleteConfirm.set(true);
  }

  onConfirmDeleteUser(): void {
    if (!this.userToDelete) return;
    this.isDeletingUser.set(true);
    this.userRepo.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.isDeletingUser.set(false);
        this.showDeleteConfirm.set(false);
        this.notificationService.showSuccess('User account removed successfully.');
        this.userToDelete = null;
        this.loadUsers();
        this.loadStats();
      },
      error: (err: any) => {
        this.isDeletingUser.set(false);
        const msg = err?.error?.message || err?.message || 'Failed to delete user account.';
        this.notificationService.showError(msg);
      }
    });
  }

  getInitials(firstName?: string, lastName?: string): string {
    const f = (firstName || '').charAt(0).toUpperCase();
    const l = (lastName || '').charAt(0).toUpperCase();
    return `${f}${l}` || 'U';
  }
}
