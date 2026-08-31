import { Component, Input, Output, EventEmitter, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSummary } from '../../../../domain/models/user.model';
import { Role } from '../../../../domain/models/role-permission.model';
import { RolePermissionApiRepository } from '../../../../data/repositories/role-permission-api.repository';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';

/**
 * Enterprise Workora Modal for Assigning Security & Corporate Roles to a User Account.
 */
@Component({
  selector: 'app-assign-role-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, WorkoraSkeletonComponent],
  template: `
    <div class="workora-modal-overlay" (click)="onCancel()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#0E6E68]/10 text-[#0E6E68]">
              <span class="material-symbols-outlined text-xl">shield_person</span>
            </span>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">Assign Security Role</h3>
              <p class="text-xs text-slate-500 font-medium">{{ user?.email }}</p>
            </div>
          </div>
          <button
            type="button"
            (click)="onCancel()"
            class="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-1">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <!-- Role Selection -->
        <div class="flex flex-col flex-1 overflow-hidden">
          <div class="workora-modal-body space-y-3">
            <label class="workora-label">Select Corporate Role</label>

            @if (isLoadingRoles()) {
              <app-workora-skeleton type="card" [count]="3"></app-workora-skeleton>
            } @else {
              <div class="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                @for (role of availableRoles(); track role.id) {
                  <label 
                    [ngClass]="selectedRoleId() === role.id ? 'border-[#0E6E68] bg-[#0E6E68]/5 shadow-xs' : 'border-[#DCEBE7] bg-[#FAFCFB] hover:bg-slate-50'"
                    class="flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all">
                    <input 
                      type="radio" 
                      name="selectedRole" 
                      [value]="role.id" 
                      [checked]="selectedRoleId() === role.id"
                      (change)="selectedRoleId.set(role.id)"
                      class="mt-0.5 accent-[#0E6E68]"
                    />
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-extrabold text-[#063B39]">{{ role.name }}</span>
                        @if (role.isSystemRole) {
                          <span class="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md">System</span>
                        }
                      </div>
                      <p class="text-[11px] text-slate-500 mt-0.5 leading-snug">{{ role.description || 'Standard access tier' }}</p>
                    </div>
                  </label>
                }
              </div>
            }
          </div>

          <!-- Action Footer -->
          <div class="workora-modal-footer">
            <button 
              type="button" 
              (click)="onCancel()"
              [disabled]="isSubmitting"
              class="workora-btn-secondary">
              Cancel
            </button>
            <button 
              type="button" 
              (click)="onConfirm()"
              [disabled]="!selectedRoleId() || isSubmitting"
              class="workora-btn-primary">
              @if (isSubmitting) {
                <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Saving...</span>
              } @else {
                <span class="material-symbols-outlined text-sm">check</span>
                <span>Assign Role</span>
              }
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AssignRoleModalComponent implements OnInit {
  @Input() user: UserSummary | null = null;
  @Input() isSubmitting = false;

  @Output() assign = new EventEmitter<{ userId: number; roleId: number }>();
  @Output() cancel = new EventEmitter<void>();

  private readonly roleRepo = inject(RolePermissionApiRepository);

  readonly availableRoles = signal<Role[]>([]);
  readonly selectedRoleId = signal<number | null>(null);
  readonly isLoadingRoles = signal<boolean>(false);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.onCancel();
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.isLoadingRoles.set(true);
    this.roleRepo.getRoles({ pageNumber: 1, pageSize: 50 }).subscribe({
      next: res => {
        this.isLoadingRoles.set(false);
        const roles = res.items || [];
        this.availableRoles.set(roles);

        // Preselect role if user has one
        if (this.user?.roles && this.user.roles.length > 0) {
          const matchingRole = roles.find(r => r.name.toLowerCase() === this.user!.roles![0].toLowerCase());
          if (matchingRole) {
            this.selectedRoleId.set(matchingRole.id);
          }
        } else {
          // Default to HRAdmin if email starts with admin, else Employee
          const defaultName = (this.user?.email.startsWith('admin') || this.user?.email.startsWith('hr')) ? 'HRAdmin' : 'Employee';
          const defaultRole = roles.find(r => r.name.toLowerCase() === defaultName.toLowerCase()) || roles.find(r => r.name === 'Employee');
          if (defaultRole) {
            this.selectedRoleId.set(defaultRole.id);
          }
        }
      },
      error: () => {
        this.isLoadingRoles.set(false);
        // Fallback default system roles if offline
        this.availableRoles.set([
          { id: 2, name: 'HRAdmin', description: 'Tenant human resources administrator managing workforce lifecycle, time, leaves, and policies.', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' },
          { id: 4, name: 'Manager', description: 'People manager with team approval authority over attendance, leave, expenses, and performance reviews.', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' },
          { id: 3, name: 'FinanceManager', description: 'Tenant finance and payroll officer managing compensation, statutory compliance, loans, and batch runs.', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' },
          { id: 5, name: 'Employee', description: 'Standard employee self-service role for clock-in, leave application, payslip access, and requests.', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' },
          { id: 1, name: 'SuperAdmin', description: 'Global platform super administrator with master bypass access across all multi-tenant organizations.', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' }
        ]);
        const defaultRole = this.user?.email.startsWith('admin') ? 2 : 5;
        this.selectedRoleId.set(defaultRole);
      }
    });
  }

  onConfirm(): void {
    if (!this.user || !this.selectedRoleId()) return;
    this.assign.emit({
      userId: this.user.id,
      roleId: this.selectedRoleId()!
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
