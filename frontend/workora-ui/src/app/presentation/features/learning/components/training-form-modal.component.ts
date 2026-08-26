import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTrainingProgramParams } from '../../../../domain/models/training.model';

@Component({
  selector: 'app-training-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
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
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Course Title <span class="text-rose-500">*</span></label>
            <input 
              type="text" 
              formControlName="title" 
              placeholder="e.g. Advanced Cloud Architecture & Kubernetes"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Instructor / Trainer <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="trainerName" 
                placeholder="e.g. Dr. Jane Doe"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Max Capacity (Seats) <span class="text-rose-500">*</span></label>
              <input 
                type="number" 
                formControlName="capacity" 
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Start Date <span class="text-rose-500">*</span></label>
              <input 
                type="date" 
                formControlName="startDate" 
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">End Date <span class="text-rose-500">*</span></label>
              <input 
                type="date" 
                formControlName="endDate" 
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Curriculum Description <span class="text-rose-500">*</span></label>
            <textarea 
              formControlName="description" 
              rows="3" 
              placeholder="Outline modules, learning objectives, and prerequisites..."
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
