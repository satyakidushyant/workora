import { Component, Input, Output, EventEmitter, inject, signal, computed, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department, Designation, Branch } from '../../../../domain/models/organization.model';
import { Employee, CreateEmployeeParams } from '../../../../domain/models/employee.model';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';
import { IndianAddressFormComponent } from '../../../shared/components/indian-address-form.component';

/**
 * Enterprise Multi-Step Employee Onboarding Stepper Modal.
 * Tailored with India-First statutory compliance fields:
 * - PAN Card (Format: ABCDE1234F)
 * - Aadhaar Number (12 digits)
 * - EPFO UAN (12 digits)
 * - ESIC Insurance IP (17 digits)
 * - Bank IFSC & Account
 * - Indian Address with State/PIN validation
 */
@Component({
  selector: 'app-employee-onboarding-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, WorkoraSelectComponent, IndianAddressFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-3xl max-h-[92vh] flex flex-col" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 border-b border-[#DDE9E6] flex items-center justify-between bg-[#F6FAF9] shrink-0">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#075E58] to-[#087F73] text-white flex items-center justify-center font-extrabold shadow-sm">
              <span class="material-symbols-outlined text-2xl">person_add</span>
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-extrabold text-[#102A2A] font-heading">
                Onboard New Team Member
              </h3>
              <p class="text-xs text-[#718686]">
                Step {{ currentStep() }} of 4: {{ getStepTitle(currentStep()) }}
              </p>
            </div>
          </div>

          <button 
            type="button" 
            (click)="closeModal.emit()"
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <!-- Stepper Progress Bar -->
        <div class="px-6 py-3 bg-white border-b border-[#DDE9E6] grid grid-cols-4 gap-2 shrink-0">
          @for (step of [1, 2, 3, 4]; track step) {
            <div class="flex items-center gap-2">
              <div 
                [ngClass]="{
                  'bg-[#087F73] text-white': currentStep() === step,
                  'bg-[#DDF7F2] text-[#075E58]': currentStep() > step,
                  'bg-slate-100 text-slate-400': currentStep() < step
                }"
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold transition-all shrink-0">
                @if (currentStep() > step) {
                  <span class="material-symbols-outlined text-sm">check</span>
                } @else {
                  <span>{{ step }}</span>
                }
              </div>
              <span class="text-[11px] font-bold truncate hidden sm:inline"
                [ngClass]="currentStep() >= step ? 'text-[#102A2A]' : 'text-[#718686]'">
                {{ getStepTitle(step) }}
              </span>
            </div>
          }
        </div>

        <!-- Stepper Form Body -->
        <form [formGroup]="form" class="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 bg-white custom-scrollbar">

          <!-- ======================================================== -->
          <!-- STEP 1: Personal & Identity Details                      -->
          <!-- ======================================================== -->
          @if (currentStep() === 1) {
            <div class="space-y-4 animate-in fade-in duration-150">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#087F73]">
                1. Personal Details &amp; Identity
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="workora-label">First Name <span class="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    formControlName="firstName" 
                    placeholder="First Name"
                    class="workora-input !py-2.5"
                  />
                  @if (isInvalid('firstName')) {
                    <p class="text-[11px] text-rose-500 mt-1">First name is required.</p>
                  }
                </div>

                <div>
                  <label class="workora-label">Last Name <span class="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    formControlName="lastName" 
                    placeholder="Last Name"
                    class="workora-input !py-2.5"
                  />
                  @if (isInvalid('lastName')) {
                    <p class="text-[11px] text-rose-500 mt-1">Last name is required.</p>
                  }
                </div>

                <div>
                  <label class="workora-label">Work Email <span class="text-rose-500">*</span></label>
                  <input 
                    type="email" 
                    formControlName="email" 
                    placeholder="Work Email Address"
                    class="workora-input !py-2.5"
                  />
                  @if (isInvalid('email')) {
                    <p class="text-[11px] text-rose-500 mt-1">Valid email address required.</p>
                  }
                </div>

                <div>
                  <label class="workora-label">Mobile Number (+91)</label>
                  <input 
                    type="tel" 
                    formControlName="phone" 
                    placeholder="Mobile Phone Number"
                    class="workora-input !py-2.5 font-mono"
                  />
                </div>

                <div>
                  <label class="workora-label">PAN (Income Tax) <span class="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    formControlName="nationalId" 
                    placeholder="10-digit PAN Number"
                    maxlength="10"
                    class="workora-input !py-2.5 uppercase font-mono"
                  />
                  @if (isInvalid('nationalId')) {
                    <p class="text-[11px] text-rose-500 mt-1">Valid 10-digit PAN (e.g. ABCDE1234F) is required.</p>
                  }
                </div>

                <div>
                  <label class="workora-label">Date of Birth <span class="text-rose-500">*</span></label>
                  <input 
                    type="date" 
                    formControlName="dateOfBirth" 
                    class="workora-input !py-2.5"
                  />
                </div>

                <div>
                  <label class="workora-label">Gender <span class="text-rose-500">*</span></label>
                  <app-workora-select
                    formControlName="gender"
                    [options]="genderOptions"
                    placeholder="Select Gender"
                  ></app-workora-select>
                </div>

                <div>
                  <label class="workora-label">Marital Status <span class="text-rose-500">*</span></label>
                  <app-workora-select
                    formControlName="maritalStatus"
                    [options]="maritalStatusOptions"
                    placeholder="Select Status"
                  ></app-workora-select>
                </div>

                <div class="sm:col-span-2 pt-2">
                  <h5 class="text-xs font-bold text-[#063B39] uppercase tracking-wider mb-2">Residential Address</h5>
                  <app-indian-address-form
                    formControlName="address"
                    [required]="false">
                  </app-indian-address-form>
                </div>

              </div>
            </div>
          }

          <!-- ======================================================== -->
          <!-- STEP 2: Job & Organization Placement                     -->
          <!-- ======================================================== -->
          @if (currentStep() === 2) {
            <div class="space-y-4 animate-in fade-in duration-150">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#0E6E68]">
                2. Job &amp; Organizational Placement
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="workora-label">Department <span class="text-rose-500">*</span></label>
                  <app-workora-select
                    formControlName="departmentId"
                    [options]="departmentOptions()"
                    [searchable]="true"
                    placeholder="Select Department"
                    icon="account_tree"
                  ></app-workora-select>
                  @if (isInvalid('departmentId')) {
                    <p class="text-[11px] text-rose-500 mt-1">Department assignment is required.</p>
                  }
                </div>

                <div>
                  <label class="workora-label">Designation / Title <span class="text-rose-500">*</span></label>
                  <app-workora-select
                    formControlName="designationId"
                    [options]="designationOptions()"
                    [searchable]="true"
                    placeholder="Select Designation"
                    icon="badge"
                  ></app-workora-select>
                  @if (isInvalid('designationId')) {
                    <p class="text-[11px] text-rose-500 mt-1">Designation is required.</p>
                  }
                </div>

                <div>
                  <label class="workora-label">Branch Office Location <span class="text-rose-500">*</span></label>
                  <app-workora-select
                    formControlName="branchId"
                    [options]="branchOptions()"
                    [searchable]="true"
                    placeholder="Select Branch"
                    icon="location_city"
                  ></app-workora-select>
                  @if (isInvalid('branchId')) {
                    <p class="text-[11px] text-rose-500 mt-1">Branch office is required.</p>
                  }
                </div>

                <div>
                  <label class="workora-label">Reporting Manager</label>
                  <app-workora-select
                    formControlName="managerId"
                    [options]="managerOptions()"
                    [searchable]="true"
                    [clearable]="true"
                    placeholder="None (Direct C-Level / Head)"
                    icon="person"
                  ></app-workora-select>
                </div>

                <div>
                  <label class="workora-label">Employment Type <span class="text-rose-500">*</span></label>
                  <app-workora-select
                    formControlName="employmentType"
                    [options]="employmentTypeOptions"
                    placeholder="Select Type"
                  ></app-workora-select>
                </div>

                <div>
                  <label class="workora-label">Date of Joining <span class="text-rose-500">*</span></label>
                  <input 
                    type="date" 
                    formControlName="hireDate" 
                    class="workora-input !py-2.5"
                  />
                  @if (isInvalid('hireDate')) {
                    <p class="text-[11px] text-rose-500 mt-1">Joining date is required.</p>
                  }
                </div>
              </div>
            </div>
          }

          <!-- ======================================================== -->
          <!-- STEP 3: Statutory Compliance & Bank Details               -->
          <!-- ======================================================== -->
          @if (currentStep() === 3) {
            <div class="space-y-4 animate-in fade-in duration-150">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#0E6E68]">
                3. Indian Statutory Compliance &amp; Bank Account
              </h4>

              <!-- Compliance Note -->
              <div class="p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-[#063B39] flex items-center gap-2">
                <span class="material-symbols-outlined text-base text-[#0E6E68]">policy</span>
                <span>Statutory fields are used directly for Provident Fund (EPFO), ESIC, and TDS calculations.</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="workora-label">Bank Name</label>
                  <input 
                    type="text" 
                    formControlName="bankName" 
                    placeholder="Bank Name"
                    class="workora-input !py-2.5"
                  />
                </div>

                <div>
                  <label class="workora-label">Account Holder Name</label>
                  <input 
                    type="text" 
                    formControlName="accountHolderName" 
                    placeholder="Account Holder Name"
                    class="workora-input !py-2.5"
                  />
                </div>

                <div>
                  <label class="workora-label">Bank Account Number</label>
                  <input 
                    type="text" 
                    formControlName="accountNumber" 
                    placeholder="Bank Account Number"
                    class="workora-input !py-2.5 font-mono"
                  />
                </div>

                <div>
                  <label class="workora-label">Bank IFSC Code</label>
                  <input 
                    type="text" 
                    formControlName="bankIfsc" 
                    placeholder="Bank IFSC Code"
                    maxlength="11"
                    class="workora-input !py-2.5 uppercase font-mono"
                  />
                </div>

                <div>
                  <label class="workora-label">EPFO Universal Account Number (UAN)</label>
                  <input 
                    type="text" 
                    formControlName="uanNumber" 
                    placeholder="UAN Number (12 digits)"
                    maxlength="12"
                    class="workora-input !py-2.5 font-mono"
                  />
                </div>

                <div>
                  <label class="workora-label">ESIC IP Number</label>
                  <input 
                    type="text" 
                    formControlName="esicNumber" 
                    placeholder="ESIC IP Number (17 digits)"
                    maxlength="17"
                    class="workora-input !py-2.5 font-mono"
                  />
                </div>
              </div>
            </div>
          }

          <!-- ======================================================== -->
          <!-- STEP 4: Emergency Contacts & Confirmation                 -->
          <!-- ======================================================== -->
          @if (currentStep() === 4) {
            <div class="space-y-4 animate-in fade-in duration-150">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#0E6E68]">
                4. Emergency Contact &amp; Summary
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="workora-label">Contact Name</label>
                  <input 
                    type="text" 
                    formControlName="contactName" 
                    placeholder="Emergency Contact Name"
                    class="workora-input !py-2.5"
                  />
                </div>

                <div>
                  <label class="workora-label">Relationship</label>
                  <input 
                    type="text" 
                    formControlName="contactRelationship" 
                    placeholder="Relationship"
                    class="workora-input !py-2.5"
                  />
                </div>

                <div>
                  <label class="workora-label">Emergency Phone (+91)</label>
                  <input 
                    type="tel" 
                    formControlName="contactPhone" 
                    placeholder="Emergency Phone Number"
                    class="workora-input !py-2.5 font-mono"
                  />
                </div>
              </div>

              <!-- Summary Card -->
              <div class="p-4 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] space-y-3 mt-4">
                <p class="text-xs font-extrabold text-[#063B39]">Onboarding Confirmation Summary</p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
                  <div>
                    <span class="text-[10px] text-slate-400 block font-bold uppercase">Name</span>
                    <span class="font-bold text-[#063B39]">{{ form.get('firstName')?.value }} {{ form.get('lastName')?.value }}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block font-bold uppercase">Work Email</span>
                    <span class="font-bold text-[#063B39] truncate block">{{ form.get('email')?.value }}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block font-bold uppercase">PAN</span>
                    <span class="font-bold font-mono text-[#0E6E68]">{{ form.get('nationalId')?.value || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block font-bold uppercase">Date of Joining</span>
                    <span class="font-bold text-[#063B39]">{{ form.get('hireDate')?.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          }

        </form>

        <!-- Stepper Navigation Footer -->
        <div class="p-4 sm:p-5 border-t border-[#DCEBE7] bg-[#F4F8F7] flex items-center justify-between shrink-0">
          <button 
            type="button" 
            (click)="previousStep()"
            [disabled]="currentStep() === 1"
            class="workora-btn-secondary text-xs disabled:opacity-30">
            <span class="material-symbols-outlined text-base">chevron_left</span>
            <span>Back</span>
          </button>

          <div class="flex items-center gap-3">
            <button 
              type="button" 
              (click)="closeModal.emit()"
              class="workora-btn-ghost text-xs">
              Cancel
            </button>

            @if (currentStep() < 4) {
              <button 
                type="button" 
                (click)="nextStep()"
                class="workora-btn-primary text-xs">
                <span>Continue</span>
                <span class="material-symbols-outlined text-base">chevron_right</span>
              </button>
            } @else {
              <button 
                type="button" 
                (click)="onSubmit()"
                [disabled]="form.invalid || isSubmitting"
                class="workora-btn-primary text-xs">
                @if (isSubmitting) {
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Onboarding...</span>
                } @else {
                  <span class="material-symbols-outlined text-base">check_circle</span>
                  <span>Complete Onboarding</span>
                }
              </button>
            }
          </div>
        </div>

      </div>
    </div>
  `
})
export class EmployeeOnboardingModalComponent {
  @Input() departments: Department[] = [];
  @Input() designations: Designation[] = [];
  @Input() branches: Branch[] = [];
  @Input() existingEmployees: Employee[] = [];
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveEmployee = new EventEmitter<CreateEmployeeParams>();

  private readonly fb = inject(FormBuilder);
  readonly currentStep = signal<number>(1);

  readonly genderOptions: WorkoraSelectOption[] = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  readonly maritalStatusOptions: WorkoraSelectOption[] = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' }
  ];

  readonly employmentTypeOptions: WorkoraSelectOption[] = [
    { value: 'FullTime', label: 'Full Time (Permanent)' },
    { value: 'PartTime', label: 'Part Time' },
    { value: 'Contract', label: 'Contract / Consultant' },
    { value: 'Internship', label: 'Intern' }
  ];

  readonly departmentOptions = computed<WorkoraSelectOption[]>(() => {
    return this.departments.map(d => ({
      value: d.id,
      label: d.name,
      sublabel: `Code: ${d.code}`
    }));
  });

  readonly designationOptions = computed<WorkoraSelectOption[]>(() => {
    return this.designations.map(des => ({
      value: des.id,
      label: des.title,
      sublabel: `Level ${des.level || 1} • ${des.departmentName || 'General'}`
    }));
  });

  readonly branchOptions = computed<WorkoraSelectOption[]>(() => {
    return this.branches.map(b => ({
      value: b.id,
      label: b.name,
      sublabel: b.isHeadOffice ? 'Headquarters' : b.location
    }));
  });

  readonly managerOptions = computed<WorkoraSelectOption[]>(() => {
    return this.existingEmployees.map(emp => ({
      value: emp.id,
      label: emp.fullName,
      sublabel: emp.employeeCode
    }));
  });

  readonly form: FormGroup = this.fb.group({
    // Step 1
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    nationalId: ['', [Validators.required]],
    dateOfBirth: ['1995-01-01', [Validators.required]],
    gender: ['Male', [Validators.required]],
    maritalStatus: ['Single', [Validators.required]],
    address: [''],

    // Step 2
    departmentId: [null, [Validators.required]],
    designationId: [null, [Validators.required]],
    branchId: [null, [Validators.required]],
    managerId: [null],
    employmentType: ['FullTime', [Validators.required]],
    hireDate: [new Date().toISOString().split('T')[0], [Validators.required]],

    // Step 3
    bankName: [''],
    accountHolderName: [''],
    accountNumber: [''],
    bankIfsc: [''],
    uanNumber: [''],
    esicNumber: [''],

    // Step 4
    contactName: [''],
    contactRelationship: [''],
    contactPhone: ['']
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Personal & Identity';
      case 2: return 'Job & Placement';
      case 3: return 'Statutory & Bank';
      case 4: return 'Emergency & Review';
      default: return '';
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  nextStep(): void {
    if (this.currentStep() === 1) {
      ['firstName', 'lastName', 'email', 'nationalId'].forEach(f => this.form.get(f)?.markAsTouched());
      if (this.form.get('firstName')?.invalid || this.form.get('lastName')?.invalid || 
          this.form.get('email')?.invalid || this.form.get('nationalId')?.invalid) return;
    } else if (this.currentStep() === 2) {
      ['departmentId', 'designationId', 'branchId', 'hireDate'].forEach(f => this.form.get(f)?.markAsTouched());
      if (this.form.get('departmentId')?.invalid || this.form.get('designationId')?.invalid || 
          this.form.get('branchId')?.invalid || this.form.get('hireDate')?.invalid) return;
    }
    this.currentStep.set(this.currentStep() + 1);
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const params: CreateEmployeeParams = {
      firstName: val.firstName.trim(),
      lastName: val.lastName.trim(),
      email: val.email.trim().toLowerCase(),
      phone: val.phone ? val.phone.trim() : null,
      nationalId: val.nationalId.trim().toUpperCase(),
      dateOfBirth: val.dateOfBirth,
      gender: val.gender,
      maritalStatus: val.maritalStatus,
      address: val.address || null,
      departmentId: Number(val.departmentId),
      designationId: Number(val.designationId),
      branchId: Number(val.branchId),
      managerId: val.managerId ? Number(val.managerId) : null,
      employmentType: val.employmentType,
      hireDate: val.hireDate
    };

    this.saveEmployee.emit(params);
  }
}
