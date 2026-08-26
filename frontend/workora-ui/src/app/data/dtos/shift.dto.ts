export interface ShiftDto {
  id: number;
  uuid: string;
  companyId: number;
  branchId?: number | null;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  spansMidnight: boolean;
  gracePeriodMinutes: number;
  breakMinutes: number;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ShiftAssignmentDto {
  id: number;
  employeeId: number;
  shiftId: number;
  shiftName: string;
  startTime: string;
  endTime: string;
  effectiveFrom: string;
  effectiveTo?: string | null;
  isActive: boolean;
}

export interface CreateShiftRequestDto {
  companyId: number;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  spansMidnight: boolean;
  gracePeriodMinutes: number;
  breakMinutes: number;
  branchId?: number | null;
  description?: string | null;
}

export interface UpdateShiftRequestDto {
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  spansMidnight: boolean;
  gracePeriodMinutes: number;
  breakMinutes: number;
  branchId?: number | null;
  description?: string | null;
}

export interface AssignShiftRequestDto {
  employeeId: number;
  shiftId: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
}
