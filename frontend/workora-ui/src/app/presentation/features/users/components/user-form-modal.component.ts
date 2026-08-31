import { Component, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy, inject, signal, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { gsap } from 'gsap';
import { UserDetail, UserSummary, CreateUserParams, UpdateUserParams } from '../../../../domain/models/user.model';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

/**
 * Enterprise Workora User Create / Edit Modal Component.
 * Features clean SaaS dialog layout, custom Workora select, reactive validation, and password toggle.
 */
@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, WorkoraSelectComponent],
  template: `
    <div class="workora-modal-overlay" (click)="onCancel()">
      <div class="workora-modal-card max-w-lg" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div>
            <h2 class="text-lg sm:text-xl font-extrabold text-[#063B39] tracking-tight font-heading">
              {{ isEdit ? 'Edit User Profile' : 'Create User Account' }}
            </h2>
            <p class="text-xs text-[#6B7F7C] mt-0.5">
              {{ isEdit ? 'Update details and role permissions for this account.' : 'Onboard a new workforce member with workspace access.' }}
            </p>
          </div>
          <button
            type="button"
            (click)="onCancel()"
            class="p-1.5 text-slate-400 hover:text-[#063B39] rounded-xl hover:bg-[#DCEBE7]/40 transition-colors border-none bg-transparent cursor-pointer shrink-0"
            aria-label="Close modal">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form (with scroll body for small screens) -->
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="flex flex-col flex-1 overflow-hidden">
          <div class="workora-modal-body space-y-4">
            <!-- Corporate Email -->
            <div class="space-y-1">
              <label class="workora-label">
                Corporate Email Address
              </label>
              <div class="relative flex items-center">
                <input
                  type="email"
                  formControlName="email"
                  placeholder="e.g. alex.smith@workora.com"
                  class="workora-input text-xs pl-4 pr-11 !py-2.5" 
                  [ngClass]="{'workora-input-error': userForm.get('email')?.touched && userForm.get('email')?.invalid}"
                />
                <span class="material-symbols-outlined text-slate-400 absolute right-3.5 text-base pointer-events-none">alternate_email</span>
              </div>
              @if (userForm.get('email')?.touched && userForm.get('email')?.invalid) {
                <div class="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                  <span class="material-symbols-outlined text-xs">error</span>
                  <span>Please enter a valid corporate email address.</span>
                </div>
              }
            </div>

            <!-- First Name & Last Name Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="workora-label">
                  First Name
                </label>
                <input
                  type="text"
                  formControlName="firstName"
                  placeholder="First name"
                  class="workora-input text-xs px-4 !py-2.5" 
                  [ngClass]="{'workora-input-error': userForm.get('firstName')?.touched && userForm.get('firstName')?.invalid}"
                />
                @if (userForm.get('firstName')?.touched && userForm.get('firstName')?.invalid) {
                  <div class="text-red-600 text-xs mt-1 font-medium">
                    First name is required.
                  </div>
                }
              </div>

              <div class="space-y-1">
                <label class="workora-label">
                  Last Name
                </label>
                <input
                  type="text"
                  formControlName="lastName"
                  placeholder="Last name"
                  class="workora-input text-xs px-4 !py-2.5" 
                  [ngClass]="{'workora-input-error': userForm.get('lastName')?.touched && userForm.get('lastName')?.invalid}"
                />
                @if (userForm.get('lastName')?.touched && userForm.get('lastName')?.invalid) {
                  <div class="text-red-600 text-xs mt-1 font-medium">
                    Last name is required.
                  </div>
                }
              </div>
            </div>

            <!-- Initial Password (only shown on Create) -->
            @if (!isEdit) {
              <div class="space-y-1">
                <label class="workora-label">
                  Initial Password
                </label>
                <div class="relative flex items-center">
                  <input
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="Minimum 8 characters"
                    class="workora-input text-xs pl-4 pr-11 !py-2.5" 
                    [ngClass]="{'workora-input-error': userForm.get('password')?.touched && userForm.get('password')?.invalid}"
                  />
                  <button 
                    type="button"
                    (click)="showPassword.set(!showPassword())"
                    class="material-symbols-outlined text-slate-400 hover:text-[#063B39] transition-colors cursor-pointer text-base absolute right-3.5 flex items-center justify-center border-none bg-transparent"
                    aria-label="Toggle password visibility"
                  >
                    {{ showPassword() ? 'visibility_off' : 'visibility' }}
                  </button>
                </div>
                @if (userForm.get('password')?.touched && userForm.get('password')?.invalid) {
                  <div class="text-red-600 text-xs mt-1 font-medium">
                    Password must be at least 8 characters.
                  </div>
                }
              </div>
            }

            <!-- Role Selector with Custom Workora Dropdown -->
            <div class="space-y-1">
              <label class="workora-label">
                Assigned Security Role
              </label>
              <app-workora-select
                formControlName="roleId"
                [options]="roleOptions"
                placeholder="Choose security role"
                icon="shield_person"
              ></app-workora-select>
            </div>

            <!-- Optional Linked Employee ID -->
            <div class="space-y-1">
              <label class="workora-label">
                Linked Employee ID <span class="text-[#6B7F7C] font-normal lowercase">(optional)</span>
              </label>
              <input
                type="number"
                formControlName="employeeId"
                placeholder="e.g. 101"
                class="workora-input text-xs px-4 !py-2.5" 
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="workora-modal-footer">
            <button
              type="button"
              (click)="onCancel()"
              [disabled]="effectiveLoading"
              class="workora-btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="userForm.invalid || effectiveLoading"
              class="workora-btn-primary">
              @if (effectiveLoading) {
                <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Processing...</span>
              } @else {
                <span>{{ isEdit ? 'Save Changes' : 'Create User' }}</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class UserFormModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() set user(val: UserSummary | UserDetail | null | undefined) {
    this.userToEdit = val;
  }
  @Input() userToEdit?: UserSummary | UserDetail | null = null;
  @Input() isLoading = false;
  @Input() isSubmitting = false;

  get effectiveLoading(): boolean {
    return this.isLoading || this.isSubmitting;
  }

  @Output() save = new EventEmitter<CreateUserParams | UpdateUserParams>();
  @Output() cancel = new EventEmitter<void>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly fb = inject(FormBuilder);

  readonly showPassword = signal<boolean>(false);

  readonly roleOptions: WorkoraSelectOption<number>[] = [
    { value: 2, label: 'HRAdmin', sublabel: 'Company / HR Administrator', icon: 'admin_panel_settings', badge: 'Admin', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 4, label: 'Manager', sublabel: 'Department / Team Manager', icon: 'supervisor_account', badge: 'Lead', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 3, label: 'FinanceManager', sublabel: 'Payroll & Finance Officer', icon: 'payments', badge: 'Finance', badgeClass: 'bg-teal-50 text-teal-700 border-teal-200' },
    { value: 5, label: 'Employee', sublabel: 'Standard Self-Service', icon: 'badge', badge: 'Member', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
    { value: 1, label: 'SuperAdmin', sublabel: 'Platform Root Super Administrator', icon: 'shield', badge: 'Root', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' }
  ];

  private ctx?: gsap.Context;
  userForm!: FormGroup;

  get isEdit(): boolean {
    return !!this.userToEdit?.id;
  }

  ngOnInit(): void {
    let defaultRoleId = 5; // Employee
    if (this.userToEdit?.roles && this.userToEdit.roles.length > 0) {
      const r = this.userToEdit.roles[0].toLowerCase();
      if (r === 'superadmin') defaultRoleId = 1;
      else if (r === 'hradmin') defaultRoleId = 2;
      else if (r === 'financemanager') defaultRoleId = 3;
      else if (r === 'manager') defaultRoleId = 4;
    } else if (this.userToEdit?.email?.startsWith('admin') || this.userToEdit?.email?.startsWith('hr')) {
      defaultRoleId = 2; // HRAdmin
    }

    this.userForm = this.fb.group({
      email: [this.userToEdit?.email || '', [Validators.required, Validators.email]],
      firstName: [this.userToEdit?.firstName || '', [Validators.required, Validators.maxLength(100)]],
      lastName: [this.userToEdit?.lastName || '', [Validators.required, Validators.maxLength(100)]],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(8)]],
      roleId: [defaultRoleId, [Validators.required]],
      employeeId: [this.userToEdit?.employeeId || null]
    });

    if (this.isEdit) {
      this.userForm.get('email')?.disable();
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    this.ctx = gsap.context(() => {
      gsap.from('.modal-backdrop', {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out'
      });

      gsap.from('.modal-box', {
        scale: 0.95,
        y: 12,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.out'
      });
    }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValues = this.userForm.getRawValue();

    if (this.isEdit) {
      const updatePayload: UpdateUserParams = {
        id: this.userToEdit!.id,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        employeeId: formValues.employeeId ? Number(formValues.employeeId) : null,
        roleId: formValues.roleId ? Number(formValues.roleId) : null
      };
      this.save.emit(updatePayload);
    } else {
      const createPayload: CreateUserParams = {
        email: formValues.email,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        password: formValues.password,
        employeeId: formValues.employeeId ? Number(formValues.employeeId) : null,
        roleId: formValues.roleId ? Number(formValues.roleId) : null
      };
      this.save.emit(createPayload);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.onCancel();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
