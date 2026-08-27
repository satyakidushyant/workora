using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.DTOs;

/// <summary>
/// Data transfer object for an overtime request.
/// </summary>
public class OvertimeRequestDto
{
    public int Id { get; set; }
    public Guid Uuid { get; set; }
    public int EmployeeId { get; set; }
    public string? EmployeeName { get; set; }
    public string? EmployeeCode { get; set; }
    public DateOnly OvertimeDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public decimal HoursRequested { get; set; }
    public string Reason { get; set; } = string.Empty;
    public OvertimeRequestStatus Status { get; set; }
    public int? PayrollRunId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
