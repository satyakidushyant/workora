import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Appraisal, SubmitReviewParams } from '../../../../domain/models/performance.model';

@Component({
  selector: 'app-appraisal-review-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">stars</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                {{ isManagerReview ? 'Manager Performance Evaluation' : 'Self-Assessment Review' }}
              </h3>
              <p class="text-xs text-slate-500">Employee: {{ appraisal?.employeeName }} ({{ appraisal?.period }} {{ appraisal?.year }})</p>
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
              <label class="workora-label">Performance Rating Score (1 to 5 Stars) <span class="text-rose-500">*</span></label>
              <div class="flex items-center gap-3 p-3 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] justify-center">
                @for (star of [1,2,3,4,5]; track star) {
                  <button 
                    type="button" 
                    (click)="setRating(star)"
                    class="p-1 border-none bg-transparent cursor-pointer transition-transform hover:scale-125">
                    <span 
                      class="material-symbols-outlined text-2xl"
                      [ngClass]="form.get('rating')?.value >= star ? 'text-amber-500 fill-amber-500' : 'text-slate-300'">
                      star
                    </span>
                  </button>
                }
                <span class="ml-2 font-bold text-xs text-[#063B39]">{{ form.get('rating')?.value || 0 }}/5</span>
              </div>
            </div>

            <div>
              <label class="workora-label">Feedback Comments &amp; Accomplishments <span class="text-rose-500">*</span></label>
              <textarea 
                formControlName="comments" 
                rows="4" 
                placeholder="Highlight major achievements, technical contributions, areas of improvement..."
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
                <span>Submit Evaluation</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class AppraisalReviewModalComponent implements OnInit {
  @Input() appraisal: Appraisal | null = null;
  @Input() isManagerReview = false;
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitReview = new EventEmitter<SubmitReviewParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    rating: [4, [Validators.required, Validators.min(1), Validators.max(5)]],
    comments: ['', [Validators.required, Validators.minLength(10)]]
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnInit(): void {
    if (this.appraisal) {
      if (this.isManagerReview && this.appraisal.managerReviewRating) {
        this.form.patchValue({
          rating: this.appraisal.managerReviewRating,
          comments: this.appraisal.managerReviewComments || ''
        });
      } else if (!this.isManagerReview && this.appraisal.selfReviewRating) {
        this.form.patchValue({
          rating: this.appraisal.selfReviewRating,
          comments: this.appraisal.selfReviewComments || ''
        });
      }
    }
  }

  setRating(star: number): void {
    this.form.patchValue({ rating: star });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.appraisal) return;
    const v = this.form.value;
    this.submitReview.emit({
      appraisalId: this.appraisal.id,
      rating: Number(v.rating),
      comments: v.comments
    });
  }
}
