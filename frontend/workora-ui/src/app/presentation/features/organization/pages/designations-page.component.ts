import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { OrganizationApiRepository } from '../../../../data/repositories/organization-api.repository';
import { Designation, Department } from '../../../../domain/models/organization.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraConfirmDialogComponent } from '../../../shared/components/workora-confirm-dialog.component';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

@Component({
  selector: 'app-designations-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent,
    WorkoraConfirmDialogComponent,
    WorkoraSelectComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2.5 rounded-2xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">badge</span>
            </span>
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
                Designations &amp; Job Titles
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                Standardize job titles, grade bands, and organizational hierarchy across departments.
              </p>
            </div>
          </div>
        </div>

        <button 
          type="button" 
          (click)="openCreateModal()"
          class="workora-btn-primary text-xs shadow-md">
          <span class="material-symbols-outlined text-base">add</span>
          <span>Add Designation</span>
        </button>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="workora-card p-4 space-y-3">
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div class="relative flex-1 max-w-md">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (ngModelChange)="onSearch()"
              placeholder="Search by designation title..."
              class="w-full pl-10 pr-4 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
          </div>

          <div class="flex items-center gap-2.5">
            <button
              type="button"
              (click)="loadData()"
              class="workora-btn-secondary !p-2.5"
              title="Refresh List">
              <span class="material-symbols-outlined text-lg">refresh</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Designations Table -->
      <div class="workora-card overflow-hidden">
        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="4"></app-workora-skeleton>
          </div>
        } @else if (designations().length === 0) {
          <div class="p-8">
            <app-workora-empty-state
              icon="workspace_premium"
              title="No Designations Found"
              description="No job titles configured yet. Create a designation to assign roles to your workforce.">
              <button 
                type="button" 
                (click)="openCreateModal()"
                class="workora-btn-primary text-xs mt-2">
                <span class="material-symbols-outlined text-base">add</span>
                <span>Add First Designation</span>
              </button>
            </app-workora-empty-state>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F4F8F7] border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]">
                  <th class="py-3.5 px-5">Designation Title</th>
                  <th class="py-3.5 px-4">Level / Grade</th>
                  <th class="py-3.5 px-4">Parent Department</th>
                  <th class="py-3.5 px-4">Description</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DCEBE7]/70">
                @for (desig of designations(); track desig.id) {
                  <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                    <td class="py-3.5 px-5 font-bold text-[#063B39]">
                      <div class="flex items-center gap-2.5">
                        <span class="material-symbols-outlined text-lg text-[#0E6E68]">badge</span>
                        <span>{{ desig.title }}</span>
                      </div>
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Level {{ desig.level || 1 }}{{ desig.grade ? ' • ' + desig.grade : '' }}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 font-semibold text-slate-700">{{ desig.departmentName || 'General' }}</td>
                    <td class="py-3.5 px-4 text-slate-600 max-w-sm truncate">{{ desig.description || '-' }}</td>
                    <td class="py-3.5 px-4">
                      <span 
                        [ngClass]="desig.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border">
                        {{ desig.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="py-3.5 px-5 text-right">
                      <div class="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          (click)="openEditModal(desig)"
                          class="p-1 rounded-lg hover:bg-[#DCEBE7] text-[#063B39] transition-colors border-none bg-transparent cursor-pointer"
                          title="Edit Designation">
                          <span class="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          type="button"
                          (click)="confirmDelete(desig)"
                          class="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border-none bg-transparent cursor-pointer"
                          title="Delete Designation">
                          <span class="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

    </div>

    <!-- CREATE / EDIT DESIGNATION MODAL -->
    @if (showModal()) {
      <div class="workora-modal-overlay" (click)="closeModal()">
        <div class="workora-modal-card max-w-lg flex flex-col" (click)="$event.stopPropagation()">
          
          <div class="p-5 sm:p-6 border-b border-[#DCEBE7] flex items-center justify-between bg-[#F4F8F7] shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#063B39] to-[#0E6E68] text-white flex items-center justify-center font-extrabold shadow-sm">
                <span class="material-symbols-outlined text-xl">badge</span>
              </div>
              <div>
                <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                  {{ editingDesigId() ? 'Update Designation' : 'Create Designation' }}
                </h3>
                <p class="text-xs text-slate-500">
                  Define job title, grade level, and associate with functional department.
                </p>
              </div>
            </div>

            <button 
              type="button" 
              (click)="closeModal()"
              class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
              <span class="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <form [formGroup]="desigForm" class="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 bg-white custom-scrollbar">
            
            <div class="space-y-4">
              <div>
                <label class="workora-label">Parent Department <span class="text-rose-500">*</span></label>
                <app-workora-select
                  formControlName="departmentId"
                  [options]="deptOptions()"
                  placeholder="Select Department"
                  icon="account_tree"
                ></app-workora-select>
                @if (isInvalid('departmentId')) {
                  <p class="text-[11px] text-rose-500 mt-1">Please select a department.</p>
                }
              </div>

              <div>
                <label class="workora-label">Designation Title <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="title" 
                  placeholder="Designation Title"
                  class="workora-input !py-2.5"
                />
                @if (isInvalid('title')) {
                  <p class="text-[11px] text-rose-500 mt-1">Designation title is required (min 2 chars).</p>
                }
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="workora-label">Hierarchy Level (1-10)</label>
                  <input 
                    type="number" 
                    formControlName="level" 
                    min="1" 
                    max="10"
                    class="workora-input !py-2.5 font-mono"
                  />
                </div>

                <div>
                  <label class="workora-label">Grade Band (Optional)</label>
                  <input 
                    type="text" 
                    formControlName="grade" 
                    placeholder="Salary Grade / Band"
                    class="workora-input !py-2.5"
                  />
                </div>
              </div>

              <div>
                <label class="workora-label">Description (Optional)</label>
                <textarea 
                  formControlName="description" 
                  rows="3" 
                  placeholder="Briefly describe job responsibilities..."
                  class="workora-input !py-2.5 resize-none">
                </textarea>
              </div>
            </div>

          </form>

          <div class="p-4 sm:p-5 border-t border-[#DCEBE7] bg-[#F4F8F7] flex items-center justify-between shrink-0">
            <button 
              type="button" 
              (click)="closeModal()"
              class="workora-btn-ghost text-xs">
              Cancel
            </button>

            <button 
              type="button" 
              (click)="submitForm()"
              [disabled]="isSaving()"
              class="workora-btn-primary text-xs">
              @if (isSaving()) {
                <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving...</span>
              } @else {
                <span class="material-symbols-outlined text-base">save</span>
                <span>{{ editingDesigId() ? 'Update Designation' : 'Create Designation' }}</span>
              }
            </button>
          </div>

        </div>
      </div>
    }

    <!-- Delete Confirmation Dialog -->
    <app-workora-confirm-dialog
      [isOpen]="showDeleteConfirm()"
      title="Delete Designation?"
      [message]="deleteMessage()"
      confirmText="Delete Designation"
      variant="danger"
      (confirm)="executeDelete()"
      (cancel)="showDeleteConfirm.set(false)">
    </app-workora-confirm-dialog>
  `
})
export class DesignationsPageComponent implements OnInit {
  private readonly organizationRepo = inject(OrganizationApiRepository);
  private readonly notificationService = inject(NotificationService);
  readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly designations = signal<Designation[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly isSaving = signal<boolean>(false);

  searchTerm = '';
  readonly showModal = signal<boolean>(false);
  readonly editingDesigId = signal<number | null>(null);

  readonly showDeleteConfirm = signal<boolean>(false);
  readonly deleteMessage = signal<string>('');
  private pendingDeleteDesig: Designation | null = null;

  readonly deptOptions = computed<WorkoraSelectOption[]>(() => {
    return this.departments().map(d => ({
      value: d.id,
      label: d.name,
      sublabel: `Code: ${d.code}`
    }));
  });

  readonly desigForm: FormGroup = this.fb.group({
    departmentId: [null, [Validators.required]],
    title: ['', [Validators.required, Validators.minLength(2)]],
    level: [1],
    grade: [''],
    description: ['']
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.organizationRepo.getDepartments({ pageSize: 100 }).subscribe({
      next: paged => this.departments.set(paged.items || []),
      error: () => this.departments.set([])
    });

    this.organizationRepo.getDesignations({ pageSize: 100 })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: paged => {
          let items = paged.items || [];
          if (this.searchTerm.trim()) {
            const term = this.searchTerm.trim().toLowerCase();
            items = items.filter(d => 
              d.title.toLowerCase().includes(term)
            );
          }
          this.designations.set(items);
        },
        error: err => {
          this.notificationService.error(err.message || 'Failed to load designations.');
        }
      });
  }

  onSearch(): void {
    this.loadData();
  }

  openCreateModal(): void {
    const depts = this.departments();
    const defaultDeptId = depts.length > 0 ? depts[0].id : null;

    this.editingDesigId.set(null);
    this.desigForm.reset({
      departmentId: defaultDeptId,
      title: '',
      level: 1,
      grade: '',
      description: ''
    });
    this.showModal.set(true);
  }

  openEditModal(desig: Designation): void {
    this.editingDesigId.set(desig.id);
    this.desigForm.patchValue({
      departmentId: desig.departmentId,
      title: desig.title,
      level: desig.level || 1,
      grade: desig.grade || '',
      description: desig.description || ''
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  isInvalid(controlName: string): boolean {
    const control = this.desigForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submitForm(): void {
    if (this.desigForm.invalid) {
      this.desigForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const val = this.desigForm.value;

    if (this.editingDesigId()) {
      this.organizationRepo.updateDesignation({
        id: this.editingDesigId()!,
        departmentId: val.departmentId,
        title: val.title.trim(),
        level: Number(val.level) || 1,
        grade: val.grade ? val.grade.trim() : null,
        description: val.description ? val.description.trim() : null
      })
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success('Designation updated successfully.');
          this.closeModal();
          this.loadData();
        },
        error: err => this.notificationService.error(err.message || 'Failed to update designation.')
      });
    } else {
      this.organizationRepo.createDesignation({
        departmentId: val.departmentId,
        title: val.title.trim(),
        level: Number(val.level) || 1,
        grade: val.grade ? val.grade.trim() : null,
        description: val.description ? val.description.trim() : null
      })
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success('Designation created successfully.');
          this.closeModal();
          this.loadData();
        },
        error: err => this.notificationService.error(err.message || 'Failed to create designation.')
      });
    }
  }

  confirmDelete(desig: Designation): void {
    this.pendingDeleteDesig = desig;
    this.deleteMessage.set(`Are you sure you want to delete designation "${desig.title}"?`);
    this.showDeleteConfirm.set(true);
  }

  executeDelete(): void {
    if (!this.pendingDeleteDesig) return;

    const id = this.pendingDeleteDesig.id;
    this.showDeleteConfirm.set(false);

    this.organizationRepo.deleteDesignation(id).subscribe({
      next: () => {
        this.notificationService.success('Designation deleted successfully.');
        this.loadData();
      },
      error: err => this.notificationService.error(err.message || 'Failed to delete designation.')
    });
  }
}
