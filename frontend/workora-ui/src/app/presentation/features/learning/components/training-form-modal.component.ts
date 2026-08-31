import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTrainingProgramParams } from '../../../../domain/models/training.model';

@Component({
  selector: 'app-training-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">school</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Create Training Course
              </h3>
              <p class="text-xs text-slate-500">Add corporate learning workshop / course.</p>
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
              <label class="workora-label">Course Title <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="title" 
                placeholder="Course Title"
                class="workora-input !py-2.5"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Instructor / Trainer <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="trainerName" 
                  placeholder="Trainer Name"
                  class="workora-input !py-2.5"
                />
              </div>

              <div>
                <label class="workora-label">Max Capacity (Seats) <span class="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  formControlName="capacity" 
                  class="workora-input !py-2.5"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Start Date <span class="text-rose-500">*</span></label>
                <input 
                  type="date" 
                  formControlName="startDate" 
                  class="workora-input !py-2.5"
                />
              </div>

              <div>
                <label class="workora-label">End Date <span class="text-rose-500">*</span></label>
                <input 
                  type="date" 
                  formControlName="endDate" 
                  class="workora-input !py-2.5"
                />
              </div>
            </div>

            <div>
              <label class="workora-label">Curriculum Description <span class="text-rose-500">*</span></label>
              <textarea 
                formControlName="description" 
                rows="3" 
                placeholder="Outline modules, learning objectives, and prerequisites..."
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
                <span>Creating...</span>
              } @else {
                <span class="material-symbols-outlined text-base">add_circle</span>
                <span>Create Course</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class TrainingFormModalComponent implements OnInit {
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() createProgram = new EventEmitter<CreateTrainingProgramParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    trainerName: ['', [Validators.required]],
    capacity: [25, [Validators.required, Validators.min(1)]],
    startDate: [new Date().toISOString().substring(0, 10), [Validators.required]],
    endDate: [new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10), [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.createProgram.emit({
      companyId: 1,
      title: v.title,
      trainerName: v.trainerName,
      capacity: Number(v.capacity),
      startDate: v.startDate,
      endDate: v.endDate,
      description: v.description
    });
  }
}
