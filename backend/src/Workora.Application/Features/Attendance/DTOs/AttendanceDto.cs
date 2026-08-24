using Workora.Domain.Enums;

namespace Workora.Application.Features.Attendance.DTOs;

/// <summary>
/// Data transfer object for daily attendance record.
/// </summary>
public record AttendanceRecordDto(
    int Id,
    Guid Uuid,
    int EmployeeId,
    string? EmployeeName,
    string? EmployeeCode,
    DateOnly AttendanceDate,
    DateTimeOffset? CheckInTime,
    DateTimeOffset? CheckOutTime,
    AttendanceStatus Status,
    decimal WorkingHours,
    decimal OvertimeHours,
    int? ShiftId,
    string? ShiftName,
    string? Remarks,
    DateTimeOffset CreatedAt);

/// <summary>
/// Data transfer object for an attendance correction request.
/// </summary>
public record AttendanceCorrectionDto(
    int Id,
    Guid Uuid,
    int AttendanceRecordId,
    int EmployeeId,
    string? EmployeeName,
    string? EmployeeCode,
    DateOnly AttendanceDate,
    DateTimeOffset? OriginalCheckInTime,
    DateTimeOffset? OriginalCheckOutTime,
    DateTimeOffset? RequestedCheckInTime,
    DateTimeOffset? RequestedCheckOutTime,
    string Reason,
    CorrectionStatus Status,
    int? ApproverEmployeeId,
    string? ApproverRemarks,
    DateTimeOffset CreatedAt);

/// <summary>
/// Monthly attendance summary stats DTO.
/// </summary>
public record AttendanceSummaryDto(
    int EmployeeId,
    int Month,
    int Year,
    int TotalWorkingDays,
    int PresentDays,
    int LateDays,
    int HalfDays,
    int AbsentDays,
    int LeaveDays,
    int HolidaysCount,
    decimal TotalHoursWorked,
    decimal TotalOvertimeHours);

/// <summary>
/// Request payload for clocking in.
/// </summary>
public record CheckInRequestDto(
    string? Remarks);

/// <summary>
/// Request payload for clocking out.
/// </summary>
public record CheckOutRequestDto(
    string? Remarks);

/// <summary>
/// Request payload for requesting an attendance correction.
/// </summary>
public record RequestCorrectionRequestDto(
    DateTimeOffset? RequestedCheckInTime,
    DateTimeOffset? RequestedCheckOutTime,
    string Reason);

/// <summary>
/// Request payload for approving or rejecting a correction.
/// </summary>
public record ProcessCorrectionRequestDto(
    string? Remarks);

/// <summary>
/// Item in a bulk attendance import payload.
/// </summary>
public record BulkImportAttendanceItemDto(
    string EmployeeCode,
    DateOnly AttendanceDate,
    DateTimeOffset? CheckInTime,
    DateTimeOffset? CheckOutTime,
    string? Remarks);

/// <summary>
/// Request payload for bulk importing attendance.
/// </summary>
public record BulkImportAttendanceRequestDto(
    IReadOnlyList<BulkImportAttendanceItemDto> Records);
