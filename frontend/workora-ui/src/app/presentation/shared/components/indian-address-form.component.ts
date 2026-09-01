import { Component, Input, forwardRef, ChangeDetectionStrategy, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkoraSelectComponent } from './workora-select.component';
import { LocationService } from '../../../core/services/location.service';

export interface IndianAddressModel {
  addressLine1?: string;
  addressLine2?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
}

@Component({
  selector: 'app-indian-address-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, WorkoraSelectComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IndianAddressFormComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="addressForm" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Address Line 1 -->
        <div class="sm:col-span-2">
          <label class="workora-label">
            Premises / Flat / Building / Street Address <span *ngIf="required" class="text-rose-500">*</span>
          </label>
          <input
            type="text"
            formControlName="addressLine1"
            placeholder="Premises / Flat / Building / Street Address"
            class="workora-input !py-2.5 text-xs"
            [class.border-rose-300]="isInvalid('addressLine1')"
          />
          <p *ngIf="isInvalid('addressLine1')" class="text-[11px] text-rose-500 mt-1">Street address is required.</p>
        </div>

        <!-- Address Line 2 -->
        <div class="sm:col-span-2">
          <label class="workora-label">
            Locality / Landmark (Optional)
          </label>
          <input
            type="text"
            formControlName="addressLine2"
            placeholder="Locality / Landmark"
            class="workora-input !py-2.5 text-xs"
          />
        </div>

        <!-- State Dropdown -->
        <div>
          <label class="workora-label flex items-center justify-between">
            <span>State / Union Territory <span *ngIf="required" class="text-rose-500">*</span></span>
            <span *ngIf="isLoadingStates()" class="text-[10px] text-[#0E6E68] font-medium flex items-center gap-1">
              <span class="inline-block w-3 h-3 border border-[#0E6E68] border-t-transparent rounded-full animate-spin"></span>
              <span>Fetching...</span>
            </span>
          </label>
          <app-workora-select
            formControlName="state"
            [options]="stateOptions()"
            [searchable]="true"
            searchPlaceholder="Search State..."
            placeholder="Select State / UT"
            icon="map"
            [hasError]="isInvalid('state')"
            [loading]="isLoadingStates()"
          ></app-workora-select>
          <p *ngIf="isInvalid('state')" class="text-[11px] text-rose-500 mt-1">Please select an Indian State or UT.</p>
        </div>

        <!-- City -->
        <div>
          <label class="workora-label flex items-center justify-between">
            <span>City / Town <span *ngIf="required" class="text-rose-500">*</span></span>
            <span *ngIf="isLoadingCities()" class="text-[10px] text-[#0E6E68] font-medium flex items-center gap-1">
              <span class="inline-block w-3 h-3 border border-[#0E6E68] border-t-transparent rounded-full animate-spin"></span>
              <span>Loading cities...</span>
            </span>
          </label>
          <app-workora-select
             formControlName="city"
             [options]="cityOptions()"
             [searchable]="true"
             searchPlaceholder="Search City..."
             [placeholder]="addressForm.get('state')?.value ? 'Select City / Town' : 'Select State First'"
             icon="location_city"
             [hasError]="isInvalid('city')"
             [loading]="isLoadingCities()"
          ></app-workora-select>
          <p *ngIf="isInvalid('city')" class="text-[11px] text-rose-500 mt-1">City is required.</p>
        </div>

        <!-- District -->
        <div>
          <label class="workora-label">
            District
          </label>
          <input
            type="text"
            formControlName="district"
            placeholder="District"
            class="workora-input !py-2.5 text-xs"
          />
        </div>

        <!-- Pincode -->
        <div>
          <label class="workora-label">
            Pincode (PIN) <span *ngIf="required" class="text-rose-500">*</span>
          </label>
          <input
            type="text"
            formControlName="pincode"
            placeholder="6-digit Pincode"
            maxlength="6"
            class="workora-input !py-2.5 text-xs font-mono"
            [class.border-rose-300]="isInvalid('pincode')"
          />
          <p *ngIf="isInvalid('pincode')" class="text-[11px] text-rose-500 mt-1">Enter a valid 6-digit Indian PIN code.</p>
        </div>
      </div>
    </div>
  `
})
export class IndianAddressFormComponent implements ControlValueAccessor, OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly locationService = inject(LocationService);
  private readonly destroyRef = inject(DestroyRef);

  @Input() required = true;

  readonly stateOptions = signal<{value: string, label: string}[]>([]);
  readonly cityOptions = signal<{value: string, label: string}[]>([]);
  readonly isLoadingStates = signal<boolean>(false);
  readonly isLoadingCities = signal<boolean>(false);

  readonly addressForm: FormGroup = this.fb.group({
    addressLine1: ['', this.required ? [Validators.required] : []],
    addressLine2: [''],
    state: ['', this.required ? [Validators.required] : []],
    district: [''],
    city: [{ value: '', disabled: true }, this.required ? [Validators.required] : []],
    pincode: ['', this.required ? [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)] : [Validators.pattern(/^[1-9][0-9]{5}$/)]]
  });

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.addressForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(val => {
        const parts = [
          val.addressLine1,
          val.addressLine2,
          val.city,
          val.district ? `Dist: ${val.district}` : null,
          val.state,
          val.pincode ? `PIN: ${val.pincode}` : null
        ].filter(Boolean);

        const formatted = parts.join(', ');
        this.onChange(formatted);
      });

    this.addressForm.get('state')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(state => {
        if (state) {
          this.addressForm.get('city')?.enable({ emitEvent: false });
          this.addressForm.patchValue({ city: '' }, { emitEvent: false });
          this.fetchCitiesForState(state);
        } else {
          this.cityOptions.set([]);
          this.addressForm.patchValue({ city: '' }, { emitEvent: false });
          this.addressForm.get('city')?.disable({ emitEvent: false });
        }
      });
  }

  ngOnInit(): void {
    this.fetchStates();
  }

  private fetchStates(): void {
    this.isLoadingStates.set(true);
    this.locationService.getStates('India').subscribe({
      next: stateList => {
        this.stateOptions.set(stateList.map(s => ({ value: s, label: s })));
        this.isLoadingStates.set(false);
        const currentState = this.addressForm.get('state')?.value;
        if (currentState) {
          this.fetchCitiesForState(currentState);
        }
      },
      error: () => {
        this.isLoadingStates.set(false);
      }
    });
  }

  private fetchCitiesForState(stateName: string, targetCity?: string): void {
    if (!stateName) return;
    this.isLoadingCities.set(true);
    this.locationService.getCities(stateName, 'India').subscribe({
      next: cityList => {
        let options = cityList;
        if (targetCity && !cityList.includes(targetCity)) {
          options = [targetCity, ...cityList];
        }
        
        this.cityOptions.set(options.map(c => ({ value: c, label: c })));
        this.isLoadingCities.set(false);

        // In writeValue flow, targetCity is provided.
        // We shouldn't patch it back if it's already there to avoid overriding user's new selections,
        // but if it was not in the list, we added it.
      },
      error: () => {
        this.isLoadingCities.set(false);
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.addressForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  writeValue(value: string | IndianAddressModel): void {
    if (!value) {
      this.addressForm.reset({
        addressLine1: '',
        addressLine2: '',
        state: '',
        district: '',
        city: '',
        pincode: ''
      }, { emitEvent: false });
      return;
    }

    if (typeof value === 'object') {
      this.addressForm.patchValue(value, { emitEvent: false });
      if (value.state) {
        this.fetchCitiesForState(value.state, value.city);
      }
      return;
    }

    // Attempt simple comma parse if string
    const parts = value.split(',').map(s => s.trim());
    if (parts.length > 0) {
      const addressLine1 = parts[0] || '';
      const addressLine2 = parts.length > 4 ? parts[1] : '';
      const city = parts.length > 2 ? parts[parts.length - 3] : '';
      const state = parts.length > 1 ? parts[parts.length - 2] : '';
      const pincode = (parts[parts.length - 1] || '').replace(/[^0-9]/g, '');

      this.addressForm.patchValue({
        addressLine1,
        addressLine2,
        city,
        state,
        pincode
      }, { emitEvent: false });

      if (state) {
        this.fetchCitiesForState(state, city);
      }
    }
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.addressForm.disable({ emitEvent: false });
    } else {
      this.addressForm.enable({ emitEvent: false });
    }
  }
}
