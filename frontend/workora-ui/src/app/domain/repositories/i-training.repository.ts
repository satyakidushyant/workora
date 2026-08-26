import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
import { TrainingProgram, TrainingEnrollment, CreateTrainingProgramParams, EnrollTrainingParams } from '../models/training.model';

export interface ITrainingRepository {
  getPrograms(pageNumber?: number, pageSize?: number, companyId?: number): Observable<PagedResponse<TrainingProgram>>;
  getProgramById(id: number): Observable<TrainingProgram>;
  createProgram(params: CreateTrainingProgramParams): Observable<TrainingProgram>;
  enroll(params: EnrollTrainingParams): Observable<TrainingEnrollment>;
  completeEnrollment(enrollmentId: number): Observable<TrainingEnrollment>;
}
