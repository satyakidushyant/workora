import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { PerformanceApiRepository } from '../../../../data/repositories/performance-api.repository';
import { EmployeeApiRepository } from '../../../../data/repositories/employee-api.repository';
import {
  Appraisal,
  Goal,
  PerformanceCycle,
  CreateAppraisalParams,
  SubmitReviewParams,
  CreateGoalParams
} from '../../../../domain/models/performance.model';
import { Employee } from '../../../../domain/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { CreateAppraisalModalComponent } from '../components/create-appraisal-modal.component';
import { AppraisalReviewModalComponent } from '../components/appraisal-review-modal.component';
import { GoalFormModalComponent } from '../components/goal-form-modal.component';

type PerformanceTab = 'appraisals' | 'goals' | 'cycles';

@Component({
  selector: 'app-performance-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraEmptyStateComponent,
    CreateAppraisalModalComponent,
    AppraisalReviewModalComponent,
    GoalFormModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">stars</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Performance &amp; Appraisals
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Conduct 360-degree reviews, track OKR &amp; KPI milestones, and manage appraisal review cycles.
          </p>
        </div>

        <div class="flex items-center gap-3">
          @if (activeTab() === 'appraisals') {
            <button 
              type="button" 
              (click)="isCreateAppraisalModalOpen.set(true)"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
              <span class="material-symbols-outlined text-base">rate_review</span>
              <span>Launch Appraisal</span>
            </button>
          } @else if (activeTab() === 'goals') {
            <button 
              type="button" 
              (click)="isCreateGoalModalOpen.set(true)"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
              <span class="material-symbols-outlined text-base">flag</span>
              <span>Set OKR Goal</span>
            </button>
          }
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#DCEBE7] shadow-2xs overflow-x-auto">
        <button 
          type="button" 
          (click)="activeTab.set('appraisals')"
          [ngClass]="activeTab() === 'appraisals' ? 'bg-[#0E6E68] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#063B39]'"
          class="px-4 py-2 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5 shrink-0">
          <span class="material-symbols-outlined text-base">assessment</span>
          <span>Appraisal Cycles</span>
        </button>

        <button 
          type="button" 
          (click)="activeTab.set('goals')"
          [ngClass]="activeTab() === 'goals' ? 'bg-[#0E6E68] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#063B39]'"
          class="px-4 py-2 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5 shrink-0">
          <span class="material-symbols-outlined text-base">flag</span>
          <span>OKR &amp; KPI Goals</span>
        </button>

        <button 
          type="button" 
          (click)="activeTab.set('cycles')"
          [ngClass]="activeTab() === 'cycles' ? 'bg-[#0E6E68] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#063B39]'"
          class="px-4 py-2 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent flex items-center gap-1.5 shrink-0">
          <span class="material-symbols-outlined text-base">event_repeat</span>
          <span>Review Schedule</span>
        </button>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 1: APPRAISAL REVIEWS -->
      <!-- ======================================================== -->
      @if (activeTab() === 'appraisals') {
        <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden animate-in fade-in duration-150">
          <div class="p-5 border-b border-[#DCEBE7]">
            <h3 class="text-sm font-extrabold text-[#063B39]">Performance Review Cycles</h3>
          </div>

          @if (isLoadingAppraisals()) {
            <div class="p-6">
              <app-workora-skeleton type="table" [count]="4"></app-workora-skeleton>
            </div>
          } @else if (appraisals().length === 0) {
            <div class="p-12">
              <app-workora-empty-state 
                icon="stars" 
                title="No Appraisals Active"
                description="Launch an annual or quarterly performance review cycle."
                actionLabel="Launch Appraisal"
                (actionClick)="isCreateAppraisalModalOpen.set(true)"
              ></app-workora-empty-state>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                    <th class="py-3.5 px-5">Employee</th>
                    <th class="py-3.5 px-4">Period</th>
                    <th class="py-3.5 px-4">Reviewer</th>
                    <th class="py-3.5 px-4">Self Score</th>
                    <th class="py-3.5 px-4">Manager Score</th>
                    <th class="py-3.5 px-4">Final Rating</th>
                    <th class="py-3.5 px-4">Status</th>
                    <th class="py-3.5 px-5 text-right">Review Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#DCEBE7]/70">
                  @for (a of appraisals(); track a.id) {
                    <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                      <td class="py-3.5 px-5 font-bold text-[#063B39]">
                        {{ a.employeeName }}
                      </td>
                      <td class="py-3.5 px-4 font-semibold text-slate-700">
                        {{ a.period }} {{ a.year }}
                      </td>
                      <td class="py-3.5 px-4 text-slate-600">
                        {{ a.reviewerName }}
                      </td>
                      <td class="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {{ a.selfReviewRating ? a.selfReviewRating + '/5' : '—' }}
                      </td>
                      <td class="py-3.5 px-4 font-mono font-bold text-[#0E6E68]">
                        {{ a.managerReviewRating ? a.managerReviewRating + '/5' : '—' }}
                      </td>
                      <td class="py-3.5 px-4 font-bold text-amber-600">
                        {{ a.finalScore ? (a.finalScore | number:'1.1-1') + '/5.0' : '—' }}
                      </td>
                      <td class="py-3.5 px-4">
                        <span 
                          [ngClass]="{
                            'bg-amber-50 text-amber-700 border-amber-200': a.status === 'Initiated',
                            'bg-blue-50 text-blue-700 border-blue-200': a.status === 'SelfReviewSubmitted',
                            'bg-purple-50 text-purple-700 border-purple-200': a.status === 'ManagerReviewSubmitted',
                            'bg-emerald-50 text-emerald-700 border-emerald-200': a.status === 'Finalized'
                          }"
                          class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border">
                          {{ a.status }}
                        </span>
                      </td>
                      <td class="py-3.5 px-5 text-right">
                        <div class="inline-flex items-center gap-1.5">
                          @if (a.status === 'Initiated') {
                            <button 
                              type="button" 
                              (click)="openSelfReviewModal(a)"
                              class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-all border-none cursor-pointer">
                              Self Review
                            </button>
                          } @else if (a.status === 'SelfReviewSubmitted') {
                            <button 
                              type="button" 
                              (click)="openManagerReviewModal(a)"
                              class="px-2.5 py-1 rounded-lg bg-[#0E6E68] hover:bg-[#063B39] text-white text-[11px] font-bold transition-all border-none cursor-pointer">
                              Manager Review
                            </button>
                          } @else if (a.status === 'ManagerReviewSubmitted') {
                            <button 
                              type="button" 
                              (click)="onFinalizeAppraisal(a.id)"
                              class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all border-none cursor-pointer">
                              Finalize
                            </button>
                          } @else {
                            <span class="text-slate-400 font-bold text-[11px]">Completed</span>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <div class="p-4 border-t border-[#DCEBE7]">
              <app-workora-pagination
                [pageNumber]="pageIndex()"
                [totalPages]="totalPages()"
                [totalCount]="totalAppraisals()"
                [pageSize]="10"
                (pageChange)="onPageChange($event)"
              ></app-workora-pagination>
            </div>
          }
        </div>
      }

      <!-- ======================================================== -->
      <!-- TAB 2: OKR GOALS -->
      <!-- ======================================================== -->
      @if (activeTab() === 'goals') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-150">
          @for (goal of goals(); track goal.id) {
            <div class="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCEBE7] shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-3 mb-2">
                  <h3 class="font-extrabold text-sm text-[#063B39]">{{ goal.title }}</h3>
                  <span 
                    [ngClass]="goal.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'"
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold border">
                    {{ goal.status }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 mb-4">{{ goal.description }}</p>

                <!-- Progress Bar -->
                <div class="space-y-1.5 bg-[#F4F8F7] p-3.5 rounded-2xl border border-[#DCEBE7]/70">
                  <div class="flex items-center justify-between text-xs font-bold">
                    <span class="text-slate-500">Progress:</span>
                    <span class="text-[#0E6E68]">{{ goal.progressPercentage }}%</span>
                  </div>
                  <div class="w-full h-2 bg-[#DCEBE7] rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-[#0E6E68] to-[#3FA79B] rounded-full transition-all"
                      [style.width.%]="goal.progressPercentage">
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between pt-4 mt-4 border-t border-[#DCEBE7] text-xs">
                <span class="text-slate-400 font-mono">Due {{ goal.targetDate | date:'mediumDate' }}</span>
                <div class="flex items-center gap-1">
                  @if (goal.progressPercentage < 100) {
                    <button 
                      type="button" 
                      (click)="onIncrementGoalProgress(goal)"
                      class="px-2.5 py-1 rounded-lg bg-[#0E6E68]/10 hover:bg-[#0E6E68]/20 text-[#0E6E68] font-bold border-none cursor-pointer">
                      +25% Progress
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- ======================================================== -->
      <!-- TAB 3: CYCLES -->
      <!-- ======================================================== -->
      @if (activeTab() === 'cycles') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-150">
          @for (c of cycles(); track c.id) {
            <div class="bg-white rounded-3xl p-5 border border-[#DCEBE7] shadow-xs space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="font-extrabold text-sm text-[#063B39]">{{ c.name }}</h4>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{{ c.status }}</span>
              </div>
              <p class="text-xs text-slate-500 font-mono">{{ c.startDate | date:'mediumDate' }} – {{ c.endDate | date:'mediumDate' }}</p>
            </div>
          }
        </div>
      }

      <!-- Modals -->
      @if (isCreateAppraisalModalOpen()) {
        <app-create-appraisal-modal
          [employees]="employees()"
          [isSubmitting]="isSubmitting()"
          (closeModal)="isCreateAppraisalModalOpen.set(false)"
          (createAppraisal)="onSaveCreateAppraisal($event)"
        ></app-create-appraisal-modal>
      }

      @if (isReviewModalOpen()) {
        <app-appraisal-review-modal
          [appraisal]="selectedAppraisal()"
          [isManagerReview]="isManagerReviewMode()"
          [isSubmitting]="isSubmitting()"
          (closeModal)="isReviewModalOpen.set(false)"
          (submitReview)="onSaveReview($event)"
        ></app-appraisal-review-modal>
      }

      @if (isCreateGoalModalOpen()) {
        <app-goal-form-modal
          [employees]="employees()"
          [isSubmitting]="isSubmitting()"
          (closeModal)="isCreateGoalModalOpen.set(false)"
          (createGoal)="onSaveCreateGoal($event)"
        ></app-goal-form-modal>
      }

    </div>
  `
})
export class PerformancePageComponent implements OnInit {
  private readonly performanceRepo = inject(PerformanceApiRepository);
  private readonly empRepo = inject(EmployeeApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly activeTab = signal<PerformanceTab>('appraisals');

  readonly appraisals = signal<Appraisal[]>([]);
  readonly totalAppraisals = signal<number>(0);
  readonly pageIndex = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly isLoadingAppraisals = signal<boolean>(false);

  readonly goals = signal<Goal[]>([]);
  readonly cycles = signal<PerformanceCycle[]>([]);
  readonly employees = signal<Employee[]>([]);

  readonly isCreateAppraisalModalOpen = signal<boolean>(false);
  readonly isReviewModalOpen = signal<boolean>(false);
  readonly isCreateGoalModalOpen = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  readonly selectedAppraisal = signal<Appraisal | null>(null);
  readonly isManagerReviewMode = signal<boolean>(false);

  ngOnInit(): void {
    this.loadAppraisals();
    this.loadGoals();
    this.loadCycles();
    this.empRepo.getEmployees({ pageSize: 100 }).subscribe(p => this.employees.set(p.items));
  }

  loadAppraisals(): void {
    this.isLoadingAppraisals.set(true);
    this.performanceRepo.getAppraisals(this.pageIndex(), 10)
      .pipe(finalize(() => this.isLoadingAppraisals.set(false)))
      .subscribe({
        next: p => {
          this.appraisals.set(p.items);
          this.totalAppraisals.set(p.totalCount);
          this.totalPages.set(p.totalPages);
        },
        error: () => {}
      });
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.loadAppraisals();
  }

  loadGoals(): void {
    this.performanceRepo.getGoals(1).subscribe({
      next: g => this.goals.set(g),
      error: () => {}
    });
  }

  loadCycles(): void {
    this.performanceRepo.getCycles(1).subscribe({
      next: c => this.cycles.set(c),
      error: () => {}
    });
  }

  openSelfReviewModal(a: Appraisal): void {
    this.selectedAppraisal.set(a);
    this.isManagerReviewMode.set(false);
    this.isReviewModalOpen.set(true);
  }

  openManagerReviewModal(a: Appraisal): void {
    this.selectedAppraisal.set(a);
    this.isManagerReviewMode.set(true);
    this.isReviewModalOpen.set(true);
  }

  onSaveCreateAppraisal(params: CreateAppraisalParams): void {
    this.isSubmitting.set(true);
    this.performanceRepo.createAppraisal(params)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.isCreateAppraisalModalOpen.set(false);
          this.notificationService.showSuccess('Appraisal cycle initiated.');
          this.loadAppraisals();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to initiate appraisal.')
      });
  }

  onSaveReview(params: SubmitReviewParams): void {
    this.isSubmitting.set(true);
    const req$ = this.isManagerReviewMode()
      ? this.performanceRepo.submitManagerReview(params)
      : this.performanceRepo.submitSelfReview(params);

    req$.pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.isReviewModalOpen.set(false);
          this.notificationService.showSuccess('Performance assessment submitted.');
          this.loadAppraisals();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to submit review.')
      });
  }

  onFinalizeAppraisal(id: number): void {
    this.performanceRepo.finalizeAppraisal(id, 4.5).subscribe({
      next: () => {
        this.notificationService.showSuccess('Appraisal finalized with score 4.5/5.0.');
        this.loadAppraisals();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to finalize appraisal.')
    });
  }

  onSaveCreateGoal(params: CreateGoalParams): void {
    this.isSubmitting.set(true);
    this.performanceRepo.createGoal(params)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.isCreateGoalModalOpen.set(false);
          this.notificationService.showSuccess('OKR Goal created.');
          this.loadGoals();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to create goal.')
      });
  }

  onIncrementGoalProgress(goal: Goal): void {
    const nextProg = Math.min(100, goal.progressPercentage + 25);
    const status = nextProg >= 100 ? 'Completed' : 'InProgress';
    this.performanceRepo.updateGoalProgress({ goalId: goal.id, progressPercentage: nextProg, status }).subscribe({
      next: () => {
        this.notificationService.showSuccess(`Progress updated to ${nextProg}%.`);
        this.loadGoals();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to update progress.')
    });
  }
}
