import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITaskRepository } from '../../domain/repositories/i-task.repository';
import { TaskItem, CreateTaskParams } from '../../domain/models/task.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import { TaskItemDto, CreateTaskRequestDto } from '../dtos/task.dto';
import { TaskMapper } from '../mappers/task.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskApiRepository implements ITaskRepository {
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  constructor(private readonly http: HttpClient) {}

  getTasks(companyId?: number, status?: string, priority?: string): Observable<TaskItem[]> {
    let params = new HttpParams();
    if (companyId) params = params.set('companyId', companyId.toString());
    if (status) params = params.set('status', status);
    if (priority) params = params.set('priority', priority);

    return this.http.get<ApiResponse<TaskItemDto[]>>(this.baseUrl, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch tasks.');
        }
        return response.data.map(t => TaskMapper.fromTaskDto(t));
      })
    );
  }

  getMyTasks(status?: string): Observable<TaskItem[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);

    return this.http.get<ApiResponse<TaskItemDto[]>>(`${this.baseUrl}/me`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch my tasks.');
        }
        return response.data.map(t => TaskMapper.fromTaskDto(t));
      })
    );
  }

  getTaskById(id: number): Observable<TaskItem> {
    return this.http.get<ApiResponse<TaskItemDto>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch task #${id}.`);
        }
        return TaskMapper.fromTaskDto(response.data);
      })
    );
  }

  createTask(params: CreateTaskParams): Observable<TaskItem> {
    const payload: CreateTaskRequestDto = {
      title: params.title,
      description: params.description || null,
      assignedToEmployeeId: params.assignedToEmployeeId,
      priority: params.priority,
      dueDate: params.dueDate
    };

    return this.http.post<ApiResponse<TaskItemDto>>(this.baseUrl, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create task.');
        }
        return TaskMapper.fromTaskDto(response.data);
      })
    );
  }

  updateTaskStatus(id: number, status: string): Observable<TaskItem> {
    return this.http.patch<ApiResponse<TaskItemDto>>(`${this.baseUrl}/${id}/status`, status).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update task status.');
        }
        return TaskMapper.fromTaskDto(response.data);
      })
    );
  }

  assignTask(id: number, assignedToEmployeeId: number): Observable<TaskItem> {
    return this.http.patch<ApiResponse<TaskItemDto>>(`${this.baseUrl}/${id}/assign`, assignedToEmployeeId).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to assign task.');
        }
        return TaskMapper.fromTaskDto(response.data);
      })
    );
  }

  deleteTask(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.isSuccess && !!response.data)
    );
  }
}
