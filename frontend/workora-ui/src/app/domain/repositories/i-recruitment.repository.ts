import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
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
} from '../models/recruitment.model';

export interface IRecruitmentRepository {
  getJobs(pageNumber?: number, pageSize?: number, status?: string): Observable<PagedResponse<JobPosting>>;
  getJobById(id: number): Observable<JobPosting>;
  createJob(params: SaveJobPostingParams): Observable<JobPosting>;
  updateJob(params: SaveJobPostingParams): Observable<JobPosting>;
  publishJob(id: number): Observable<JobPosting>;
  closeJob(id: number): Observable<JobPosting>;
  
  getCandidates(pageNumber?: number, pageSize?: number, jobPostingId?: number, stage?: string): Observable<PagedResponse<Candidate>>;
  getCandidateById(id: number): Observable<CandidateDetail>;
  createCandidate(params: CreateCandidateParams): Observable<Candidate>;
  moveCandidateStage(id: number, stage: string): Observable<Candidate>;
  rejectCandidate(id: number, reason?: string): Observable<Candidate>;

  getInterviews(interviewerId?: number, candidateId?: number): Observable<Interview[]>;
  scheduleInterview(params: ScheduleInterviewParams): Observable<Interview>;
  submitInterviewFeedback(params: SubmitInterviewFeedbackParams): Observable<Interview>;

  createOffer(params: CreateJobOfferParams): Observable<JobOffer>;
  sendOffer(id: number): Observable<JobOffer>;
  acceptOffer(id: number): Observable<JobOffer>;
  declineOffer(id: number): Observable<JobOffer>;

  getPipeline(jobPostingId?: number, companyId?: number): Observable<RecruitmentPipeline>;
}
