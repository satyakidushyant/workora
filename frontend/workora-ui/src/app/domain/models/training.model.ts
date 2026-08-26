export interface TrainingProgram {
  id: number;
  uuid: string;
  companyId: number;
  title: string;
  description: string;
  trainerName: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface TrainingEnrollment {
  id: number;
  trainingProgramId: number;
  programTitle?: string | null;
  employeeId: number;
  employeeName?: string | null;
  status: string; // 'Enrolled' | 'InProgress' | 'Completed' | 'Dropped'
  completedAt?: string | null;
  createdAt: string;
}

export interface CreateTrainingProgramParams {
  companyId: number;
  title: string;
  description: string;
  trainerName: string;
  startDate: string;
  endDate: string;
  capacity: number;
}

export interface EnrollTrainingParams {
  trainingProgramId: number;
  employeeId: number;
}
