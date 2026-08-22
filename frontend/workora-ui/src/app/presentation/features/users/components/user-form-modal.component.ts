import { Component, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { gsap } from 'gsap';
import { UserDetail, UserSummary, CreateUserParams, UpdateUserParams } from '../../../../domain/models/user.model';

/**
 * Enterprise Workora User Create / Edit Modal Component.
 * Features clean SaaS dialog layout, reactive validation, and smooth GSAP entrance.
 */
@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs modal-backdrop">
      <div class="relative w-full max-w-lg p-6 sm:p-8 bg-white border border-[#DCEBE7] rounded-3xl shadow-2xl overflow-hidden modal-box">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 mb-6 border-b border-[#DCEBE7]">
          <div>
            <h2 class="text-xl font-extrabold text-[#063B39] tracking-tight font-heading">
              {{ isEdit ? 'Edit User Profile' : 'Create User Account' }}
            </h2>
            <p class="text-xs text-[#6B7F7C] mt-0.5">
              {{ isEdit ? 'Update details for this account.' : 'Onboard a new user with system access.' }}
            </p>
          </div>
          <button
            (click)="onCancel()"
            class="p-1.5 text-slate-400 hover:text-[#063B39] rounded-xl hover:bg-[#DCEBE7]/40 transition-colors border-none bg-transparent cursor-pointer"
            aria-label="Close modal">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Email -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-[#063B39] uppercase tracking-wider">
              Corporate Email Address
            </label>
            <input
              type="email"
              formControlName="email"
              placeholder="e.g. alex.smith@workora.com"
              [disabled]="isEdit"
              class="workora-input text-xs disabled:opacity-60 disabled:cursor-not-allowed" />
            <div *ngIf="userForm.get('email')?.touched && userForm.get('email')?.invalid" class="text-red-600 text-xs mt-0.5">
              Please enter a valid email address.
            </div>
          </div>

          <!-- First Name & Last Name Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-xs font-bold text-[#063B39] uppercase tracking-wider">
                First Name
              </label>
              <input
                type="text"
                formControlName="firstName"
                placeholder="First name"
                class="workora-input text-xs" />
              <div *ngIf="userForm.get('firstName')?.touched && userForm.get('firstName')?.invalid" class="text-red-600 text-xs mt-0.5">
                First name is required.
              </div>
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold text-[#063B39] uppercase tracking-wider">
                Last Name
              </label>
              <input
                type="text"
                formControlName="lastName"
                placeholder="Last name"
                class="workora-input text-xs" />
              <div *ngIf="userForm.get('lastName')?.touched && userForm.get('lastName')?.invalid" class="text-red-600 text-xs mt-0.5">
                Last name is required.
              </div>
            </div>
          </div>

          <!-- Initial Password (only shown on Create) -->
          <div *ngIf="!isEdit" class="space-y-1">
            <label class="block text-xs font-bold text-[#063B39] uppercase tracking-wider">
              Initial Password
            </label>
            <input
              type="password"
              formControlName="password"
              placeholder="Minimum 8 characters"
              class="workora-input text-xs" />
            <div *ngIf="userForm.get('password')?.touched && userForm.get('password')?.invalid" class="text-red-600 text-xs mt-0.5">
              Password must be at least 8 characters.
            </div>
          </div>

          <!-- Optional Linked Employee ID -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-[#063B39] uppercase tracking-wider">
              Linked Employee ID <span class="text-[#6B7F7C] font-normal lowercase">(optional)</span>
            </label>
            <input
              type="number"
              formControlName="employeeId"
              placeholder="e.g. 101"
              class="workora-input text-xs" />
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-5 border-t border-[#DCEBE7] mt-6">
            <button
              type="button"
              (click)="onCancel()"
              class="workora-btn-secondary px-4 py-2 text-xs">
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="userForm.invalid || isSubmitting"
              class="workora-btn-primary px-5 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!isSubmitting">{{ isEdit ? 'Save Changes' : 'Create User' }}</span>
              <span *ngIf="isSubmitting" class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Processing...</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class UserFormModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() userToEdit?: UserSummary | UserDetail | null = null;
  @Input() isSubmitting = false;

  @Output() save = new EventEmitter<CreateUserParams | UpdateUserParams>();
  @Output() cancel = new EventEmitter<void>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly fb = inject(FormBuilder);

  private ctx?: gsap.Context;
  userForm!: FormGroup;

  get isEdit(): boolean {
    return !!this.userToEdit?.id;
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: [this.userToEdit?.email || '', [Validators.required, Validators.email]],
      firstName: [this.userToEdit?.firstName || '', [Validators.required, Validators.maxLength(100)]],
      lastName: [this.userToEdit?.lastName || '', [Validators.required, Validators.maxLength(100)]],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(8)]],
      employeeId: [this.userToEdit?.employeeId || null]
    });

    if (this.isEdit) {
      this.userForm.get('email')?.disable();
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ctx = gsap.context(() => {
      gsap.from('.modal-backdrop', {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out'
      });

      gsap.from('.modal-box', {
        scale: 0.94,
        y: 15,
        opacity: 0,
        duration: 0.35,
        ease: 'back.out(1.3)'
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
        employeeId: formValues.employeeId ? Number(formValues.employeeId) : null
      };
      this.save.emit(updatePayload);
    } else {
      const createPayload: CreateUserParams = {
        email: formValues.email,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        password: formValues.password,
        employeeId: formValues.employeeId ? Number(formValues.employeeId) : null
      };
      this.save.emit(createPayload);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
