/**
 * Domain model representing a work shift definition.
 */
export interface Shift {
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

/**
 * Parameters for saving a shift.
 */
export interface SaveShiftParams {
  id?: number;
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

/**
 * Parameters for assigning a shift.
 */
export interface AssignShiftParams {
  employeeId: number;
  shiftId: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
}
