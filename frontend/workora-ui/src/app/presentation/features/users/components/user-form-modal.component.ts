import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDetail, UserSummary, CreateUserParams, UpdateUserParams } from '../../../../domain/models/user.model';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div class="relative w-full max-w-lg p-6 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden">
        <!-- Background Glow -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Header -->
        <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div>
            <h2 class="text-xl font-bold text-white tracking-tight">
              {{ isEdit ? 'Edit User Profile' : 'Create System User' }}
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              {{ isEdit ? 'Update details for this account.' : 'Onboard a new user with system access.' }}
            </p>
          </div>
          <button
            (click)="onCancel()"
            class="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
            aria-label="Close modal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Email (only editable on Create) -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              formControlName="email"
              placeholder="e.g. alex.smith@workora.com"
              [disabled]="isEdit"
              class="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
            <div *ngIf="userForm.get('email')?.touched && userForm.get('email')?.invalid" class="text-red-400 text-xs mt-1">
              Please enter a valid email address.
            </div>
          </div>

          <!-- First Name & Last Name Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                First Name
              </label>
              <input
                type="text"
                formControlName="firstName"
                placeholder="First name"
                class="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
              <div *ngIf="userForm.get('firstName')?.touched && userForm.get('firstName')?.invalid" class="text-red-400 text-xs mt-1">
                First name is required.
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                formControlName="lastName"
                placeholder="Last name"
                class="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
              <div *ngIf="userForm.get('lastName')?.touched && userForm.get('lastName')?.invalid" class="text-red-400 text-xs mt-1">
                Last name is required.
              </div>
            </div>
          </div>

          <!-- Initial Password (only shown on Create) -->
          <div *ngIf="!isEdit">
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Initial Password
            </label>
            <input
              type="password"
              formControlName="password"
              placeholder="Minimum 8 characters"
              class="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
            <div *ngIf="userForm.get('password')?.touched && userForm.get('password')?.invalid" class="text-red-400 text-xs mt-1">
              Password must be at least 8 characters.
            </div>
          </div>

          <!-- Optional Linked Employee ID -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Linked Employee ID <span class="text-slate-500 lowercase">(optional)</span>
            </label>
            <input
              type="number"
              formControlName="employeeId"
              placeholder="e.g. 101"
              class="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-slate-800 mt-6">
            <button
              type="button"
              (click)="onCancel()"
              class="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium">
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="userForm.invalid || isSubmitting"
              class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!isSubmitting">{{ isEdit ? 'Save Changes' : 'Create User' }}</span>
              <span *ngIf="isSubmitting" class="flex items-center space-x-2">
                <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Processing...</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class UserFormModalComponent implements OnInit {
  @Input() userToEdit?: UserSummary | UserDetail | null = null;
  @Input() isSubmitting = false;

  @Output() save = new EventEmitter<CreateUserParams | UpdateUserParams>();
  @Output() cancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
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
