/**
 * Domain model representing a daily attendance punch record.
 */
export interface AttendanceRecord {
  id: number;
  uuid: string;
  employeeId: number;
  employeeName?: string | null;
  employeeCode?: string | null;
  attendanceDate: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  status: string;
  workingHours: number;
  overtimeHours: number;
  shiftId?: number | null;
  shiftName?: string | null;
  remarks?: string | null;
  createdAt: string;
}

/**
 * Domain model representing an attendance correction request.
 */
export interface AttendanceCorrection {
  id: number;
  uuid: string;
  attendanceRecordId: number;
  employeeId: number;
  employeeName?: string | null;
  employeeCode?: string | null;
  attendanceDate: string;
  originalCheckInTime?: string | null;
  originalCheckOutTime?: string | null;
  requestedCheckInTime?: string | null;
  requestedCheckOutTime?: string | null;
  reason: string;
  status: string;
  approverEmployeeId?: number | null;
  approverRemarks?: string | null;
  createdAt: string;
}

/**
 * Domain model representing monthly attendance summary stats.
 */
export interface AttendanceSummary {
  employeeId: number;
  month: number;
  year: number;
  totalWorkingDays: number;
  presentDays: number;
  lateDays: number;
  halfDays: number;
  absentDays: number;
  leaveDays: number;
  holidaysCount: number;
  totalHoursWorked: number;
  totalOvertimeHours: number;
}

/**
 * Domain model representing live workforce presence.
 */
export interface LiveAttendanceStatus {
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  onLeaveCount: number;
  lateCount: number;
}

/**
 * Query parameters for fetching attendance records.
 */
export interface AttendanceQueryParams {
  employeeId?: number;
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
}

/**
 * Parameters for requesting an attendance punch correction.
 */
export interface RequestCorrectionParams {
  attendanceRecordId: number;
  requestedCheckInTime?: string | null;
  requestedCheckOutTime?: string | null;
  reason: string;
}
