import { Component, Input, Output, EventEmitter, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department, Designation, Branch } from '../../../../domain/models/organization.model';
import { Employee, CreateEmployeeParams } from '../../../../domain/models/employee.model';

/**
 * Enterprise Multi-Step Onboarding Stepper Modal.
 * Step 1: Personal Details
 * Step 2: Job & Organizational Placement
 * Step 3: Bank & Disbursement
 * Step 4: Emergency Contacts & Confirmation
 */
@Component({
  selector: 'app-employee-onboarding-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div class="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] border border-[#DCEBE7] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 border-b border-[#DCEBE7] flex items-center justify-between bg-[#F4F8F7]/60 shrink-0">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#063B39] to-[#0E6E68] text-white flex items-center justify-center font-extrabold shadow-sm">
              <span class="material-symbols-outlined text-2xl">person_add</span>
            </div>
            <div>
              <h3 class="text-lg font-extrabold text-[#063B39] font-heading">
                Onboard New Team Member
              </h3>
              <p class="text-xs text-slate-500">
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
        <div class="px-6 py-3 bg-white border-b border-[#DCEBE7] grid grid-cols-4 gap-2 shrink-0">
          @for (step of [1, 2, 3, 4]; track step) {
            <div class="flex items-center gap-2">
              <div 
                [ngClass]="{
                  'bg-[#0E6E68] text-white': currentStep() === step,
                  'bg-emerald-100 text-emerald-800': currentStep() > step,
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
                [ngClass]="currentStep() >= step ? 'text-[#063B39]' : 'text-slate-400'">
                {{ getStepTitle(step) }}
              </span>
            </div>
          }
        </div>

        <!-- Stepper Form Body -->
        <form [formGroup]="form" class="flex-1 overflow-y-auto p-5 sm:p-8 space-y-5 bg-[#F4F8F7]/30">

          <!-- ======================================================== -->
          <!-- STEP 1: Personal Details -->
          <!-- ======================================================== -->
          @if (currentStep() === 1) {
            <div class="space-y-4 animate-in fade-in duration-200">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#0E6E68]">1. Personal & Contact Details</h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">First Name <span class="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    formControlName="firstName" 
                    placeholder="e.g. Satyaki"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Last Name <span class="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    formControlName="lastName" 
                    placeholder="e.g. Roy"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Work / Primary Email <span class="text-rose-500">*</span></label>
                  <input 
                    type="email" 
                    formControlName="email" 
                    placeholder="e.g. satyaki@workora.io"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Contact Phone</label>
                  <input 
                    type="tel" 
                    formControlName="phone" 
                    placeholder="e.g. +1 555-0192"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">National ID / SSN <span class="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    formControlName="nationalId" 
                    placeholder="e.g. AAA-00-0000"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Date of Birth <span class="text-rose-500">*</span></label>
                  <input 
                    type="date" 
                    formControlName="dateOfBirth" 
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Gender <span class="text-rose-500">*</span></label>
                  <select 
                    formControlName="gender"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Non-Binary</option>
                    <option value="Undisclosed">Prefer Not to Say</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Marital Status <span class="text-rose-500">*</span></label>
                  <select 
                    formControlName="maritalStatus"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Residential Address</label>
                  <input 
                    type="text" 
                    formControlName="address" 
                    placeholder="Street, City, State, Postal Code"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                  />
                </div>
              </div>
            </div>
          }

          <!-- ======================================================== -->
          <!-- STEP 2: Job & Placement -->
          <!-- ======================================================== -->
          @if (currentStep() === 2) {
            <div class="space-y-4 animate-in fade-in duration-200">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#0E6E68]">2. Job & Organizational Placement</h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Department <span class="text-rose-500">*</span></label>
                  <select 
                    formControlName="departmentId"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                    <option [ngValue]="null" disabled>-- Select Department --</option>
                    @for (d of departments; track d.id) {
                      <option [ngValue]="d.id">{{ d.name }} ({{ d.code }})</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Designation / Title <span class="text-rose-500">*</span></label>
                  <select 
                    formControlName="designationId"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                    <option [ngValue]="null" disabled>-- Select Designation --</option>
                    @for (des of designations; track des.id) {
                      <option [ngValue]="des.id">{{ des.title }} (Level {{ des.level }})</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Branch Location <span class="text-rose-500">*</span></label>
                  <select 
                    formControlName="branchId"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                    <option [ngValue]="null" disabled>-- Select Branch Office --</option>
                    @for (b of branches; track b.id) {
                      <option [ngValue]="b.id">{{ b.name }} ({{ b.location }})</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Reporting Manager (Optional)</label>
                  <select 
                    formControlName="managerId"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                    <option [ngValue]="null">-- None (Reports to C-Level) --</option>
                    @for (emp of existingEmployees; track emp.id) {
                      <option [ngValue]="emp.id">{{ emp.fullName }} ({{ emp.employeeCode }})</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Employment Type <span class="text-rose-500">*</span></label>
                  <select 
                    formControlName="employmentType"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                    <option value="FullTime">Full Time (Permanent)</option>
                    <option value="PartTime">Part Time</option>
                    <option value="Contract">Contract / Consultant</option>
                    <option value="Internship">Intern</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Joining / Hire Date <span class="text-rose-500">*</span></label>
                  <input 
                    type="date" 
                    formControlName="hireDate" 
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                  />
                </div>
              </div>
            </div>
          }

          <!-- ======================================================== -->
          <!-- STEP 3: Bank Disbursement -->
          <!-- ======================================================== -->
          @if (currentStep() === 3) {
            <div class="space-y-4 animate-in fade-in duration-200">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#0E6E68]">3. Bank Disbursement & Direct Deposit</h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Bank Name</label>
                  <input 
                    type="text" 
                    formControlName="bankName" 
                    placeholder="e.g. JPMorgan Chase / HDFC Bank"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Account Holder Name</label>
                  <input 
                    type="text" 
                    formControlName="accountHolderName" 
                    placeholder="Name as it appears on bank passbook"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                  />
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Account Number / IBAN</label>
                  <input 
                    type="text" 
                    formControlName="accountNumber" 
                    placeholder="e.g. 9876543210123"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium font-mono transition-all"
                  />
                </div>
              </div>
            </div>
          }

          <!-- ======================================================== -->
          <!-- STEP 4: Emergency Contacts & Confirmation -->
          <!-- ======================================================== -->
          @if (currentStep() === 4) {
            <div class="space-y-4 animate-in fade-in duration-200">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#0E6E68]">4. Emergency Contact & Review</h4>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Contact Name</label>
                  <input 
                    type="text" 
                    formControlName="contactName" 
                    placeholder="e.g. Ananya Roy"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Relationship</label>
                  <input 
                    type="text" 
                    formControlName="contactRelationship" 
                    placeholder="e.g. Spouse / Parent"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Emergency Phone</label>
                  <input 
                    type="tel" 
                    formControlName="contactPhone" 
                    placeholder="e.g. +1 555-0199"
                    class="w-full px-3.5 py-2.5 bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                  />
                </div>
              </div>

              <!-- Summary Card -->
              <div class="p-4 bg-white rounded-2xl border border-[#DCEBE7] space-y-2 mt-4">
                <p class="text-xs font-extrabold text-[#063B39]">Onboarding Confirmation Summary</p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
                  <div>
                    <span class="text-[10px] text-slate-400 block font-bold uppercase">Name</span>
                    <span class="font-bold text-[#063B39]">{{ form.get('firstName')?.value }} {{ form.get('lastName')?.value }}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block font-bold uppercase">Email</span>
                    <span class="font-bold text-[#063B39] truncate block">{{ form.get('email')?.value }}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block font-bold uppercase">Type</span>
                    <span class="font-bold text-[#063B39]">{{ form.get('employmentType')?.value }}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block font-bold uppercase">Hire Date</span>
                    <span class="font-bold text-[#063B39]">{{ form.get('hireDate')?.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          }

        </form>

        <!-- Stepper Navigation Footer -->
        <div class="p-4 sm:p-5 border-t border-[#DCEBE7] bg-white flex items-center justify-between shrink-0">
          <button 
            type="button" 
            (click)="previousStep()"
            [disabled]="currentStep() === 1"
            class="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-30 cursor-pointer border-none bg-transparent flex items-center gap-1">
            <span class="material-symbols-outlined text-base">chevron_left</span>
            <span>Back</span>
          </button>

          <div class="flex items-center gap-3">
            <button 
              type="button" 
              (click)="closeModal.emit()"
              class="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border-none bg-transparent">
              Cancel
            </button>

            @if (currentStep() < 4) {
              <button 
                type="button" 
                (click)="nextStep()"
                [disabled]="!isCurrentStepValid()"
                class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer border-none">
                <span>Continue</span>
                <span class="material-symbols-outlined text-base">chevron_right</span>
              </button>
            } @else {
              <button 
                type="button" 
                (click)="onSubmit()"
                [disabled]="form.invalid || isSubmitting"
                class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer border-none">
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
    hireDate: [new Date().toISOString().substring(0, 10), [Validators.required]],

    // Step 3
    bankName: [''],
    accountHolderName: [''],
    accountNumber: [''],

    // Step 4
    contactName: [''],
    contactRelationship: [''],
    contactPhone: ['']
  });

  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Personal';
      case 2: return 'Placement';
      case 3: return 'Disbursement';
      case 4: return 'Emergency & Review';
      default: return '';
    }
  }

  isCurrentStepValid(): boolean {
    if (this.currentStep() === 1) {
      return !!(
        this.form.get('firstName')?.valid &&
        this.form.get('lastName')?.valid &&
        this.form.get('email')?.valid &&
        this.form.get('nationalId')?.valid &&
        this.form.get('dateOfBirth')?.valid
      );
    }
    if (this.currentStep() === 2) {
      return !!(
        this.form.get('departmentId')?.valid &&
        this.form.get('designationId')?.valid &&
        this.form.get('branchId')?.valid &&
        this.form.get('hireDate')?.valid
      );
    }
    return true;
  }

  nextStep(): void {
    if (this.isCurrentStepValid() && this.currentStep() < 4) {
      this.currentStep.update(s => s + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;

    const params: CreateEmployeeParams = {
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      phone: v.phone || null,
      nationalId: v.nationalId,
      dateOfBirth: v.dateOfBirth,
      gender: v.gender,
      maritalStatus: v.maritalStatus,
      hireDate: v.hireDate,
      departmentId: Number(v.departmentId),
      designationId: Number(v.designationId),
      branchId: Number(v.branchId),
      managerId: v.managerId ? Number(v.managerId) : null,
      employmentType: v.employmentType,
      address: v.address || null,
      bankDetail: v.accountNumber ? {
        bankName: v.bankName || 'Default Bank',
        accountNumber: v.accountNumber,
        accountHolderName: v.accountHolderName || `${v.firstName} ${v.lastName}`
      } : undefined,
      emergencyContact: v.contactName ? {
        name: v.contactName,
        relationship: v.contactRelationship || 'Family',
        phoneNumber: v.contactPhone || ''
      } : undefined
    };

    this.saveEmployee.emit(params);
  }
}
