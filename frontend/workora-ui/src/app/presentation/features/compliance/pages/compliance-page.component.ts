import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ComplianceApiRepository } from '../../../../data/repositories/compliance-api.repository';
import { EmployeeApiRepository } from '../../../../data/repositories/employee-api.repository';
import { StatutorySummary, StatutoryExportFile } from '../../../../domain/models/compliance.model';
import { Employee } from '../../../../domain/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';

@Component({
  selector: 'app-compliance-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSkeletonComponent
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
              Statutory Compliance &amp; Government Filings
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Generate India regulatory exports (EPF ECR, ESIC returns, PT slabs, TDS Form 16).
          </p>
        </div>

        <div class="flex items-center gap-3">
          <select 
            [ngModel]="selectedMonth()" 
            (ngModelChange)="onMonthChange($event)"
            class="px-3.5 py-2 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] font-bold shadow-2xs cursor-pointer outline-none">
            @for (m of [1,2,3,4,5,6,7,8,9,10,11,12]; track m) {
              <option [value]="m">Month {{ m }}</option>
            }
          </select>
          <select 
            [ngModel]="selectedYear()" 
            (ngModelChange)="onYearChange($event)"
            class="px-3.5 py-2 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] font-bold shadow-2xs cursor-pointer outline-none">
            <option [value]="2025">2025</option>
            <option [value]="2026">2026</option>
          </select>
        </div>
      </div>

      <!-- Statutory Remittance Aggregation Cards -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (i of [1,2,3,4]; track i) {
            <app-workora-skeleton type="card"></app-workora-skeleton>
          }
        </div>
      } @else if (summary()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Statutory Remittance</span>
            <p class="text-2xl font-extrabold text-[#0E6E68] font-heading">
              ₹{{ summary()!.totalStatutoryRemittance | number:'1.2-2' }}
            </p>
            <p class="text-[11px] text-slate-500 font-medium">{{ summary()!.eligibleEmployeesCount }} Eligible Employees</p>
          </div>

          <div class="bg-white p-5 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Provident Fund (EPF Total)</span>
            <p class="text-2xl font-extrabold text-[#063B39] font-heading">
              ₹{{ (summary()!.totalEmployeePf + summary()!.totalEmployerPf) | number:'1.2-2' }}
            </p>
            <p class="text-[11px] text-slate-500">Employee: ₹{{ summary()!.totalEmployeePf | number }} | Employer: ₹{{ summary()!.totalEmployerPf | number }}</p>
          </div>

          <div class="bg-white p-5 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employee State Insurance (ESIC)</span>
            <p class="text-2xl font-extrabold text-[#063B39] font-heading">
              ₹{{ (summary()!.totalEmployeeEsic + summary()!.totalEmployerEsic) | number:'1.2-2' }}
            </p>
            <p class="text-[11px] text-slate-500">Employee: ₹{{ summary()!.totalEmployeeEsic | number }} | Employer: ₹{{ summary()!.totalEmployerEsic | number }}</p>
          </div>

          <div class="bg-white p-5 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">TDS &amp; Professional Tax</span>
            <p class="text-2xl font-extrabold text-[#063B39] font-heading">
              ₹{{ (summary()!.totalProfessionalTax + summary()!.totalTdsDeducted) | number:'1.2-2' }}
            </p>
            <p class="text-[11px] text-slate-500">TDS: ₹{{ summary()!.totalTdsDeducted | number }} | PT: ₹{{ summary()!.totalProfessionalTax | number }}</p>
          </div>
        </div>
      }

      <!-- Government Portal 1-Click Exports -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE7] shadow-xs space-y-6">
        <div>
          <h3 class="text-base font-extrabold text-[#063B39] font-heading">
            Government Portal Electronic Challan &amp; Return (ECR) Exports
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Download pre-formatted text/CSV returns compliant with Indian government portals.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <!-- EPF ECR -->
          <div class="p-5 rounded-2xl bg-[#F4F8F7] border border-[#DCEBE7] flex flex-col justify-between space-y-4">
            <div>
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-3">
                <span class="material-symbols-outlined">description</span>
              </div>
              <h4 class="font-bold text-sm text-[#063B39]">EPF Unified Portal ECR (.txt)</h4>
              <p class="text-xs text-slate-500 mt-1">UAN-based monthly electronic challan text file for EPFO upload.</p>
            </div>
            <button 
              type="button" 
              (click)="onExportEpf()"
              class="w-full py-2.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer border-none">
              <span class="material-symbols-outlined text-sm">download</span>
              <span>Download EPF ECR</span>
            </button>
          </div>

          <!-- ESIC Return -->
          <div class="p-5 rounded-2xl bg-[#F4F8F7] border border-[#DCEBE7] flex flex-col justify-between space-y-4">
            <div>
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3">
                <span class="material-symbols-outlined">table_chart</span>
              </div>
              <h4 class="font-bold text-sm text-[#063B39]">ESIC Monthly Contribution (.csv)</h4>
              <p class="text-xs text-slate-500 mt-1">IP Number and gross wage return file for ESIC Portal upload.</p>
            </div>
            <button 
              type="button" 
              (click)="onExportEsic()"
              class="w-full py-2.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer border-none">
              <span class="material-symbols-outlined text-sm">download</span>
              <span>Download ESIC CSV</span>
            </button>
          </div>

          <!-- Professional Tax -->
          <div class="p-5 rounded-2xl bg-[#F4F8F7] border border-[#DCEBE7] flex flex-col justify-between space-y-4">
            <div>
              <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold mb-3">
                <span class="material-symbols-outlined">receipt_long</span>
              </div>
              <h4 class="font-bold text-sm text-[#063B39]">Professional Tax Return (.csv)</h4>
              <p class="text-xs text-slate-500 mt-1">State-wise PT deduction schedule statement.</p>
            </div>
            <button 
              type="button" 
              (click)="onExportPt()"
              class="w-full py-2.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer border-none">
              <span class="material-symbols-outlined text-sm">download</span>
              <span>Download PT Return</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  `
})
export class CompliancePageComponent implements OnInit {
  private readonly complianceRepo = inject(ComplianceApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly selectedMonth = signal<number>(new Date().getMonth() + 1);
  readonly selectedYear = signal<number>(new Date().getFullYear());
  readonly summary = signal<StatutorySummary | null>(null);
  readonly isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadSummary();
  }

  onMonthChange(m: number): void {
    this.selectedMonth.set(Number(m));
    this.loadSummary();
  }

  onYearChange(y: number): void {
    this.selectedYear.set(Number(y));
    this.loadSummary();
  }

  loadSummary(): void {
    this.isLoading.set(true);
    this.complianceRepo.getStatutorySummary(this.selectedMonth(), this.selectedYear(), 1)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: s => this.summary.set(s),
        error: () => {}
      });
  }

  onExportEpf(): void {
    this.complianceRepo.exportEpfEcr(this.selectedMonth(), this.selectedYear(), 1).subscribe({
      next: f => {
        this.downloadFile(f);
        this.notificationService.showSuccess('EPF ECR file generated.');
      },
      error: err => this.notificationService.showError(err.message || 'Failed to export EPF ECR.')
    });
  }

  onExportEsic(): void {
    this.complianceRepo.exportEsicReturn(this.selectedMonth(), this.selectedYear(), 1).subscribe({
      next: f => {
        this.downloadFile(f);
        this.notificationService.showSuccess('ESIC monthly return generated.');
      },
      error: err => this.notificationService.showError(err.message || 'Failed to export ESIC return.')
    });
  }

  onExportPt(): void {
    this.complianceRepo.exportPtReturn(this.selectedMonth(), this.selectedYear(), 1).subscribe({
      next: f => {
        this.downloadFile(f);
        this.notificationService.showSuccess('PT return generated.');
      },
      error: err => this.notificationService.showError(err.message || 'Failed to export PT return.')
    });
  }

  private downloadFile(file: StatutoryExportFile): void {
    const blob = new Blob([atob(file.fileContentBase64 || '')], { type: file.contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
