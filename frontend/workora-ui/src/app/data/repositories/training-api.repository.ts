import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITrainingRepository } from '../../domain/repositories/i-training.repository';
import { TrainingProgram, TrainingEnrollment, CreateTrainingProgramParams, EnrollTrainingParams } from '../../domain/models/training.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import {
  TrainingProgramDto,
  TrainingEnrollmentDto,
  CreateTrainingProgramRequestDto,
  EnrollTrainingRequestDto
} from '../dtos/training.dto';
import { TrainingMapper } from '../mappers/training.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingApiRepository implements ITrainingRepository {
  private readonly baseUrl = `${environment.apiUrl}/training`;

  constructor(private readonly http: HttpClient) {}

  getPrograms(pageNumber = 1, pageSize = 10, companyId?: number): Observable<PagedResponse<TrainingProgram>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (companyId) params = params.set('companyId', companyId.toString());

    return this.http.get<ApiResponse<PagedResponse<TrainingProgramDto>>>(`${this.baseUrl}/programs`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch training programs.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(p => TrainingMapper.fromProgramDto(p)),
          totalPages: paged.totalPages || 1,
          totalCount: paged.totalCount || 0,
          pageIndex: paged.pageIndex || pageNumber,
          pageSize: paged.pageSize || pageSize,
          hasPreviousPage: paged.hasPreviousPage || false,
          hasNextPage: paged.hasNextPage || false
        };
      })
    );
  }

  getProgramById(id: number): Observable<TrainingProgram> {
    return this.http.get<ApiResponse<TrainingProgramDto>>(`${this.baseUrl}/programs/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch training program #${id}.`);
        }
        return TrainingMapper.fromProgramDto(response.data);
      })
    );
  }

  createProgram(params: CreateTrainingProgramParams): Observable<TrainingProgram> {
    const payload: CreateTrainingProgramRequestDto = {
      companyId: params.companyId,
      title: params.title,
      description: params.description,
      trainerName: params.trainerName,
      startDate: params.startDate,
      endDate: params.endDate,
      capacity: params.capacity
    };

    return this.http.post<ApiResponse<TrainingProgramDto>>(`${this.baseUrl}/programs`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create training program.');
        }
        return TrainingMapper.fromProgramDto(response.data);
      })
    );
  }

  enroll(params: EnrollTrainingParams): Observable<TrainingEnrollment> {
    const payload: EnrollTrainingRequestDto = {
      trainingProgramId: params.trainingProgramId,
      employeeId: params.employeeId
    };

    return this.http.post<ApiResponse<TrainingEnrollmentDto>>(`${this.baseUrl}/enroll`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to enroll employee in training.');
        }
        return TrainingMapper.fromEnrollmentDto(response.data);
      })
    );
  }

  completeEnrollment(enrollmentId: number): Observable<TrainingEnrollment> {
    return this.http.patch<ApiResponse<TrainingEnrollmentDto>>(`${this.baseUrl}/enrollments/${enrollmentId}/complete`, {}).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to mark enrollment as completed.');
        }
        return TrainingMapper.fromEnrollmentDto(response.data);
      })
    );
  }
}
