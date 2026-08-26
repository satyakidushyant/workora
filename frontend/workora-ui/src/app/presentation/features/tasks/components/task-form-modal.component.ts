import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTaskParams } from '../../../../domain/models/task.model';
import { Employee } from '../../../../domain/models/employee.model';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
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
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Task Title <span class="text-rose-500">*</span></label>
            <input 
              type="text" 
              formControlName="title" 
              placeholder="e.g. Prepare Q3 audit documentation"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Assign To Employee <span class="text-rose-500">*</span></label>
            <select 
              formControlName="assignedToEmployeeId"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
              @for (emp of employees; track emp.id) {
                <option [ngValue]="emp.id">{{ emp.fullName }} ({{ emp.designationTitle || emp.departmentName }})</option>
              }
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Priority <span class="text-rose-500">*</span></label>
              <select 
                formControlName="priority"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Due Date <span class="text-rose-500">*</span></label>
              <input 
                type="date" 
                formControlName="dueDate" 
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Task Description</label>
            <textarea 
              formControlName="description" 
              rows="3" 
              placeholder="Outline steps, requirements, and deliverables..."
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all resize-none"
            ></textarea>
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
                <span>Creating...</span>
              } @else {
                <span class="material-symbols-outlined text-base">add_task</span>
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
  @Input() employees: Employee[] = [];
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() createTask = new EventEmitter<CreateTaskParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    assignedToEmployeeId: [null, [Validators.required]],
    priority: ['Medium', [Validators.required]],
    dueDate: [new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10), [Validators.required]],
    description: ['']
  });

  ngOnInit(): void {
    if (this.employees.length > 0) {
      this.form.patchValue({ assignedToEmployeeId: this.employees[0].id });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.createTask.emit({
      title: v.title,
      description: v.description || null,
      assignedToEmployeeId: Number(v.assignedToEmployeeId),
      priority: v.priority,
      dueDate: v.dueDate
    });
  }
}
