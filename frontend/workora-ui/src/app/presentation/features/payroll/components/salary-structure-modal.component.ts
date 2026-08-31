import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalaryStructure, Payhead, SaveSalaryStructureParams } from '../../../../domain/models/payroll.model';

@Component({
  selector: 'app-salary-structure-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-xl" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                {{ structure ? 'Edit Salary Template' : 'Create Salary Template' }}
              </h3>
              <p class="text-xs text-slate-500">Define component breakdown and statutory deduction rules.</p>
            </div>
          </div>
          <button 
            type="button" 
            (click)="closeModal.emit()"
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col flex-1 overflow-hidden">
          <div class="workora-modal-body space-y-4">
            <div>
              <label class="workora-label">Structure Template Name <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="name" 
                placeholder="e.g. Standard Full-Time Engineering Grade A"
                class="workora-input !py-2.5"
              />
            </div>

            <div>
              <label class="workora-label">Description</label>
              <input 
                type="text" 
                formControlName="description" 
                placeholder="Optional notes regarding designation eligibility"
                class="workora-input !py-2.5"
              />
            </div>

            <!-- Components Array -->
            <div class="space-y-3 pt-2">
              <div class="flex items-center justify-between">
                <label class="workora-label !mb-0">Salary Components (Earnings &amp; Deductions)</label>
                <button 
                  type="button" 
                  (click)="addComponent()"
                  class="px-2.5 py-1 bg-[#0E6E68]/10 hover:bg-[#0E6E68]/20 text-[#0E6E68] text-xs font-bold rounded-lg transition-colors border-none cursor-pointer">
                  + Add Component
                </button>
              </div>

              <div formArrayName="components" class="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                @for (c of componentsArray.controls; track $index) {
                  <div [formGroupName]="$index" class="p-3 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] grid grid-cols-12 gap-2 items-center text-xs">
                    <div class="col-span-4">
                      <input 
                        type="text" 
                        formControlName="name" 
                        placeholder="Name (e.g. HRA)"
                        class="workora-input !py-1.5 !px-2.5 !text-xs !bg-white"
                      />
                    </div>

                    <div class="col-span-2">
                      <input 
                        type="text" 
                        formControlName="code" 
                        placeholder="Code"
                        class="workora-input !py-1.5 !px-2.5 !text-xs !bg-white font-mono uppercase"
                      />
                    </div>

                    <div class="col-span-3">
                      <select 
                        formControlName="type"
                        class="workora-select !py-1.5 !px-2 !text-xs !bg-white">
                        <option value="Earning">Earning</option>
                        <option value="Deduction">Deduction</option>
                      </select>
                    </div>

                    <div class="col-span-2">
                      <input 
                        type="number" 
                        formControlName="defaultValue" 
                        placeholder="Val"
                        class="workora-input !py-1.5 !px-2 !text-xs !bg-white text-center"
                      />
                    </div>

                    <div class="col-span-1 text-right">
                      <button 
                        type="button" 
                        (click)="removeComponent($index)"
                        class="text-rose-500 hover:text-rose-700 p-1 border-none bg-transparent cursor-pointer"
                        title="Remove Component">
                        <span class="material-symbols-outlined text-base">close</span>
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

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
                <span class="material-symbols-outlined text-base">save</span>
                <span>Save Structure</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class SalaryStructureModalComponent implements OnChanges {
  @Input() structure: SalaryStructure | null = null;
  @Input() payheads: Payhead[] = [];
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveStructure = new EventEmitter<SaveSalaryStructureParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    components: this.fb.array([])
  });

  get componentsArray(): FormArray {
    return this.form.get('components') as FormArray;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['structure'] && this.structure) {
      this.form.patchValue({
        name: this.structure.name,
        description: this.structure.description || ''
      });
      this.componentsArray.clear();
      for (const c of this.structure.components) {
        this.componentsArray.push(this.fb.group({
          name: [c.name, Validators.required],
          code: [c.code, Validators.required],
          type: [c.type, Validators.required],
          calculationType: [c.calculationType || 'Fixed'],
          defaultValue: [c.defaultValue || 0],
          isTaxable: [c.isTaxable ?? true]
        }));
      }
    } else if (changes['structure'] && !this.structure) {
      this.form.reset();
      this.componentsArray.clear();
      // Add default Basic, HRA, Medical, and Tax
      this.componentsArray.push(this.fb.group({ name: 'Basic Salary', code: 'BASIC', type: 'Earning', calculationType: 'Fixed', defaultValue: 50, isTaxable: true }));
      this.componentsArray.push(this.fb.group({ name: 'House Rent Allowance', code: 'HRA', type: 'Earning', calculationType: 'PercentageOfBasic', defaultValue: 40, isTaxable: true }));
      this.componentsArray.push(this.fb.group({ name: 'Provident Fund (PF)', code: 'PF', type: 'Deduction', calculationType: 'PercentageOfBasic', defaultValue: 12, isTaxable: false }));
    }
  }

  addComponent(): void {
    this.componentsArray.push(this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      type: ['Earning', Validators.required],
      calculationType: ['Fixed'],
      defaultValue: [0],
      isTaxable: [true]
    }));
  }

  removeComponent(index: number): void {
    this.componentsArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.saveStructure.emit({
      id: this.structure?.id,
      companyId: 1,
      name: v.name,
      description: v.description || null,
      components: v.components.map((c: any) => ({
        name: c.name,
        code: c.code.toUpperCase(),
        type: c.type,
        calculationType: c.calculationType || 'Fixed',
        defaultValue: Number(c.defaultValue || 0),
        isTaxable: !!c.isTaxable
      }))
    });
  }
}
