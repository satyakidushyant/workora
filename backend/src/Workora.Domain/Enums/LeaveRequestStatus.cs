namespace Workora.Domain.Enums;

/// <summary>
/// Status of a leave request throughout its approval lifecycle.
/// </summary>
public enum LeaveRequestStatus
{
    /// <summary>
    /// Awaiting direct reporting manager approval.
    /// </summary>
    PendingManagerApproval = 1,

    /// <summary>
    /// Awaiting secondary HR department approval.
    /// </summary>
    PendingHrApproval = 2,

    /// <summary>
    /// Fully approved and balance deducted.
    /// </summary>
    Approved = 3,

    /// <summary>
    /// Rejected by manager or HR.
    /// </summary>
    Rejected = 4,

    /// <summary>
    /// Cancelled by the employee or overridden by HR.
    /// </summary>
    Cancelled = 5
}
