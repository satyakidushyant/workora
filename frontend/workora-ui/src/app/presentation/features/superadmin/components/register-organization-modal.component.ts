import { Component, Output, EventEmitter, OnInit, OnDestroy, ElementRef, PLATFORM_ID, inject, signal, HostListener, Input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';
import { RegisterOrganizationParams } from '../../../../domain/models/superadmin.model';

/**
 * Enterprise Workora Modal Component for Registering & Provisioning a Tenant Organization.
 * Features body teleportation to ensure full-viewport backdrop dimming with zero topbar interference.
 */
@Component({
  selector: 'app-register-organization-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WorkoraSelectComponent
  ],
  template: `
    <div class="workora-modal-overlay" (click)="onCancel()">
      <div class="workora-modal-card max-w-lg" (click)="$event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center font-bold shadow-2xs shrink-0">
              <span class="material-symbols-outlined text-xl">domain_add</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#102A2A] font-heading">Register Tenant Organization</h3>
              <p class="text-xs text-[#718686]">Provision a new enterprise tenant company profile</p>
            </div>
          </div>
          <button 
            type="button" 
            (click)="onCancel()" 
            class="text-slate-400 hover:text-[#102A2A] rounded-xl p-1.5 transition-colors border-none bg-transparent cursor-pointer"
            aria-label="Close modal">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Registration Form -->
        <form [formGroup]="orgForm" (ngSubmit)="onSubmit()" class="flex flex-col flex-1 overflow-hidden">
          <div class="workora-modal-body space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="workora-label">Company Legal Name <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="name" 
                  placeholder="Company Legal Name" 
                  class="workora-input !py-2.5" 
                />
                @if (orgForm.get('name')?.invalid && orgForm.get('name')?.touched) {
                  <p class="text-[11px] text-rose-500 font-bold mt-1">Company name is required.</p>
                }
              </div>

              <div>
                <label class="workora-label">Company Code / Subdomain <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="code" 
                  placeholder="Company Code" 
                  class="workora-input !py-2.5 uppercase font-mono" 
                />
                @if (orgForm.get('code')?.invalid && orgForm.get('code')?.touched) {
                  <p class="text-[11px] text-rose-500 font-bold mt-1">Code is required (min 2 chars).</p>
                }
              </div>

              <div>
                <label class="workora-label">Base Currency <span class="text-rose-500">*</span></label>
                <app-workora-select
                  formControlName="currency"
                  [options]="currencyOptions"
                  placeholder="Select Currency"
                  icon="payments"
                ></app-workora-select>
              </div>

              <div>
                <label class="workora-label">Primary Admin Email</label>
                <input 
                  type="email" 
                  formControlName="email" 
                  placeholder="Primary Admin Email" 
                  class="workora-input !py-2.5" 
                />
              </div>

              <div>
                <label class="workora-label">Phone Number</label>
                <input 
                  type="tel" 
                  formControlName="phone" 
                  placeholder="Phone Number" 
                  class="workora-input !py-2.5" 
                />
              </div>

              <div class="sm:col-span-2">
                <label class="workora-label">Corporate Website</label>
                <input 
                  type="url" 
                  formControlName="website" 
                  placeholder="Website URL" 
                  class="workora-input !py-2.5" 
                />
              </div>
            </div>
          </div>

          <div class="workora-modal-footer">
            <button 
              type="button" 
              (click)="onCancel()" 
              [disabled]="isSubmitting"
              class="workora-btn-secondary">
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="orgForm.invalid || isSubmitting" 
              class="workora-btn-primary">
              @if (isSubmitting) {
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Provisioning...</span>
              } @else {
                <span class="material-symbols-outlined text-base">domain_add</span>
                <span>Provision Organization</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class RegisterOrganizationModalComponent implements OnInit, OnDestroy {
  @Input() isSubmitting = false;

  @Output() save = new EventEmitter<RegisterOrganizationParams>();
  @Output() cancel = new EventEmitter<void>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly fb = inject(FormBuilder);

  readonly currencyOptions: WorkoraSelectOption<string>[] = [
    { value: 'INR', label: 'INR (₹)', sublabel: 'Indian Rupee', icon: 'currency_rupee', badge: 'INR', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'USD', label: 'USD ($)', sublabel: 'US Dollar', icon: 'attach_money', badge: 'USD', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'EUR', label: 'EUR (€)', sublabel: 'Euro', icon: 'euro', badge: 'EUR', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
    { value: 'GBP', label: 'GBP (£)', sublabel: 'British Pound', icon: 'currency_pound', badge: 'GBP', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'AED', label: 'AED (د.إ)', sublabel: 'UAE Dirham', icon: 'payments', badge: 'AED', badgeClass: 'bg-teal-50 text-teal-700 border-teal-200' },
    { value: 'SGD', label: 'SGD (S$)', sublabel: 'Singapore Dollar', icon: 'payments', badge: 'SGD', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' }
  ];

  readonly orgForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    currency: ['INR', [Validators.required]],
    email: ['', [Validators.email]],
    phone: [''],
    website: ['']
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.onCancel();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.appendChild(this.elementRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.elementRef.nativeElement.parentElement === document.body) {
      document.body.removeChild(this.elementRef.nativeElement);
    }
  }

  onSubmit(): void {
    if (this.orgForm.invalid) {
      this.orgForm.markAllAsTouched();
      return;
    }

    const val = this.orgForm.value;
    this.save.emit({
      name: val.name,
      code: val.code,
      currency: val.currency || 'INR',
      email: val.email || undefined,
      phone: val.phone || undefined,
      website: val.website || undefined
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
