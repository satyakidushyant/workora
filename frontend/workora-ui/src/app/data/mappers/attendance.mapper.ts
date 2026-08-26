import {
  AttendanceRecordDto,
  AttendanceCorrectionDto,
  AttendanceSummaryDto,
  LiveAttendanceStatusDto
} from '../dtos/attendance.dto';
import {
  AttendanceRecord,
  AttendanceCorrection,
  AttendanceSummary,
  LiveAttendanceStatus
} from '../../domain/models/attendance.model';

export class AttendanceMapper {
  static fromRecordDto(dto: AttendanceRecordDto): AttendanceRecord {
    return {
      id: dto.id,
      uuid: dto.uuid,
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      employeeCode: dto.employeeCode,
      attendanceDate: dto.attendanceDate,
      checkInTime: dto.checkInTime,
      checkOutTime: dto.checkOutTime,
      status: dto.status,
      workingHours: dto.workingHours,
      overtimeHours: dto.overtimeHours,
      shiftId: dto.shiftId,
      shiftName: dto.shiftName,
      remarks: dto.remarks,
      createdAt: dto.createdAt
    };
  }

  static fromCorrectionDto(dto: AttendanceCorrectionDto): AttendanceCorrection {
    return {
      id: dto.id,
      uuid: dto.uuid,
      attendanceRecordId: dto.attendanceRecordId,
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      employeeCode: dto.employeeCode,
      attendanceDate: dto.attendanceDate,
      originalCheckInTime: dto.originalCheckInTime,
      originalCheckOutTime: dto.originalCheckOutTime,
      requestedCheckInTime: dto.requestedCheckInTime,
      requestedCheckOutTime: dto.requestedCheckOutTime,
      reason: dto.reason,
      status: dto.status,
      approverEmployeeId: dto.approverEmployeeId,
      approverRemarks: dto.approverRemarks,
      createdAt: dto.createdAt
    };
  }

  static fromSummaryDto(dto: AttendanceSummaryDto): AttendanceSummary {
    return {
      employeeId: dto.employeeId,
      month: dto.month,
      year: dto.year,
      totalWorkingDays: dto.totalWorkingDays,
      presentDays: dto.presentDays,
      lateDays: dto.lateDays,
      halfDays: dto.halfDays,
      absentDays: dto.absentDays,
      leaveDays: dto.leaveDays,
      holidaysCount: dto.holidaysCount,
      totalHoursWorked: dto.totalHoursWorked,
      totalOvertimeHours: dto.totalOvertimeHours
    };
  }

  static fromLiveStatusDto(dto: LiveAttendanceStatusDto): LiveAttendanceStatus {
    return {
      totalEmployees: dto.totalEmployees,
      presentCount: dto.presentCount,
      absentCount: dto.absentCount,
      onLeaveCount: dto.onLeaveCount,
      lateCount: dto.lateCount
    };
  }
}
