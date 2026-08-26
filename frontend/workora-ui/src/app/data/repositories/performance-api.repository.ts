import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPerformanceRepository } from '../../domain/repositories/i-performance.repository';
import {
  Appraisal,
  Goal,
  PerformanceCycle,
  CreateAppraisalParams,
  SubmitReviewParams,
  CreateGoalParams,
  UpdateGoalProgressParams
} from '../../domain/models/performance.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import {
  AppraisalDto,
  GoalDto,
  PerformanceCycleDto,
  CreateAppraisalRequestDto,
  SubmitSelfReviewRequestDto,
  SubmitManagerReviewRequestDto,
  FinalizeAppraisalRequestDto,
  CreateGoalRequestDto,
  UpdateGoalProgressRequestDto,
  CreatePerformanceCycleRequestDto
} from '../dtos/performance.dto';
import { PerformanceMapper } from '../mappers/performance.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerformanceApiRepository implements IPerformanceRepository {
  private readonly baseUrl = `${environment.apiUrl}/performance`;

  constructor(private readonly http: HttpClient) {}

  getAppraisals(pageNumber = 1, pageSize = 10, employeeId?: number): Observable<PagedResponse<Appraisal>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (employeeId) params = params.set('employeeId', employeeId.toString());

    return this.http.get<ApiResponse<PagedResponse<AppraisalDto>>>(`${this.baseUrl}/appraisals`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch appraisals.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(a => PerformanceMapper.fromAppraisalDto(a)),
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

  getAppraisalById(id: number): Observable<Appraisal> {
    return this.http.get<ApiResponse<AppraisalDto>>(`${this.baseUrl}/appraisals/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch appraisal #${id}.`);
        }
        return PerformanceMapper.fromAppraisalDto(response.data);
      })
    );
  }

  createAppraisal(params: CreateAppraisalParams): Observable<Appraisal> {
    const payload: CreateAppraisalRequestDto = {
      employeeId: params.employeeId,
      reviewerEmployeeId: params.reviewerEmployeeId,
      period: params.period,
      year: params.year
    };

    return this.http.post<ApiResponse<AppraisalDto>>(`${this.baseUrl}/appraisals`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create appraisal review.');
        }
        return PerformanceMapper.fromAppraisalDto(response.data);
      })
    );
  }

  submitSelfReview(params: SubmitReviewParams): Observable<Appraisal> {
    const payload: SubmitSelfReviewRequestDto = {
      comments: params.comments,
      rating: params.rating
    };

    return this.http.put<ApiResponse<AppraisalDto>>(`${this.baseUrl}/appraisals/${params.appraisalId}/self-review`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to submit self-review.');
        }
        return PerformanceMapper.fromAppraisalDto(response.data);
      })
    );
  }

  submitManagerReview(params: SubmitReviewParams): Observable<Appraisal> {
    const payload: SubmitManagerReviewRequestDto = {
      comments: params.comments,
      rating: params.rating
    };

    return this.http.put<ApiResponse<AppraisalDto>>(`${this.baseUrl}/appraisals/${params.appraisalId}/manager-review`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to submit manager evaluation.');
        }
        return PerformanceMapper.fromAppraisalDto(response.data);
      })
    );
  }

  finalizeAppraisal(appraisalId: number, finalScore: number): Observable<Appraisal> {
    const payload: FinalizeAppraisalRequestDto = { finalScore };
    return this.http.post<ApiResponse<AppraisalDto>>(`${this.baseUrl}/appraisals/${appraisalId}/finalize`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to finalize appraisal review.');
        }
        return PerformanceMapper.fromAppraisalDto(response.data);
      })
    );
  }

  getGoals(employeeId: number, status?: string): Observable<Goal[]> {
    let params = new HttpParams().set('employeeId', employeeId.toString());
    if (status) params = params.set('status', status);

    return this.http.get<ApiResponse<GoalDto[]>>(`${this.baseUrl}/goals`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch employee goals.');
        }
        return response.data.map(g => PerformanceMapper.fromGoalDto(g));
      })
    );
  }

  createGoal(params: CreateGoalParams): Observable<Goal> {
    const payload: CreateGoalRequestDto = {
      employeeId: params.employeeId,
      title: params.title,
      description: params.description,
      targetDate: params.targetDate
    };

    return this.http.post<ApiResponse<GoalDto>>(`${this.baseUrl}/goals`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create goal.');
        }
        return PerformanceMapper.fromGoalDto(response.data);
      })
    );
  }

  updateGoalProgress(params: UpdateGoalProgressParams): Observable<Goal> {
    const payload: UpdateGoalProgressRequestDto = {
      progressPercentage: params.progressPercentage,
      status: params.status
    };

    return this.http.put<ApiResponse<GoalDto>>(`${this.baseUrl}/goals/${params.goalId}/progress`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update goal progress.');
        }
        return PerformanceMapper.fromGoalDto(response.data);
      })
    );
  }

  getCycles(companyId = 1): Observable<PerformanceCycle[]> {
    const params = new HttpParams().set('companyId', companyId.toString());
    return this.http.get<ApiResponse<PerformanceCycleDto[]>>(`${this.baseUrl}/cycles`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch performance cycles.');
        }
        return response.data.map(c => PerformanceMapper.fromCycleDto(c));
      })
    );
  }

  createCycle(companyId: number, name: string, startDate: string, endDate: string): Observable<PerformanceCycle> {
    const payload: CreatePerformanceCycleRequestDto = { companyId, name, startDate, endDate };
    return this.http.post<ApiResponse<PerformanceCycleDto>>(`${this.baseUrl}/cycles`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create performance cycle.');
        }
        return PerformanceMapper.fromCycleDto(response.data);
      })
    );
  }
}
