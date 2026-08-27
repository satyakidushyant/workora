using Workora.Domain.Enums;
using Workora.Shared.Responses;

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
