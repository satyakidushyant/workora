using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an employee's application for leave.
/// </summary>
public class LeaveRequest : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the employee.
    /// </summary>
    public int EmployeeId { get; private set; }

    /// <summary>
    /// Navigation property to the employee.
    /// </summary>
    public Employee Employee { get; private set; } = null!;

    /// <summary>
    /// Foreign key identifier for the leave type.
    /// </summary>
    public int LeaveTypeId { get; private set; }

    /// <summary>
    /// Navigation property to the leave type.
    /// </summary>
    public LeaveType LeaveType { get; private set; } = null!;

    /// <summary>
    /// Starting date of the leave period.
    /// </summary>
    public DateOnly StartDate { get; private set; }

    /// <summary>
    /// Ending date of the leave period (inclusive).
    /// </summary>
    public DateOnly EndDate { get; private set; }

    /// <summary>
    /// Total computed working days requested.
    /// </summary>
    public decimal DaysCount { get; private set; }

    /// <summary>
    /// Current approval status of the request.
    /// </summary>
    public LeaveRequestStatus Status { get; private set; } = LeaveRequestStatus.PendingManagerApproval;

    /// <summary>
    /// Reason provided by the employee.
    /// </summary>
    public string Reason { get; private set; } = null!;

    private readonly List<LeaveApproval> _approvals = new();
    /// <summary>
    /// Navigation collection of workflow approval steps.
    /// </summary>
    public IReadOnlyCollection<LeaveApproval> Approvals => _approvals.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private LeaveRequest() { }

    /// <summary>
    /// Creates a new LeaveRequest instance.
    /// </summary>
    public static LeaveRequest Create(
        int employeeId,
        int leaveTypeId,
        DateOnly startDate,
        DateOnly endDate,
        decimal daysCount,
        string reason)
    {
        return new LeaveRequest
        {
            EmployeeId = employeeId,
            LeaveTypeId = leaveTypeId,
            StartDate = startDate,
            EndDate = endDate,
            DaysCount = daysCount,
            Status = LeaveRequestStatus.PendingManagerApproval,
            Reason = reason,
            IsActive = true
        };
    }

    /// <summary>
    /// Approves the leave request at the manager or HR stage.
    /// </summary>
    public void Approve(int approverEmployeeId, string approverRole, bool requiresSecondStage, string? comments = null)
    {
        var approval = LeaveApproval.Create(Id, approverEmployeeId, approverRole, "Approved", comments);
        _approvals.Add(approval);

        if (requiresSecondStage && Status == LeaveRequestStatus.PendingManagerApproval)
        {
            Status = LeaveRequestStatus.PendingHrApproval;
        }
        else
        {
            Status = LeaveRequestStatus.Approved;
        }
    }

    /// <summary>
    /// Rejects the leave request.
    /// </summary>
    public void Reject(int approverEmployeeId, string approverRole, string? comments = null)
    {
        var approval = LeaveApproval.Create(Id, approverEmployeeId, approverRole, "Rejected", comments);
        _approvals.Add(approval);
        Status = LeaveRequestStatus.Rejected;
    }

    /// <summary>
    /// Cancels the leave request.
    /// </summary>
    public void Cancel()
    {
        Status = LeaveRequestStatus.Cancelled;
    }
}
