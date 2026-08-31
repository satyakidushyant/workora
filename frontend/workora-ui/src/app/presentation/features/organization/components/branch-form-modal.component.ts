import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Branch, CreateBranchParams, UpdateBranchParams } from '../../../../domain/models/organization.model';

/**
 * Presentational modal component for creating and updating branch offices.
 */
@Component({
  selector: 'app-branch-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-lg" (click)="$event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">location_city</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#102A2A] font-heading">
                {{ isEditMode ? 'Update Branch Location' : 'Add New Branch Office' }}
              </h3>
              <p class="text-xs text-[#718686]">Configure physical branch, location timezone, and address.</p>
            </div>
          </div>
          <button 
            type="button" 
            (click)="closeModal.emit()"
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col flex-1 overflow-hidden">
          <div class="workora-modal-body space-y-4">
            <!-- Branch Code & Name -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Branch Code <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="code" 
                  placeholder="Branch Code"
                  class="workora-input !py-2.5 uppercase font-mono tracking-wider"
                />
                @if (form.get('code')?.invalid && form.get('code')?.touched) {
                  <p class="text-[11px] text-rose-500 font-semibold mt-1">Branch code is required.</p>
                }
              </div>

              <div>
                <label class="workora-label">Branch Name <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="name" 
                  placeholder="Branch Name"
                  class="workora-input !py-2.5"
                />
                @if (form.get('name')?.invalid && form.get('name')?.touched) {
                  <p class="text-[11px] text-rose-500 font-semibold mt-1">Branch name is required.</p>
                }
              </div>
            </div>

            <!-- Location & Timezone -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">City / Region <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="location" 
                  placeholder="City / Region"
                  class="workora-input !py-2.5"
                />
              </div>

              <div>
                <label class="workora-label">Timezone <span class="text-rose-500">*</span></label>
                <select 
                  formControlName="timezone"
                  class="workora-select">
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30) [Default]</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                  <option value="America/New_York">America/New_York (EST/EDT)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                  <option value="UTC">UTC Universal</option>
                </select>
              </div>
            </div>

            <!-- Full Address -->
            <div>
              <label class="workora-label">Street Address</label>
              <input 
                type="text" 
                formControlName="address" 
                placeholder="Street Address"
                class="workora-input !py-2.5"
              />
            </div>

            <!-- Is Head Office Checkbox -->
            <div class="flex items-center gap-3 p-3 bg-[#F6FAF9] rounded-2xl border border-[#DDE9E6]">
              <input 
                type="checkbox" 
                id="isHeadOfficeCheckbox"
                formControlName="isHeadOffice" 
                class="workora-checkbox"
              />
              <label for="isHeadOfficeCheckbox" class="text-xs font-bold text-[#102A2A] cursor-pointer">
                Designate as Primary Headquarters Office
              </label>
            </div>
          </div>

          <!-- Modal Action Buttons -->
          <div class="workora-modal-footer">
            <button 
              type="button" 
              (click)="closeModal.emit()"
              class="workora-btn-secondary">
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="form.invalid || isSubmitting"
              class="workora-btn-primary">
              @if (isSubmitting) {
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving...</span>
              } @else {
                <span class="material-symbols-outlined text-base">check</span>
                <span>{{ isEditMode ? 'Update Branch' : 'Add Branch' }}</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class BranchFormModalComponent implements OnChanges {
  @Input() branch: Branch | null = null;
  @Input() companyId = 1;
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveBranch = new EventEmitter<CreateBranchParams | UpdateBranchParams>();

  private readonly fb = inject(FormBuilder);
  get isEditMode(): boolean {
    return !!this.branch;
  }

  readonly form: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(20)]],
    name: ['', [Validators.required, Validators.maxLength(150)]],
    location: ['', [Validators.required, Validators.maxLength(100)]],
    address: [''],
    timezone: ['Asia/Kolkata', [Validators.required]],
    isHeadOffice: [false]
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['branch'] && this.branch) {
      this.form.patchValue({
        code: this.branch.code,
        name: this.branch.name,
        location: this.branch.location,
        address: this.branch.address || '',
        timezone: this.branch.timezone || 'Asia/Kolkata',
        isHeadOffice: this.branch.isHeadOffice || false
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const formVal = this.form.value;

    if (this.isEditMode && this.branch) {
      const params: UpdateBranchParams = {
        id: this.branch.id,
        name: formVal.name,
        code: formVal.code.toUpperCase(),
        location: formVal.location,
        address: formVal.address || null,
        timezone: formVal.timezone,
        isHeadOffice: !!formVal.isHeadOffice
      };
      this.saveBranch.emit(params);
    } else {
      const params: CreateBranchParams = {
        companyId: this.companyId,
        name: formVal.name,
        code: formVal.code.toUpperCase(),
        location: formVal.location,
        address: formVal.address || null,
        timezone: formVal.timezone,
        isHeadOffice: !!formVal.isHeadOffice
      };
      this.saveBranch.emit(params);
    }
  }
}
