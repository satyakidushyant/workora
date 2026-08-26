import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
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
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">location_city</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                {{ isEditMode ? 'Update Branch Location' : 'Add New Branch Office' }}
              </h3>
              <p class="text-xs text-slate-500">Configure physical branch, location timezone, and address.</p>
            </div>
          </div>
          <button 
            type="button" 
            (click)="closeModal.emit()"
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Branch Code & Name -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Branch Code <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="code" 
                placeholder="e.g. SF-HQ, NY-01"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium uppercase tracking-wider transition-all"
              />
              @if (form.get('code')?.invalid && form.get('code')?.touched) {
                <p class="text-[11px] text-rose-500 font-semibold mt-1">Branch code is required.</p>
              }
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Branch Name <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="name" 
                placeholder="e.g. San Francisco Tech Hub"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
              @if (form.get('name')?.invalid && form.get('name')?.touched) {
                <p class="text-[11px] text-rose-500 font-semibold mt-1">Branch name is required.</p>
              }
            </div>
          </div>

          <!-- Location & Timezone -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">City / Region <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="location" 
                placeholder="e.g. San Francisco, CA"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Timezone <span class="text-rose-500">*</span></label>
              <select 
                formControlName="timezone"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                <option value="America/New_York">America/New_York (EST/EDT)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                <option value="UTC">UTC Universal</option>
              </select>
            </div>
          </div>

          <!-- Full Address -->
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Street Address</label>
            <input 
              type="text" 
              formControlName="address" 
              placeholder="e.g. 500 Market St, Floor 12"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] focus:bg-white text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
          </div>

          <!-- Is Head Office Checkbox -->
          <div class="flex items-center gap-3 p-3 bg-[#F4F8F7] rounded-xl border border-[#DCEBE7]">
            <input 
              type="checkbox" 
              id="isHeadOfficeCheckbox"
              formControlName="isHeadOffice" 
              class="w-4 h-4 text-[#0E6E68] rounded-md border-slate-300 focus:ring-[#0E6E68]"
            />
            <label for="isHeadOfficeCheckbox" class="text-xs font-bold text-[#063B39] cursor-pointer">
              Designate as Primary Headquarters Office
            </label>
          </div>

          <!-- Modal Action Buttons -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#DCEBE7]">
            <button 
              type="button" 
              (click)="closeModal.emit()"
              class="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border-none bg-transparent">
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="form.invalid || isSubmitting"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer border-none">
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
    timezone: ['America/Los_Angeles', [Validators.required]],
    isHeadOffice: [false]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['branch'] && this.branch) {
      this.form.patchValue({
        code: this.branch.code,
        name: this.branch.name,
        location: this.branch.location,
        address: this.branch.address || '',
        timezone: this.branch.timezone || 'America/Los_Angeles',
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
