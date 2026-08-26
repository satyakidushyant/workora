import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalaryStructure, Payhead, SaveSalaryStructureParams } from '../../../../domain/models/payroll.model';

@Component({
  selector: 'app-salary-structure-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl border border-[#DCEBE7] shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
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
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Structure Template Name <span class="text-rose-500">*</span></label>
            <input 
              type="text" 
              formControlName="name" 
              placeholder="e.g. Standard Full-Time Engineering Grade A"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Description</label>
            <input 
              type="text" 
              formControlName="description" 
              placeholder="Optional notes regarding designation eligibility"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
          </div>

          <!-- Components Array -->
          <div class="space-y-3 pt-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-[#063B39]">Salary Components (Earnings &amp; Deductions)</label>
              <button 
                type="button" 
                (click)="addComponent()"
                class="px-2.5 py-1 bg-[#0E6E68]/10 hover:bg-[#0E6E68]/20 text-[#0E6E68] text-xs font-bold rounded-lg transition-colors border-none cursor-pointer">
                + Add Component
              </button>
            </div>

            <div formArrayName="components" class="space-y-2 max-h-56 overflow-y-auto pr-1">
              @for (c of componentsArray.controls; track $index) {
                <div [formGroupName]="$index" class="p-3 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] grid grid-cols-12 gap-2 items-center text-xs">
                  <div class="col-span-4">
                    <input 
                      type="text" 
                      formControlName="name" 
                      placeholder="Name (e.g. HRA)"
                      class="w-full px-2.5 py-1.5 bg-white text-xs text-[#063B39] rounded-lg border border-[#DCEBE7] outline-none font-medium"
                    />
                  </div>

                  <div class="col-span-2">
                    <input 
                      type="text" 
                      formControlName="code" 
                      placeholder="Code"
                      class="w-full px-2.5 py-1.5 bg-white text-xs text-[#063B39] rounded-lg border border-[#DCEBE7] outline-none font-medium font-mono uppercase"
                    />
                  </div>

                  <div class="col-span-3">
                    <select 
                      formControlName="type"
                      class="w-full px-2 py-1.5 bg-white text-xs text-[#063B39] rounded-lg border border-[#DCEBE7] outline-none font-medium">
                      <option value="Earning">Earning</option>
                      <option value="Deduction">Deduction</option>
                    </select>
                  </div>

                  <div class="col-span-2">
                    <input 
                      type="number" 
                      formControlName="defaultValue" 
                      placeholder="Val"
                      class="w-full px-2 py-1.5 bg-white text-xs text-[#063B39] rounded-lg border border-[#DCEBE7] outline-none font-medium"
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

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#DCEBE7]">
            <button 
              type="button" 
              (click)="closeModal.emit()"
              class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border-none bg-transparent">
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
