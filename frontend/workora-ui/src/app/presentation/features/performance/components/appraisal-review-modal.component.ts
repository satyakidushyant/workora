import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Appraisal, SubmitReviewParams } from '../../../../domain/models/performance.model';

@Component({
  selector: 'app-appraisal-review-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
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
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Performance Rating Score (1 to 5 Stars) <span class="text-rose-500">*</span></label>
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
            <label class="block text-xs font-bold text-[#063B39] mb-1">Feedback Comments &amp; Accomplishments <span class="text-rose-500">*</span></label>
            <textarea 
              formControlName="comments" 
              rows="4" 
              placeholder="Highlight major achievements, technical contributions, areas of improvement..."
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
