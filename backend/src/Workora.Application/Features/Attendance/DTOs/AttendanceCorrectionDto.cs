using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.DTOs;

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
