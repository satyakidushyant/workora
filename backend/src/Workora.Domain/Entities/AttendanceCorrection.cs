using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an employee's request to amend an attendance record.
/// </summary>
public class AttendanceCorrection : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the parent attendance record.
    /// </summary>
    public int AttendanceRecordId { get; private set; }

    /// <summary>
    /// Navigation property to the attendance record.
    /// </summary>
    public AttendanceRecord AttendanceRecord { get; private set; } = null!;

    /// <summary>
    /// The requested amended check-in timestamp.
    /// </summary>
    public DateTimeOffset? RequestedCheckInTime { get; private set; }

    /// <summary>
    /// The requested amended check-out timestamp.
    /// </summary>
    public DateTimeOffset? RequestedCheckOutTime { get; private set; }

    /// <summary>
    /// Reason provided by the employee for the discrepancy.
    /// </summary>
    public string Reason { get; private set; } = null!;

    /// <summary>
    /// Approval status of the correction.
    /// </summary>
    public CorrectionStatus Status { get; private set; } = CorrectionStatus.Pending;

    /// <summary>
    /// Optional foreign key to the reviewing manager / employee.
    /// </summary>
    public int? ApproverEmployeeId { get; private set; }

    /// <summary>
    /// Comments provided upon approval or rejection.
    /// </summary>
    public string? ApproverRemarks { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private AttendanceCorrection() { }

    /// <summary>
    /// Creates a new AttendanceCorrection request instance.
    /// </summary>
    public static AttendanceCorrection Create(
        int attendanceRecordId,
        DateTimeOffset? requestedCheckInTime,
        DateTimeOffset? requestedCheckOutTime,
        string reason)
    {
        return new AttendanceCorrection
        {
            AttendanceRecordId = attendanceRecordId,
            RequestedCheckInTime = requestedCheckInTime,
            RequestedCheckOutTime = requestedCheckOutTime,
            Reason = reason,
            Status = CorrectionStatus.Pending,
            IsActive = true
        };
    }

    /// <summary>
    /// Approves the correction request.
    /// </summary>
    public void Approve(int approverEmployeeId, string? remarks = null)
    {
        Status = CorrectionStatus.Approved;
        ApproverEmployeeId = approverEmployeeId;
        ApproverRemarks = remarks;
    }

    /// <summary>
    /// Rejects the correction request.
    /// </summary>
    public void Reject(int approverEmployeeId, string? remarks = null)
    {
        Status = CorrectionStatus.Rejected;
        ApproverEmployeeId = approverEmployeeId;
        ApproverRemarks = remarks;
    }
}
