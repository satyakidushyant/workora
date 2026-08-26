import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
import {
  Appraisal,
  Goal,
  PerformanceCycle,
  CreateAppraisalParams,
  SubmitReviewParams,
  CreateGoalParams,
  UpdateGoalProgressParams
} from '../models/performance.model';

export interface IPerformanceRepository {
  getAppraisals(pageNumber?: number, pageSize?: number, employeeId?: number): Observable<PagedResponse<Appraisal>>;
  getAppraisalById(id: number): Observable<Appraisal>;
  createAppraisal(params: CreateAppraisalParams): Observable<Appraisal>;
  submitSelfReview(params: SubmitReviewParams): Observable<Appraisal>;
  submitManagerReview(params: SubmitReviewParams): Observable<Appraisal>;
  finalizeAppraisal(appraisalId: number, finalScore: number): Observable<Appraisal>;

  getGoals(employeeId: number, status?: string): Observable<Goal[]>;
  createGoal(params: CreateGoalParams): Observable<Goal>;
  updateGoalProgress(params: UpdateGoalProgressParams): Observable<Goal>;

  getCycles(companyId: number): Observable<PerformanceCycle[]>;
  createCycle(companyId: number, name: string, startDate: string, endDate: string): Observable<PerformanceCycle>;
}
