import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ExpenseApiRepository } from '../../../../data/repositories/expense-api.repository';
import { EmployeeApiRepository } from '../../../../data/repositories/employee-api.repository';
import { ExpenseClaim, SubmitExpenseParams } from '../../../../domain/models/expense.model';
import { Employee } from '../../../../domain/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { SubmitExpenseModalComponent } from '../components/submit-expense-modal.component';

@Component({
  selector: 'app-expenses-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent,
    SubmitExpenseModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">receipt</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Expense Reimbursement Claims
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage employee travel, meals, and software claims with two-tier Manager &amp; Finance approval.
          </p>
        </div>

        <button 
          type="button" 
          (click)="isSubmitModalOpen.set(true)"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
          <span class="material-symbols-outlined text-base">add_circle</span>
          <span>Submit Claim</span>
        </button>
      </div>

      <!-- Expense Claims Table -->
      <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden">
        <div class="p-5 border-b border-[#DCEBE7]">
          <h3 class="text-sm font-extrabold text-[#063B39]">Submitted Reimbursement Claims</h3>
        </div>

        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="4"></app-workora-skeleton>
          </div>
        } @else if (claims().length === 0) {
          <div class="p-12">
            <app-workora-empty-state 
              icon="receipt" 
              title="No Claims Recorded"
              description="Submit business expense receipts for reimbursement."
              actionLabel="Submit First Claim"
              (actionClick)="isSubmitModalOpen.set(true)"
            ></app-workora-empty-state>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                  <th class="py-3.5 px-5">Employee</th>
                  <th class="py-3.5 px-4">Category &amp; Merchant</th>
                  <th class="py-3.5 px-4">Date</th>
                  <th class="py-3.5 px-4">Amount</th>
                  <th class="py-3.5 px-4">Receipt</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-5 text-right">Approval Workflow</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DCEBE7]/70">
                @for (c of claims(); track c.id) {
                  <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                    <td class="py-3.5 px-5">
                      <p class="font-bold text-[#063B39]">{{ c.employeeName }}</p>
                      <p class="text-[10px] text-slate-400 font-mono">{{ c.employeeCode }}</p>
                    </td>
                    <td class="py-3.5 px-4">
                      <p class="font-semibold text-slate-800">{{ c.category }}</p>
                      <p class="text-[11px] text-slate-500">{{ c.merchantName || '—' }}</p>
                    </td>
                    <td class="py-3.5 px-4 text-slate-600 font-medium">
                      {{ c.expenseDate | date:'mediumDate' }}
                    </td>
                    <td class="py-3.5 px-4 font-extrabold text-[#0E6E68]">
                      \${{ c.amount | number:'1.2-2' }}
                    </td>
                    <td class="py-3.5 px-4">
                      <a 
                        [href]="c.receiptUrl" 
                        target="_blank" 
                        class="text-[#0E6E68] hover:underline inline-flex items-center gap-1 font-bold">
                        <span class="material-symbols-outlined text-sm">attachment</span>
                        <span>Bill Link</span>
                      </a>
                    </td>
                    <td class="py-3.5 px-4">
                      <span 
                        [ngClass]="{
                          'bg-amber-50 text-amber-700 border-amber-200': c.status === 'Submitted' || c.status === 'PendingManager',
                          'bg-blue-50 text-blue-700 border-blue-200': c.status === 'PendingFinance' || c.status === 'ManagerApproved',
                          'bg-emerald-50 text-emerald-700 border-emerald-200': c.status === 'Approved' || c.status === 'Paid',
                          'bg-rose-50 text-rose-700 border-rose-200': c.status === 'Rejected'
                        }"
                        class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border">
                        {{ c.status }}
                      </span>
                    </td>
                    <td class="py-3.5 px-5 text-right">
                      <div class="inline-flex items-center gap-1.5">
                        @if (c.status === 'Submitted' || c.status === 'PendingManager') {
                          <button 
                            type="button" 
                            (click)="onApproveManager(c.id)"
                            class="px-2.5 py-1 rounded-lg bg-[#0E6E68] hover:bg-[#063B39] text-white text-[11px] font-bold transition-all border-none cursor-pointer">
                            Mgr Approve
                          </button>
                        } @else if (c.status === 'PendingFinance' || c.status === 'ManagerApproved') {
                          <button 
                            type="button" 
                            (click)="onApproveFinance(c.id)"
                            class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all border-none cursor-pointer">
                            Finance Final
                          </button>
                        }

                        @if (c.status !== 'Approved' && c.status !== 'Paid' && c.status !== 'Rejected') {
                          <button 
                            type="button" 
                            (click)="onRejectExpense(c.id)"
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

      <!-- Submit Modal -->
      @if (isSubmitModalOpen()) {
        <app-submit-expense-modal
          [employees]="employees()"
          [isSubmitting]="isSubmitting()"
          (closeModal)="isSubmitModalOpen.set(false)"
          (submitExpense)="onSaveSubmitExpense($event)"
        ></app-submit-expense-modal>
      }

    </div>
  `
})
export class ExpensesPageComponent implements OnInit {
  private readonly expenseRepo = inject(ExpenseApiRepository);
  private readonly empRepo = inject(EmployeeApiRepository);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  readonly claims = signal<ExpenseClaim[]>([]);
  readonly employees = signal<Employee[]>([]);

  readonly isLoading = signal<boolean>(false);
  readonly isSubmitModalOpen = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  private get currentEmpId(): number {
    return this.authService.currentUser()?.employeeId ?? 1;
  }

  ngOnInit(): void {
    this.loadClaims();
    this.empRepo.getEmployees({ pageSize: 100 }).subscribe(p => this.employees.set(p.items));
  }

  loadClaims(): void {
    this.isLoading.set(true);
    this.expenseRepo.getExpenseClaims()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: items => this.claims.set(items),
        error: () => {}
      });
  }

  onSaveSubmitExpense(params: SubmitExpenseParams): void {
    this.isSubmitting.set(true);
    this.expenseRepo.submitExpenseClaim(params)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.isSubmitModalOpen.set(false);
          this.notificationService.showSuccess('Expense claim submitted for review.');
          this.loadClaims();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to submit claim.')
      });
  }

  onApproveManager(id: number): void {
    this.expenseRepo.approveByManager(id, this.currentEmpId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Approved by reporting manager. Forwarded to Finance.');
        this.loadClaims();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to approve claim.')
    });
  }

  onApproveFinance(id: number): void {
    this.expenseRepo.approveByFinance(id, this.currentEmpId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Reimbursement approved by Finance team.');
        this.loadClaims();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to finalize claim.')
    });
  }

  onRejectExpense(id: number): void {
    this.expenseRepo.rejectExpenseClaim(id, this.currentEmpId, 'Invalid receipt proof').subscribe({
      next: () => {
        this.notificationService.showSuccess('Claim rejected.');
        this.loadClaims();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to reject claim.')
    });
  }
}
