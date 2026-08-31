import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTicketParams } from '../../../../domain/models/helpdesk.model';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

@Component({
  selector: 'app-create-ticket-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, WorkoraSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">confirmation_number</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Raise Support Ticket
              </h3>
              <p class="text-xs text-slate-500">Submit an inquiry to HR, IT, or Payroll.</p>
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
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Category <span class="text-rose-500">*</span></label>
                <app-workora-select
                  formControlName="category"
                  [options]="categoryOptions"
                  placeholder="Category"
                  icon="category"
                ></app-workora-select>
              </div>

              <div>
                <label class="workora-label">Priority <span class="text-rose-500">*</span></label>
                <app-workora-select
                  formControlName="priority"
                  [options]="priorityOptions"
                  placeholder="Priority"
                  icon="flag"
                ></app-workora-select>
              </div>
            </div>

            <div>
              <label class="workora-label">Subject <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="subject" 
                placeholder="Brief summary of the issue..."
                class="workora-input !py-2.5"
              />
            </div>

            <div>
              <label class="workora-label">Detailed Description <span class="text-rose-500">*</span></label>
              <textarea 
                formControlName="description" 
                rows="4" 
                placeholder="Explain the problem in detail with any error codes or steps..."
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
                <span>Submitting...</span>
              } @else {
                <span class="material-symbols-outlined text-base">send</span>
                <span>Submit Ticket</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class CreateTicketModalComponent {
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() createTicket = new EventEmitter<CreateTicketParams>();

  private readonly fb = inject(FormBuilder);

  readonly categoryOptions: WorkoraSelectOption<string>[] = [
    { value: 'ITSupport', label: 'IT Support & Tech', icon: 'computer', badge: 'IT', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'Payroll', label: 'Payroll & Salary', icon: 'payments', badge: 'Payroll', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'Attendance', label: 'Attendance & Leave', icon: 'schedule', badge: 'Time', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'HRPolicy', label: 'HR Policy & Benefits', icon: 'policy', badge: 'HR', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
    { value: 'Facilities', label: 'Office Facilities', icon: 'corporate_fare', badge: 'Admin', badgeClass: 'bg-teal-50 text-teal-700 border-teal-200' },
    { value: 'General', label: 'General Inquiry', icon: 'help', badge: 'General', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' }
  ];

  readonly priorityOptions: WorkoraSelectOption<string>[] = [
    { value: 'Low', label: 'Low', icon: 'flag', badge: 'Low', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
    { value: 'Medium', label: 'Medium', icon: 'flag', badge: 'Med', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'High', label: 'High', icon: 'flag', badge: 'High', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'Urgent', label: 'Urgent', icon: 'flag', badge: 'Urgent', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' }
  ];

  readonly form: FormGroup = this.fb.group({
    category: ['ITSupport', [Validators.required]],
    priority: ['Medium', [Validators.required]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(5)]]
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.createTicket.emit({
      category: v.category,
      priority: v.priority,
      subject: v.subject,
      description: v.description
    });
  }
}
