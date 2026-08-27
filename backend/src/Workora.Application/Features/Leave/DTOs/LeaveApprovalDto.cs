using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.DTOs;

/// <summary>
/// Data transfer object for a leave approval record.
/// </summary>
public class LeaveApprovalDto
{
    public int Id { get; set; }
    public int LeaveRequestId { get; set; }
    public int ApproverEmployeeId { get; set; }
    public string ApproverRole { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Comments { get; set; }
    public DateTimeOffset ActionDate { get; set; }
}
