import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Payslip } from '../../../../domain/models/payroll.model';

@Component({
  selector: 'app-payslip-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-2xl" (click)="$event.stopPropagation()">
        
        <!-- Header & Action Bar -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">receipt_long</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Digital Salary Payslip
              </h3>
              <p class="text-xs text-slate-500">Ref: {{ payslip?.uuid }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button 
              type="button" 
              (click)="printPayslip()"
              class="px-3 py-1.5 rounded-xl border border-[#DCEBE7] hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer">
              <span class="material-symbols-outlined text-base">print</span>
              <span>Print</span>
            </button>
            <button 
              type="button" 
              (click)="closeModal.emit()"
              class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        @if (payslip) {
          <!-- Payslip Document View -->
          <div class="workora-modal-body space-y-6 text-xs text-[#063B39]">
            
            <!-- Company & Employee Details -->
            <div class="p-5 bg-gradient-to-tr from-[#063B39] to-[#0E6E68] text-white rounded-3xl flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-white/70">Workora Corporation</span>
                <h2 class="text-lg font-extrabold mt-0.5">{{ payslip.employeeName }}</h2>
                <p class="text-xs text-white/80 font-mono">Employee Code: {{ payslip.employeeCode }}</p>
              </div>
              <div class="sm:text-right">
                <span class="text-[10px] font-bold uppercase tracking-wider text-white/70">Payment Status</span>
                <div class="mt-1">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 border border-emerald-300 text-emerald-100">
                    {{ payslip.paymentStatus }}
                  </span>
                </div>
                <p class="text-xs text-white/80 mt-1">Generated: {{ payslip.createdAt | date:'mediumDate' }}</p>
              </div>
            </div>

            <!-- Earnings vs Deductions Breakdown -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Earnings -->
              <div class="bg-[#F4F8F7] p-4 rounded-2xl border border-[#DCEBE7] space-y-3">
                <h4 class="font-extrabold text-xs text-[#0E6E68] uppercase tracking-wider border-b border-[#DCEBE7] pb-2 flex items-center justify-between">
                  <span>Earnings &amp; Allowances</span>
                  <span class="material-symbols-outlined text-base">add_circle</span>
                </h4>
                <div class="space-y-2">
                  @for (item of earningsItems(); track item.id) {
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-slate-600 font-medium">{{ item.componentName }}</span>
                      <span class="font-bold text-[#063B39]">\${{ item.amount | number:'1.2-2' }}</span>
                    </div>
                  }
                </div>
                <div class="pt-2 border-t border-[#DCEBE7] flex items-center justify-between font-extrabold text-xs text-[#063B39]">
                  <span>Total Gross Pay</span>
                  <span class="text-emerald-700">\${{ payslip.grossSalary | number:'1.2-2' }}</span>
                </div>
              </div>

              <!-- Deductions -->
              <div class="bg-[#F4F8F7] p-4 rounded-2xl border border-[#DCEBE7] space-y-3">
                <h4 class="font-extrabold text-xs text-rose-600 uppercase tracking-wider border-b border-[#DCEBE7] pb-2 flex items-center justify-between">
                  <span>Statutory Deductions</span>
                  <span class="material-symbols-outlined text-base">remove_circle</span>
                </h4>
                <div class="space-y-2">
                  @for (item of deductionsItems(); track item.id) {
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-slate-600 font-medium">{{ item.componentName }}</span>
                      <span class="font-bold text-rose-600">-\${{ item.amount | number:'1.2-2' }}</span>
                    </div>
                  }
                </div>
                <div class="pt-2 border-t border-[#DCEBE7] flex items-center justify-between font-extrabold text-xs text-[#063B39]">
                  <span>Total Deductions</span>
                  <span class="text-rose-600">-\${{ payslip.totalDeductions | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>

            <!-- Net Payable Banner -->
            <div class="p-5 bg-[#3FA79B]/10 rounded-2xl border border-[#3FA79B]/30 flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Net Take-Home Pay</span>
                <p class="text-2xl font-extrabold font-heading text-[#063B39] mt-0.5">
                  \${{ payslip.netSalary | number:'1.2-2' }}
                </p>
              </div>
              <div class="text-right">
                <span class="material-symbols-outlined text-3xl text-[#0E6E68]">verified</span>
              </div>
            </div>

          </div>
        }

      </div>
    </div>
  `
})
export class PayslipModalComponent {
  @Input() payslip: Payslip | null = null;

  @Output() closeModal = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  earningsItems() {
    return (this.payslip?.items || []).filter(i => i.type === 'Earning');
  }

  deductionsItems() {
    return (this.payslip?.items || []).filter(i => i.type === 'Deduction');
  }

  printPayslip(): void {
    window.print();
  }
}
