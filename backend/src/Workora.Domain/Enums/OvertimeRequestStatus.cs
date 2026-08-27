namespace Workora.Domain.Enums;

/// <summary>
/// Status of an overtime request throughout its approval lifecycle.
/// </summary>
public enum OvertimeRequestStatus
{
    /// <summary>
    /// Awaiting direct reporting manager approval.
    /// </summary>
    PendingManagerApproval = 1,

    /// <summary>
    /// Awaiting secondary HR/Finance department approval.
    /// </summary>
    PendingHrApproval = 2,

    /// <summary>
    /// Fully approved and queued for payroll.
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