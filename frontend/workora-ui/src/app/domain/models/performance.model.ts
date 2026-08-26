export interface Appraisal {
  id: number;
  uuid: string;
  employeeId: number;
  employeeName?: string | null;
  employeeCode?: string | null;
  reviewerEmployeeId: number;
  reviewerName?: string | null;
  period: string;
  year: number;
  status: string; // 'Initiated' | 'SelfReviewSubmitted' | 'ManagerReviewSubmitted' | 'Finalized'
  selfReviewComments?: string | null;
  selfReviewRating?: number | null;
  managerReviewComments?: string | null;
  managerReviewRating?: number | null;
  finalScore?: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface Goal {
  id: number;
  uuid: string;
  employeeId: number;
  employeeName?: string | null;
  title: string;
  description: string;
  targetDate: string;
  progressPercentage: number;
  status: string; // 'NotStarted' | 'InProgress' | 'Completed' | 'Deferred'
  isActive: boolean;
  createdAt: string;
}

export interface PerformanceCycle {
  id: number;
  companyId: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface CreateAppraisalParams {
  employeeId: number;
  reviewerEmployeeId: number;
  period: string;
  year: number;
}

export interface SubmitReviewParams {
  appraisalId: number;
  comments: string;
  rating: number;
}

export interface CreateGoalParams {
  employeeId: number;
  title: string;
  description: string;
  targetDate: string;
}

export interface UpdateGoalProgressParams {
  goalId: number;
  progressPercentage: number;
  status: string;
}
