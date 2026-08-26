import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { RecruitmentApiRepository } from '../../../../data/repositories/recruitment-api.repository';
import { EmployeeApiRepository } from '../../../../data/repositories/employee-api.repository';
import {
  Candidate,
  JobPosting,
  ScheduleInterviewParams,
  CreateJobOfferParams,
  CreateCandidateParams
} from '../../../../domain/models/recruitment.model';
import { Employee } from '../../../../domain/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { CandidateApplicationModalComponent } from '../components/candidate-application-modal.component';
import { InterviewScheduleModalComponent } from '../components/interview-schedule-modal.component';
import { JobOfferModalComponent } from '../components/job-offer-modal.component';

@Component({
  selector: 'app-candidates-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent,
    CandidateApplicationModalComponent,
    InterviewScheduleModalComponent,
    JobOfferModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">view_kanban</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Candidate Pipeline Funnel
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Advance applicants across screening rounds, schedule interviews, and issue job offers.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a 
            routerLink="/jobs"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-[#DCEBE7] transition-all shadow-2xs cursor-pointer text-decoration-none">
            <span class="material-symbols-outlined text-base text-[#0E6E68]">work</span>
            <span>Job Openings</span>
          </a>

          <button 
            type="button" 
            (click)="isAddCandidateModalOpen.set(true)"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
            <span class="material-symbols-outlined text-base">person_add</span>
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      <!-- Stage Funnel Metrics -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        @for (s of ['Applied', 'Screening', 'Interview', 'Offered', 'Hired', 'Rejected']; track s) {
          <div class="bg-white p-3.5 rounded-2xl border border-[#DCEBE7] shadow-2xs">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">{{ s }}</span>
            <p class="text-xl font-extrabold text-[#063B39] mt-0.5">{{ countByStage(s) }}</p>
          </div>
        }
      </div>

      <!-- Candidates Table -->
      <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden">
        <div class="p-5 border-b border-[#DCEBE7] flex items-center justify-between">
          <h3 class="text-sm font-extrabold text-[#063B39]">Candidate Applicant Profiles</h3>
        </div>

        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="5"></app-workora-skeleton>
          </div>
        } @else if (candidates().length === 0) {
          <div class="p-12">
            <app-workora-empty-state 
              icon="group" 
              title="No Candidates Found"
              description="Add applicants or receive candidate resumes through job boards."
              actionLabel="Add Candidate"
              (actionClick)="isAddCandidateModalOpen.set(true)"
            ></app-workora-empty-state>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                  <th class="py-3.5 px-5">Candidate</th>
                  <th class="py-3.5 px-4">Applied Role</th>
                  <th class="py-3.5 px-4">Applied Date</th>
                  <th class="py-3.5 px-4">Resume</th>
                  <th class="py-3.5 px-4">Current Stage</th>
                  <th class="py-3.5 px-5 text-right">Pipeline Workflow Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DCEBE7]/70">
                @for (c of candidates(); track c.id) {
                  <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                    <td class="py-3.5 px-5">
                      <p class="font-bold text-[#063B39]">{{ c.fullName }}</p>
                      <p class="text-[10px] text-slate-400 font-mono">{{ c.email }}</p>
                    </td>
                    <td class="py-3.5 px-4 font-semibold text-slate-700">
                      {{ c.jobTitle || 'General Application' }}
                    </td>
                    <td class="py-3.5 px-4 text-slate-600 font-medium">
                      {{ c.appliedDate | date:'mediumDate' }}
                    </td>
                    <td class="py-3.5 px-4">
                      @if (c.resumeUrl) {
                        <a 
                          [href]="c.resumeUrl" 
                          target="_blank" 
                          class="text-[#0E6E68] hover:underline font-bold inline-flex items-center gap-1">
                          <span class="material-symbols-outlined text-sm">description</span>
                          <span>CV Link</span>
                        </a>
                      } @else {
                        <span class="text-slate-400 text-[11px]">—</span>
                      }
                    </td>
                    <td class="py-3.5 px-4">
                      <span 
                        [ngClass]="{
                          'bg-amber-50 text-amber-700 border-amber-200': c.stage === 'Applied' || c.stage === 'Screening',
                          'bg-blue-50 text-blue-700 border-blue-200': c.stage === 'Interview',
                          'bg-purple-50 text-purple-700 border-purple-200': c.stage === 'Offered',
                          'bg-emerald-50 text-emerald-700 border-emerald-200': c.stage === 'Hired',
                          'bg-rose-50 text-rose-700 border-rose-200': c.stage === 'Rejected'
                        }"
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border">
                        {{ c.stage }}
                      </span>
                    </td>
                    <td class="py-3.5 px-5 text-right">
                      <div class="inline-flex items-center gap-1.5">
                        @if (c.stage === 'Applied') {
                          <button 
                            type="button" 
                            (click)="onAdvanceStage(c.id, 'Screening')"
                            class="px-2.5 py-1 rounded-lg bg-[#0E6E68]/10 hover:bg-[#0E6E68]/20 text-[#0E6E68] text-[11px] font-bold transition-all border-none cursor-pointer">
                            Screen
                          </button>
                        } @else if (c.stage === 'Screening') {
                          <button 
                            type="button" 
                            (click)="openScheduleModal(c)"
                            class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-all border-none cursor-pointer">
                            Schedule Interview
                          </button>
                        } @else if (c.stage === 'Interview') {
                          <button 
                            type="button" 
                            (click)="openOfferModal(c)"
                            class="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold transition-all border-none cursor-pointer">
                            Make Offer
                          </button>
                        } @else if (c.stage === 'Offered') {
                          <button 
                            type="button" 
                            (click)="onAdvanceStage(c.id, 'Hired')"
                            class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all border-none cursor-pointer">
                            Mark Hired
                          </button>
                        }

                        @if (c.stage !== 'Hired' && c.stage !== 'Rejected') {
                          <button 
                            type="button" 
                            (click)="onReject(c.id)"
                            class="text-rose-600 hover:text-rose-800 text-[11px] font-bold border-none bg-transparent cursor-pointer p-1"
                            title="Disqualify Candidate">
                            <span class="material-symbols-outlined text-sm">person_cancel</span>
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Modals -->
      @if (isAddCandidateModalOpen()) {
        <app-candidate-application-modal
          [jobs]="jobs()"
          [isSubmitting]="isSubmitting()"
          (closeModal)="isAddCandidateModalOpen.set(false)"
          (createCandidate)="onSaveCandidate($event)"
        ></app-candidate-application-modal>
      }

      @if (isScheduleModalOpen()) {
        <app-interview-schedule-modal
          [candidate]="selectedCandidate()"
          [interviewers]="interviewers()"
          [isSubmitting]="isSubmitting()"
          (closeModal)="isScheduleModalOpen.set(false)"
          (scheduleInterview)="onSaveScheduleInterview($event)"
        ></app-interview-schedule-modal>
      }

      @if (isOfferModalOpen()) {
        <app-job-offer-modal
          [candidate]="selectedCandidate()"
          [isSubmitting]="isSubmitting()"
          (closeModal)="isOfferModalOpen.set(false)"
          (createOffer)="onSaveJobOffer($event)"
        ></app-job-offer-modal>
      }

    </div>
  `
})
export class CandidatesPageComponent implements OnInit {
  private readonly recruitmentRepo = inject(RecruitmentApiRepository);
  private readonly empRepo = inject(EmployeeApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly candidates = signal<Candidate[]>([]);
  readonly jobs = signal<JobPosting[]>([]);
  readonly interviewers = signal<Employee[]>([]);

  readonly isLoading = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  readonly isAddCandidateModalOpen = signal<boolean>(false);
  readonly isScheduleModalOpen = signal<boolean>(false);
  readonly isOfferModalOpen = signal<boolean>(false);

  readonly selectedCandidate = signal<Candidate | null>(null);

  countByStage(stage: string): number {
    return this.candidates().filter(c => c.stage === stage).length;
  }

  ngOnInit(): void {
    this.loadCandidates();
    this.recruitmentRepo.getJobs(1, 100).subscribe(p => this.jobs.set(p.items));
    this.empRepo.getEmployees({ pageSize: 100 }).subscribe(p => this.interviewers.set(p.items));
  }

  loadCandidates(): void {
    this.isLoading.set(true);
    this.recruitmentRepo.getCandidates(1, 50)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: p => this.candidates.set(p.items),
        error: () => {}
      });
  }

  openScheduleModal(candidate: Candidate): void {
    this.selectedCandidate.set(candidate);
    this.isScheduleModalOpen.set(true);
  }

  openOfferModal(candidate: Candidate): void {
    this.selectedCandidate.set(candidate);
    this.isOfferModalOpen.set(true);
  }

  onSaveCandidate(params: CreateCandidateParams): void {
    this.isSubmitting.set(true);
    this.recruitmentRepo.createCandidate(params)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.isAddCandidateModalOpen.set(false);
          this.notificationService.showSuccess('Candidate applicant added.');
          this.loadCandidates();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to add candidate.')
      });
  }

  onAdvanceStage(id: number, stage: string): void {
    this.recruitmentRepo.moveCandidateStage(id, stage).subscribe({
      next: () => {
        this.notificationService.showSuccess(`Candidate moved to ${stage} stage.`);
        this.loadCandidates();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to update candidate stage.')
    });
  }

  onSaveScheduleInterview(params: ScheduleInterviewParams): void {
    this.isSubmitting.set(true);
    this.recruitmentRepo.scheduleInterview(params)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.isScheduleModalOpen.set(false);
          this.notificationService.showSuccess('Interview round scheduled and calendar invite created.');
          if (params.candidateId) this.onAdvanceStage(params.candidateId, 'Interview');
        },
        error: err => this.notificationService.showError(err.message || 'Failed to schedule interview.')
      });
  }

  onSaveJobOffer(params: CreateJobOfferParams): void {
    this.isSubmitting.set(true);
    this.recruitmentRepo.createOffer(params)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: offer => {
          this.isOfferModalOpen.set(false);
          this.recruitmentRepo.sendOffer(offer.id).subscribe();
          this.notificationService.showSuccess('Formal job offer letter generated and dispatched.');
          if (params.candidateId) this.onAdvanceStage(params.candidateId, 'Offered');
        },
        error: err => this.notificationService.showError(err.message || 'Failed to create job offer.')
      });
  }

  onReject(id: number): void {
    this.recruitmentRepo.rejectCandidate(id, 'Did not meet technical requirements').subscribe({
      next: () => {
        this.notificationService.showSuccess('Candidate disqualified.');
        this.loadCandidates();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to reject candidate.')
    });
  }
}
