import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AssetApiRepository } from '../../../../data/repositories/asset-api.repository';
import { EmployeeApiRepository } from '../../../../data/repositories/employee-api.repository';
import { Asset, CreateAssetParams, AssignAssetParams, ReturnAssetParams } from '../../../../domain/models/asset.model';
import { Employee } from '../../../../domain/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';

@Component({
  selector: 'app-assets-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraEmptyStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">devices</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Asset &amp; Equipment Inventory
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Track hardware laptops, workstations, peripherals, and staff allocation handovers.
          </p>
        </div>

        <button 
          type="button" 
          (click)="openCreateModal()"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
          <span class="material-symbols-outlined text-base">add_box</span>
          <span>Register Asset</span>
        </button>
      </div>

      <!-- Controls -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DCEBE7] shadow-2xs">
        <div class="relative flex-1 max-w-md">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="onSearch()"
            placeholder="Search by asset tag, name, or serial number..."
            class="w-full pl-9 pr-4 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
          />
        </div>

        <div class="flex items-center gap-2.5">
          <select 
            [(ngModel)]="selectedCategory" 
            (ngModelChange)="loadAssets()"
            class="px-3.5 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
            <option [ngValue]="undefined">All Categories</option>
            <option value="Laptop">Laptops</option>
            <option value="Desktop">Desktops / Workstations</option>
            <option value="Monitor">Monitors</option>
            <option value="Mobile">Smartphones &amp; Tablets</option>
            <option value="Furniture">Furniture</option>
          </select>

          <select 
            [(ngModel)]="selectedStatus" 
            (ngModelChange)="loadAssets()"
            class="px-3.5 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
            <option [ngValue]="undefined">All Statuses</option>
            <option value="Available">Available (In Stock)</option>
            <option value="InUse">Assigned (In Use)</option>
            <option value="UnderMaintenance">Under Maintenance</option>
            <option value="Retired">Retired / Written Off</option>
          </select>
        </div>
      </div>

      <!-- Assets Grid -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (i of [1,2,3]; track i) {
            <app-workora-skeleton type="card"></app-workora-skeleton>
          }
        </div>
      } @else if (assets().length === 0) {
        <div class="bg-white rounded-3xl p-12 border border-[#DCEBE7] shadow-xs">
          <app-workora-empty-state 
            icon="devices" 
            title="No Assets Registered"
            description="Register corporate devices and track custody assignments."
            actionLabel="Register First Asset"
            (actionClick)="openCreateModal()"
          ></app-workora-empty-state>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (asset of assets(); track asset.id) {
            <div class="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCEBE7] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div class="flex items-start justify-between gap-3 mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-[#0E6E68]/10 text-[#0E6E68] flex items-center justify-center font-bold">
                      <span class="material-symbols-outlined text-xl">laptop_mac</span>
                    </div>
                    <div>
                      <h3 class="font-extrabold text-sm text-[#063B39]">{{ asset.name }}</h3>
                      <span class="font-mono text-[10px] font-extrabold text-[#0E6E68]">{{ asset.assetTag }}</span>
                    </div>
                  </div>

                  <span 
                    [ngClass]="{
                      'bg-emerald-50 text-emerald-700 border-emerald-200': asset.status === 'Available',
                      'bg-blue-50 text-blue-700 border-blue-200': asset.status === 'InUse',
                      'bg-amber-50 text-amber-700 border-amber-200': asset.status === 'UnderMaintenance',
                      'bg-slate-100 text-slate-500 border-slate-200': asset.status === 'Retired'
                    }"
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border">
                    {{ asset.status }}
                  </span>
                </div>

                <div class="space-y-1.5 text-xs text-slate-600 bg-[#F4F8F7] p-3 rounded-2xl border border-[#DCEBE7]/70 mt-3">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400 font-bold uppercase text-[10px]">Category</span>
                    <span class="font-bold text-[#063B39]">{{ asset.category }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400 font-bold uppercase text-[10px]">Serial No</span>
                    <span class="font-mono text-slate-700">{{ asset.serialNumber || '—' }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400 font-bold uppercase text-[10px]">Assigned Custodian</span>
                    <span class="font-bold text-[#0E6E68] truncate max-w-[140px]">{{ asset.currentAssignedEmployeeName || 'Unassigned' }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-between pt-4 mt-4 border-t border-[#DCEBE7]">
                <span class="text-[10px] font-bold text-slate-400">{{ asset.purchaseDate | date:'mediumDate' }}</span>

                <div class="flex items-center gap-1.5">
                  @if (asset.status === 'Available') {
                    <button 
                      type="button" 
                      (click)="openAssignModal(asset)"
                      class="px-3 py-1.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold transition-all shadow-xs cursor-pointer border-none">
                      Assign
                    </button>
                  } @else if (asset.status === 'InUse') {
                    <button 
                      type="button" 
                      (click)="openReturnModal(asset)"
                      class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer border-none">
                      Return
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <div class="bg-white rounded-2xl p-4 border border-[#DCEBE7]">
          <app-workora-pagination
            [pageNumber]="pageIndex()"
            [totalPages]="totalPages()"
            [totalCount]="totalAssets()"
            [pageSize]="pageSize"
            (pageChange)="onPageChange($event)"
          ></app-workora-pagination>
        </div>
      }

      <!-- Create Asset Modal -->
      @if (isCreateModalOpen()) {
        <div class="workora-modal-overlay" (click)="isCreateModalOpen.set(false)">
          <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
            <div class="workora-modal-header">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined">devices</span>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-[#063B39] font-heading">Register New Asset</h3>
                  <p class="text-xs text-slate-500">Record hardware device into inventory.</p>
                </div>
              </div>
              <button (click)="isCreateModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form [formGroup]="createForm" (ngSubmit)="onSaveAsset()" class="flex flex-col flex-1 overflow-hidden">
              <div class="workora-modal-body space-y-4">
                <div>
                  <label class="workora-label">Asset Name <span class="text-rose-500">*</span></label>
                  <input type="text" formControlName="name" placeholder="Asset Name" class="workora-input !py-2.5" />
                </div>

                <div>
                  <label class="workora-label">Asset Tag Code <span class="text-rose-500">*</span></label>
                  <input type="text" formControlName="assetTag" placeholder="Asset Tag Code" class="workora-input !py-2.5 uppercase font-mono" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="workora-label">Category <span class="text-rose-500">*</span></label>
                    <select formControlName="category" class="workora-select">
                      <option value="Laptop">Laptop</option>
                      <option value="Desktop">Desktop</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Furniture">Furniture</option>
                    </select>
                  </div>

                  <div>
                    <label class="workora-label">Serial Number</label>
                    <input type="text" formControlName="serialNumber" placeholder="Serial Number" class="workora-input !py-2.5" />
                  </div>
                </div>
              </div>

              <div class="workora-modal-footer">
                <button type="button" (click)="isCreateModalOpen.set(false)" class="workora-btn-secondary">
                  Cancel
                </button>
                <button type="submit" [disabled]="createForm.invalid || isSubmitting()" class="workora-btn-primary">
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Assign Modal -->
      @if (isAssignModalOpen()) {
        <div class="workora-modal-overlay" (click)="isAssignModalOpen.set(false)">
          <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
            <div class="workora-modal-header">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined">person_pin</span>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-[#063B39] font-heading">Assign Asset</h3>
                  <p class="text-xs text-slate-500">{{ selectedAsset()?.name }} ({{ selectedAsset()?.assetTag }})</p>
                </div>
              </div>
              <button (click)="isAssignModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div class="workora-modal-body space-y-4">
              <div>
                <label class="workora-label">Assign to Employee <span class="text-rose-500">*</span></label>
                <select 
                  [(ngModel)]="assignedEmployeeId"
                  class="workora-select">
                  <option [ngValue]="undefined" disabled>-- Select Employee --</option>
                  @for (emp of employees(); track emp.id) {
                    <option [ngValue]="emp.id">{{ emp.fullName }} ({{ emp.employeeCode }})</option>
                  }
                </select>
              </div>
            </div>

            <div class="workora-modal-footer">
              <button type="button" (click)="isAssignModalOpen.set(false)" class="workora-btn-secondary">
                Cancel
              </button>
              <button type="button" (click)="onConfirmAssign()" [disabled]="!assignedEmployeeId || isSubmitting()" class="workora-btn-primary">
                Confirm Checkout
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Return Modal -->
      @if (isReturnModalOpen()) {
        <div class="workora-modal-overlay" (click)="isReturnModalOpen.set(false)">
          <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
            <div class="workora-modal-header">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined">assignment_return</span>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-[#063B39] font-heading">Return to Inventory</h3>
                  <p class="text-xs text-slate-500">{{ selectedAsset()?.name }}</p>
                </div>
              </div>
              <button (click)="isReturnModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div class="workora-modal-body space-y-4">
              <div>
                <label class="workora-label">Return Condition Note</label>
                <input 
                  type="text" 
                  [(ngModel)]="returnCondition" 
                  placeholder="Return condition & notes"
                  class="workora-input !py-2.5"
                />
              </div>
            </div>

            <div class="workora-modal-footer">
              <button type="button" (click)="isReturnModalOpen.set(false)" class="workora-btn-secondary">
                Cancel
              </button>
              <button type="button" (click)="onConfirmReturn()" [disabled]="isSubmitting()" class="workora-btn-primary">
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class AssetsPageComponent implements OnInit {
  private readonly assetRepo = inject(AssetApiRepository);
  private readonly empRepo = inject(EmployeeApiRepository);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly assets = signal<Asset[]>([]);
  readonly totalAssets = signal<number>(0);
  readonly pageIndex = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly isLoading = signal<boolean>(false);
  readonly pageSize = 9;

  searchTerm = '';
  selectedCategory?: string;
  selectedStatus?: string;

  readonly employees = signal<Employee[]>([]);

  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isAssignModalOpen = signal<boolean>(false);
  readonly isReturnModalOpen = signal<boolean>(false);
  readonly selectedAsset = signal<Asset | null>(null);
  readonly isSubmitting = signal<boolean>(false);

  assignedEmployeeId?: number;
  returnCondition = 'Good Condition';

  readonly createForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    assetTag: ['', [Validators.required]],
    category: ['Laptop', [Validators.required]],
    serialNumber: ['']
  });

  ngOnInit(): void {
    this.loadAssets();
    this.empRepo.getEmployees({ pageSize: 100 }).subscribe(p => this.employees.set(p.items));
  }

  loadAssets(): void {
    this.isLoading.set(true);
    this.assetRepo.getAssets({
      pageNumber: this.pageIndex(),
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      category: this.selectedCategory,
      status: this.selectedStatus
    })
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: paged => {
        this.assets.set(paged.items);
        this.totalAssets.set(paged.totalCount);
        this.totalPages.set(paged.totalPages);
      },
      error: err => this.notificationService.showError(err.message || 'Failed to load assets.')
    });
  }

  onSearch(): void {
    this.pageIndex.set(1);
    this.loadAssets();
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.loadAssets();
  }

  openCreateModal(): void {
    this.createForm.reset({ category: 'Laptop' });
    this.isCreateModalOpen.set(true);
  }

  openAssignModal(asset: Asset): void {
    this.selectedAsset.set(asset);
    this.assignedEmployeeId = undefined;
    this.isAssignModalOpen.set(true);
  }

  openReturnModal(asset: Asset): void {
    this.selectedAsset.set(asset);
    this.returnCondition = 'Good Condition';
    this.isReturnModalOpen.set(true);
  }

  onSaveAsset(): void {
    if (this.createForm.invalid) return;
    const v = this.createForm.value;

    this.isSubmitting.set(true);
    this.assetRepo.createAsset({
      companyId: 1,
      name: v.name,
      assetTag: v.assetTag.toUpperCase(),
      category: v.category,
      serialNumber: v.serialNumber || null
    })
    .pipe(finalize(() => this.isSubmitting.set(false)))
    .subscribe({
      next: () => {
        this.isCreateModalOpen.set(false);
        this.notificationService.showSuccess('Asset registered into inventory.');
        this.loadAssets();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to register asset.')
    });
  }

  onConfirmAssign(): void {
    if (!this.selectedAsset() || !this.assignedEmployeeId) return;

    this.isSubmitting.set(true);
    this.assetRepo.assignAsset({
      assetId: this.selectedAsset()!.id,
      employeeId: this.assignedEmployeeId,
      assignedDate: new Date().toISOString().substring(0, 10)
    })
    .pipe(finalize(() => this.isSubmitting.set(false)))
    .subscribe({
      next: () => {
        this.isAssignModalOpen.set(false);
        this.notificationService.showSuccess('Asset checkout completed.');
        this.loadAssets();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to assign asset.')
    });
  }

  onConfirmReturn(): void {
    if (!this.selectedAsset()) return;

    this.isSubmitting.set(true);
    this.assetRepo.returnAsset({
      assetId: this.selectedAsset()!.id,
      returnedDate: new Date().toISOString().substring(0, 10),
      condition: this.returnCondition
    })
    .pipe(finalize(() => this.isSubmitting.set(false)))
    .subscribe({
      next: () => {
        this.isReturnModalOpen.set(false);
        this.notificationService.showSuccess('Asset returned to stock inventory.');
        this.loadAssets();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to return asset.')
    });
  }
}
