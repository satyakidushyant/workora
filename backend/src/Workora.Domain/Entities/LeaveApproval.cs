using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Audit record of an approval or rejection decision on a leave request.
/// </summary>
public class LeaveApproval : BaseEntity
{
    /// <summary>
    /// Foreign key identifier for the parent leave request.
    /// </summary>
    public int LeaveRequestId { get; private set; }

    /// <summary>
    /// Navigation property to the leave request.
    /// </summary>
    public LeaveRequest LeaveRequest { get; private set; } = null!;

    /// <summary>
    /// Identifier of the reviewing employee.
    /// </summary>
    public int ApproverEmployeeId { get; private set; }

    /// <summary>
    /// Role name under which approval was made (e.g., "Manager", "HR").
    /// </summary>
    public string ApproverRole { get; private set; } = null!;

    /// <summary>
    /// Decision status ("Approved", "Rejected").
    /// </summary>
    public string Status { get; private set; } = null!;

    /// <summary>
    /// Optional comments or feedback.
    /// </summary>
    public string? Comments { get; private set; }

    /// <summary>
    /// Timestamp of when the action occurred.
    /// </summary>
    public DateTimeOffset ActionDate { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private LeaveApproval() { }

    /// <summary>
    /// Creates a new LeaveApproval step record.
    /// </summary>
    public static LeaveApproval Create(
        int leaveRequestId,
        int approverEmployeeId,
        string approverRole,
        string status,
        string? comments = null)
    {
        return new LeaveApproval
        {
            LeaveRequestId = leaveRequestId,
            ApproverEmployeeId = approverEmployeeId,
            ApproverRole = approverRole,
            Status = status,
            Comments = comments,
            ActionDate = DateTimeOffset.UtcNow,
            IsActive = true
        };
    }
}
