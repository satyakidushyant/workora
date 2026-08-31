import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrainingProgram, EnrollTrainingParams } from '../../../../domain/models/training.model';
import { Employee } from '../../../../domain/models/employee.model';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

@Component({
  selector: 'app-training-enroll-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, WorkoraSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">how_to_reg</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Enroll in Training
              </h3>
              <p class="text-xs text-slate-500">Course: {{ program?.title }}</p>
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
              <label class="workora-label">Select Employee to Enroll <span class="text-rose-500">*</span></label>
              <app-workora-select
                formControlName="employeeId"
                [options]="employeeOptions()"
                [searchable]="true"
                searchPlaceholder="Search employee to enroll..."
                placeholder="Choose employee"
                icon="person"
              ></app-workora-select>
            </div>

            <div class="p-3.5 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] space-y-1 text-xs">
              <div class="flex items-center justify-between text-slate-600">
                <span>Instructor:</span>
                <strong class="text-[#063B39]">{{ program?.trainerName }}</strong>
              </div>
              <div class="flex items-center justify-between text-slate-600">
                <span>Schedule:</span>
                <strong class="text-slate-800">{{ program?.startDate | date:'mediumDate' }} – {{ program?.endDate | date:'mediumDate' }}</strong>
              </div>
              <div class="flex items-center justify-between text-slate-600">
                <span>Seats Remaining:</span>
                <strong class="text-[#0E6E68]">{{ (program?.capacity || 0) - (program?.enrolledCount || 0) }} Available</strong>
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
                <span>Enrolling...</span>
              } @else {
                <span class="material-symbols-outlined text-base">person_add</span>
                <span>Confirm Enrollment</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class TrainingEnrollModalComponent implements OnInit {
  private readonly _employees = signal<Employee[]>([]);

  @Input() program: TrainingProgram | null = null;
  @Input() set employees(val: Employee[]) {
    this._employees.set(val || []);
    if (val && val.length > 0 && !this.form.get('employeeId')?.value) {
      this.form.patchValue({ employeeId: val[0].id });
    }
  }

  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() enroll = new EventEmitter<EnrollTrainingParams>();

  private readonly fb = inject(FormBuilder);

  readonly employeeOptions = computed<WorkoraSelectOption<number>[]>(() => {
    return this._employees().map(emp => ({
      value: emp.id,
      label: emp.fullName,
      sublabel: `${emp.employeeCode} • ${emp.designationTitle || emp.departmentName || 'Staff'}`,
      icon: 'person'
    }));
  });

  readonly form: FormGroup = this.fb.group({
    employeeId: [null, [Validators.required]]
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnInit(): void {
    const emps = this._employees();
    if (emps.length > 0 && !this.form.get('employeeId')?.value) {
      this.form.patchValue({ employeeId: emps[0].id });
    }
  }

  onSubmit(): void {
    if (this.form.invalid || !this.program) return;
    const v = this.form.value;
    this.enroll.emit({
      trainingProgramId: this.program.id,
      employeeId: Number(v.employeeId)
    });
  }
}
