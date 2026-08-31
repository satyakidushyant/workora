import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';
import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { EmployeeApiRepository } from '../../../../data/repositories/employee-api.repository';
import { OrganizationApiRepository } from '../../../../data/repositories/organization-api.repository';
import {
  Employee,
  EmployeeDetail,
  CreateEmployeeParams,
  TransferEmployeeParams,
  TerminateEmployeeParams
} from '../../../../domain/models/employee.model';
import { Department, Designation, Branch } from '../../../../domain/models/organization.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraConfirmDialogComponent } from '../../../shared/components/workora-confirm-dialog.component';
import { EmployeeOnboardingModalComponent } from '../components/employee-onboarding-modal.component';
import { EmployeeDossierModalComponent } from '../components/employee-dossier-modal.component';
import { EmployeeTransferModalComponent } from '../components/employee-transfer-modal.component';
import { EmployeeTerminateModalComponent } from '../components/employee-terminate-modal.component';

type ViewMode = 'grid' | 'table';

/**
 * Smart Container Page for Employee Directory, 360 Dossiers, and Onboarding.
 */
@Component({
  selector: 'app-employee-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSelectComponent,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraEmptyStateComponent,
    WorkoraConfirmDialogComponent,
    EmployeeOnboardingModalComponent,
    EmployeeDossierModalComponent,
    EmployeeTransferModalComponent,
    EmployeeTerminateModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#DDF7F2] text-[#087F73]">
              <span class="material-symbols-outlined text-2xl">badge</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#102A2A] tracking-tight font-heading">
              Employees
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-[#718686] mt-1 font-medium">
            Manage employee lifecycle, 360-degree dossiers, departmental transfers, and onboarding.
          </p>
        </div>

        <div class="flex items-center gap-3">
          @if (authService.hasPermission('employees.view')) {
            <button 
              type="button" 
              (click)="onExport()"
              class="workora-btn-secondary text-xs">
              <span class="material-symbols-outlined text-base text-[#087F73]">download</span>
              <span>Export CSV</span>
            </button>
          }

          @if (authService.hasPermission('employees.create')) {
            <button 
              type="button" 
              (click)="openOnboardingModal()"
              class="workora-btn-primary text-xs shadow-sm">
              <span class="material-symbols-outlined text-base">person_add</span>
              <span>+ Onboard Employee</span>
            </button>
          }
        </div>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="bg-white p-4 rounded-3xl border border-[#DDE9E6] shadow-xs space-y-3">
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          <!-- Search Input -->
          <div class="relative flex-1 max-w-md">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (ngModelChange)="onSearch()"
              placeholder="Search by name, email, or employee code..."
              class="w-full pl-9 pr-4 py-2 bg-[#F6FAF9] text-xs text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] focus:bg-white outline-none font-medium transition-all"
            />
          </div>

          <!-- Dropdown Filters -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Department Filter -->
            <div class="w-44">
              <app-workora-select
                [(ngModel)]="selectedDeptFilter"
                (selectionChange)="onFilterChange()"
                [options]="deptFilterOptions()"
                [clearable]="true"
                placeholder="All Departments"
                icon="account_tree"
              ></app-workora-select>
            </div>

            <!-- Branch Filter -->
            <div class="w-40">
              <app-workora-select
                [(ngModel)]="selectedBranchFilter"
                (selectionChange)="onFilterChange()"
                [options]="branchFilterOptions()"
                [clearable]="true"
                placeholder="All Branches"
                icon="location_on"
              ></app-workora-select>
            </div>

            <!-- Status Filter -->
            <div class="w-36">
              <app-workora-select
                [(ngModel)]="selectedStatusFilter"
                (selectionChange)="onFilterChange()"
                [options]="statusFilterOptions"
                [clearable]="true"
                placeholder="All Statuses"
                icon="filter_alt"
              ></app-workora-select>
            </div>

            <!-- View Toggle -->
            <div class="flex items-center p-1 bg-[#F4F8F7] rounded-xl border border-[#DCEBE7] ml-auto">
              <button 
                type="button" 
                (click)="viewMode.set('grid')"
                [ngClass]="viewMode() === 'grid' ? 'bg-white text-[#0E6E68] shadow-2xs font-bold' : 'text-slate-400 hover:text-slate-600'"
                class="p-1.5 rounded-lg transition-all border-none bg-transparent cursor-pointer"
                title="Grid View">
                <span class="material-symbols-outlined text-lg">grid_view</span>
              </button>
              <button 
                type="button" 
                (click)="viewMode.set('table')"
                [ngClass]="viewMode() === 'table' ? 'bg-white text-[#0E6E68] shadow-2xs font-bold' : 'text-slate-400 hover:text-slate-600'"
                class="p-1.5 rounded-lg transition-all border-none bg-transparent cursor-pointer"
                title="Table View">
                <span class="material-symbols-outlined text-lg">table_rows</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      <!-- Employees Grid / Table View -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (i of [1,2,3]; track i) {
            <app-workora-skeleton type="card"></app-workora-skeleton>
          }
        </div>
      } @else if (employees().length === 0) {
        <div class="bg-white rounded-3xl p-12 border border-[#DCEBE7] shadow-xs">
          <app-workora-empty-state 
            icon="badge" 
            title="No Employees Found"
            description="Start by onboarding your workforce into the organization structure."
            [actionLabel]="authService.hasPermission('employees.create') ? 'Onboard First Employee' : undefined"
            (actionClick)="openOnboardingModal()"
          ></app-workora-empty-state>
        </div>
      } @else {
        
        <!-- GRID VIEW -->
        @if (viewMode() === 'grid') {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (emp of employees(); track emp.id) {
              <div class="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCEBE7] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-4">
                    <div class="flex items-center gap-3">
                      <!-- Avatar -->
                      <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#063B39] to-[#0E6E68] text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0">
                        {{ getInitials(emp.firstName, emp.lastName) }}
                      </div>
                      <div>
                        <h3 class="font-extrabold text-sm text-[#063B39]">{{ emp.fullName }}</h3>
                        <p class="text-xs text-slate-500 font-semibold truncate">{{ emp.designationTitle || 'Staff' }}</p>
                      </div>
                    </div>

                    <span 
                      [ngClass]="emp.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                      class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0">
                      {{ emp.employmentStatus }}
                    </span>
                  </div>

                  <div class="space-y-1.5 text-xs text-slate-600 bg-[#F4F8F7] p-3 rounded-2xl border border-[#DCEBE7]/70">
                    <div class="flex items-center justify-between">
                      <span class="text-slate-400 font-bold uppercase text-[10px]">Code</span>
                      <span class="font-mono font-extrabold text-[#0E6E68]">{{ emp.employeeCode }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-slate-400 font-bold uppercase text-[10px]">Department</span>
                      <span class="font-bold text-[#063B39]">{{ emp.departmentName || '—' }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-slate-400 font-bold uppercase text-[10px]">Branch</span>
                      <span class="font-bold text-[#063B39]">{{ emp.branchName || '—' }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-slate-400 font-bold uppercase text-[10px]">Email</span>
                      <span class="font-medium text-slate-600 truncate max-w-[160px]">{{ emp.email }}</span>
                    </div>
                  </div>
                </div>

                <!-- Footer Actions -->
                <div class="flex items-center justify-between pt-4 mt-4 border-t border-[#DCEBE7]">
                  <button 
                    type="button" 
                    (click)="openDossier(emp)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0E6E68]/10 hover:bg-[#0E6E68] text-[#0E6E68] hover:text-white text-xs font-bold transition-all cursor-pointer border-none">
                    <span class="material-symbols-outlined text-base">visibility</span>
                    <span>360 Dossier</span>
                  </button>

                  <div class="flex items-center gap-1">
                    @if (authService.hasPermission('employees.transfer')) {
                      <button 
                        type="button" 
                        (click)="openTransferModal(emp)"
                        class="p-1.5 rounded-lg text-slate-500 hover:text-[#0E6E68] hover:bg-[#3FA79B]/10 transition-colors border-none bg-transparent cursor-pointer"
                        title="Transfer / Promote">
                        <span class="material-symbols-outlined text-base">swap_horiz</span>
                      </button>
                    }

                    @if (emp.isActive) {
                      @if (authService.hasPermission('employees.terminate')) {
                        <button 
                          type="button" 
                          (click)="openTerminateModal(emp)"
                          class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border-none bg-transparent cursor-pointer"
                          title="Terminate Employment">
                          <span class="material-symbols-outlined text-base">person_off</span>
                        </button>
                      }
                    } @else {
                      @if (authService.hasPermission('employees.update')) {
                        <button 
                          type="button" 
                          (click)="onReactivate(emp)"
                          class="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors border-none bg-transparent cursor-pointer"
                          title="Reactivate / Rehire">
                          <span class="material-symbols-outlined text-base">how_to_reg</span>
                        </button>
                      }
                    }
                  </div>
                </div>

              </div>
            }
          </div>
        }

        <!-- TABLE VIEW -->
        @if (viewMode() === 'table') {
          <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs text-slate-600">
                <thead class="bg-[#F4F8F7] text-[#063B39] font-extrabold uppercase text-[10px] tracking-wider border-b border-[#DCEBE7]">
                  <tr>
                    <th class="py-3.5 px-5">Employee</th>
                    <th class="py-3.5 px-5">Code</th>
                    <th class="py-3.5 px-5">Department</th>
                    <th class="py-3.5 px-5">Branch</th>
                    <th class="py-3.5 px-5">Status</th>
                    <th class="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#DCEBE7]">
                  @for (emp of employees(); track emp.id) {
                    <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                      <td class="py-3.5 px-5">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#063B39] to-[#0E6E68] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {{ getInitials(emp.firstName, emp.lastName) }}
                          </div>
                          <div>
                            <p class="font-extrabold text-[#063B39] text-xs leading-none">{{ emp.fullName }}</p>
                            <p class="text-[10px] text-slate-400 font-semibold mt-0.5">{{ emp.email }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="py-3.5 px-5 font-mono font-extrabold text-[#0E6E68]">{{ emp.employeeCode }}</td>
                      <td class="py-3.5 px-5 font-bold text-[#063B39]">{{ emp.departmentName || '—' }}</td>
                      <td class="py-3.5 px-5 font-bold text-[#063B39]">{{ emp.branchName || '—' }}</td>
                      <td class="py-3.5 px-5">
                        <span 
                          [ngClass]="emp.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                          class="px-2 py-0.5 rounded-full text-[9px] font-extrabold border inline-block">
                          {{ emp.employmentStatus }}
                        </span>
                      </td>
                      <td class="py-3.5 px-5 text-right">
                        <div class="inline-flex items-center gap-1.5">
                          <button 
                            type="button" 
                            (click)="openDossier(emp)"
                            class="p-1.5 rounded-lg text-slate-500 hover:text-[#0E6E68] hover:bg-[#3FA79B]/10 transition-colors border-none bg-transparent cursor-pointer"
                            title="View 360 Dossier">
                            <span class="material-symbols-outlined text-base">visibility</span>
                          </button>
                          @if (authService.hasPermission('employees.transfer')) {
                            <button 
                              type="button" 
                              (click)="openTransferModal(emp)"
                              class="p-1.5 rounded-lg text-slate-500 hover:text-[#0E6E68] hover:bg-[#3FA79B]/10 transition-colors border-none bg-transparent cursor-pointer"
                              title="Transfer / Promote">
                              <span class="material-symbols-outlined text-base">swap_horiz</span>
                            </button>
                          }
                          @if (emp.isActive && authService.hasPermission('employees.terminate')) {
                            <button 
                              type="button" 
                              (click)="openTerminateModal(emp)"
                              class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border-none bg-transparent cursor-pointer"
                              title="Terminate Employment">
                              <span class="material-symbols-outlined text-base">person_off</span>
                            </button>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- Pagination -->
        <div class="bg-white rounded-2xl p-4 border border-[#DCEBE7]">
          <app-workora-pagination
            [pageNumber]="pageIndex()"
            [totalPages]="totalPages()"
            [totalCount]="totalEmployees()"
            [pageSize]="pageSize"
            (pageChange)="onPageChange($event)"
          ></app-workora-pagination>
        </div>

      }

      <!-- Modals -->
      @if (isOnboardingModalOpen()) {
        <app-employee-onboarding-modal
          [departments]="departments()"
          [designations]="designations()"
          [branches]="branches()"
          [existingEmployees]="employees()"
          [isSubmitting]="isSubmittingModal()"
          (closeModal)="isOnboardingModalOpen.set(false)"
          (saveEmployee)="onSaveOnboarding($event)"
        ></app-employee-onboarding-modal>
      }

      @if (isDossierModalOpen() && activeDossier()) {
        <app-employee-dossier-modal
          [employee]="activeDossier()!"
          (closeModal)="isDossierModalOpen.set(false)"
          (requestTransfer)="openTransferModal(activeDossier()!)"
          (requestTerminate)="openTerminateModal(activeDossier()!)"
        ></app-employee-dossier-modal>
      }

      @if (isTransferModalOpen() && selectedEmployee()) {
        <app-employee-transfer-modal
          [employee]="selectedEmployee()!"
          [departments]="departments()"
          [designations]="designations()"
          [branches]="branches()"
          [existingEmployees]="employees()"
          [isSubmitting]="isSubmittingModal()"
          (closeModal)="isTransferModalOpen.set(false)"
          (transferEmployee)="onSaveTransfer($event)"
        ></app-employee-transfer-modal>
      }

      @if (isTerminateModalOpen() && selectedEmployee()) {
        <app-employee-terminate-modal
          [employee]="selectedEmployee()!"
          [isSubmitting]="isSubmittingModal()"
          (closeModal)="isTerminateModalOpen.set(false)"
          (terminateEmployee)="onSaveTermination($event)"
        ></app-employee-terminate-modal>
      }

      <!-- Confirmation Dialog -->
      @if (confirmDialogState(); as dialog) {
        <app-workora-confirm-dialog
          [isOpen]="true"
          [title]="dialog.title"
          [message]="dialog.message"
          [confirmText]="dialog.confirmText || 'Confirm'"
          (confirm)="dialog.onConfirm(); confirmDialogState.set(null)"
          (cancel)="confirmDialogState.set(null)"
        ></app-workora-confirm-dialog>
      }

    </div>
  `
})
export class EmployeeListPageComponent implements OnInit {
  private readonly empRepo = inject(EmployeeApiRepository);
  private readonly orgRepo = inject(OrganizationApiRepository);
  private readonly notificationService = inject(NotificationService);
  readonly authService = inject(AuthService);

  readonly viewMode = signal<ViewMode>('grid');

  // Employee Directory State
  readonly employees = signal<Employee[]>([]);
  readonly totalEmployees = signal<number>(0);
  readonly pageIndex = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly isLoading = signal<boolean>(false);
  readonly pageSize = 9;

  searchTerm = '';
  selectedDeptFilter?: number;
  selectedBranchFilter?: number;
  selectedStatusFilter?: string;

  // Master Data Cache
  readonly departments = signal<Department[]>([]);
  readonly designations = signal<Designation[]>([]);
  readonly branches = signal<Branch[]>([]);

  readonly deptFilterOptions = computed<WorkoraSelectOption<number>[]>(() => {
    return this.departments().map(d => ({
      value: d.id,
      label: d.name,
      icon: 'account_tree'
    }));
  });

  readonly branchFilterOptions = computed<WorkoraSelectOption<number>[]>(() => {
    return this.branches().map(b => ({
      value: b.id,
      label: b.name,
      sublabel: b.location,
      icon: 'location_on'
    }));
  });

  readonly statusFilterOptions: WorkoraSelectOption<string>[] = [
    { value: 'Active', label: 'Active', icon: 'check_circle', badge: 'Active', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'Probation', label: 'On Probation', icon: 'pending', badge: 'Probation', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'Terminated', label: 'Terminated', icon: 'cancel', badge: 'Terminated', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' }
  ];

  // Modals & Action Signals
  readonly isOnboardingModalOpen = signal<boolean>(false);
  readonly isDossierModalOpen = signal<boolean>(false);
  readonly activeDossier = signal<EmployeeDetail | null>(null);

  readonly isTransferModalOpen = signal<boolean>(false);
  readonly isTerminateModalOpen = signal<boolean>(false);
  readonly selectedEmployee = signal<Employee | null>(null);
  readonly isSubmittingModal = signal<boolean>(false);

  readonly confirmDialogState = signal<{
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  ngOnInit(): void {
    this.loadEmployees();
    this.loadMasterData();
  }

  loadEmployees(): void {
    this.isLoading.set(true);
    this.empRepo.getEmployees({
      pageNumber: this.pageIndex(),
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      departmentId: this.selectedDeptFilter,
      branchId: this.selectedBranchFilter,
      status: this.selectedStatusFilter
    })
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: paged => {
        this.employees.set(paged.items);
        this.totalEmployees.set(paged.totalCount);
        this.totalPages.set(paged.totalPages);
      },
      error: err => this.notificationService.showError(err.message || 'Failed to load employee directory.')
    });
  }

  loadMasterData(): void {
    this.orgRepo.getDepartments({ pageSize: 100 }).subscribe({
      next: p => this.departments.set(p.items),
      error: () => this.departments.set([])
    });
    this.orgRepo.getDesignations({ pageSize: 100 }).subscribe({
      next: p => this.designations.set(p.items),
      error: () => this.designations.set([])
    });
    this.orgRepo.getBranches({ pageSize: 100 }).subscribe({
      next: p => this.branches.set(p.items),
      error: () => this.branches.set([])
    });
  }

  onSearch(): void {
    this.pageIndex.set(1);
    this.loadEmployees();
  }

  onFilterChange(): void {
    this.pageIndex.set(1);
    this.loadEmployees();
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.loadEmployees();
  }

  openOnboardingModal(): void {
    this.isOnboardingModalOpen.set(true);
  }

  openDossier(emp: Employee): void {
    this.empRepo.getEmployeeById(emp.id).subscribe({
      next: detail => {
        this.activeDossier.set(detail);
        this.isDossierModalOpen.set(true);
      },
      error: err => this.notificationService.showError(err.message || 'Failed to fetch employee dossier.')
    });
  }

  openTransferModal(emp: Employee): void {
    this.selectedEmployee.set(emp);
    this.isTransferModalOpen.set(true);
  }

  openTerminateModal(emp: Employee): void {
    this.selectedEmployee.set(emp);
    this.isTerminateModalOpen.set(true);
  }

  onSaveOnboarding(params: CreateEmployeeParams): void {
    this.isSubmittingModal.set(true);
    this.empRepo.createEmployee(params)
      .pipe(finalize(() => this.isSubmittingModal.set(false)))
      .subscribe({
        next: () => {
          this.isOnboardingModalOpen.set(false);
          this.notificationService.showSuccess('Employee onboarded successfully.');
          this.loadEmployees();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to onboard employee.')
      });
  }

  onSaveTransfer(params: TransferEmployeeParams): void {
    this.isSubmittingModal.set(true);
    this.empRepo.transferEmployee(params)
      .pipe(finalize(() => this.isSubmittingModal.set(false)))
      .subscribe({
        next: () => {
          this.isTransferModalOpen.set(false);
          this.notificationService.showSuccess('Employee transferred successfully.');
          this.loadEmployees();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to transfer employee.')
      });
  }

  onSaveTermination(params: TerminateEmployeeParams): void {
    this.isSubmittingModal.set(true);
    this.empRepo.terminateEmployee(params)
      .pipe(finalize(() => this.isSubmittingModal.set(false)))
      .subscribe({
        next: () => {
          this.isTerminateModalOpen.set(false);
          this.notificationService.showSuccess('Employee terminated.');
          this.loadEmployees();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to terminate employee.')
      });
  }

  onReactivate(emp: Employee): void {
    this.confirmDialogState.set({
      title: `Reactivate Employee: ${emp.fullName}`,
      message: `Rehire and reactivate ${emp.fullName} (${emp.employeeCode})?`,
      confirmText: 'Reactivate',
      onConfirm: () => {
        this.empRepo.reactivateEmployee({
          id: emp.id,
          departmentId: emp.departmentId,
          designationId: emp.designationId,
          branchId: emp.branchId
        }).subscribe({
          next: () => {
            this.confirmDialogState.set(null);
            this.notificationService.showSuccess('Employee profile reactivated.');
            this.loadEmployees();
          },
          error: err => this.notificationService.showError(err.message || 'Failed to reactivate employee.')
        });
      }
    });
  }

  onExport(): void {
    this.empRepo.exportEmployees().subscribe({
      next: employees => {
        const csv = this.convertToCSV(employees);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Workora_Employees_${new Date().toISOString().substring(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.notificationService.showSuccess('Employee list exported to CSV.');
      },
      error: err => this.notificationService.showError(err.message || 'Failed to export employees.')
    });
  }

  private convertToCSV(items: Employee[]): string {
    if (items.length === 0) return '';
    const headers = ['EmployeeCode', 'FullName', 'Email', 'Phone', 'Department', 'Designation', 'Branch', 'Status', 'HireDate'];
    const rows = items.map(e => [
      e.employeeCode,
      `"${e.fullName}"`,
      e.email,
      e.phone || '',
      `"${e.departmentName || ''}"`,
      `"${e.designationTitle || ''}"`,
      `"${e.branchName || ''}"`,
      e.employmentStatus,
      e.hireDate
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  getInitials(firstName?: string, lastName?: string): string {
    const f = firstName ? firstName.charAt(0).toUpperCase() : 'E';
    const l = lastName ? lastName.charAt(0).toUpperCase() : 'M';
    return `${f}${l}`;
  }
}
