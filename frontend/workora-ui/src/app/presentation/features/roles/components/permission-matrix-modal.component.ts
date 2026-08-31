import { Component, Input, Output, EventEmitter, OnInit, signal, computed, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleDetail, ModulePermissions, Permission } from '../../../../domain/models/role-permission.model';

/**
 * High-end Permission Matrix Modal Component.
 * Allows visual inspection, search, and bulk toggling of module permissions matching PermissionCatalog.cs.
 */
@Component({
  selector: 'app-permission-matrix-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-4xl max-h-[90vh] flex flex-col" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 border-b border-[#DCEBE7] flex items-center justify-between gap-4 bg-[#F4F8F7]/50 shrink-0">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#063B39] to-[#0E6E68] text-white flex items-center justify-center font-extrabold shadow-sm">
              <span class="material-symbols-outlined text-2xl">shield_lock</span>
            </div>
            <div>
              <div class="flex items-center gap-2.5">
                <h3 class="text-lg font-extrabold text-[#063B39] font-heading">
                  Permissions: {{ roleDetail?.name }}
                </h3>
                @if (roleDetail?.isSystemRole) {
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                    System Role
                  </span>
                }
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                Configured permissions define feature access and security barriers across all 37 modules.
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

        <!-- Toolbar & Search -->
        <div class="p-4 border-b border-[#DCEBE7] bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div class="relative flex-1 max-w-md">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input 
              type="text" 
              [(ngModel)]="searchFilter" 
              placeholder="Filter by permission name or code (e.g. attendance.approve)..."
              class="w-full pl-9 pr-4 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-3">
            <div class="px-3 py-1.5 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] text-xs font-extrabold flex items-center gap-1.5 border border-[#3FA79B]/30">
              <span class="material-symbols-outlined text-sm">verified_user</span>
              <span>{{ selectedPermissionIds().size }} / {{ totalAvailablePermissions() }} Selected</span>
            </div>

            <div class="flex items-center gap-1.5">
              <button 
                type="button" 
                (click)="selectAll()"
                class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#063B39] text-xs font-bold transition-all cursor-pointer border-none">
                Select All
              </button>
              <button 
                type="button" 
                (click)="clearAll()"
                class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer border-none">
                Clear All
              </button>
            </div>
          </div>
        </div>

        <!-- Permissions Accordion / Matrix Container -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#F4F8F7]/30">
          @for (group of filteredModuleGroups(); track group.module) {
            <div class="bg-white rounded-2xl border border-[#DCEBE7] shadow-2xs overflow-hidden transition-all">
              
              <!-- Module Header -->
              <div class="p-3.5 sm:px-5 sm:py-3.5 bg-[#F4F8F7]/70 border-b border-[#DCEBE7] flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-[#0E6E68] text-lg">folder_open</span>
                  <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#063B39]">{{ group.module }} Module</h4>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#DCEBE7] text-[#063B39]">
                    {{ getSelectedCountInModule(group) }} / {{ group.permissions.length }}
                  </span>
                </div>

                <button 
                  type="button" 
                  (click)="toggleModule(group)"
                  class="text-[11px] font-bold text-[#0E6E68] hover:text-[#063B39] hover:underline transition-colors border-none bg-transparent cursor-pointer">
                  {{ isModuleAllSelected(group) ? 'Deselect Module' : 'Select All in Module' }}
                </button>
              </div>

              <!-- Permission Grid Items -->
              <div class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                @for (perm of group.permissions; track perm.id) {
                  <label 
                    class="flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none"
                    [ngClass]="selectedPermissionIds().has(perm.id) 
                      ? 'bg-[#3FA79B]/10 border-[#3FA79B]/50 shadow-2xs' 
                      : 'bg-white border-[#DCEBE7] hover:bg-slate-50'">
                    <input 
                      type="checkbox" 
                      [checked]="selectedPermissionIds().has(perm.id)"
                      (change)="togglePermission(perm.id)"
                      class="w-4 h-4 mt-0.5 text-[#0E6E68] rounded-md border-slate-300 focus:ring-[#0E6E68]"
                    />
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-[#063B39] leading-tight">{{ perm.name }}</p>
                      <p class="text-[10px] font-mono text-slate-400 mt-0.5 truncate">{{ perm.code }}</p>
                      @if (perm.description) {
                        <p class="text-[10px] text-slate-500 mt-1 leading-snug line-clamp-2">{{ perm.description }}</p>
                      }
                    </div>
                  </label>
                }
              </div>

            </div>
          }

          @if (filteredModuleGroups().length === 0) {
            <div class="p-8 text-center bg-white rounded-2xl border border-[#DCEBE7]">
              <span class="material-symbols-outlined text-3xl text-slate-400">search_off</span>
              <p class="text-xs font-bold text-[#063B39] mt-2">No permissions matched "{{ searchFilter }}"</p>
            </div>
          }
        </div>

        <!-- Footer Actions -->
        <div class="p-4 sm:p-5 border-t border-[#DCEBE7] bg-white flex items-center justify-between shrink-0">
          <span class="text-xs text-slate-500 font-medium hidden sm:inline">
            Changes will take effect upon the user's next API request.
          </span>

          <div class="flex items-center gap-3 ml-auto">
            <button 
              type="button" 
              (click)="closeModal.emit()"
              class="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border-none bg-transparent">
              Cancel
            </button>
            <button 
              type="button" 
              (click)="onSave()"
              [disabled]="isSubmitting"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer border-none">
              @if (isSubmitting) {
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving Permissions...</span>
              } @else {
                <span class="material-symbols-outlined text-base">save</span>
                <span>Save Permissions Matrix</span>
              }
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class PermissionMatrixModalComponent implements OnInit {
  @Input() roleDetail: RoleDetail | null = null;
  @Input() moduleGroups: ModulePermissions[] = [];
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() savePermissions = new EventEmitter<{ roleId: number; permissionIds: number[] }>();

  readonly selectedPermissionIds = signal<Set<number>>(new Set());
  searchFilter = '';

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnInit(): void {
    if (this.roleDetail?.permissions) {
      const initialIds = new Set<number>(this.roleDetail.permissions.map(p => p.id));
      this.selectedPermissionIds.set(initialIds);
    }
  }

  totalAvailablePermissions = computed(() => {
    return this.moduleGroups.reduce((acc, g) => acc + g.permissions.length, 0);
  });

  filteredModuleGroups = computed(() => {
    const filter = this.searchFilter.toLowerCase().trim();
    if (!filter) return this.moduleGroups;

    return this.moduleGroups
      .map(group => ({
        module: group.module,
        permissions: group.permissions.filter(p =>
          p.name.toLowerCase().includes(filter) ||
          p.code.toLowerCase().includes(filter) ||
          (p.description && p.description.toLowerCase().includes(filter))
        )
      }))
      .filter(group => group.permissions.length > 0);
  });

  togglePermission(id: number): void {
    const current = new Set(this.selectedPermissionIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedPermissionIds.set(current);
  }

  selectAll(): void {
    const allIds = new Set<number>();
    for (const group of this.moduleGroups) {
      for (const perm of group.permissions) {
        allIds.add(perm.id);
      }
    }
    this.selectedPermissionIds.set(allIds);
  }

  clearAll(): void {
    this.selectedPermissionIds.set(new Set<number>());
  }

  getSelectedCountInModule(group: ModulePermissions): number {
    const selected = this.selectedPermissionIds();
    return group.permissions.filter(p => selected.has(p.id)).length;
  }

  isModuleAllSelected(group: ModulePermissions): boolean {
    const selected = this.selectedPermissionIds();
    return group.permissions.length > 0 && group.permissions.every(p => selected.has(p.id));
  }

  toggleModule(group: ModulePermissions): void {
    const current = new Set(this.selectedPermissionIds());
    const allSelected = this.isModuleAllSelected(group);

    for (const perm of group.permissions) {
      if (allSelected) {
        current.delete(perm.id);
      } else {
        current.add(perm.id);
      }
    }
    this.selectedPermissionIds.set(current);
  }

  onSave(): void {
    if (!this.roleDetail) return;
    this.savePermissions.emit({
      roleId: this.roleDetail.id,
      permissionIds: Array.from(this.selectedPermissionIds())
    });
  }
}
