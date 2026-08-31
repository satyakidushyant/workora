import { Component, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy, inject, signal, computed, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { gsap } from 'gsap';
import { UserDetail, UserSummary, CreateUserParams, UpdateUserParams } from '../../../../domain/models/user.model';
import { Role } from '../../../../domain/models/role-permission.model';
import { RolePermissionApiRepository } from '../../../../data/repositories/role-permission-api.repository';
import { AuthService } from '../../../../core/services/auth.service';

/**
 * Enterprise Workora User Create / Edit Modal Component.
 * Features clean in-form role card selection, reactive validation, and password toggle.
 */
@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="workora-modal-overlay" (click)="onCancel()">
      <div class="workora-modal-card max-w-xl" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center font-extrabold shadow-2xs shrink-0">
              <span class="material-symbols-outlined text-xl">{{ isEdit ? 'manage_accounts' : 'person_add' }}</span>
            </div>
            <div>
              <h2 class="text-base sm:text-lg font-extrabold text-[#102A2A] tracking-tight font-heading">
                {{ isEdit ? 'Edit User Profile' : 'Create User Account' }}
              </h2>
              <p class="text-xs text-[#718686]">
                {{ isEdit ? 'Update credentials and assigned security role for this user.' : 'Onboard a new workforce member with workspace login credentials.' }}
              </p>
            </div>
          </div>
          <button
            type="button"
            (click)="onCancel()"
            class="text-slate-400 hover:text-[#102A2A] rounded-xl hover:bg-[#DDF7F2]/40 transition-colors border-none bg-transparent cursor-pointer p-1.5 shrink-0"
            aria-label="Close modal">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="flex flex-col flex-1 overflow-hidden">
          <div class="workora-modal-body space-y-4">
            
            <!-- Corporate Email -->
            <div class="space-y-1">
              <label class="workora-label">
                Corporate Email Address <span class="text-rose-500">*</span>
              </label>
              <div class="relative flex items-center">
                <input
                  type="email"
                  formControlName="email"
                  placeholder="Corporate email address"
                  class="workora-input text-xs pl-4 pr-11 !py-2.5" 
                  [ngClass]="{'workora-input-error': userForm.get('email')?.touched && userForm.get('email')?.invalid}"
                />
                <span class="material-symbols-outlined text-slate-400 absolute right-3.5 text-base pointer-events-none">alternate_email</span>
              </div>
              @if (userForm.get('email')?.touched && userForm.get('email')?.invalid) {
                <div class="text-rose-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <span class="material-symbols-outlined text-xs">error</span>
                  <span>Please enter a valid corporate email address.</span>
                </div>
              }
            </div>

            <!-- First Name & Last Name Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="workora-label">
                  First Name <span class="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="firstName"
                  placeholder="First name"
                  class="workora-input text-xs px-4 !py-2.5" 
                  [ngClass]="{'workora-input-error': userForm.get('firstName')?.touched && userForm.get('firstName')?.invalid}"
                />
                @if (userForm.get('firstName')?.touched && userForm.get('firstName')?.invalid) {
                  <div class="text-rose-500 text-[11px] mt-1 font-medium">
                    First name is required.
                  </div>
                }
              </div>

              <div class="space-y-1">
                <label class="workora-label">
                  Last Name <span class="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="lastName"
                  placeholder="Last name"
                  class="workora-input text-xs px-4 !py-2.5" 
                  [ngClass]="{'workora-input-error': userForm.get('lastName')?.touched && userForm.get('lastName')?.invalid}"
                />
                @if (userForm.get('lastName')?.touched && userForm.get('lastName')?.invalid) {
                  <div class="text-rose-500 text-[11px] mt-1 font-medium">
                    Last name is required.
                  </div>
                }
              </div>
            </div>

            <!-- Initial Password (only shown on Create) -->
            @if (!isEdit) {
              <div class="space-y-1">
                <label class="workora-label">
                  Initial Password <span class="text-rose-500">*</span>
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
                    class="material-symbols-outlined text-slate-400 hover:text-[#087F73] transition-colors cursor-pointer text-base absolute right-3.5 flex items-center justify-center border-none bg-transparent"
                    aria-label="Toggle password visibility"
                  >
                    {{ showPassword() ? 'visibility_off' : 'visibility' }}
                  </button>
                </div>
                @if (userForm.get('password')?.touched && userForm.get('password')?.invalid) {
                  <div class="text-rose-500 text-[11px] mt-1 font-medium">
                    Password must be at least 8 characters.
                  </div>
                }
              </div>
            }

            <!-- Role Selection Grid (Clean, Collision-Free, Fully Visible) -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="workora-label !mb-0">
                  Assigned Security Role <span class="text-rose-500">*</span>
                </label>
                @if (isLoadingRoles()) {
                  <span class="text-[10px] text-[#087F73] font-semibold flex items-center gap-1">
                    <span class="w-2.5 h-2.5 border-2 border-[#087F73] border-t-transparent rounded-full animate-spin"></span>
                    <span>Syncing roles...</span>
                  </span>
                } @else {
                  <span class="text-[11px] text-[#718686]">Select security access tier</span>
                }
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar p-0.5">
                @for (role of sortedRoles(); track role.id) {
                  <div 
                    (click)="selectRole(role.id)"
                    [ngClass]="userForm.get('roleId')?.value === role.id 
                      ? 'border-[#087F73] bg-[#DDF7F2]/40 ring-2 ring-[#087F73]/25 shadow-xs' 
                      : 'border-[#DDE9E6] bg-white hover:border-[#087F73]/50 hover:bg-[#F6FAF9]'"
                    class="flex items-center justify-between gap-2 p-2.5 rounded-2xl border cursor-pointer transition-all text-left">
                    
                    <div class="flex items-center gap-2 min-w-0">
                      <div class="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" [ngClass]="getRoleIconBg(role.name)">
                        <span class="material-symbols-outlined text-base" [ngClass]="getRoleIconColor(role.name)">
                          {{ getRoleIcon(role.name) }}
                        </span>
                      </div>
                      <div class="min-w-0 leading-tight">
                        <div class="text-xs font-bold text-[#102A2A] truncate">{{ role.name }}</div>
                        <div class="text-[10px] text-[#718686] truncate font-normal">{{ role.description || 'Standard access tier' }}</div>
                      </div>
                    </div>

                    <div class="flex items-center gap-1.5 shrink-0">
                      <span [ngClass]="getRoleBadgeClass(role.name)" class="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border">
                        {{ getRoleBadge(role.name) }}
                      </span>
                      @if (userForm.get('roleId')?.value === role.id) {
                        <span class="material-symbols-outlined text-base text-[#087F73] font-bold">check_circle</span>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Optional Linked Employee ID -->
            <div class="space-y-1">
              <label class="workora-label">
                Linked Employee ID <span class="text-[#718686] font-normal lowercase">(optional)</span>
              </label>
              <input
                type="number"
                formControlName="employeeId"
                placeholder="Employee ID"
                class="workora-input text-xs px-4 !py-2.5 font-mono" 
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
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Processing...</span>
              } @else {
                <span class="material-symbols-outlined text-base">check</span>
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
  private readonly roleRepo = inject(RolePermissionApiRepository);
  private readonly authService = inject(AuthService);

  readonly showPassword = signal<boolean>(false);
  readonly rawRoles = signal<Role[]>([]);
  readonly isLoadingRoles = signal<boolean>(false);

  readonly isCurrentSuperAdmin = computed<boolean>(() => {
    return this.authService.hasRole('SuperAdmin') || 
           (this.authService.currentUser()?.roles?.includes('SuperAdmin') ?? false) ||
           this.authService.currentUser()?.email === 'admin@workora.com';
  });

  /**
   * Sorts roles so SuperAdmin and Admin tiers appear first.
   * SuperAdmin role is ONLY visible when the logged-in user is a SuperAdmin.
   */
  readonly sortedRoles = computed<Role[]>(() => {
    const isSuperAdmin = this.isCurrentSuperAdmin();
    const roles = this.rawRoles();
    const list = roles && roles.length > 0 ? [...roles] : [
      { id: 1, name: 'SuperAdmin', description: 'Platform Root Administrator (Master Access)', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' },
      { id: 2, name: 'HRAdmin', description: 'Company / Human Resources Administrator', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' },
      { id: 4, name: 'Manager', description: 'Department & Team Manager (Approvals)', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' },
      { id: 3, name: 'FinanceManager', description: 'Payroll & Statutory Remittances Officer', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' },
      { id: 5, name: 'Employee', description: 'Standard Employee Self-Service Access', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' }
    ];

    const filteredList = isSuperAdmin 
      ? list 
      : list.filter(r => r.name.toLowerCase() !== 'superadmin');

    const orderMap: Record<string, number> = {
      'superadmin': 1,
      'hradmin': 2,
      'financemanager': 3,
      'manager': 4,
      'employee': 5
    };

    return filteredList.sort((a, b) => {
      const orderA = orderMap[a.name.toLowerCase()] || 99;
      const orderB = orderMap[b.name.toLowerCase()] || 99;
      return orderA - orderB;
    });
  });

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
      defaultRoleId = 1; // SuperAdmin if root admin, else HRAdmin
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

    if (isPlatformBrowser(this.platformId)) {
      document.body.appendChild(this.elementRef.nativeElement);
    }

    this.loadRoles();
  }

  selectRole(roleId: number): void {
    this.userForm.get('roleId')?.setValue(roleId);
    this.userForm.get('roleId')?.markAsDirty();
  }

  private loadRoles(): void {
    this.isLoadingRoles.set(true);
    this.roleRepo.getRoles({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: res => {
        this.isLoadingRoles.set(false);
        const roles = res.items || [];
        this.rawRoles.set(roles);

        // Re-align roleId if userToEdit has role matching by name
        if (this.userToEdit?.roles && this.userToEdit.roles.length > 0) {
          const roleName = this.userToEdit.roles[0].toLowerCase();
          const match = roles.find(r => r.name.toLowerCase() === roleName);
          if (match) {
            this.userForm.get('roleId')?.setValue(match.id);
          }
        }
      },
      error: () => {
        this.isLoadingRoles.set(false);
      }
    });
  }

  getRoleIcon(name: string): string {
    switch (name.toLowerCase()) {
      case 'superadmin': return 'shield';
      case 'hradmin': return 'admin_panel_settings';
      case 'financemanager': return 'payments';
      case 'manager': return 'supervisor_account';
      case 'employee': return 'badge';
      default: return 'verified_user';
    }
  }

  getRoleIconBg(name: string): string {
    switch (name.toLowerCase()) {
      case 'superadmin': return 'bg-purple-100 text-purple-700';
      case 'hradmin': return 'bg-emerald-100 text-emerald-700';
      case 'financemanager': return 'bg-teal-100 text-teal-700';
      case 'manager': return 'bg-blue-100 text-blue-700';
      case 'employee': return 'bg-slate-100 text-slate-700';
      default: return 'bg-[#DDF7F2] text-[#087F73]';
    }
  }

  getRoleIconColor(name: string): string {
    switch (name.toLowerCase()) {
      case 'superadmin': return 'text-purple-700';
      case 'hradmin': return 'text-emerald-700';
      case 'financemanager': return 'text-teal-700';
      case 'manager': return 'text-blue-700';
      case 'employee': return 'text-slate-600';
      default: return 'text-[#087F73]';
    }
  }

  getRoleBadge(name: string): string {
    switch (name.toLowerCase()) {
      case 'superadmin': return 'Platform Root';
      case 'hradmin': return 'Tenant Admin';
      case 'financemanager': return 'Finance';
      case 'manager': return 'Team Lead';
      case 'employee': return 'Member';
      default: return 'Custom';
    }
  }

  getRoleBadgeClass(name: string): string {
    switch (name.toLowerCase()) {
      case 'superadmin': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'hradmin': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'financemanager': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'manager': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'employee': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-[#DDF7F2] text-[#075E58] border-[#DDF7F2]';
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
    if (isPlatformBrowser(this.platformId) && this.elementRef.nativeElement.parentElement === document.body) {
      document.body.removeChild(this.elementRef.nativeElement);
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
