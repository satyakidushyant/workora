using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Tracks an employee's annual allocated, used, and pending leave balances for a specific leave type.
/// </summary>
public class LeaveBalance : AuditableEntity
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
    /// The calendar year of the balance (e.g. 2026).
    /// </summary>
    public int Year { get; private set; }

    /// <summary>
    /// Total days allocated for the year (including carryover).
    /// </summary>
    public decimal AllocatedDays { get; private set; }

    /// <summary>
    /// Total approved days taken.
    /// </summary>
    public decimal UsedDays { get; private set; }

    /// <summary>
    /// Days currently reserved in pending approval requests.
    /// </summary>
    public decimal PendingDays { get; private set; }

    /// <summary>
    /// Gets the net available days remaining.
    /// </summary>
    public decimal AvailableDays => AllocatedDays - UsedDays - PendingDays;

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private LeaveBalance() { }

    /// <summary>
    /// Creates a new LeaveBalance instance.
    /// </summary>
    public static LeaveBalance Create(
        int employeeId,
        int leaveTypeId,
        int year,
        decimal allocatedDays,
        decimal usedDays = 0,
        decimal pendingDays = 0)
    {
        return new LeaveBalance
        {
            EmployeeId = employeeId,
            LeaveTypeId = leaveTypeId,
            Year = year,
            AllocatedDays = allocatedDays,
            UsedDays = usedDays,
            PendingDays = pendingDays,
            IsActive = true
        };
    }

    /// <summary>
    /// Reserves days when a request is submitted.
    /// </summary>
    public void ReserveDays(decimal days)
    {
        PendingDays += days;
    }

    /// <summary>
    /// Deducts days upon final approval of a leave request.
    /// </summary>
    public void ApplyApproval(decimal days)
    {
        PendingDays = Math.Max(0, PendingDays - days);
        UsedDays += days;
    }

    /// <summary>
    /// Releases reserved days when a request is rejected or cancelled.
    /// </summary>
    public void ReleaseDays(decimal days)
    {
        PendingDays = Math.Max(0, PendingDays - days);
    }
}
