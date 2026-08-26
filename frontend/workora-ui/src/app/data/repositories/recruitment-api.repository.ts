import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IRecruitmentRepository } from '../../domain/repositories/i-recruitment.repository';
import {
  JobPosting,
  Candidate,
  CandidateDetail,
  Interview,
  JobOffer,
  RecruitmentPipeline,
  SaveJobPostingParams,
  CreateCandidateParams,
  ScheduleInterviewParams,
  SubmitInterviewFeedbackParams,
  CreateJobOfferParams
} from '../../domain/models/recruitment.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import {
  JobPostingDto,
  CandidateDto,
  InterviewDto,
  JobOfferDto,
  CandidateDetailDto,
  RecruitmentPipelineDto,
  CreateJobPostingRequestDto,
  UpdateJobPostingRequestDto,
  CreateCandidateRequestDto,
  ScheduleInterviewRequestDto,
  SubmitInterviewFeedbackRequestDto,
  CreateJobOfferRequestDto
} from '../dtos/recruitment.dto';
import { RecruitmentMapper } from '../mappers/recruitment.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecruitmentApiRepository implements IRecruitmentRepository {
  private readonly baseUrl = `${environment.apiUrl}/recruitment`;

  constructor(private readonly http: HttpClient) {}

  getJobs(pageNumber = 1, pageSize = 10, status?: string): Observable<PagedResponse<JobPosting>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (status) params = params.set('status', status);

    return this.http.get<ApiResponse<PagedResponse<JobPostingDto>>>(`${this.baseUrl}/jobs`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch job postings.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(j => RecruitmentMapper.fromJobDto(j)),
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

  getJobById(id: number): Observable<JobPosting> {
    return this.http.get<ApiResponse<JobPostingDto>>(`${this.baseUrl}/jobs/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch job posting #${id}.`);
        }
        return RecruitmentMapper.fromJobDto(response.data);
      })
    );
  }

  createJob(params: SaveJobPostingParams): Observable<JobPosting> {
    const payload: CreateJobPostingRequestDto = {
      companyId: params.companyId,
      departmentId: params.departmentId,
      title: params.title,
      description: params.description,
      requirements: params.requirements,
      employmentType: params.employmentType,
      location: params.location,
      experienceYearsMin: params.experienceYearsMin,
      experienceYearsMax: params.experienceYearsMax,
      salaryMin: params.salaryMin || null,
      salaryMax: params.salaryMax || null,
      closingDate: params.closingDate || null
    };

    return this.http.post<ApiResponse<JobPostingDto>>(`${this.baseUrl}/jobs`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create job posting.');
        }
        return RecruitmentMapper.fromJobDto(response.data);
      })
    );
  }

  updateJob(params: SaveJobPostingParams): Observable<JobPosting> {
    const payload: UpdateJobPostingRequestDto = {
      departmentId: params.departmentId,
      title: params.title,
      description: params.description,
      requirements: params.requirements,
      employmentType: params.employmentType,
      location: params.location,
      experienceYearsMin: params.experienceYearsMin,
      experienceYearsMax: params.experienceYearsMax,
      salaryMin: params.salaryMin || null,
      salaryMax: params.salaryMax || null,
      closingDate: params.closingDate || null
    };

    return this.http.put<ApiResponse<JobPostingDto>>(`${this.baseUrl}/jobs/${params.id}`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update job posting.');
        }
        return RecruitmentMapper.fromJobDto(response.data);
      })
    );
  }

  publishJob(id: number): Observable<JobPosting> {
    return this.http.patch<ApiResponse<JobPostingDto>>(`${this.baseUrl}/jobs/${id}/publish`, {}).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to publish job.');
        }
        return RecruitmentMapper.fromJobDto(response.data);
      })
    );
  }

  closeJob(id: number): Observable<JobPosting> {
    return this.http.patch<ApiResponse<JobPostingDto>>(`${this.baseUrl}/jobs/${id}/close`, {}).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to close job.');
        }
        return RecruitmentMapper.fromJobDto(response.data);
      })
    );
  }

  getCandidates(pageNumber = 1, pageSize = 20, jobPostingId?: number, stage?: string): Observable<PagedResponse<Candidate>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (jobPostingId) params = params.set('jobPostingId', jobPostingId.toString());
    if (stage) params = params.set('stage', stage);

    return this.http.get<ApiResponse<PagedResponse<CandidateDto>>>(`${this.baseUrl}/candidates`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch candidate applicants.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(c => RecruitmentMapper.fromCandidateDto(c)),
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

  getCandidateById(id: number): Observable<CandidateDetail> {
    return this.http.get<ApiResponse<CandidateDetailDto>>(`${this.baseUrl}/candidates/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch candidate #${id}.`);
        }
        return RecruitmentMapper.fromCandidateDetailDto(response.data);
      })
    );
  }

  createCandidate(params: CreateCandidateParams): Observable<Candidate> {
    const payload: CreateCandidateRequestDto = {
      jobPostingId: params.jobPostingId,
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      phone: params.phone || null,
      resumeUrl: params.resumeUrl || null
    };

    return this.http.post<ApiResponse<CandidateDto>>(`${this.baseUrl}/candidates`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create candidate application.');
        }
        return RecruitmentMapper.fromCandidateDto(response.data);
      })
    );
  }

  moveCandidateStage(id: number, stage: string): Observable<Candidate> {
    return this.http.patch<ApiResponse<CandidateDto>>(`${this.baseUrl}/candidates/${id}/stage`, { stage }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update candidate pipeline stage.');
        }
        return RecruitmentMapper.fromCandidateDto(response.data);
      })
    );
  }

  rejectCandidate(id: number, reason?: string): Observable<Candidate> {
    return this.http.patch<ApiResponse<CandidateDto>>(`${this.baseUrl}/candidates/${id}/reject`, { reason: reason || null }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to reject candidate.');
        }
        return RecruitmentMapper.fromCandidateDto(response.data);
      })
    );
  }

  getInterviews(interviewerId?: number, candidateId?: number): Observable<Interview[]> {
    let params = new HttpParams();
    if (interviewerId) params = params.set('interviewerId', interviewerId.toString());
    if (candidateId) params = params.set('candidateId', candidateId.toString());

    return this.http.get<ApiResponse<InterviewDto[]>>(`${this.baseUrl}/interviews`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch interviews.');
        }
        return response.data.map(i => RecruitmentMapper.fromInterviewDto(i));
      })
    );
  }

  scheduleInterview(params: ScheduleInterviewParams): Observable<Interview> {
    const payload: ScheduleInterviewRequestDto = {
      candidateId: params.candidateId,
      interviewerEmployeeId: params.interviewerEmployeeId,
      scheduledAt: params.scheduledAt,
      locationOrLink: params.locationOrLink
    };

    return this.http.post<ApiResponse<InterviewDto>>(`${this.baseUrl}/interviews`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to schedule interview round.');
        }
        return RecruitmentMapper.fromInterviewDto(response.data);
      })
    );
  }

  submitInterviewFeedback(params: SubmitInterviewFeedbackParams): Observable<Interview> {
    const payload: SubmitInterviewFeedbackRequestDto = {
      feedback: params.feedback,
      rating: params.rating
    };

    return this.http.post<ApiResponse<InterviewDto>>(`${this.baseUrl}/interviews/${params.interviewId}/feedback`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to submit interview feedback.');
        }
        return RecruitmentMapper.fromInterviewDto(response.data);
      })
    );
  }

  createOffer(params: CreateJobOfferParams): Observable<JobOffer> {
    const payload: CreateJobOfferRequestDto = {
      candidateId: params.candidateId,
      offeredSalary: params.offeredSalary,
      joiningDate: params.joiningDate,
      expiryDate: params.expiryDate,
      notes: params.notes || null
    };

    return this.http.post<ApiResponse<JobOfferDto>>(`${this.baseUrl}/offers`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create job offer.');
        }
        return RecruitmentMapper.fromJobOfferDto(response.data);
      })
    );
  }

  sendOffer(id: number): Observable<JobOffer> {
    return this.http.patch<ApiResponse<JobOfferDto>>(`${this.baseUrl}/offers/${id}/send`, {}).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to dispatch offer letter.');
        }
        return RecruitmentMapper.fromJobOfferDto(response.data);
      })
    );
  }

  acceptOffer(id: number): Observable<JobOffer> {
    return this.http.patch<ApiResponse<JobOfferDto>>(`${this.baseUrl}/offers/${id}/accept`, {}).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to accept job offer.');
        }
        return RecruitmentMapper.fromJobOfferDto(response.data);
      })
    );
  }

  declineOffer(id: number): Observable<JobOffer> {
    return this.http.patch<ApiResponse<JobOfferDto>>(`${this.baseUrl}/offers/${id}/decline`, {}).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to decline job offer.');
        }
        return RecruitmentMapper.fromJobOfferDto(response.data);
      })
    );
  }

  getPipeline(jobPostingId?: number, companyId?: number): Observable<RecruitmentPipeline> {
    let params = new HttpParams();
    if (jobPostingId) params = params.set('jobPostingId', jobPostingId.toString());
    if (companyId) params = params.set('companyId', companyId.toString());

    return this.http.get<ApiResponse<RecruitmentPipelineDto>>(`${this.baseUrl}/pipeline`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch pipeline metrics.');
        }
        return RecruitmentMapper.fromPipelineDto(response.data);
      })
    );
  }
}
