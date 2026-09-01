import { Component, Input, Output, EventEmitter, inject, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TenantOrganization, UpdateOrganizationParams } from '../../../../domain/models/superadmin.model';
import { LocationService } from '../../../../core/services/location.service';

/**
 * Presentational modal component for editing tenant organization corporate profiles.
 * Dynamically fetches States and state-dependent Cities using 3rd-party Location API.
 */
@Component({
  selector: 'app-edit-organization-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-2xl flex flex-col" (click)="$event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center font-extrabold shadow-2xs shrink-0">
              <span class="material-symbols-outlined text-2xl">edit_square</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#102A2A] font-heading tracking-tight">
                Edit Organization Profile
              </h3>
              <p class="text-xs text-[#718686]">Update corporate identity, legal registrations, tax IDs, and address.</p>
            </div>
          </div>
          <button 
            type="button" 
            (click)="closeModal.emit()"
            class="text-slate-400 hover:text-[#102A2A] rounded-xl p-1.5 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-white custom-scrollbar">
          
          <!-- Corporate Identity & Code -->
          <div class="space-y-4">
            <h4 class="text-xs font-extrabold text-[#063B39] uppercase tracking-wider border-b border-slate-100 pb-2">
              Corporate Identity
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="sm:col-span-2">
                <label class="workora-label">Legal Company Name <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="name" 
                  placeholder="Legal Company Name"
                  class="workora-input !py-2.5"
                />
                @if (isInvalid('name')) {
                  <p class="text-[11px] text-rose-500 font-semibold mt-1">Legal company name is required.</p>
                }
              </div>

              <div>
                <label class="workora-label">Corporate Code</label>
                <input 
                  type="text" 
                  [value]="organization?.code || ''"
                  disabled 
                  class="workora-input !py-2.5 bg-slate-100 font-mono font-bold text-[#0E6E68] cursor-not-allowed"
                />
                <span class="text-[10px] text-slate-400">Fixed system code</span>
              </div>
            </div>
          </div>

          <!-- Legal & Statutory Tax Identifiers -->
          <div class="space-y-4">
            <h4 class="text-xs font-extrabold text-[#063B39] uppercase tracking-wider border-b border-slate-100 pb-2">
              Statutory &amp; Legal Identifiers
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">CIN / Registration No.</label>
                <input 
                  type="text" 
                  formControlName="registrationNumber" 
                  placeholder="e.g. U71100GJ2024PTC152995"
                  class="workora-input !py-2.5 font-mono uppercase"
                />
              </div>

              <div>
                <label class="workora-label">GSTIN / Corporate Tax ID</label>
                <input 
                  type="text" 
                  formControlName="taxId" 
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  class="workora-input !py-2.5 font-mono uppercase"
                />
              </div>

              <div>
                <label class="workora-label">Industry Classification</label>
                <select formControlName="industry" class="workora-select !py-2.5">
                  <option value="Information Technology">Information Technology</option>
                  <option value="Financial Services">Financial Services &amp; Banking</option>
                  <option value="Healthcare & Life Sciences">Healthcare &amp; Life Sciences</option>
                  <option value="Manufacturing & Logistics">Manufacturing &amp; Logistics</option>
                  <option value="Retail & E-commerce">Retail &amp; E-commerce</option>
                  <option value="Consulting & Professional Services">Consulting &amp; Professional Services</option>
                  <option value="Education & EdTech">Education &amp; EdTech</option>
                </select>
              </div>

              <div>
                <label class="workora-label">Primary Contact Person</label>
                <input 
                  type="text" 
                  formControlName="primaryContactName" 
                  placeholder="Contact Admin Name"
                  class="workora-input !py-2.5"
                />
              </div>
            </div>
          </div>

          <!-- Contact & Web -->
          <div class="space-y-4">
            <h4 class="text-xs font-extrabold text-[#063B39] uppercase tracking-wider border-b border-slate-100 pb-2">
              Contact &amp; Web Information
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="workora-label">Corporate Email</label>
                <input 
                  type="email" 
                  formControlName="email" 
                  placeholder="admin@company.com"
                  class="workora-input !py-2.5 font-mono text-xs"
                />
                @if (isInvalid('email')) {
                  <p class="text-[11px] text-rose-500 font-semibold mt-1">Please enter a valid email address.</p>
                }
              </div>

              <div>
                <label class="workora-label">Corporate Phone</label>
                <input 
                  type="text" 
                  formControlName="phone" 
                  placeholder="+91 98765 43210"
                  class="workora-input !py-2.5 font-mono text-xs"
                />
              </div>

              <div>
                <label class="workora-label">Official Website URL</label>
                <input 
                  type="url" 
                  formControlName="website" 
                  placeholder="https://www.company.com"
                  class="workora-input !py-2.5 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <!-- Fiscal & Currency Settings -->
          <div class="space-y-4">
            <h4 class="text-xs font-extrabold text-[#063B39] uppercase tracking-wider border-b border-slate-100 pb-2">
              Financial Settings
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Base Operating Currency</label>
                <select formControlName="currency" class="workora-select !py-2.5 font-bold">
                  <option value="INR">INR (₹) - Indian Rupee [Standard]</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="AED">AED (AED) - UAE Dirham</option>
                  <option value="SGD">SGD (S$) - Singapore Dollar</option>
                </select>
              </div>

              <div>
                <label class="workora-label">Fiscal Year Starting Month</label>
                <select formControlName="fiscalYearStartMonth" class="workora-select !py-2.5 font-bold">
                  <option [value]="1">January (Month 1)</option>
                  <option [value]="4">April (Month 4 - Indian Standard)</option>
                  <option [value]="7">July (Month 7)</option>
                  <option [value]="10">October (Month 10)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Registered Corporate Address (Dynamic State & City API Dropdowns) -->
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 class="text-xs font-extrabold text-[#063B39] uppercase tracking-wider">
                Registered Corporate Address
              </h4>
              <span class="text-[10px] font-bold text-[#0E6E68] bg-[#E8F8F5] px-2 py-0.5 rounded-full border border-[#16A085]/20">
                API Location Service
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="workora-label">Building / Street Address</label>
                <input 
                  type="text" 
                  formControlName="streetAddress" 
                  placeholder="510, Timesquare Arcade, Baghban Cross Road"
                  class="workora-input !py-2.5 text-xs"
                />
              </div>

              <!-- State Dropdown (Dynamic API) -->
              <div>
                <label class="workora-label flex items-center justify-between">
                  <span>State / Union Territory</span>
                  @if (isLoadingStates()) {
                    <span class="text-[10px] text-[#0E6E68] font-medium flex items-center gap-1">
                      <span class="inline-block w-3 h-3 border border-[#0E6E68] border-t-transparent rounded-full animate-spin"></span>
                      <span>Fetching API...</span>
                    </span>
                  }
                </label>
                <select 
                  formControlName="state" 
                  (change)="onStateSelect($event)"
                  class="workora-select !py-2.5 text-xs font-medium">
                  <option value="">Select State / UT</option>
                  @for (st of states(); track st) {
                    <option [value]="st">{{ st }}</option>
                  }
                </select>
              </div>

              <!-- Dependent City Dropdown (Dynamic API) -->
              <div>
                <label class="workora-label flex items-center justify-between">
                  <span>City / Town</span>
                  @if (isLoadingCities()) {
                    <span class="text-[10px] text-[#0E6E68] font-medium flex items-center gap-1">
                      <span class="inline-block w-3 h-3 border border-[#0E6E68] border-t-transparent rounded-full animate-spin"></span>
                      <span>Loading cities...</span>
                    </span>
                  }
                </label>
                <select 
                  formControlName="city" 
                  class="workora-select !py-2.5 text-xs font-medium"
                  [disabled]="!form.get('state')?.value || isLoadingCities()">
                  <option value="">{{ form.get('state')?.value ? (isLoadingCities() ? 'Loading cities...' : 'Select City') : 'Select State First' }}</option>
                  @for (ct of cities(); track ct) {
                    <option [value]="ct">{{ ct }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="workora-label">Pincode (PIN)</label>
                <input 
                  type="text" 
                  formControlName="pincode" 
                  placeholder="380058"
                  maxlength="6"
                  class="workora-input !py-2.5 text-xs font-mono"
                />
              </div>
            </div>
          </div>

        </form>

        <!-- Modal Action Footer -->
        <div class="workora-modal-footer">
          <button 
            type="button" 
            (click)="closeModal.emit()"
            class="workora-btn-secondary text-xs">
            Cancel
          </button>

          <button 
            type="button" 
            (click)="onSubmit()"
            [disabled]="form.invalid || isSubmitting"
            class="workora-btn-primary text-xs shadow-md">
            @if (isSubmitting) {
              <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Saving...</span>
            } @else {
              <span class="material-symbols-outlined text-base">check</span>
              <span>Save Organization Changes</span>
            }
          </button>
        </div>

      </div>
    </div>
  `
})
export class EditOrganizationModalComponent implements OnInit, OnChanges {
  @Input() organization: TenantOrganization | null = null;
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveOrganization = new EventEmitter<UpdateOrganizationParams>();

  private readonly fb = inject(FormBuilder);
  private readonly locationService = inject(LocationService);

  readonly states = signal<string[]>([]);
  readonly cities = signal<string[]>([]);
  readonly isLoadingStates = signal<boolean>(false);
  readonly isLoadingCities = signal<boolean>(false);

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    registrationNumber: [''],
    taxId: [''],
    email: ['', [Validators.email]],
    phone: [''],
    website: [''],
    industry: ['Information Technology'],
    primaryContactName: [''],
    currency: ['INR', [Validators.required]],
    fiscalYearStartMonth: [4, [Validators.required]],
    streetAddress: [''],
    city: [''],
    state: ['Gujarat'],
    pincode: ['']
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnInit(): void {
    this.fetchStates();
    if (this.organization) {
      this.populateForm(this.organization);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.organization) {
      this.populateForm(this.organization);
    }
  }

  private fetchStates(): void {
    this.isLoadingStates.set(true);
    this.locationService.getStates('India').subscribe({
      next: stateList => {
        this.states.set(stateList);
        this.isLoadingStates.set(false);
        const currentState = this.form.get('state')?.value;
        if (currentState) {
          this.fetchCitiesForState(currentState);
        }
      },
      error: () => {
        this.isLoadingStates.set(false);
      }
    });
  }

  onStateSelect(event: Event): void {
    const selectedState = (event.target as HTMLSelectElement).value;
    this.form.patchValue({ city: '' });
    if (selectedState) {
      this.fetchCitiesForState(selectedState);
    } else {
      this.cities.set([]);
    }
  }

  private fetchCitiesForState(stateName: string, targetCity?: string): void {
    if (!stateName) return;
    this.isLoadingCities.set(true);
    this.locationService.getCities(stateName, 'India').subscribe({
      next: cityList => {
        this.cities.set(cityList);
        this.isLoadingCities.set(false);
        if (targetCity && cityList.includes(targetCity)) {
          this.form.patchValue({ city: targetCity }, { emitEvent: false });
        } else if (targetCity && !cityList.includes(targetCity)) {
          // If target city is not in standard list, append it so saved values are never lost
          this.cities.set([targetCity, ...cityList]);
          this.form.patchValue({ city: targetCity }, { emitEvent: false });
        }
      },
      error: () => {
        this.isLoadingCities.set(false);
      }
    });
  }

  private populateForm(org: TenantOrganization): void {
    const rawAddress = org.address || '';
    const parts = rawAddress.split(',').map(s => s.trim());

    let street = rawAddress;
    let city = 'Ahmedabad';
    let state = 'Gujarat';
    let pin = '';

    if (parts.length >= 3) {
      street = parts.slice(0, Math.max(1, parts.length - 3)).join(', ');
      city = parts[parts.length - 3] || 'Ahmedabad';
      state = parts[parts.length - 2] || 'Gujarat';
      pin = (parts[parts.length - 1] || '').replace(/[^0-9]/g, '');
    }

    this.form.patchValue({
      name: org.name || '',
      registrationNumber: org.registrationNumber || '',
      taxId: org.taxId || '',
      email: org.email || '',
      phone: org.phone || '',
      website: org.website || '',
      industry: org.industry || 'Information Technology',
      primaryContactName: org.primaryContactName || (org.name ? `${org.name} Admin` : ''),
      currency: org.currency || 'INR',
      fiscalYearStartMonth: org.fiscalYearStartMonth || 4,
      streetAddress: street,
      city: city,
      state: state,
      pincode: pin
    }, { emitEvent: false });

    if (state) {
      this.fetchCitiesForState(state, city);
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.form.invalid || !this.organization) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;

    const addressParts = [
      val.streetAddress,
      val.city,
      val.state,
      val.pincode ? `PIN: ${val.pincode}` : null
    ].filter(Boolean);

    const fullAddress = addressParts.join(', ');

    const params: UpdateOrganizationParams = {
      id: this.organization.id,
      name: val.name.trim(),
      registrationNumber: val.registrationNumber ? val.registrationNumber.trim() : null,
      taxId: val.taxId ? val.taxId.trim() : null,
      email: val.email ? val.email.trim() : null,
      phone: val.phone ? val.phone.trim() : null,
      website: val.website ? val.website.trim() : null,
      industry: val.industry || null,
      primaryContactName: val.primaryContactName ? val.primaryContactName.trim() : null,
      currency: val.currency || 'INR',
      fiscalYearStartMonth: +val.fiscalYearStartMonth || 4,
      address: fullAddress || null
    };

    this.saveOrganization.emit(params);
  }
}
