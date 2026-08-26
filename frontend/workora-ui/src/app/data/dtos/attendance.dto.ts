export interface AttendanceRecordDto {
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

export interface AttendanceCorrectionDto {
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

export interface AttendanceSummaryDto {
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

export interface LiveAttendanceStatusDto {
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  onLeaveCount: number;
  lateCount: number;
}

export interface CheckInRequestDto {
  remarks?: string | null;
}

export interface CheckOutRequestDto {
  remarks?: string | null;
}

export interface RequestCorrectionRequestDto {
  requestedCheckInTime?: string | null;
  requestedCheckOutTime?: string | null;
  reason: string;
}

export interface ProcessCorrectionRequestDto {
  remarks?: string | null;
}
