import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Candidate, CreateJobOfferParams } from '../../../../domain/models/recruitment.model';

@Component({
  selector: 'app-job-offer-modal',
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
              <span class="material-symbols-outlined">mark_email_read</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Extend Formal Job Offer
              </h3>
              <p class="text-xs text-slate-500">Candidate: {{ candidate?.fullName }}</p>
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
              <label class="workora-label">Offered Annual Base Salary ($) <span class="text-rose-500">*</span></label>
              <input 
                type="number" 
                formControlName="offeredSalary" 
                placeholder="e.g. 95000"
                class="workora-input !py-2.5"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Expected Joining Date <span class="text-rose-500">*</span></label>
                <input 
                  type="date" 
                  formControlName="joiningDate" 
                  class="workora-input !py-2.5"
                />
              </div>

              <div>
                <label class="workora-label">Offer Expiry Date <span class="text-rose-500">*</span></label>
                <input 
                  type="date" 
                  formControlName="expiryDate" 
                  class="workora-input !py-2.5"
                />
              </div>
            </div>

            <div>
              <label class="workora-label">Special Clauses / Sign-on Bonus Notes</label>
              <textarea 
                formControlName="notes" 
                rows="3" 
                placeholder="e.g. $5,000 sign-on bonus contingent on 1-year tenure, equity grants..."
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
                <span>Generating Offer...</span>
              } @else {
                <span class="material-symbols-outlined text-base">send</span>
                <span>Create &amp; Dispatch Offer</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class JobOfferModalComponent implements OnInit {
  @Input() candidate: Candidate | null = null;
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() createOffer = new EventEmitter<CreateJobOfferParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    offeredSalary: [90000, [Validators.required, Validators.min(1000)]],
    joiningDate: [new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10), [Validators.required]],
    expiryDate: [new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10), [Validators.required]],
    notes: ['']
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid || !this.candidate) return;
    const v = this.form.value;
    this.createOffer.emit({
      candidateId: this.candidate.id,
      offeredSalary: Number(v.offeredSalary),
      joiningDate: v.joiningDate,
      expiryDate: v.expiryDate,
      notes: v.notes || null
    });
  }
}
