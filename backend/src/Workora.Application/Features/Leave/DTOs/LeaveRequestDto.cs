using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.DTOs;

/// <summary>
/// Data transfer object for a leave request.
/// </summary>
public class LeaveRequestDto
{
    public int Id { get; set; }
    public Guid Uuid { get; set; }
    public int EmployeeId { get; set; }
    public string? EmployeeName { get; set; }
    public string? EmployeeCode { get; set; }
    public int LeaveTypeId { get; set; }
    public string? LeaveTypeName { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal DaysCount { get; set; }
    public LeaveRequestStatus Status { get; set; }
    public string Reason { get; set; } = string.Empty;
    public IReadOnlyList<LeaveApprovalDto> Approvals { get; set; } = new List<LeaveApprovalDto>();
    public DateTimeOffset CreatedAt { get; set; }
}
