export interface TrainingProgramDto {
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

export interface TrainingEnrollmentDto {
  id: number;
  trainingProgramId: number;
  programTitle?: string | null;
  employeeId: number;
  employeeName?: string | null;
  status: string;
  completedAt?: string | null;
  createdAt: string;
}

export interface CreateTrainingProgramRequestDto {
  companyId: number;
  title: string;
  description: string;
  trainerName: string;
  startDate: string;
  endDate: string;
  capacity: number;
}

export interface EnrollTrainingRequestDto {
  trainingProgramId: number;
  employeeId: number;
}
