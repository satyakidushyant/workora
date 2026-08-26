import { Component, Input, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeDetail } from '../../../../domain/models/employee.model';

type DossierTab = 'overview' | 'history' | 'bank' | 'contacts';

/**
 * 360-Degree Employee Profile Dossier Modal Component.
 */
@Component({
  selector: 'app-employee-dossier-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div class="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] border border-[#DCEBE7] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header Banner -->
        <div class="p-5 sm:p-6 bg-gradient-to-r from-[#063B39] to-[#0E6E68] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 relative overflow-hidden">
          <div class="flex items-center gap-4 relative z-10">
            <!-- Profile Avatar -->
            <div class="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shrink-0">
              {{ getInitials(employee?.firstName, employee?.lastName) }}
            </div>

            <div>
              <div class="flex items-center gap-2.5">
                <h3 class="text-xl font-extrabold text-white font-heading">{{ employee?.fullName }}</h3>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#3FA79B]/30 text-white border border-[#3FA79B]/40">
                  {{ employee?.employeeCode }}
                </span>
                <span 
                  [ngClass]="employee?.isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : 'bg-rose-500/20 text-rose-300 border-rose-400/30'"
                  class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border">
                  {{ employee?.employmentStatus }}
                </span>
              </div>
              <p class="text-xs text-white/80 mt-1">
                {{ employee?.designationTitle || 'Staff Member' }} • {{ employee?.departmentName || 'Operations' }} • {{ employee?.branchName || 'Headquarters' }}
              </p>
            </div>
          </div>

          <button 
            type="button" 
            (click)="closeModal.emit()"
            class="text-white/70 hover:text-white rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer relative z-10 self-start sm:self-center">
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <!-- Navigation Tabs -->
        <div class="px-6 py-2.5 bg-[#F4F8F7] border-b border-[#DCEBE7] flex items-center gap-2 overflow-x-auto shrink-0">
          <button 
            type="button" 
            (click)="activeTab.set('overview')"
            [ngClass]="activeTab() === 'overview' ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#063B39]'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base">person</span>
            <span>Profile Overview</span>
          </button>

          <button 
            type="button" 
            (click)="activeTab.set('history')"
            [ngClass]="activeTab() === 'history' ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#063B39]'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base">history_edu</span>
            <span>Career History ({{ employee?.employmentHistory?.length || 0 }})</span>
          </button>

          <button 
            type="button" 
            (click)="activeTab.set('bank')"
            [ngClass]="activeTab() === 'bank' ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#063B39]'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base">account_balance</span>
            <span>Bank &amp; Payroll</span>
          </button>

          <button 
            type="button" 
            (click)="activeTab.set('contacts')"
            [ngClass]="activeTab() === 'contacts' ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#063B39]'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base">emergency</span>
            <span>Emergency Contacts</span>
          </button>
        </div>

        <!-- Tab Content Body -->
        <div class="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">

          <!-- ======================================================== -->
          <!-- TAB 1: OVERVIEW -->
          <!-- ======================================================== -->
          @if (activeTab() === 'overview') {
            <div class="space-y-6 animate-in fade-in duration-200">
              <!-- Grid Info Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div class="p-4 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]">
                  <span class="text-[10px] text-slate-400 font-bold uppercase block">Official Email</span>
                  <span class="text-xs font-bold text-[#063B39] block mt-0.5 truncate">{{ employee?.email }}</span>
                </div>

                <div class="p-4 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]">
                  <span class="text-[10px] text-slate-400 font-bold uppercase block">Phone Number</span>
                  <span class="text-xs font-bold text-[#063B39] block mt-0.5">{{ employee?.phone || '—' }}</span>
                </div>

                <div class="p-4 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]">
                  <span class="text-[10px] text-slate-400 font-bold uppercase block">National ID</span>
                  <span class="text-xs font-bold text-[#063B39] block mt-0.5 font-mono">{{ employee?.nationalId }}</span>
                </div>

                <div class="p-4 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]">
                  <span class="text-[10px] text-slate-400 font-bold uppercase block">Date of Birth</span>
                  <span class="text-xs font-bold text-[#063B39] block mt-0.5">{{ employee?.dateOfBirth | date:'longDate' }}</span>
                </div>

                <div class="p-4 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]">
                  <span class="text-[10px] text-slate-400 font-bold uppercase block">Gender &amp; Marital</span>
                  <span class="text-xs font-bold text-[#063B39] block mt-0.5">{{ employee?.gender }} • {{ employee?.maritalStatus }}</span>
                </div>

                <div class="p-4 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]">
                  <span class="text-[10px] text-slate-400 font-bold uppercase block">Joining Date</span>
                  <span class="text-xs font-bold text-[#063B39] block mt-0.5">{{ employee?.hireDate | date:'longDate' }}</span>
                </div>

                <div class="p-4 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]">
                  <span class="text-[10px] text-slate-400 font-bold uppercase block">Employment Type</span>
                  <span class="text-xs font-bold text-[#063B39] block mt-0.5">{{ employee?.employmentType }}</span>
                </div>

                <div class="p-4 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]">
                  <span class="text-[10px] text-slate-400 font-bold uppercase block">Reporting Manager</span>
                  <span class="text-xs font-bold text-[#063B39] block mt-0.5">{{ employee?.managerName || 'None (Direct Report to Exec)' }}</span>
                </div>

                <div class="p-4 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]">
                  <span class="text-[10px] text-slate-400 font-bold uppercase block">Residential Address</span>
                  <span class="text-xs font-bold text-[#063B39] block mt-0.5 truncate">{{ employee?.address || '—' }}</span>
                </div>
              </div>
            </div>
          }

          <!-- ======================================================== -->
          <!-- TAB 2: CAREER HISTORY -->
          <!-- ======================================================== -->
          @if (activeTab() === 'history') {
            <div class="space-y-4 animate-in fade-in duration-200">
              @if (!employee?.employmentHistory || employee?.employmentHistory?.length === 0) {
                <div class="p-8 text-center bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]">
                  <span class="material-symbols-outlined text-3xl text-slate-400">history</span>
                  <p class="text-xs font-bold text-[#063B39] mt-1">Initial hire onboarding record only.</p>
                </div>
              } @else {
                <div class="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#DCEBE7]">
                  @for (event of employee?.employmentHistory; track event.id) {
                    <div class="flex items-start gap-4 relative">
                      <div class="w-7 h-7 rounded-full bg-[#0E6E68] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ring-4 ring-white">
                        <span class="material-symbols-outlined text-sm">trending_up</span>
                      </div>
                      <div class="flex-1 p-4 bg-white rounded-2xl border border-[#DCEBE7] shadow-2xs">
                        <div class="flex items-center justify-between">
                          <h4 class="text-xs font-extrabold text-[#063B39]">{{ event.eventType }}</h4>
                          <span class="text-[10px] font-bold text-slate-400">{{ event.effectiveDate | date:'mediumDate' }}</span>
                        </div>
                        @if (event.notes) {
                          <p class="text-xs text-slate-600 mt-1">{{ event.notes }}</p>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- ======================================================== -->
          <!-- TAB 3: BANK & COMPENSATION -->
          <!-- ======================================================== -->
          @if (activeTab() === 'bank') {
            <div class="space-y-4 animate-in fade-in duration-200">
              @if (!employee?.bankDetails || employee?.bankDetails?.length === 0) {
                <div class="p-8 text-center bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]">
                  <span class="material-symbols-outlined text-3xl text-slate-400">account_balance_wallet</span>
                  <p class="text-xs font-bold text-[#063B39] mt-1">No bank accounts linked yet.</p>
                </div>
              } @else {
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  @for (bank of employee?.bankDetails; track bank.id) {
                    <div class="p-5 bg-gradient-to-tr from-[#063B39] to-[#0E6E68] rounded-3xl text-white shadow-md space-y-3 relative overflow-hidden">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-extrabold tracking-wider uppercase opacity-80">{{ bank.bankName }}</span>
                        @if (bank.isPrimary) {
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#3FA79B] text-white">
                            Primary Account
                          </span>
                        }
                      </div>

                      <div>
                        <p class="text-[10px] opacity-70 uppercase tracking-widest">Account Number</p>
                        <p class="text-base font-mono font-bold tracking-widest">{{ bank.accountNumber }}</p>
                      </div>

                      <div class="flex items-center justify-between text-[11px] opacity-80 pt-2 border-t border-white/15">
                        <span>Holder: {{ bank.accountHolderName }}</span>
                        @if (bank.branchCode) {
                          <span>IFSC/Code: {{ bank.branchCode }}</span>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- ======================================================== -->
          <!-- TAB 4: EMERGENCY CONTACTS -->
          <!-- ======================================================== -->
          @if (activeTab() === 'contacts') {
            <div class="space-y-4 animate-in fade-in duration-200">
              @if (!employee?.emergencyContacts || employee?.emergencyContacts?.length === 0) {
                <div class="p-8 text-center bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]">
                  <span class="material-symbols-outlined text-3xl text-slate-400">contact_emergency</span>
                  <p class="text-xs font-bold text-[#063B39] mt-1">No emergency contacts registered.</p>
                </div>
              } @else {
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  @for (contact of employee?.emergencyContacts; track contact.id) {
                    <div class="p-4 bg-white rounded-2xl border border-[#DCEBE7] shadow-2xs flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                          <span class="material-symbols-outlined">favorite</span>
                        </div>
                        <div>
                          <h4 class="text-xs font-extrabold text-[#063B39]">{{ contact.name }}</h4>
                          <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#DCEBE7] text-[#063B39]">
                            {{ contact.relationship }}
                          </span>
                        </div>
                      </div>

                      <a [href]="'tel:' + contact.phoneNumber" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0E6E68]/10 text-[#0E6E68] text-xs font-bold hover:bg-[#0E6E68] hover:text-white transition-colors no-underline">
                        <span class="material-symbols-outlined text-sm">call</span>
                        <span>{{ contact.phoneNumber }}</span>
                      </a>
                    </div>
                  }
                </div>
              }
            </div>
          }

        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-[#DCEBE7] bg-[#F4F8F7]/50 flex items-center justify-end shrink-0">
          <button 
            type="button" 
            (click)="closeModal.emit()"
            class="px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer border-none bg-transparent">
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  `
})
export class EmployeeDossierModalComponent {
  @Input() employee: EmployeeDetail | null = null;
  @Output() closeModal = new EventEmitter<void>();

  readonly activeTab = signal<DossierTab>('overview');

  getInitials(firstName?: string, lastName?: string): string {
    const f = firstName ? firstName.charAt(0).toUpperCase() : 'E';
    const l = lastName ? lastName.charAt(0).toUpperCase() : 'M';
    return `${f}${l}`;
  }
}
