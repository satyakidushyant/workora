import { Observable } from 'rxjs';
import { TaskItem, CreateTaskParams } from '../models/task.model';

export interface ITaskRepository {
  getTasks(companyId?: number, status?: string, priority?: string): Observable<TaskItem[]>;
  getMyTasks(status?: string): Observable<TaskItem[]>;
  getTaskById(id: number): Observable<TaskItem>;
  createTask(params: CreateTaskParams): Observable<TaskItem>;
  updateTaskStatus(id: number, status: string): Observable<TaskItem>;
  assignTask(id: number, assignedToEmployeeId: number): Observable<TaskItem>;
  deleteTask(id: number): Observable<boolean>;
}
