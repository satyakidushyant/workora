import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { RecruitmentApiRepository } from '../../../../data/repositories/recruitment-api.repository';
import { OrganizationApiRepository } from '../../../../data/repositories/organization-api.repository';
import { JobPosting, SaveJobPostingParams } from '../../../../domain/models/recruitment.model';
import { Department } from '../../../../domain/models/organization.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { JobFormModalComponent } from '../components/job-form-modal.component';

@Component({
  selector: 'app-jobs-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraEmptyStateComponent,
    JobFormModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">work</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Recruitment &amp; Vacancies
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Post job openings, track hiring funnels, and manage corporate talent requisitions.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a 
            routerLink="/candidates"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-[#DCEBE7] transition-all shadow-2xs cursor-pointer text-decoration-none">
            <span class="material-symbols-outlined text-base text-[#0E6E68]">view_kanban</span>
            <span>Candidate Pipeline</span>
          </a>

          <button 
            type="button" 
            (click)="openCreateJobModal()"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
            <span class="material-symbols-outlined text-base">add</span>
            <span>Post Job Vacancy</span>
          </button>
        </div>
      </div>

      <!-- Jobs Grid -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (i of [1,2,3]; track i) {
            <app-workora-skeleton type="card"></app-workora-skeleton>
          }
        </div>
      } @else if (jobs().length === 0) {
        <div class="bg-white rounded-3xl p-12 border border-[#DCEBE7] shadow-xs">
          <app-workora-empty-state 
            icon="work_off" 
            title="No Job Vacancies"
            description="Create your first corporate vacancy requisition to accept applicant resumes."
            actionLabel="Post First Job"
            (actionClick)="openCreateJobModal()"
          ></app-workora-empty-state>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (job of jobs(); track job.id) {
            <div class="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCEBE7] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div class="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 class="font-extrabold text-sm text-[#063B39]">{{ job.title }}</h3>
                    <p class="text-[11px] text-slate-500 font-medium">{{ job.departmentName || 'General Dept' }} • {{ job.location }}</p>
                  </div>
                  <span 
                    [ngClass]="{
                      'bg-emerald-50 text-emerald-700 border-emerald-200': job.status === 'Published' || job.status === 'Active',
                      'bg-amber-50 text-amber-700 border-amber-200': job.status === 'Draft',
                      'bg-slate-100 text-slate-500 border-slate-200': job.status === 'Closed'
                    }"
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0">
                    {{ job.status }}
                  </span>
                </div>

                <!-- Specs Pill Box -->
                <div class="my-3 p-3 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]/70 space-y-1 text-xs">
                  <div class="flex items-center justify-between text-slate-600">
                    <span>Experience:</span>
                    <strong class="text-[#063B39]">{{ job.experienceYearsMin }} - {{ job.experienceYearsMax }} Years</strong>
                  </div>
                  @if (job.salaryMin && job.salaryMax) {
                    <div class="flex items-center justify-between text-slate-600">
                      <span>Salary Range:</span>
                      <strong class="text-[#0E6E68]">\${{ job.salaryMin | number }} - \${{ job.salaryMax | number }}</strong>
                    </div>
                  }
                  <div class="flex items-center justify-between text-slate-600">
                    <span>Type:</span>
                    <strong class="text-slate-800">{{ job.employmentType }}</strong>
                  </div>
                </div>

                <p class="text-xs text-slate-600 line-clamp-2">{{ job.description }}</p>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-between pt-4 mt-4 border-t border-[#DCEBE7]">
                <div class="flex items-center gap-1.5 text-xs text-[#0E6E68] font-bold">
                  <span class="material-symbols-outlined text-base">group</span>
                  <span>{{ job.applicantsCount }} Applicants</span>
                </div>

                <div class="flex items-center gap-2">
                  @if (job.status === 'Draft') {
                    <button 
                      type="button" 
                      (click)="onPublishJob(job.id)"
                      class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all border-none cursor-pointer">
                      Publish
                    </button>
                  } @else if (job.status === 'Published' || job.status === 'Active') {
                    <button 
                      type="button" 
                      (click)="onCloseJob(job.id)"
                      class="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold transition-all border-none cursor-pointer">
                      Close
                    </button>
                  }

                  <button 
                    type="button" 
                    (click)="openEditJobModal(job)"
                    class="text-slate-400 hover:text-[#0E6E68] p-1 border-none bg-transparent cursor-pointer"
                    title="Edit Opening">
                    <span class="material-symbols-outlined text-base">edit</span>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <div class="bg-white rounded-2xl p-4 border border-[#DCEBE7]">
          <app-workora-pagination
            [pageNumber]="pageIndex()"
            [totalPages]="totalPages()"
            [totalCount]="totalJobs()"
            [pageSize]="pageSize"
            (pageChange)="onPageChange($event)"
          ></app-workora-pagination>
        </div>
      }

      <!-- Job Modal -->
      @if (isJobModalOpen()) {
        <app-job-form-modal
          [job]="selectedJob()"
          [departments]="departments()"
          [isSubmitting]="isSubmittingJob()"
          (closeModal)="isJobModalOpen.set(false)"
          (saveJob)="onSaveJobPosting($event)"
        ></app-job-form-modal>
      }

    </div>
  `
})
export class JobsPageComponent implements OnInit {
  private readonly recruitmentRepo = inject(RecruitmentApiRepository);
  private readonly orgRepo = inject(OrganizationApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly jobs = signal<JobPosting[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly totalJobs = signal<number>(0);
  readonly pageIndex = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly isLoading = signal<boolean>(false);
  readonly pageSize = 9;

  readonly isJobModalOpen = signal<boolean>(false);
  readonly isSubmittingJob = signal<boolean>(false);
  readonly selectedJob = signal<JobPosting | null>(null);

  ngOnInit(): void {
    this.loadJobs();
    this.orgRepo.getDepartments({ pageSize: 100 }).subscribe(p => this.departments.set(p.items));
  }

  loadJobs(): void {
    this.isLoading.set(true);
    this.recruitmentRepo.getJobs(this.pageIndex(), this.pageSize)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: p => {
          this.jobs.set(p.items);
          this.totalJobs.set(p.totalCount);
          this.totalPages.set(p.totalPages);
        },
        error: () => {}
      });
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.loadJobs();
  }

  openCreateJobModal(): void {
    this.selectedJob.set(null);
    this.isJobModalOpen.set(true);
  }

  openEditJobModal(job: JobPosting): void {
    this.selectedJob.set(job);
    this.isJobModalOpen.set(true);
  }

  onSaveJobPosting(params: SaveJobPostingParams): void {
    this.isSubmittingJob.set(true);
    const req$ = params.id
      ? this.recruitmentRepo.updateJob(params)
      : this.recruitmentRepo.createJob(params);

    req$.pipe(finalize(() => this.isSubmittingJob.set(false)))
      .subscribe({
        next: () => {
          this.isJobModalOpen.set(false);
          this.notificationService.showSuccess('Job vacancy opening saved.');
          this.loadJobs();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to save job.')
      });
  }

  onPublishJob(id: number): void {
    this.recruitmentRepo.publishJob(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Job opening published.');
        this.loadJobs();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to publish job.')
    });
  }

  onCloseJob(id: number): void {
    this.recruitmentRepo.closeJob(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Job opening closed.');
        this.loadJobs();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to close job.')
    });
  }
}
