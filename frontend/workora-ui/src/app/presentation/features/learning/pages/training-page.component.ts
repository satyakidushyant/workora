import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TrainingApiRepository } from '../../../../data/repositories/training-api.repository';
import { EmployeeApiRepository } from '../../../../data/repositories/employee-api.repository';
import { TrainingProgram, CreateTrainingProgramParams, EnrollTrainingParams } from '../../../../domain/models/training.model';
import { Employee } from '../../../../domain/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { TrainingFormModalComponent } from '../components/training-form-modal.component';
import { TrainingEnrollModalComponent } from '../components/training-enroll-modal.component';

@Component({
  selector: 'app-training-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraEmptyStateComponent,
    TrainingFormModalComponent,
    TrainingEnrollModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">school</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Learning &amp; Professional Development
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Explore corporate training programs, upskill staff, and manage workshop enrollments.
          </p>
        </div>

        <button 
          type="button" 
          (click)="isCreateModalOpen.set(true)"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
          <span class="material-symbols-outlined text-base">add</span>
          <span>Create Course</span>
        </button>
      </div>

      <!-- Training Programs Grid -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (i of [1,2,3]; track i) {
            <app-workora-skeleton type="card"></app-workora-skeleton>
          }
        </div>
      } @else if (programs().length === 0) {
        <div class="bg-white rounded-3xl p-12 border border-[#DCEBE7] shadow-xs">
          <app-workora-empty-state 
            icon="school" 
            title="No Training Programs"
            description="Create your first corporate workshop or course."
            actionLabel="Create Course"
            (actionClick)="isCreateModalOpen.set(true)"
          ></app-workora-empty-state>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (prog of programs(); track prog.id) {
            <div class="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCEBE7] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div class="flex items-start justify-between gap-3 mb-2">
                  <h3 class="font-extrabold text-sm text-[#063B39]">{{ prog.title }}</h3>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    Active
                  </span>
                </div>
                <p class="text-xs text-slate-500 font-medium mb-3">Instructor: <strong class="text-slate-700">{{ prog.trainerName }}</strong></p>

                <!-- Capacity & Dates Box -->
                <div class="my-3 p-3.5 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]/70 space-y-2 text-xs">
                  <div class="flex items-center justify-between text-slate-600">
                    <span>Schedule:</span>
                    <span class="font-mono font-bold text-slate-800">{{ prog.startDate | date:'MMM d' }} – {{ prog.endDate | date:'MMM d' }}</span>
                  </div>
                  
                  <div class="space-y-1">
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="text-slate-500 font-bold">Enrollment Capacity:</span>
                      <span class="font-bold text-[#0E6E68]">{{ prog.enrolledCount }} / {{ prog.capacity }} Seats</span>
                    </div>
                    <div class="w-full h-1.5 bg-[#DCEBE7] rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-[#0E6E68] rounded-full"
                        [style.width.%]="(prog.enrolledCount / (prog.capacity || 1)) * 100">
                      </div>
                    </div>
                  </div>
                </div>

                <p class="text-xs text-slate-600 line-clamp-3">{{ prog.description }}</p>
              </div>

              <!-- Actions -->
              <div class="pt-4 mt-4 border-t border-[#DCEBE7]">
                <button 
                  type="button" 
                  (click)="openEnrollModal(prog)"
                  class="w-full py-2.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer border-none">
                  <span class="material-symbols-outlined text-base">how_to_reg</span>
                  <span>Enroll Staff</span>
                </button>
              </div>
            </div>
          }
        </div>

        <div class="bg-white rounded-2xl p-4 border border-[#DCEBE7]">
          <app-workora-pagination
            [pageNumber]="pageIndex()"
            [totalPages]="totalPages()"
            [totalCount]="totalPrograms()"
            [pageSize]="pageSize"
            (pageChange)="onPageChange($event)"
          ></app-workora-pagination>
        </div>
      }

      <!-- Modals -->
      @if (isCreateModalOpen()) {
        <app-training-form-modal
          [isSubmitting]="isSubmitting()"
          (closeModal)="isCreateModalOpen.set(false)"
          (createProgram)="onSaveCreateProgram($event)"
        ></app-training-form-modal>
      }

      @if (isEnrollModalOpen()) {
        <app-training-enroll-modal
          [program]="selectedProgram()"
          [employees]="employees()"
          [isSubmitting]="isSubmitting()"
          (closeModal)="isEnrollModalOpen.set(false)"
          (enroll)="onSaveEnroll($event)"
        ></app-training-enroll-modal>
      }

    </div>
  `
})
export class TrainingPageComponent implements OnInit {
  private readonly trainingRepo = inject(TrainingApiRepository);
  private readonly empRepo = inject(EmployeeApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly programs = signal<TrainingProgram[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly totalPrograms = signal<number>(0);
  readonly pageIndex = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly isLoading = signal<boolean>(false);
  readonly pageSize = 9;

  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isEnrollModalOpen = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  readonly selectedProgram = signal<TrainingProgram | null>(null);

  ngOnInit(): void {
    this.loadPrograms();
    this.empRepo.getEmployees({ pageSize: 100 }).subscribe(p => this.employees.set(p.items));
  }

  loadPrograms(): void {
    this.isLoading.set(true);
    this.trainingRepo.getPrograms(this.pageIndex(), this.pageSize)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: p => {
          this.programs.set(p.items);
          this.totalPrograms.set(p.totalCount);
          this.totalPages.set(p.totalPages);
        },
        error: () => {}
      });
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.loadPrograms();
  }

  openEnrollModal(prog: TrainingProgram): void {
    this.selectedProgram.set(prog);
    this.isEnrollModalOpen.set(true);
  }

  onSaveCreateProgram(params: CreateTrainingProgramParams): void {
    this.isSubmitting.set(true);
    this.trainingRepo.createProgram(params)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.isCreateModalOpen.set(false);
          this.notificationService.showSuccess('Training course program created.');
          this.loadPrograms();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to create training program.')
      });
  }

  onSaveEnroll(params: EnrollTrainingParams): void {
    this.isSubmitting.set(true);
    this.trainingRepo.enroll(params)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.isEnrollModalOpen.set(false);
          this.notificationService.showSuccess('Employee enrolled in training course.');
          this.loadPrograms();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to enroll in training.')
      });
  }
}
