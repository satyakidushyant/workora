import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, PLATFORM_ID, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSummary } from '../../../../domain/models/user.model';
import { Role } from '../../../../domain/models/role-permission.model';
import { RolePermissionApiRepository } from '../../../../data/repositories/role-permission-api.repository';
import { AuthService } from '../../../../core/services/auth.service';
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
      <div class="workora-modal-card max-w-lg" (click)="$event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center font-extrabold shadow-2xs shrink-0">
              <span class="material-symbols-outlined text-xl">shield_person</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#102A2A] font-heading">Assign Security Role</h3>
              <p class="text-xs text-[#718686] font-medium">{{ user?.fullName }} ({{ user?.email }})</p>
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

        <!-- Role Selection -->
        <div class="flex flex-col flex-1 overflow-hidden">
          <div class="workora-modal-body space-y-3">
            <div class="flex items-center justify-between">
              <label class="workora-label">Select Security Role</label>
              <span class="text-[11px] text-[#718686]">Grants role-based workspace permissions</span>
            </div>

            @if (isLoadingRoles()) {
              <app-workora-skeleton type="card" [count]="4"></app-workora-skeleton>
            } @else {
              <div class="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                @for (role of sortedRoles(); track role.id) {
                  <div 
                    (click)="selectedRoleId.set(role.id)"
                    [ngClass]="selectedRoleId() === role.id 
                      ? 'border-[#087F73] bg-[#DDF7F2]/30 ring-2 ring-[#087F73]/20 shadow-xs' 
                      : 'border-[#DDE9E6] bg-white hover:border-[#087F73]/50 hover:bg-[#F6FAF9]'"
                    class="flex items-start gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all">
                    
                    <div class="mt-0.5 shrink-0">
                      <div 
                        [ngClass]="selectedRoleId() === role.id ? 'border-[#087F73] bg-[#087F73]' : 'border-slate-300 bg-white'"
                        class="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors">
                        @if (selectedRoleId() === role.id) {
                          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                        }
                      </div>
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-1.5 min-w-0">
                          <span class="material-symbols-outlined text-base" [ngClass]="getRoleIconColor(role.name)">
                            {{ getRoleIcon(role.name) }}
                          </span>
                          <span class="text-xs font-bold text-[#102A2A] truncate">{{ role.name }}</span>
                        </div>
                        <span [ngClass]="getRoleBadgeClass(role.name)" class="text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0">
                          {{ getRoleBadge(role.name) }}
                        </span>
                      </div>
                      <p class="text-[11px] text-[#718686] mt-1 leading-relaxed">{{ role.description || 'Standard workspace permission tier.' }}</p>
                    </div>
                  </div>
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
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving...</span>
              } @else {
                <span class="material-symbols-outlined text-base">check</span>
                <span>Assign Role</span>
              }
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AssignRoleModalComponent implements OnInit, OnDestroy {
  @Input() user: UserSummary | null = null;
  @Input() isSubmitting = false;

  @Output() assign = new EventEmitter<{ userId: number; roleId: number }>();
  @Output() cancel = new EventEmitter<void>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly roleRepo = inject(RolePermissionApiRepository);
  private readonly authService = inject(AuthService);

  readonly availableRoles = signal<Role[]>([]);
  readonly selectedRoleId = signal<number | null>(null);
  readonly isLoadingRoles = signal<boolean>(false);

  readonly isCurrentSuperAdmin = computed<boolean>(() => {
    return this.authService.hasRole('SuperAdmin') || 
           (this.authService.currentUser()?.roles?.includes('SuperAdmin') ?? false) ||
           this.authService.currentUser()?.email === 'admin@workora.com';
  });

  /**
   * Sorts roles so SuperAdmin and Admin tiers appear first.
   * SuperAdmin is ONLY visible when current logged-in user is SuperAdmin.
   */
  readonly sortedRoles = computed<Role[]>(() => {
    const isSuperAdmin = this.isCurrentSuperAdmin();
    const roles = [...this.availableRoles()];
    const filtered = isSuperAdmin 
      ? roles 
      : roles.filter(r => r.name.toLowerCase() !== 'superadmin');

    const orderMap: Record<string, number> = {
      'superadmin': 1,
      'hradmin': 2,
      'financemanager': 3,
      'manager': 4,
      'employee': 5
    };

    return filtered.sort((a, b) => {
      const orderA = orderMap[a.name.toLowerCase()] || 99;
      const orderB = orderMap[b.name.toLowerCase()] || 99;
      return orderA - orderB;
    });
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.onCancel();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.appendChild(this.elementRef.nativeElement);
    }
    this.loadRoles();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.elementRef.nativeElement.parentElement === document.body) {
      document.body.removeChild(this.elementRef.nativeElement);
    }
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
          { id: 1, name: 'SuperAdmin', description: 'Global platform super administrator with master bypass access across all multi-tenant organizations.', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' },
          { id: 2, name: 'HRAdmin', description: 'Tenant human resources administrator managing workforce lifecycle, time, leaves, and policies.', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' },
          { id: 3, name: 'FinanceManager', description: 'Tenant finance and payroll officer managing compensation, statutory compliance, loans, and batch runs.', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' },
          { id: 4, name: 'Manager', description: 'People manager with team approval authority over attendance, leave, expenses, and performance reviews.', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' },
          { id: 5, name: 'Employee', description: 'Standard employee self-service role for clock-in, leave application, payslip access, and requests.', isSystemRole: true, userCount: 0, permissionCount: 0, createdAt: '' }
        ]);
        const defaultRole = this.user?.email.startsWith('admin') ? 1 : 5;
        this.selectedRoleId.set(defaultRole);
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

  getRoleIconColor(name: string): string {
    switch (name.toLowerCase()) {
      case 'superadmin': return 'text-purple-600';
      case 'hradmin': return 'text-emerald-600';
      case 'financemanager': return 'text-teal-600';
      case 'manager': return 'text-blue-600';
      case 'employee': return 'text-slate-500';
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
