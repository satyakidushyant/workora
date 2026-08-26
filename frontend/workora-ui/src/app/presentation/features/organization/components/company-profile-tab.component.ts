import { Component, Input, Output, EventEmitter, inject, signal, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Company, UpdateCompanyProfileParams } from '../../../../domain/models/organization.model';
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * Presentational component for managing company identity, branding, and fiscal parameters.
 */
@Component({
  selector: 'app-company-profile-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
                Established {{ company?.createdAt | date:'mediumDate' }} • Currency: <span class="font-bold text-[#0E6E68]">{{ company?.currency || 'USD' }}</span>
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
              placeholder="e.g. Workora Global Inc."
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
              placeholder="e.g. U72200MH2023PTC123456"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none font-medium transition-all"
            />
          </div>

          <!-- Tax ID / GSTIN -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Tax Identification / GSTIN</label>
            <input 
              type="text" 
              formControlName="taxId" 
              placeholder="e.g. 27AAAAA0000A1Z5"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none font-medium transition-all"
            />
          </div>

          <!-- Corporate Email -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Corporate Email</label>
            <input 
              type="email" 
              formControlName="email" 
              placeholder="e.g. contact@workora.io"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none font-medium transition-all"
            />
          </div>

          <!-- Corporate Phone -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Contact Phone</label>
            <input 
              type="tel" 
              formControlName="phone" 
              placeholder="e.g. +1 (555) 019-2834"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none font-medium transition-all"
            />
          </div>

          <!-- Website -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Website</label>
            <input 
              type="url" 
              formControlName="website" 
              placeholder="e.g. https://workora.io"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none font-medium transition-all"
            />
          </div>

          <!-- Currency -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Default Currency <span class="text-rose-500">*</span></label>
            <select 
              formControlName="currency" 
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none font-medium transition-all">
              <option value="USD">USD - US Dollar ($)</option>
              <option value="INR">INR - Indian Rupee (₹)</option>
              <option value="EUR">EUR - Euro (€)</option>
              <option value="GBP">GBP - British Pound (£)</option>
              <option value="AED">AED - UAE Dirham (د.إ)</option>
              <option value="SGD">SGD - Singapore Dollar (S$)</option>
            </select>
          </div>

          <!-- Fiscal Year Start Month -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Fiscal Year Start Month <span class="text-rose-500">*</span></label>
            <select 
              formControlName="fiscalYearStartMonth" 
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] focus:ring-2 focus:ring-[#0E6E68]/15 outline-none font-medium transition-all">
              <option [value]="1">January</option>
              <option [value]="4">April (Common in India/UK)</option>
              <option [value]="7">July</option>
              <option [value]="10">October</option>
            </select>
          </div>

          <!-- Head Office Address -->
          <div class="md:col-span-2 lg:col-span-3">
            <label class="block text-xs font-bold text-[#063B39] mb-1.5">Registered Headquarters Address</label>
            <textarea 
              formControlName="address" 
              rows="3" 
              placeholder="e.g. 100 Enterprise Way, Suite 400, San Francisco, CA 94107"
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
        <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl p-6 w-full max-w-md border border-[#DCEBE7] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-extrabold text-[#063B39]">Update Company Logo</h3>
              <button (click)="isLogoModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1.5">Direct Image URL</label>
              <input 
                type="url" 
                #logoInput
                [value]="company?.logoUrl || ''"
                placeholder="https://res.cloudinary.com/..."
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
              <p class="text-[11px] text-slate-400 mt-1">Provide a HTTPS image URL hosted on CDN or Cloudinary.</p>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button 
                type="button" 
                (click)="isLogoModalOpen.set(false)"
                class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border-none bg-transparent">
                Cancel
              </button>
              <button 
                type="button" 
                (click)="onSaveLogo(logoInput.value)"
                class="px-5 py-2 text-xs font-bold text-white bg-[#0E6E68] hover:bg-[#063B39] rounded-xl transition-colors shadow-xs cursor-pointer border-none">
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

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    registrationNumber: [''],
    taxId: [''],
    email: ['', [Validators.email]],
    phone: [''],
    website: [''],
    fiscalYearStartMonth: [1, [Validators.required]],
    currency: ['USD', [Validators.required]],
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
        fiscalYearStartMonth: this.company.fiscalYearStartMonth || 1,
        currency: this.company.currency || 'USD',
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
