import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { PayrollApiRepository } from '../../../../data/repositories/payroll-api.repository';
import { Payslip } from '../../../../domain/models/payroll.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { PayslipModalComponent } from '../components/payslip-modal.component';

@Component({
  selector: 'app-payslips-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent,
    PayslipModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">request_quote</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              My Payslips &amp; Tax Documents
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Self-service digital payslip archive, earnings breakdowns, and monthly take-home statements.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-xs font-bold text-slate-500">Year:</label>
          <select 
            [ngModel]="selectedYear()" 
            (ngModelChange)="onYearChange($event)"
            class="px-3.5 py-2 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] shadow-2xs font-bold outline-none cursor-pointer">
            <option [value]="2026">2026</option>
            <option [value]="2025">2025</option>
            <option [value]="2024">2024</option>
          </select>
        </div>
      </div>

      <!-- Payslips Grid -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (i of [1,2,3]; track i) {
            <app-workora-skeleton type="card"></app-workora-skeleton>
          }
        </div>
      } @else if (payslips().length === 0) {
        <div class="bg-white rounded-3xl p-12 border border-[#DCEBE7] shadow-xs">
          <app-workora-empty-state 
            icon="receipt_long" 
            title="No Payslips Issued"
            description="No salary slips have been disbursed for the selected calendar year."
          ></app-workora-empty-state>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (p of payslips(); track p.id) {
            <div class="bg-white rounded-3xl p-6 border border-[#DCEBE7] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-[#0E6E68]/10 text-[#0E6E68] flex items-center justify-center font-bold">
                      <span class="material-symbols-outlined text-xl">payments</span>
                    </div>
                    <div>
                      <h3 class="font-extrabold text-sm text-[#063B39]">Monthly Salary Slip</h3>
                      <p class="text-[11px] text-slate-500 font-mono">Issued {{ p.createdAt | date:'mediumDate' }}</p>
                    </div>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {{ p.paymentStatus }}
                  </span>
                </div>

                <!-- Salary Amounts Box -->
                <div class="my-4 p-4 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] space-y-2 text-xs">
                  <div class="flex items-center justify-between text-slate-600">
                    <span>Gross Earnings:</span>
                    <span class="font-bold text-[#063B39]">\${{ p.grossSalary | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex items-center justify-between text-slate-600">
                    <span>Deductions &amp; Tax:</span>
                    <span class="font-bold text-rose-600">-\${{ p.totalDeductions | number:'1.2-2' }}</span>
                  </div>
                  <div class="pt-2 border-t border-[#DCEBE7] flex items-center justify-between font-extrabold text-sm">
                    <span class="text-[#063B39]">Net Take-Home:</span>
                    <span class="text-[#0E6E68]">\${{ p.netSalary | number:'1.2-2' }}</span>
                  </div>
                </div>
              </div>

              <div class="pt-2">
                <button 
                  type="button" 
                  (click)="viewPayslip(p)"
                  class="w-full py-2.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer border-none">
                  <span class="material-symbols-outlined text-base">visibility</span>
                  <span>View Itemized Statement</span>
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Payslip Modal -->
      @if (isPayslipModalOpen()) {
        <app-payslip-modal
          [payslip]="selectedPayslip()"
          (closeModal)="isPayslipModalOpen.set(false)"
        ></app-payslip-modal>
      }

    </div>
  `
})
export class PayslipsPageComponent implements OnInit {
  private readonly payrollRepo = inject(PayrollApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly selectedYear = signal<number>(new Date().getFullYear());
  readonly payslips = signal<Payslip[]>([]);
  readonly isLoading = signal<boolean>(false);

  readonly isPayslipModalOpen = signal<boolean>(false);
  readonly selectedPayslip = signal<Payslip | null>(null);

  ngOnInit(): void {
    this.loadPayslips();
  }

  loadPayslips(): void {
    this.isLoading.set(true);
    this.payrollRepo.getMyPayslips(this.selectedYear())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: items => this.payslips.set(items),
        error: () => {}
      });
  }

  onYearChange(year: number): void {
    this.selectedYear.set(Number(year));
    this.loadPayslips();
  }

  viewPayslip(p: Payslip): void {
    this.selectedPayslip.set(p);
    this.isPayslipModalOpen.set(true);
  }
}
