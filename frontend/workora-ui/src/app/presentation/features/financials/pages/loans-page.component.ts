import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { LoanApiRepository } from '../../../../data/repositories/loan-api.repository';
import { EmployeeApiRepository } from '../../../../data/repositories/employee-api.repository';
import { Loan, LoanEmiSchedule, ApplyLoanParams } from '../../../../domain/models/loan.model';
import { Employee } from '../../../../domain/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { ApplyLoanModalComponent } from '../components/apply-loan-modal.component';

@Component({
  selector: 'app-loans-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent,
    ApplyLoanModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">account_balance</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Employee Loans &amp; Salary Advances
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage corporate loan programs, EMI schedules, and monthly payroll deductions.
          </p>
        </div>

        <button 
          type="button" 
          (click)="isApplyModalOpen.set(true)"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
          <span class="material-symbols-outlined text-base">credit_score</span>
          <span>Apply for Loan</span>
        </button>
      </div>

      <!-- Loans Grid / Table -->
      <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden">
        <div class="p-5 border-b border-[#DCEBE7] flex items-center justify-between">
          <h3 class="text-sm font-extrabold text-[#063B39]">Active &amp; Past Loan Accounts</h3>
        </div>

        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="4"></app-workora-skeleton>
          </div>
        } @else if (loans().length === 0) {
          <div class="p-12">
            <app-workora-empty-state 
              icon="account_balance" 
              title="No Loan Accounts"
              description="No employee loan or salary advance applications have been recorded."
              actionLabel="Apply for Loan"
              (actionClick)="isApplyModalOpen.set(true)"
            ></app-workora-empty-state>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                  <th class="py-3.5 px-5">Employee</th>
                  <th class="py-3.5 px-4">Loan Type</th>
                  <th class="py-3.5 px-4">Principal</th>
                  <th class="py-3.5 px-4">Monthly EMI</th>
                  <th class="py-3.5 px-4">Balance</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DCEBE7]/70">
                @for (loan of loans(); track loan.id) {
                  <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                    <td class="py-3.5 px-5">
                      <p class="font-bold text-[#063B39]">{{ loan.employeeName }}</p>
                      <p class="text-[10px] text-slate-400 font-mono">{{ loan.employeeCode }}</p>
                    </td>
                    <td class="py-3.5 px-4 font-semibold text-slate-700">
                      {{ loan.loanType }}
                    </td>
                    <td class="py-3.5 px-4 font-bold text-[#063B39]">
                      \${{ loan.principalAmount | number:'1.2-2' }}
                    </td>
                    <td class="py-3.5 px-4 font-bold text-[#0E6E68]">
                      \${{ loan.monthlyEmi | number:'1.2-2' }}/mo
                    </td>
                    <td class="py-3.5 px-4 font-extrabold text-slate-800">
                      \${{ loan.remainingBalance | number:'1.2-2' }}
                    </td>
                    <td class="py-3.5 px-4">
                      <span 
                        [ngClass]="{
                          'bg-amber-50 text-amber-700 border-amber-200': loan.status === 'Pending' || loan.status === 'Applied',
                          'bg-emerald-50 text-emerald-700 border-emerald-200': loan.status === 'Approved' || loan.status === 'Disbursed',
                          'bg-rose-50 text-rose-700 border-rose-200': loan.status === 'Rejected',
                          'bg-slate-100 text-slate-600 border-slate-200': loan.status === 'Closed'
                        }"
                        class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border">
                        {{ loan.status }}
                      </span>
                    </td>
                    <td class="py-3.5 px-5 text-right">
                      <div class="inline-flex items-center gap-1.5">
                        <button 
                          type="button" 
                          (click)="viewSchedule(loan)"
                          class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all border-none cursor-pointer">
                          EMI Schedule
                        </button>

                        @if (loan.status === 'Pending' || loan.status === 'Applied') {
                          <button 
                            type="button" 
                            (click)="onApproveLoan(loan.id)"
                            class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all border-none cursor-pointer">
                            Approve
                          </button>
                          <button 
                            type="button" 
                            (click)="onRejectLoan(loan.id)"
                            class="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-all border-none cursor-pointer">
                            Reject
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Schedule Modal -->
      @if (selectedLoanForSchedule()) {
        <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-[#DCEBE7] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-3">
              <h3 class="text-sm font-extrabold text-[#063B39]">Monthly EMI Amortization Schedule</h3>
              <button (click)="selectedLoanForSchedule.set(null)" class="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div class="max-h-64 overflow-y-auto space-y-2 text-xs">
              @for (item of schedule(); track item.id) {
                <div class="p-3 bg-[#F4F8F7] rounded-xl border border-[#DCEBE7] flex items-center justify-between">
                  <div>
                    <span class="font-bold text-[#063B39]">Installment #{{ item.installmentNumber }}</span>
                    <p class="text-[10px] text-slate-500 font-mono">Due: {{ item.dueDate | date:'mediumDate' }}</p>
                  </div>
                  <div class="text-right">
                    <span class="font-extrabold text-[#0E6E68]">\${{ item.emiAmount | number:'1.2-2' }}</span>
                    <span class="block text-[10px]" [ngClass]="item.isPaid ? 'text-emerald-600 font-bold' : 'text-slate-400'">
                      {{ item.isPaid ? 'Paid in Payroll' : 'Pending' }}
                    </span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- Apply Loan Modal -->
      @if (isApplyModalOpen()) {
        <app-apply-loan-modal
          [employees]="employees()"
          [isSubmitting]="isSubmittingApply()"
          (closeModal)="isApplyModalOpen.set(false)"
          (submitLoan)="onSaveApplyLoan($event)"
        ></app-apply-loan-modal>
      }

    </div>
  `
})
export class LoansPageComponent implements OnInit {
  private readonly loanRepo = inject(LoanApiRepository);
  private readonly empRepo = inject(EmployeeApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly loans = signal<Loan[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly schedule = signal<LoanEmiSchedule[]>([]);

  readonly isLoading = signal<boolean>(false);
  readonly isApplyModalOpen = signal<boolean>(false);
  readonly isSubmittingApply = signal<boolean>(false);

  readonly selectedLoanForSchedule = signal<Loan | null>(null);

  ngOnInit(): void {
    this.loadLoans();
    this.empRepo.getEmployees({ pageSize: 100 }).subscribe(p => this.employees.set(p.items));
  }

  loadLoans(): void {
    this.isLoading.set(true);
    this.loanRepo.getCompanyLoans()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: items => this.loans.set(items),
        error: () => {}
      });
  }

  viewSchedule(loan: Loan): void {
    this.selectedLoanForSchedule.set(loan);
    this.loanRepo.getLoanSchedule(loan.id).subscribe({
      next: s => this.schedule.set(s),
      error: () => {}
    });
  }

  onSaveApplyLoan(params: ApplyLoanParams): void {
    this.isSubmittingApply.set(true);
    this.loanRepo.applyForLoan(params)
      .pipe(finalize(() => this.isSubmittingApply.set(false)))
      .subscribe({
        next: () => {
          this.isApplyModalOpen.set(false);
          this.notificationService.showSuccess('Loan application submitted for review.');
          this.loadLoans();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to submit loan application.')
      });
  }

  onApproveLoan(id: number): void {
    this.loanRepo.approveLoan(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Loan approved.');
        this.loadLoans();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to approve loan.')
    });
  }

  onRejectLoan(id: number): void {
    this.loanRepo.rejectLoan(id, 1, 'Rejected by policy').subscribe({
      next: () => {
        this.notificationService.showSuccess('Loan application rejected.');
        this.loadLoans();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to reject loan.')
    });
  }
}
