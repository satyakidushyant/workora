import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TaskApiRepository } from '../../../../data/repositories/task-api.repository';
import { EmployeeApiRepository } from '../../../../data/repositories/employee-api.repository';
import { TaskItem, CreateTaskParams } from '../../../../domain/models/task.model';
import { Employee } from '../../../../domain/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { TaskFormModalComponent } from '../components/task-form-modal.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSkeletonComponent,
    TaskFormModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">checklist</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Task Delegation &amp; Workflows
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Assign operational action items, track deliverables, and manage deadlines.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center bg-white p-1 rounded-2xl border border-[#DCEBE7] shadow-2xs">
            <button 
              type="button" 
              (click)="isMyTasksView.set(false)"
              [ngClass]="!isMyTasksView() ? 'bg-[#0E6E68] text-white font-bold' : 'text-slate-600'"
              class="px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent">
              Team Tasks
            </button>
            <button 
              type="button" 
              (click)="isMyTasksView.set(true)"
              [ngClass]="isMyTasksView() ? 'bg-[#0E6E68] text-white font-bold' : 'text-slate-600'"
              class="px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer border-none bg-transparent">
              My Tasks
            </button>
          </div>

          <button 
            type="button" 
            (click)="isCreateModalOpen.set(true)"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
            <span class="material-symbols-outlined text-base">add</span>
            <span>Assign Task</span>
          </button>
        </div>
      </div>

      <!-- Kanban Columns -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (i of [1,2,3]; track i) {
            <app-workora-skeleton type="card"></app-workora-skeleton>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Column 1: To Do -->
          <div class="bg-[#F4F8F7] p-4 sm:p-5 rounded-3xl border border-[#DCEBE7] space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-slate-400"></span>
                <h3 class="font-extrabold text-sm text-[#063B39]">To Do</h3>
              </div>
              <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-slate-600 border border-[#DCEBE7]">
                {{ getTasksByStatus('ToDo').length }}
              </span>
            </div>

            <div class="space-y-3">
              @for (task of getTasksByStatus('ToDo'); track task.id) {
                <div class="bg-white p-4 rounded-2xl border border-[#DCEBE7] shadow-2xs space-y-2.5 hover:shadow-md transition-all">
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="font-bold text-xs text-[#063B39]">{{ task.title }}</h4>
                    <span 
                      [ngClass]="{
                        'text-rose-600 font-extrabold': task.priority === 'Critical' || task.priority === 'High',
                        'text-slate-500 font-semibold': task.priority === 'Medium' || task.priority === 'Low'
                      }"
                      class="text-[10px]">
                      {{ task.priority }}
                    </span>
                  </div>
                  @if (task.description) {
                    <p class="text-[11px] text-slate-500 line-clamp-2">{{ task.description }}</p>
                  }
                  <div class="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-[#DCEBE7]/60">
                    <span>Assigned: <strong class="text-slate-700">{{ task.assignedToEmployeeName }}</strong></span>
                    <button 
                      type="button" 
                      (click)="onUpdateStatus(task.id, 'InProgress')"
                      class="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border-none cursor-pointer">
                      Start →
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Column 2: In Progress -->
          <div class="bg-[#F4F8F7] p-4 sm:p-5 rounded-3xl border border-[#DCEBE7] space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                <h3 class="font-extrabold text-sm text-[#063B39]">In Progress</h3>
              </div>
              <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-slate-600 border border-[#DCEBE7]">
                {{ getTasksByStatus('InProgress').length }}
              </span>
            </div>

            <div class="space-y-3">
              @for (task of getTasksByStatus('InProgress'); track task.id) {
                <div class="bg-white p-4 rounded-2xl border border-[#DCEBE7] shadow-2xs space-y-2.5 hover:shadow-md transition-all">
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="font-bold text-xs text-[#063B39]">{{ task.title }}</h4>
                    <span class="text-[10px] font-bold text-blue-600">{{ task.priority }}</span>
                  </div>
                  @if (task.description) {
                    <p class="text-[11px] text-slate-500 line-clamp-2">{{ task.description }}</p>
                  }
                  <div class="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-[#DCEBE7]/60">
                    <span>Due: {{ task.dueDate | date:'shortDate' }}</span>
                    <button 
                      type="button" 
                      (click)="onUpdateStatus(task.id, 'Done')"
                      class="px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold border-none cursor-pointer">
                      Complete ✓
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Column 3: Done -->
          <div class="bg-[#F4F8F7] p-4 sm:p-5 rounded-3xl border border-[#DCEBE7] space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                <h3 class="font-extrabold text-sm text-[#063B39]">Done</h3>
              </div>
              <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-slate-600 border border-[#DCEBE7]">
                {{ getTasksByStatus('Done').length }}
              </span>
            </div>

            <div class="space-y-3">
              @for (task of getTasksByStatus('Done'); track task.id) {
                <div class="bg-white p-4 rounded-2xl border border-[#DCEBE7] shadow-2xs space-y-2.5 opacity-80">
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="font-bold text-xs text-slate-500 line-through">{{ task.title }}</h4>
                    <span class="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                  </div>
                  <div class="text-[10px] text-slate-400">
                    Completed by {{ task.assignedToEmployeeName }}
                  </div>
                </div>
              }
            </div>
          </div>

        </div>
      }

      <!-- Modals -->
      @if (isCreateModalOpen()) {
        <app-task-form-modal
          [employees]="employees()"
          [isSubmitting]="isSubmitting()"
          (closeModal)="isCreateModalOpen.set(false)"
          (createTask)="onSaveTask($event)"
        ></app-task-form-modal>
      }

    </div>
  `
})
export class TasksPageComponent implements OnInit {
  private readonly taskRepo = inject(TaskApiRepository);
  private readonly empRepo = inject(EmployeeApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly tasks = signal<TaskItem[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly isMyTasksView = signal<boolean>(false);
  readonly isCreateModalOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.loadTasks();
    this.empRepo.getEmployees({ pageSize: 100 }).subscribe(p => this.employees.set(p.items));
  }

  loadTasks(): void {
    this.isLoading.set(true);
    const req$ = this.isMyTasksView()
      ? this.taskRepo.getMyTasks()
      : this.taskRepo.getTasks(1);

    req$.pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: t => this.tasks.set(t),
        error: () => {}
      });
  }

  getTasksByStatus(status: string): TaskItem[] {
    return this.tasks().filter(t => t.status === status);
  }

  onSaveTask(params: CreateTaskParams): void {
    this.isSubmitting.set(true);
    this.taskRepo.createTask(params)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.isCreateModalOpen.set(false);
          this.notificationService.showSuccess('Task assigned.');
          this.loadTasks();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to create task.')
      });
  }

  onUpdateStatus(id: number, status: string): void {
    this.taskRepo.updateTaskStatus(id, status).subscribe({
      next: () => {
        this.notificationService.showSuccess(`Task moved to ${status}.`);
        this.loadTasks();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to update task status.')
    });
  }
}
