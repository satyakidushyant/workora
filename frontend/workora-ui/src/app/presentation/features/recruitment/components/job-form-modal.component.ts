import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobPosting, SaveJobPostingParams } from '../../../../domain/models/recruitment.model';
import { Department } from '../../../../domain/models/organization.model';

@Component({
  selector: 'app-job-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workora-modal-overlay" (click)="closeModal.emit()">
      <div class="workora-modal-card max-w-xl" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="workora-modal-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">work</span>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                {{ job ? 'Edit Job Opening' : 'Post New Job Vacancy' }}
              </h3>
              <p class="text-xs text-slate-500">Configure position details, requirements, and salary range.</p>
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
              <label class="workora-label">Job Title <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="title" 
                placeholder="Job Title"
                class="workora-input !py-2.5"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Department <span class="text-rose-500">*</span></label>
                <select 
                  formControlName="departmentId"
                  class="workora-select">
                  <option [ngValue]="null" disabled>-- Select Department --</option>
                  @for (d of departments; track d.id) {
                    <option [ngValue]="d.id">{{ d.name }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="workora-label">Employment Type <span class="text-rose-500">*</span></label>
                <select 
                  formControlName="employmentType"
                  class="workora-select">
                  <option value="FullTime">Full-Time</option>
                  <option value="PartTime">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Location / Office <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="location" 
                  placeholder="Location / Office"
                  class="workora-input !py-2.5"
                />
              </div>

              <div>
                <label class="workora-label">Experience (Min - Max Yrs)</label>
                <div class="grid grid-cols-2 gap-2">
                  <input type="number" formControlName="experienceYearsMin" placeholder="Min" class="workora-input !py-2 text-center" />
                  <input type="number" formControlName="experienceYearsMax" placeholder="Max" class="workora-input !py-2 text-center" />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="workora-label">Salary Range ($ Min - $ Max)</label>
                <div class="grid grid-cols-2 gap-2">
                  <input type="number" formControlName="salaryMin" placeholder="Min $" class="workora-input !py-2 text-center" />
                  <input type="number" formControlName="salaryMax" placeholder="Max $" class="workora-input !py-2 text-center" />
                </div>
              </div>

              <div>
                <label class="workora-label">Application Closing Date</label>
                <input 
                  type="date" 
                  formControlName="closingDate" 
                  class="workora-input !py-2.5"
                />
              </div>
            </div>

            <div>
              <label class="workora-label">Job Description <span class="text-rose-500">*</span></label>
              <textarea 
                formControlName="description" 
                rows="3" 
                placeholder="Outline responsibilities and role summary..."
                class="workora-input !rounded-2xl !py-2.5 resize-none"
              ></textarea>
            </div>

            <div>
              <label class="workora-label">Key Requirements &amp; Qualifications <span class="text-rose-500">*</span></label>
              <textarea 
                formControlName="requirements" 
                rows="2" 
                placeholder="Required skills, education, and credentials..."
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
                <span>Saving...</span>
              } @else {
                <span class="material-symbols-outlined text-base">save</span>
                <span>Save Opening</span>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class JobFormModalComponent implements OnChanges {
  @Input() job: JobPosting | null = null;
  @Input() departments: Department[] = [];
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveJob = new EventEmitter<SaveJobPostingParams>();

  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    departmentId: [null, [Validators.required]],
    employmentType: ['FullTime', [Validators.required]],
    location: ['Headquarters, New York', [Validators.required]],
    experienceYearsMin: [2, [Validators.required, Validators.min(0)]],
    experienceYearsMax: [5, [Validators.required, Validators.min(0)]],
    salaryMin: [80000],
    salaryMax: [120000],
    closingDate: [null],
    description: ['', [Validators.required, Validators.minLength(10)]],
    requirements: ['', [Validators.required, Validators.minLength(10)]]
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['job'] && this.job) {
      this.form.patchValue({
        title: this.job.title,
        departmentId: this.job.departmentId,
        employmentType: this.job.employmentType,
        location: this.job.location,
        experienceYearsMin: this.job.experienceYearsMin,
        experienceYearsMax: this.job.experienceYearsMax,
        salaryMin: this.job.salaryMin,
        salaryMax: this.job.salaryMax,
        closingDate: this.job.closingDate,
        description: this.job.description,
        requirements: this.job.requirements
      });
    } else if (changes['job'] && !this.job) {
      this.form.reset({
        employmentType: 'FullTime',
        location: 'Headquarters, New York',
        experienceYearsMin: 2,
        experienceYearsMax: 5
      });
      if (this.departments.length > 0) {
        this.form.patchValue({ departmentId: this.departments[0].id });
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.saveJob.emit({
      id: this.job?.id,
      companyId: 1,
      departmentId: Number(v.departmentId),
      title: v.title,
      description: v.description,
      requirements: v.requirements,
      employmentType: v.employmentType,
      location: v.location,
      experienceYearsMin: Number(v.experienceYearsMin || 0),
      experienceYearsMax: Number(v.experienceYearsMax || 0),
      salaryMin: v.salaryMin ? Number(v.salaryMin) : null,
      salaryMax: v.salaryMax ? Number(v.salaryMax) : null,
      closingDate: v.closingDate || null
    });
  }
}
