export interface JobPostingDto {
  id: number;
  uuid: string;
  companyId: number;
  departmentId: number;
  departmentName?: string | null;
  title: string;
  description: string;
  requirements: string;
  employmentType: string;
  location: string;
  experienceYearsMin: number;
  experienceYearsMax: number;
  salaryMin?: number | null;
  salaryMax?: number | null;
  status: string;
  closingDate?: string | null;
  applicantsCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CandidateDto {
  id: number;
  uuid: string;
  jobPostingId: number;
  jobTitle?: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string | null;
  resumeUrl?: string | null;
  stage: string;
  rejectionReason?: string | null;
  appliedDate: string;
}

export interface InterviewDto {
  id: number;
  uuid: string;
  candidateId: number;
  candidateName?: string | null;
  interviewerEmployeeId: number;
  interviewerName?: string | null;
  scheduledAt: string;
  locationOrLink: string;
  status: string;
  feedback?: string | null;
  rating?: number | null;
  conductedAt?: string | null;
}

export interface JobOfferDto {
  id: number;
  uuid: string;
  candidateId: number;
  candidateName?: string | null;
  offeredSalary: number;
  joiningDate: string;
  expiryDate: string;
  status: string;
  sentAt?: string | null;
  respondedAt?: string | null;
  notes?: string | null;
}

export interface CandidateDetailDto extends CandidateDto {
  interviews: InterviewDto[];
  offers: JobOfferDto[];
}

export interface PipelineStageMetricsDto {
  stage: string;
  count: number;
}

export interface RecruitmentPipelineDto {
  stages: PipelineStageMetricsDto[];
  totalCandidates: number;
}

export interface CreateJobPostingRequestDto {
  companyId: number;
  departmentId: number;
  title: string;
  description: string;
  requirements: string;
  employmentType: string;
  location: string;
  experienceYearsMin: number;
  experienceYearsMax: number;
  salaryMin?: number | null;
  salaryMax?: number | null;
  closingDate?: string | null;
}

export interface UpdateJobPostingRequestDto {
  departmentId: number;
  title: string;
  description: string;
  requirements: string;
  employmentType: string;
  location: string;
  experienceYearsMin: number;
  experienceYearsMax: number;
  salaryMin?: number | null;
  salaryMax?: number | null;
  closingDate?: string | null;
}

export interface CreateCandidateRequestDto {
  jobPostingId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  resumeUrl?: string | null;
}

export interface MoveCandidateStageRequestDto {
  stage: string;
}

export interface RejectCandidateRequestDto {
  reason?: string | null;
}

export interface ScheduleInterviewRequestDto {
  candidateId: number;
  interviewerEmployeeId: number;
  scheduledAt: string;
  locationOrLink: string;
}

export interface SubmitInterviewFeedbackRequestDto {
  feedback: string;
  rating: number;
}

export interface CreateJobOfferRequestDto {
  candidateId: number;
  offeredSalary: number;
  joiningDate: string;
  expiryDate: string;
  notes?: string | null;
}
