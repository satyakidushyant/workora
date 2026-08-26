import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
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
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl border border-[#DCEBE7] shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
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
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Job Title <span class="text-rose-500">*</span></label>
            <input 
              type="text" 
              formControlName="title" 
              placeholder="e.g. Senior Full-Stack Engineer"
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Department <span class="text-rose-500">*</span></label>
              <select 
                formControlName="departmentId"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                <option [ngValue]="null" disabled>-- Select Department --</option>
                @for (d of departments; track d.id) {
                  <option [ngValue]="d.id">{{ d.name }}</option>
                }
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Employment Type <span class="text-rose-500">*</span></label>
              <select 
                formControlName="employmentType"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                <option value="FullTime">Full-Time</option>
                <option value="PartTime">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Location / Office <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                formControlName="location" 
                placeholder="e.g. San Francisco, CA / Remote"
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Experience (Min - Max Yrs)</label>
              <div class="grid grid-cols-2 gap-2">
                <input type="number" formControlName="experienceYearsMin" placeholder="Min" class="w-full px-2.5 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] outline-none" />
                <input type="number" formControlName="experienceYearsMax" placeholder="Max" class="w-full px-2.5 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] outline-none" />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Salary Range ($ Min - $ Max)</label>
              <div class="grid grid-cols-2 gap-2">
                <input type="number" formControlName="salaryMin" placeholder="Min $" class="w-full px-2.5 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] outline-none" />
                <input type="number" formControlName="salaryMax" placeholder="Max $" class="w-full px-2.5 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] outline-none" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Application Closing Date</label>
              <input 
                type="date" 
                formControlName="closingDate" 
                class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Job Description <span class="text-rose-500">*</span></label>
            <textarea 
              formControlName="description" 
              rows="3" 
              placeholder="Outline responsibilities and role summary..."
              class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#063B39] mb-1">Key Requirements &amp; Qualifications <span class="text-rose-500">*</span></label>
            <textarea 
              formControlName="requirements" 
              rows="2" 
              placeholder="Required skills, education, and credentials..."
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
