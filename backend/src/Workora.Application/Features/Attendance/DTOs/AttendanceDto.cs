using Workora.Domain.Enums;

namespace Workora.Application.Features.Attendance.DTOs;

/// <summary>
/// Data transfer object for daily attendance record.
/// </summary>
public class AttendanceRecordDto
{
    public int Id { get; set; }
    public Guid Uuid { get; set; }
    public int EmployeeId { get; set; }
    public string? EmployeeName { get; set; }
    public string? EmployeeCode { get; set; }
    public DateOnly AttendanceDate { get; set; }
    public DateTimeOffset? CheckInTime { get; set; }
    public DateTimeOffset? CheckOutTime { get; set; }
    public AttendanceStatus Status { get; set; }
    public decimal WorkingHours { get; set; }
    public decimal OvertimeHours { get; set; }
    public int? ShiftId { get; set; }
    public string? ShiftName { get; set; }
    public string? Remarks { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}

/// <summary>
/// Data transfer object for an attendance correction request.
/// </summary>
public class AttendanceCorrectionDto
{
    public int Id { get; set; }
    public Guid Uuid { get; set; }
    public int AttendanceRecordId { get; set; }
    public int EmployeeId { get; set; }
    public string? EmployeeName { get; set; }
    public string? EmployeeCode { get; set; }
    public DateOnly AttendanceDate { get; set; }
    public DateTimeOffset? OriginalCheckInTime { get; set; }
    public DateTimeOffset? OriginalCheckOutTime { get; set; }
    public DateTimeOffset? RequestedCheckInTime { get; set; }
    public DateTimeOffset? RequestedCheckOutTime { get; set; }
    public string Reason { get; set; } = string.Empty;
    public CorrectionStatus Status { get; set; }
    public int? ApproverEmployeeId { get; set; }
    public string? ApproverRemarks { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}

/// <summary>
/// Monthly attendance summary stats DTO.
/// </summary>
public class AttendanceSummaryDto
{
    public int EmployeeId { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public int TotalWorkingDays { get; set; }
    public int PresentDays { get; set; }
    public int LateDays { get; set; }
    public int HalfDays { get; set; }
    public int AbsentDays { get; set; }
    public int LeaveDays { get; set; }
    public int HolidaysCount { get; set; }
    public decimal TotalHoursWorked { get; set; }
    public decimal TotalOvertimeHours { get; set; }

    public AttendanceSummaryDto() { }

    public AttendanceSummaryDto(
        int employeeId,
        int month,
        int year,
        int totalWorkingDays,
        int presentDays,
        int lateDays,
        int halfDays,
        int absentDays,
        int leaveDays,
        int holidaysCount,
        decimal totalHoursWorked,
        decimal totalOvertimeHours)
    {
        EmployeeId = employeeId;
        Month = month;
        Year = year;
        TotalWorkingDays = totalWorkingDays;
        PresentDays = presentDays;
        LateDays = lateDays;
        HalfDays = halfDays;
        AbsentDays = absentDays;
        LeaveDays = leaveDays;
        HolidaysCount = holidaysCount;
        TotalHoursWorked = totalHoursWorked;
        TotalOvertimeHours = totalOvertimeHours;
    }
}

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
