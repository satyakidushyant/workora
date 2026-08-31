import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateGoalParams } from '../../../../domain/models/performance.model';
import { Employee } from '../../../../domain/models/employee.model';

@Component({
  selector: 'app-goal-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">flag</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Set OKR / KPI Goal
              </h3>
              <p class="text-xs text-slate-500">Define measurable milestone target.</p>
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
              <label class="workora-label">Employee <span class="text-rose-500">*</span></label>
              <select 
                formControlName="employeeId"
                class="workora-select">
                @for (emp of employees; track emp.id) {
                  <option [ngValue]="emp.id">{{ emp.fullName }} ({{ emp.employeeCode }})</option>
                }
              </select>
            </div>

            <div>
              <label class="workora-label">Goal / Objective Title <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="title" 
                placeholder="Goal / Objective Title"
                class="workora-input !py-2.5"
              />
            </div>

            <div>
              <label class="workora-label">Target Completion Date <span class="text-rose-500">*</span></label>
              <input 
                type="date" 
                formControlName="targetDate" 
                class="workora-input !py-2.5"
              />
            </div>

            <div>
              <label class="workora-label">Milestone Description &amp; Metrics <span class="text-rose-500">*</span></label>
              <textarea 
                formControlName="description" 
                rows="3" 
                placeholder="Outline deliverables and measurable key results..."
                class="workora-input !rounded-2xl !py-2.5 resize-none"
              ></textarea>
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
                <span>Saving Goal...</span>
              } @else {
                <span class="material-symbols-outlined text-base">flag</span>
                <span>Set Goal</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class GoalFormModalComponent implements OnInit {
  @Input() employees: Employee[] = [];
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() createGoal = new EventEmitter<CreateGoalParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    employeeId: [null, [Validators.required]],
    title: ['', [Validators.required]],
    targetDate: [new Date(Date.now() + 90 * 86400000).toISOString().substring(0, 10), [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnInit(): void {
    if (this.employees.length > 0) {
      this.form.patchValue({ employeeId: this.employees[0].id });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.createGoal.emit({
      employeeId: Number(v.employeeId),
      title: v.title,
      targetDate: v.targetDate,
      description: v.description
    });
  }
}
