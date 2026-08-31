import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTaskParams } from '../../../../domain/models/task.model';
import { Employee } from '../../../../domain/models/employee.model';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, WorkoraSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">assignment</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Delegate &amp; Assign Task
              </h3>
              <p class="text-xs text-slate-500">Create operational task for employee.</p>
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
              <label class="workora-label">Task Title <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="title" 
                placeholder="Task Title"
                class="workora-input !py-2.5"
              />
            </div>

            <div>
              <label class="workora-label">Assign To Employee <span class="text-rose-500">*</span></label>
              <app-workora-select
                formControlName="assignedToEmployeeId"
                [options]="employeeOptions()"
                [searchable]="true"
                searchPlaceholder="Search assignee..."
                placeholder="Select assignee"
                icon="person"
              ></app-workora-select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Priority <span class="text-rose-500">*</span></label>
                <app-workora-select
                  formControlName="priority"
                  [options]="priorityOptions"
                  placeholder="Priority"
                  icon="flag"
                ></app-workora-select>
              </div>

              <div>
                <label class="workora-label">Due Date <span class="text-rose-500">*</span></label>
                <input 
                  type="date" 
                  formControlName="dueDate" 
                  class="workora-input !py-2.5"
                />
              </div>
            </div>

            <div>
              <label class="workora-label">Task Description</label>
              <textarea 
                formControlName="description" 
                rows="3" 
                placeholder="Outline steps, requirements, and deliverables..."
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
                <span>Assigning...</span>
              } @else {
                <span class="material-symbols-outlined text-base">task_alt</span>
                <span>Create Task</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class TaskFormModalComponent implements OnInit {
  private readonly _employees = signal<Employee[]>([]);

  @Input() set employees(val: Employee[]) {
    this._employees.set(val || []);
    if (val && val.length > 0 && !this.form.get('assignedToEmployeeId')?.value) {
      this.form.patchValue({ assignedToEmployeeId: val[0].id });
    }
  }

  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() createTask = new EventEmitter<CreateTaskParams>();

  private readonly fb = inject(FormBuilder);

  readonly priorityOptions: WorkoraSelectOption<string>[] = [
    { value: 'Low', label: 'Low', icon: 'flag', badge: 'Low', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
    { value: 'Medium', label: 'Medium', icon: 'flag', badge: 'Med', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'High', label: 'High', icon: 'flag', badge: 'High', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'Critical', label: 'Critical', icon: 'flag', badge: 'Urgent', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' }
  ];

  readonly employeeOptions = computed<WorkoraSelectOption<number>[]>(() => {
    return this._employees().map(emp => ({
      value: emp.id,
      label: emp.fullName,
      sublabel: emp.designationTitle || emp.departmentName || emp.employeeCode,
      icon: 'person'
    }));
  });

  readonly form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    assignedToEmployeeId: [null, [Validators.required]],
    priority: ['Medium', [Validators.required]],
    dueDate: [new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10), [Validators.required]],
    description: ['']
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnInit(): void {
    const emps = this._employees();
    if (emps.length > 0 && !this.form.get('assignedToEmployeeId')?.value) {
      this.form.patchValue({ assignedToEmployeeId: emps[0].id });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.createTask.emit({
      title: v.title,
      assignedToEmployeeId: Number(v.assignedToEmployeeId),
      priority: v.priority,
      dueDate: v.dueDate,
      description: v.description || null
    });
  }
}
