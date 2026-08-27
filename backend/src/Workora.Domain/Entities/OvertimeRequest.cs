using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an employee's request for overtime work approval.
/// </summary>
public class OvertimeRequest : AuditableEntity
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
    /// The date of the overtime work.
    /// </summary>
    public DateOnly OvertimeDate { get; private set; }

    /// <summary>
    /// Start time of the overtime.
    /// </summary>
    public TimeOnly StartTime { get; private set; }

    /// <summary>
    /// End time of the overtime.
    /// </summary>
    public TimeOnly EndTime { get; private set; }

    /// <summary>
    /// Total computed overtime hours requested.
    /// </summary>
    public decimal HoursRequested { get; private set; }

    /// <summary>
    /// Reason provided by the employee.
    /// </summary>
    public string Reason { get; private set; } = null!;

    /// <summary>
    /// Current approval status of the request.
    /// </summary>
    public OvertimeRequestStatus Status { get; private set; } = OvertimeRequestStatus.PendingManagerApproval;

    /// <summary>
    /// Optional foreign key to the payroll run where this overtime was included.
    /// </summary>
    public int? PayrollRunId { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private OvertimeRequest() { }

    /// <summary>
    /// Creates a new OvertimeRequest instance.
    /// </summary>
    public static OvertimeRequest Create(
        int employeeId,
        DateOnly overtimeDate,
        TimeOnly startTime,
        TimeOnly endTime,
        decimal hoursRequested,
        string reason)
    {
        return new OvertimeRequest
        {
            EmployeeId = employeeId,
            OvertimeDate = overtimeDate,
            StartTime = startTime,
            EndTime = endTime,
            HoursRequested = hoursRequested,
            Reason = reason,
            Status = OvertimeRequestStatus.PendingManagerApproval,
            IsActive = true
        };
    }

    /// <summary>
    /// Approves the overtime request at the manager or HR/Finance stage.
    /// </summary>
    public void Approve(int approverEmployeeId, string approverRole, bool requiresSecondStage, string? comments = null)
    {
        // Add approval record if needed (similar to LeaveApproval)
        if (requiresSecondStage && Status == OvertimeRequestStatus.PendingManagerApproval)
        {
            Status = OvertimeRequestStatus.PendingHrApproval;
        }
        else
        {
            Status = OvertimeRequestStatus.Approved;
        }
    }

    /// <summary>
    /// Rejects the overtime request.
    /// </summary>
    public void Reject(int approverEmployeeId, string approverRole, string? comments = null)
    {
        Status = OvertimeRequestStatus.Rejected;
    }

    /// <summary>
    /// Cancels the overtime request.
    /// </summary>
    public void Cancel()
    {
        Status = OvertimeRequestStatus.Cancelled;
    }

    /// <summary>
    /// Marks the overtime as included in a payroll run.
    /// </summary>
    public void MarkAsProcessed(int payrollRunId)
    {
        PayrollRunId = payrollRunId;
    }
}