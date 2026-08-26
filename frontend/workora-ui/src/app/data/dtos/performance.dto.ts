export interface AppraisalDto {
  id: number;
  uuid: string;
  employeeId: number;
  employeeName?: string | null;
  employeeCode?: string | null;
  reviewerEmployeeId: number;
  reviewerName?: string | null;
  period: string;
  year: number;
  status: string;
  selfReviewComments?: string | null;
  selfReviewRating?: number | null;
  managerReviewComments?: string | null;
  managerReviewRating?: number | null;
  finalScore?: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface GoalDto {
  id: number;
  uuid: string;
  employeeId: number;
  employeeName?: string | null;
  title: string;
  description: string;
  targetDate: string;
  progressPercentage: number;
  status: string;
  isActive: boolean;
  createdAt: string;
}

export interface PerformanceCycleDto {
  id: number;
  companyId: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface CreateAppraisalRequestDto {
  employeeId: number;
  reviewerEmployeeId: number;
  period: string;
  year: number;
}

export interface SubmitSelfReviewRequestDto {
  comments: string;
  rating: number;
}

export interface SubmitManagerReviewRequestDto {
  comments: string;
  rating: number;
}

export interface FinalizeAppraisalRequestDto {
  finalScore: number;
}

export interface CreateGoalRequestDto {
  employeeId: number;
  title: string;
  description: string;
  targetDate: string;
}

export interface UpdateGoalProgressRequestDto {
  progressPercentage: number;
  status: string;
}

export interface CreatePerformanceCycleRequestDto {
  companyId: number;
  name: string;
  startDate: string;
  endDate: string;
}
