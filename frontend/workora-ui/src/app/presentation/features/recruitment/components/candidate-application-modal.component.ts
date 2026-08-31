import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectionStrategy, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobPosting, CreateCandidateParams } from '../../../../domain/models/recruitment.model';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';

@Component({
  selector: 'app-candidate-application-modal',
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
              <span class="material-symbols-outlined">person_add</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                Add Candidate Applicant
              </h3>
              <p class="text-xs text-slate-500">Register applicant for vacancy review.</p>
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
              <label class="workora-label">Target Job Vacancy <span class="text-rose-500">*</span></label>
              <app-workora-select
                formControlName="jobPostingId"
                [options]="jobOptions()"
                [searchable]="true"
                searchPlaceholder="Search job vacancies..."
                placeholder="Choose target vacancy"
                icon="work"
              ></app-workora-select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">First Name <span class="text-rose-500">*</span></label>
                <input type="text" formControlName="firstName" class="workora-input !py-2.5" />
              </div>

              <div>
                <label class="workora-label">Last Name <span class="text-rose-500">*</span></label>
                <input type="text" formControlName="lastName" class="workora-input !py-2.5" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Email <span class="text-rose-500">*</span></label>
                <input type="email" formControlName="email" class="workora-input !py-2.5" />
              </div>

              <div>
                <label class="workora-label">Phone</label>
                <input type="tel" formControlName="phone" class="workora-input !py-2.5" />
              </div>
            </div>

            <div>
              <label class="workora-label">Resume / Portfolio Cloud URL</label>
              <input type="text" formControlName="resumeUrl" placeholder="https://storage.workora.com/resumes/candidate.pdf" class="workora-input !py-2.5" />
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
                <span>Adding...</span>
              } @else {
                <span class="material-symbols-outlined text-base">person_add</span>
                <span>Add Candidate</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class CandidateApplicationModalComponent implements OnInit {
  private readonly _jobs = signal<JobPosting[]>([]);

  @Input() set jobs(val: JobPosting[]) {
    this._jobs.set(val || []);
    if (val && val.length > 0 && !this.form.get('jobPostingId')?.value) {
      this.form.patchValue({ jobPostingId: val[0].id });
    }
  }

  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() createCandidate = new EventEmitter<CreateCandidateParams>();

  private readonly fb = inject(FormBuilder);

  readonly jobOptions = computed<WorkoraSelectOption<number>[]>(() => {
    return this._jobs().map(j => ({
      value: j.id,
      label: j.title,
      sublabel: `${j.departmentName || 'Department'} • ${j.location || 'HQ'}`,
      icon: 'work',
      badge: j.employmentType,
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
    }));
  });

  readonly form: FormGroup = this.fb.group({
    jobPostingId: [null, [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    resumeUrl: ['']
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnInit(): void {
    const jList = this._jobs();
    if (jList.length > 0 && !this.form.get('jobPostingId')?.value) {
      this.form.patchValue({ jobPostingId: jList[0].id });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.createCandidate.emit({
      jobPostingId: Number(v.jobPostingId),
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      phone: v.phone || null,
      resumeUrl: v.resumeUrl || null
    });
  }
}
