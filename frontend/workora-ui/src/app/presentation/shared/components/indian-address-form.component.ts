import { Component, Input, forwardRef, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkoraSelectComponent } from './workora-select.component';

export interface IndianAddressModel {
  addressLine1?: string;
  addressLine2?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
}

export const INDIAN_STATES_AND_UTS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

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
          <label class="workora-label">
            State / Union Territory <span *ngIf="required" class="text-rose-500">*</span>
          </label>
          <app-workora-select
            formControlName="state"
            [options]="stateOptions"
            [searchable]="true"
            searchPlaceholder="Search State..."
            placeholder="Select State / UT"
            icon="map"
            [hasError]="isInvalid('state')"
          ></app-workora-select>
          <p *ngIf="isInvalid('state')" class="text-[11px] text-rose-500 mt-1">Please select an Indian State or UT.</p>
        </div>

        <!-- City -->
        <div>
          <label class="workora-label">
            City / Town <span *ngIf="required" class="text-rose-500">*</span>
          </label>
          <input
            type="text"
            formControlName="city"
            placeholder="City / Town"
            class="workora-input !py-2.5 text-xs"
            [class.border-rose-300]="isInvalid('city')"
          />
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
export class IndianAddressFormComponent implements ControlValueAccessor {
  private readonly fb = inject(FormBuilder);

  @Input() required = true;

  readonly stateOptions = INDIAN_STATES_AND_UTS.map(state => ({
    value: state,
    label: state
  }));

  readonly addressForm: FormGroup = this.fb.group({
    addressLine1: ['', this.required ? [Validators.required] : []],
    addressLine2: [''],
    state: ['', this.required ? [Validators.required] : []],
    district: [''],
    city: ['', this.required ? [Validators.required] : []],
    pincode: ['', this.required ? [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)] : [Validators.pattern(/^[1-9][0-9]{5}$/)]]
  });

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.addressForm.valueChanges.subscribe(val => {
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
      return;
    }

    // Attempt simple comma parse if string
    const parts = value.split(',').map(s => s.trim());
    if (parts.length > 0) {
      this.addressForm.patchValue({
        addressLine1: parts[0] || '',
        addressLine2: parts.length > 4 ? parts[1] : '',
        city: parts.length > 2 ? parts[parts.length - 3] : '',
        state: parts.length > 1 ? parts[parts.length - 2] : '',
        pincode: (parts[parts.length - 1] || '').replace(/[^0-9]/g, '')
      }, { emitEvent: false });
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
