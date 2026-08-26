export interface JobPosting {
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

export interface Candidate {
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
  stage: string; // 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Hired' | 'Rejected'
  rejectionReason?: string | null;
  appliedDate: string;
}

export interface Interview {
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

export interface JobOffer {
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

export interface CandidateDetail extends Candidate {
  interviews: Interview[];
  offers: JobOffer[];
}

export interface PipelineStageMetrics {
  stage: string;
  count: number;
}

export interface RecruitmentPipeline {
  stages: PipelineStageMetrics[];
  totalCandidates: number;
}

export interface SaveJobPostingParams {
  id?: number;
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

export interface CreateCandidateParams {
  jobPostingId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  resumeUrl?: string | null;
}

export interface ScheduleInterviewParams {
  candidateId: number;
  interviewerEmployeeId: number;
  scheduledAt: string;
  locationOrLink: string;
}

export interface SubmitInterviewFeedbackParams {
  interviewId: number;
  feedback: string;
  rating: number;
}

export interface CreateJobOfferParams {
  candidateId: number;
  offeredSalary: number;
  joiningDate: string;
  expiryDate: string;
  notes?: string | null;
}
