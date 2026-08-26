import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { PayrollApiRepository } from '../../../../data/repositories/payroll-api.repository';
import { EmployeeApiRepository } from '../../../../data/repositories/employee-api.repository';
import {
  PayrollRun,
  PayrollRunDetail,
  SalaryStructure,
  Payslip,
  Payhead,
  SaveSalaryStructureParams,
  AssignSalaryStructureParams,
  CreatePayrollRunParams
} from '../../../../domain/models/payroll.model';
import { Employee } from '../../../../domain/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { CreatePayrollRunModalComponent } from '../components/create-payroll-run-modal.component';
import { PayslipModalComponent } from '../components/payslip-modal.component';
import { SalaryStructureModalComponent } from '../components/salary-structure-modal.component';
import { AssignSalaryModalComponent } from '../components/assign-salary-modal.component';

type PayrollTab = 'runs' | 'structures' | 'assignments';

@Component({
  selector: 'app-payroll-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraEmptyStateComponent,
    CreatePayrollRunModalComponent,
    PayslipModalComponent,
    SalaryStructureModalComponent,
    AssignSalaryModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">receipt_long</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Payroll &amp; Compensation
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Automate monthly salary runs, configure pay components, and manage employee compensation structures.
          </p>
        </div>

        <div class="flex items-center gap-3">
          @if (activeTab() === 'runs') {
            <button 
              type="button" 
              (click)="isCreateRunModalOpen.set(true)"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
              <span class="material-symbols-outlined text-base">play_arrow</span>
              <span>Execute Payroll Cycle</span>
            </button>
          } @else if (activeTab() === 'structures') {
            <button 
              type="button" 
              (click)="openCreateStructureModal()"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
              <span class="material-symbols-outlined text-base">add</span>
              <span>Create Structure</span>
            </button>
          } @else {
            <button 
              type="button" 
              (click)="isAssignModalOpen.set(true)"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
              <span class="material-symbols-outlined text-base">person_add</span>
              <span>Assign Salary</span>
            </button>
          }
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#DCEBE7] shadow-2xs overflow-x-auto">
        <button 
          type="button" 
          (click)="activeTab.set('runs')"
          [ngClass]="activeTab() === 'runs' ? 'bg-[#0E6E68] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#063B39]'"
          class="px-4 py-2 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5 shrink-0">
          <span class="material-symbols-outlined text-base">payments</span>
          <span>Monthly Payroll Runs</span>
        </button>

        <button 
          type="button" 
          (click)="activeTab.set('structures')"
          [ngClass]="activeTab() === 'structures' ? 'bg-[#0E6E68] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#063B39]'"
          class="px-4 py-2 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5 shrink-0">
          <span class="material-symbols-outlined text-base">account_balance_wallet</span>
          <span>Salary Structures</span>
        </button>

        <button 
          type="button" 
          (click)="activeTab.set('assignments')"
          [ngClass]="activeTab() === 'assignments' ? 'bg-[#0E6E68] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#063B39]'"
          class="px-4 py-2 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5 shrink-0">
          <span class="material-symbols-outlined text-base">badge</span>
          <span>Employee Compensations</span>
        </button>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 1: PAYROLL RUNS -->
      <!-- ======================================================== -->
      @if (activeTab() === 'runs') {
        <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden animate-in fade-in duration-150">
          <div class="p-5 border-b border-[#DCEBE7]">
            <h3 class="text-sm font-extrabold text-[#063B39]">Monthly Salary Calculation Batches</h3>
          </div>

          @if (isLoadingRuns()) {
            <div class="p-6">
              <app-workora-skeleton type="table" [count]="4"></app-workora-skeleton>
            </div>
          } @else if (runs().length === 0) {
            <div class="p-12">
              <app-workora-empty-state 
                icon="payments" 
                title="No Payroll Cycles"
                description="Click 'Execute Payroll Cycle' to compute salary withholdings and generate payslips."
                actionLabel="Execute First Cycle"
                (actionClick)="isCreateRunModalOpen.set(true)"
              ></app-workora-empty-state>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                    <th class="py-3.5 px-5">Cycle Period</th>
                    <th class="py-3.5 px-4">Headcount</th>
                    <th class="py-3.5 px-4">Total Gross</th>
                    <th class="py-3.5 px-4">Deductions</th>
                    <th class="py-3.5 px-4">Net Payout</th>
                    <th class="py-3.5 px-4">Status</th>
                    <th class="py-3.5 px-5 text-right">Workflow Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#DCEBE7]/70">
                  @for (run of runs(); track run.id) {
                    <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                      <td class="py-3.5 px-5 font-bold text-[#063B39]">
                        {{ monthName(run.periodMonth) }} {{ run.periodYear }}
                      </td>
                      <td class="py-3.5 px-4 font-semibold text-slate-700">
                        {{ run.totalEmployees }} Employees
                      </td>
                      <td class="py-3.5 px-4 font-bold text-[#063B39]">
                        \${{ run.totalGrossPay | number:'1.2-2' }}
                      </td>
                      <td class="py-3.5 px-4 font-semibold text-rose-600">
                        -\${{ run.totalDeductions | number:'1.2-2' }}
                      </td>
                      <td class="py-3.5 px-4 font-extrabold text-[#0E6E68]">
                        \${{ run.totalNetPay | number:'1.2-2' }}
                      </td>
                      <td class="py-3.5 px-4">
                        <span 
                          [ngClass]="{
                            'bg-amber-50 text-amber-700 border-amber-200': run.status === 'Draft' || run.status === 'Calculated',
                            'bg-blue-50 text-blue-700 border-blue-200': run.status === 'Approved',
                            'bg-emerald-50 text-emerald-700 border-emerald-200': run.status === 'Disbursed'
                          }"
                          class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border">
                          {{ run.status }}
                        </span>
                      </td>
                      <td class="py-3.5 px-5 text-right">
                        <div class="inline-flex items-center gap-1.5">
                          <button 
                            type="button" 
                            (click)="viewRunDetails(run.id)"
                            class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all border-none cursor-pointer">
                            View
                          </button>

                          @if (run.status === 'Draft' || run.status === 'Calculated') {
                            <button 
                              type="button" 
                              (click)="onApproveRun(run.id)"
                              class="px-2.5 py-1 rounded-lg bg-[#0E6E68] hover:bg-[#063B39] text-white text-[11px] font-bold transition-all border-none cursor-pointer">
                              Approve
                            </button>
                          } @else if (run.status === 'Approved') {
                            <button 
                              type="button" 
                              (click)="onDisburseRun(run.id)"
                              class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all border-none cursor-pointer">
                              Disburse
                            </button>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <div class="p-4 border-t border-[#DCEBE7]">
              <app-workora-pagination
                [pageNumber]="pageIndex()"
                [totalPages]="totalPages()"
                [totalCount]="totalRuns()"
                [pageSize]="10"
                (pageChange)="onPageChange($event)"
              ></app-workora-pagination>
            </div>
          }
        </div>
      }

      <!-- ======================================================== -->
      <!-- TAB 2: SALARY STRUCTURES -->
      <!-- ======================================================== -->
      @if (activeTab() === 'structures') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-150">
          @for (s of structures(); track s.id) {
            <div class="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCEBE7] shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-3 mb-2">
                  <h3 class="font-extrabold text-sm text-[#063B39]">{{ s.name }}</h3>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
                </div>
                <p class="text-xs text-slate-500 mb-4">{{ s.description || 'Standard corporate structure template.' }}</p>

                <!-- Components list -->
                <div class="space-y-1.5 bg-[#F4F8F7] p-3 rounded-2xl border border-[#DCEBE7]/70 text-xs">
                  <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Configured Line Items ({{ s.components.length }})</span>
                  @for (c of s.components; track c.id) {
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="font-medium text-slate-600">{{ c.name }} ({{ c.code }})</span>
                      <span [ngClass]="c.type === 'Earning' ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'">
                        {{ c.type === 'Earning' ? '+' : '-' }}{{ c.defaultValue }}%
                      </span>
                    </div>
                  }
                </div>
              </div>

              <div class="flex items-center justify-end pt-4 mt-4 border-t border-[#DCEBE7]">
                <button 
                  type="button" 
                  (click)="openEditStructureModal(s)"
                  class="text-xs font-bold text-[#0E6E68] hover:underline border-none bg-transparent cursor-pointer">
                  Edit Template
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- ======================================================== -->
      <!-- TAB 3: EMPLOYEE COMPENSATION -->
      <!-- ======================================================== -->
      @if (activeTab() === 'assignments') {
        <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden animate-in fade-in duration-150">
          <div class="p-5 border-b border-[#DCEBE7]">
            <h3 class="text-sm font-extrabold text-[#063B39]">Employee Compensation Packages</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                  <th class="py-3.5 px-5">Employee</th>
                  <th class="py-3.5 px-4">Designation</th>
                  <th class="py-3.5 px-4">Department</th>
                  <th class="py-3.5 px-4">Work Email</th>
                  <th class="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DCEBE7]/70">
                @for (emp of employees(); track emp.id) {
                  <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                    <td class="py-3.5 px-5">
                      <p class="font-bold text-[#063B39]">{{ emp.fullName }}</p>
                      <p class="text-[10px] text-slate-400 font-mono">{{ emp.employeeCode }}</p>
                    </td>
                    <td class="py-3.5 px-4 font-medium text-slate-700">
                      {{ emp.designationTitle || '—' }}
                    </td>
                    <td class="py-3.5 px-4 text-slate-600">
                      {{ emp.departmentName || '—' }}
                    </td>
                    <td class="py-3.5 px-4 font-mono text-slate-500">
                      {{ emp.email }}
                    </td>
                    <td class="py-3.5 px-5 text-right">
                      <button 
                        type="button" 
                        (click)="openAssignForEmployee(emp)"
                        class="px-3 py-1 bg-[#0E6E68]/10 hover:bg-[#0E6E68]/20 text-[#0E6E68] text-[11px] font-bold rounded-lg transition-colors border-none cursor-pointer">
                        Assign Structure
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Modals -->
      @if (isCreateRunModalOpen()) {
        <app-create-payroll-run-modal
          [isSubmitting]="isSubmittingRun()"
          (closeModal)="isCreateRunModalOpen.set(false)"
          (createRun)="onSaveCreateRun($event)"
        ></app-create-payroll-run-modal>
      }

      @if (isStructureModalOpen()) {
        <app-salary-structure-modal
          [structure]="selectedStructure()"
          [payheads]="payheads()"
          [isSubmitting]="isSubmittingStructure()"
          (closeModal)="isStructureModalOpen.set(false)"
          (saveStructure)="onSaveStructure($event)"
        ></app-salary-structure-modal>
      }

      @if (isAssignModalOpen()) {
        <app-assign-salary-modal
          [employees]="employees()"
          [structures]="structures()"
          [isSubmitting]="isSubmittingAssign()"
          (closeModal)="isAssignModalOpen.set(false)"
          (assignSalary)="onSaveAssignSalary($event)"
        ></app-assign-salary-modal>
      }

      @if (isPayslipModalOpen()) {
        <app-payslip-modal
          [payslip]="selectedPayslip()"
          (closeModal)="isPayslipModalOpen.set(false)"
        ></app-payslip-modal>
      }

    </div>
  `
})
export class PayrollPageComponent implements OnInit {
  private readonly payrollRepo = inject(PayrollApiRepository);
  private readonly empRepo = inject(EmployeeApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly activeTab = signal<PayrollTab>('runs');

  readonly runs = signal<PayrollRun[]>([]);
  readonly totalRuns = signal<number>(0);
  readonly pageIndex = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly isLoadingRuns = signal<boolean>(false);

  readonly structures = signal<SalaryStructure[]>([]);
  readonly payheads = signal<Payhead[]>([]);
  readonly employees = signal<Employee[]>([]);

  readonly isCreateRunModalOpen = signal<boolean>(false);
  readonly isStructureModalOpen = signal<boolean>(false);
  readonly isAssignModalOpen = signal<boolean>(false);
  readonly isPayslipModalOpen = signal<boolean>(false);

  readonly isSubmittingRun = signal<boolean>(false);
  readonly isSubmittingStructure = signal<boolean>(false);
  readonly isSubmittingAssign = signal<boolean>(false);

  readonly selectedStructure = signal<SalaryStructure | null>(null);
  readonly selectedPayslip = signal<Payslip | null>(null);

  monthName(m: number): string {
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return names[m - 1] || `Month ${m}`;
  }

  ngOnInit(): void {
    this.loadRuns();
    this.loadStructures();
    this.loadPayheads();
    this.loadEmployees();
  }

  loadRuns(): void {
    this.isLoadingRuns.set(true);
    this.payrollRepo.getRuns(this.pageIndex(), 10)
      .pipe(finalize(() => this.isLoadingRuns.set(false)))
      .subscribe({
        next: p => {
          this.runs.set(p.items);
          this.totalRuns.set(p.totalCount);
          this.totalPages.set(p.totalPages);
        },
        error: () => {}
      });
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.loadRuns();
  }

  loadStructures(): void {
    this.payrollRepo.getStructures(1).subscribe({
      next: s => this.structures.set(s),
      error: () => {}
    });
  }

  loadPayheads(): void {
    this.payrollRepo.getPayheads(1).subscribe({
      next: p => this.payheads.set(p),
      error: () => {}
    });
  }

  loadEmployees(): void {
    this.empRepo.getEmployees({ pageSize: 100 }).subscribe({
      next: p => this.employees.set(p.items),
      error: () => {}
    });
  }

  openCreateStructureModal(): void {
    this.selectedStructure.set(null);
    this.isStructureModalOpen.set(true);
  }

  openEditStructureModal(s: SalaryStructure): void {
    this.selectedStructure.set(s);
    this.isStructureModalOpen.set(true);
  }

  openAssignForEmployee(emp: Employee): void {
    this.isAssignModalOpen.set(true);
  }

  viewRunDetails(runId: number): void {
    this.payrollRepo.getRunById(runId).subscribe({
      next: detail => {
        if (detail.payslips && detail.payslips.length > 0) {
          this.selectedPayslip.set(detail.payslips[0]);
          this.isPayslipModalOpen.set(true);
        } else {
          this.notificationService.showInfo('No payslips generated for this cycle yet.');
        }
      },
      error: err => this.notificationService.showError(err.message || 'Failed to load run details.')
    });
  }

  onSaveCreateRun(params: CreatePayrollRunParams): void {
    this.isSubmittingRun.set(true);
    this.payrollRepo.createRun(params)
      .pipe(finalize(() => this.isSubmittingRun.set(false)))
      .subscribe({
        next: () => {
          this.isCreateRunModalOpen.set(false);
          this.notificationService.showSuccess('Payroll cycle calculated successfully.');
          this.loadRuns();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to calculate payroll.')
      });
  }

  onSaveStructure(params: SaveSalaryStructureParams): void {
    this.isSubmittingStructure.set(true);
    const req$ = params.id
      ? this.payrollRepo.updateStructure(params)
      : this.payrollRepo.createStructure(params);

    req$.pipe(finalize(() => this.isSubmittingStructure.set(false)))
      .subscribe({
        next: () => {
          this.isStructureModalOpen.set(false);
          this.notificationService.showSuccess('Salary structure template saved.');
          this.loadStructures();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to save structure.')
      });
  }

  onSaveAssignSalary(params: AssignSalaryStructureParams): void {
    this.isSubmittingAssign.set(true);
    this.payrollRepo.assignStructure(params)
      .pipe(finalize(() => this.isSubmittingAssign.set(false)))
      .subscribe({
        next: () => {
          this.isAssignModalOpen.set(false);
          this.notificationService.showSuccess('Salary compensation assigned.');
        },
        error: err => this.notificationService.showError(err.message || 'Failed to assign salary.')
      });
  }

  onApproveRun(id: number): void {
    this.payrollRepo.approveRun(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Payroll cycle approved.');
        this.loadRuns();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to approve run.')
    });
  }

  onDisburseRun(id: number): void {
    this.payrollRepo.disburseRun(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Payroll run disbursed.');
        this.loadRuns();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to disburse run.')
    });
  }
}
