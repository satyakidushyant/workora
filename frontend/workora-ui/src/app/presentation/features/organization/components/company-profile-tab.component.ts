import { Component, Input, Output, EventEmitter, inject, signal, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Company, UpdateCompanyProfileParams } from '../../../../domain/models/organization.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

/**
 * Presentational component for managing company identity, branding, and fiscal parameters.
 */
@Component({
  selector: 'app-company-profile-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, WorkoraSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Header Banner & Logo Section -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE7] shadow-xs relative overflow-hidden">
        <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-gradient-to-br from-[#3FA79B]/10 to-transparent rounded-full pointer-events-none"></div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div class="flex items-center gap-5">
            <!-- Company Logo Preview -->
            <div class="relative group">
              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#063B39] to-[#0E6E68] text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white overflow-hidden shrink-0">
                @if (company?.logoUrl) {
                  <img [src]="company?.logoUrl" [alt]="company?.name" class="w-full h-full object-cover" />
                } @else {
                  <span>{{ (company?.name || 'WK').slice(0, 2).toUpperCase() }}</span>
                }
              </div>
            </div>

            <div>
              <div class="flex items-center gap-3">
                <h2 class="text-2xl font-extrabold text-[#063B39] tracking-tight font-heading">{{ company?.name || 'Workora Enterprise' }}</h2>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#3FA79B]/15 text-[#0E6E68] border border-[#3FA79B]/30">
                  {{ company?.code || 'CORP' }}
                </span>
                @if (company?.isActive) {
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                  </span>
                }
              </div>
              <p class="text-xs text-slate-500 mt-1 font-medium">
                Established {{ company?.createdAt | date:'mediumDate' }} • Currency: <span class="font-bold text-[#0E6E68]">{{ company?.currency || 'INR' }}</span>
              </p>
            </div>
          </div>

          <!-- Direct Logo URL updater input trigger -->
          <div class="w-full sm:w-auto">
            <button 
              type="button" 
              (click)="isLogoModalOpen.set(true)"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#DCEBE7] bg-[#F4F8F7] hover:bg-white text-xs font-bold text-[#063B39] transition-all cursor-pointer shadow-2xs hover:shadow-xs">
              <span class="material-symbols-outlined text-base text-[#0E6E68]">image</span>
              <span>Update Logo</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Company Profile Form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE7] shadow-xs space-y-6">
        <div>
          <h3 class="text-base font-bold text-[#063B39]">Corporate Details</h3>
          <p class="text-xs text-slate-500 mt-0.5">Manage legal name, tax registrations, fiscal year start, and contact channels.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <!-- Company Name -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Company Legal Name <span class="text-rose-500">*</span></label>
            <input 
              type="text" 
              formControlName="name" 
              placeholder="e.g. Acme Technologies India Pvt Ltd"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none font-medium transition-all"
            />
            @if (form.get('name')?.invalid && form.get('name')?.touched) {
              <p class="text-[11px] text-rose-500 font-semibold mt-1">Company name is required.</p>
            }
          </div>

          <!-- Registration Number -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Registration / CIN Number</label>
            <input 
              type="text" 
              formControlName="registrationNumber" 
              placeholder="e.g. U72200KA2023PTC123456"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none font-medium transition-all"
            />
          </div>

          <!-- Tax ID / GSTIN -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Tax Identification / GSTIN</label>
            <input 
              type="text" 
              formControlName="taxId" 
              placeholder="e.g. 29AAAAA0000A1Z5"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none font-medium transition-all"
            />
          </div>

          <!-- Corporate Email -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Corporate Email</label>
            <input 
              type="email" 
              formControlName="email" 
              placeholder="e.g. contact@company.in"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none font-medium transition-all"
            />
          </div>

          <!-- Corporate Phone -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Contact Phone</label>
            <input 
              type="tel" 
              formControlName="phone" 
              placeholder="e.g. +91 80 1234 5678"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none font-medium transition-all"
            />
          </div>

          <!-- Website -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Website</label>
            <input 
              type="url" 
              formControlName="website" 
              placeholder="e.g. https://company.in"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none font-medium transition-all"
            />
          </div>

          <!-- Currency -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Default Currency <span class="text-rose-500">*</span></label>
            <app-workora-select
              formControlName="currency"
              [options]="currencyOptions"
              placeholder="Choose Currency"
              icon="payments"
            ></app-workora-select>
          </div>

          <!-- Fiscal Year Start Month -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Fiscal Year Start Month <span class="text-rose-500">*</span></label>
            <app-workora-select
              formControlName="fiscalYearStartMonth"
              [options]="fiscalYearOptions"
              placeholder="Choose Fiscal Start Month"
              icon="calendar_month"
            ></app-workora-select>
          </div>

          <!-- Head Office Address -->
          <div class="md:col-span-2 lg:col-span-3">
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Registered Headquarters Address</label>
            <textarea 
              formControlName="address" 
              rows="3" 
              placeholder="e.g. Brigade Gateway, Malleshwaram, Bengaluru, Karnataka 560055"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none font-medium transition-all resize-none"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#DCEBE7]">
          <button 
            type="submit" 
            [disabled]="form.invalid || isSaving"
            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer">
            @if (isSaving) {
              <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Saving...</span>
            } @else {
              <span class="material-symbols-outlined text-base">save</span>
              <span>Save Company Profile</span>
            }
          </button>
        </div>
      </form>

      <!-- Logo Update Modal -->
      @if (isLogoModalOpen()) {
        <div class="workora-modal-overlay" (click)="isLogoModalOpen.set(false)">
          <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
            <div class="workora-modal-header">
              <h3 class="text-base font-extrabold text-[#063B39]">Update Company Logo</h3>
              <button (click)="isLogoModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div class="workora-modal-body space-y-4">
              <div>
                <label class="workora-label">Direct Image URL</label>
                <input 
                  type="url" 
                  #logoInput
                  [value]="company?.logoUrl || ''"
                  placeholder="https://res.cloudinary.com/..."
                  class="workora-input !py-2.5"
                />
                <p class="text-[11px] text-slate-400 mt-1">Provide a HTTPS image URL hosted on CDN or Cloudinary.</p>
              </div>
            </div>

            <div class="workora-modal-footer">
              <button 
                type="button" 
                (click)="isLogoModalOpen.set(false)"
                class="workora-btn-secondary">
                Cancel
              </button>
              <button 
                type="button" 
                (click)="onSaveLogo(logoInput.value)"
                class="workora-btn-primary">
                Update Logo
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CompanyProfileTabComponent implements OnChanges {
  @Input() company: Company | null = null;
  @Input() isSaving = false;
  @Output() saveProfile = new EventEmitter<UpdateCompanyProfileParams>();
  @Output() saveLogo = new EventEmitter<string>();

  private readonly fb = inject(FormBuilder);
  readonly isLogoModalOpen = signal<boolean>(false);

  readonly currencyOptions: WorkoraSelectOption<string>[] = [
    { value: 'INR', label: 'INR (₹)', sublabel: 'Indian Rupee', icon: 'currency_rupee', badge: 'INR', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'USD', label: 'USD ($)', sublabel: 'US Dollar', icon: 'attach_money', badge: 'USD', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'EUR', label: 'EUR (€)', sublabel: 'Euro', icon: 'euro', badge: 'EUR', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
    { value: 'GBP', label: 'GBP (£)', sublabel: 'British Pound', icon: 'currency_pound', badge: 'GBP', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'AED', label: 'AED (د.إ)', sublabel: 'UAE Dirham', icon: 'payments', badge: 'AED', badgeClass: 'bg-teal-50 text-teal-700 border-teal-200' },
    { value: 'SGD', label: 'SGD (S$)', sublabel: 'Singapore Dollar', icon: 'payments', badge: 'SGD', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' }
  ];

  readonly fiscalYearOptions: WorkoraSelectOption<number>[] = [
    { value: 4, label: 'April', sublabel: 'Standard India / UK Financial Year', icon: 'calendar_month', badge: 'India', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 1, label: 'January', sublabel: 'Calendar Year (Jan - Dec)', icon: 'calendar_month', badge: 'US/Global', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 7, label: 'July', sublabel: 'Australia / Q3 Financial Year', icon: 'calendar_month' },
    { value: 10, label: 'October', sublabel: 'Q4 Financial Year', icon: 'calendar_month' }
  ];

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    registrationNumber: [''],
    taxId: [''],
    email: ['', [Validators.email]],
    phone: [''],
    website: [''],
    fiscalYearStartMonth: [4, [Validators.required]],
    currency: ['INR', [Validators.required]],
    address: ['']
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['company'] && this.company) {
      this.form.patchValue({
        name: this.company.name,
        registrationNumber: this.company.registrationNumber || '',
        taxId: this.company.taxId || '',
        email: this.company.email || '',
        phone: this.company.phone || '',
        website: this.company.website || '',
        fiscalYearStartMonth: this.company.fiscalYearStartMonth || 4,
        currency: this.company.currency || 'INR',
        address: this.company.address || ''
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const formVal = this.form.value;
    this.saveProfile.emit({
      id: this.company?.id,
      name: formVal.name,
      registrationNumber: formVal.registrationNumber || null,
      taxId: formVal.taxId || null,
      email: formVal.email || null,
      phone: formVal.phone || null,
      website: formVal.website || null,
      fiscalYearStartMonth: Number(formVal.fiscalYearStartMonth),
      currency: formVal.currency,
      address: formVal.address || null
    });
  }

  onSaveLogo(url: string): void {
    if (!url.trim()) return;
    this.saveLogo.emit(url.trim());
    this.isLogoModalOpen.set(false);
  }
}
