using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a daily attendance log for an employee.
/// </summary>
public class AttendanceRecord : AuditableEntity
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
    /// The date of attendance.
    /// </summary>
    public DateOnly AttendanceDate { get; private set; }

    /// <summary>
    /// Timestamp when check-in was registered.
    /// </summary>
    public DateTimeOffset? CheckInTime { get; private set; }

    /// <summary>
    /// Timestamp when check-out was registered.
    /// </summary>
    public DateTimeOffset? CheckOutTime { get; private set; }

    /// <summary>
    /// Computed status of the attendance record.
    /// </summary>
    public AttendanceStatus Status { get; private set; } = AttendanceStatus.Present;

    /// <summary>
    /// Total net hours worked.
    /// </summary>
    public decimal WorkingHours { get; private set; }

    /// <summary>
    /// Total overtime hours worked.
    /// </summary>
    public decimal OvertimeHours { get; private set; }

    /// <summary>
    /// Optional foreign key to the shift assigned on that day.
    /// </summary>
    public int? ShiftId { get; private set; }

    /// <summary>
    /// Navigation property to the shift.
    /// </summary>
    public Shift? Shift { get; private set; }

    /// <summary>
    /// Optional notes or remarks.
    /// </summary>
    public string? Remarks { get; private set; }

    private readonly List<AttendanceCorrection> _corrections = new();
    /// <summary>
    /// Navigation collection of correction requests against this record.
    /// </summary>
    public IReadOnlyCollection<AttendanceCorrection> Corrections => _corrections.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private AttendanceRecord() { }

    /// <summary>
    /// Creates a new AttendanceRecord instance.
    /// </summary>
    public static AttendanceRecord Create(
        int employeeId,
        DateOnly attendanceDate,
        DateTimeOffset? checkInTime = null,
        DateTimeOffset? checkOutTime = null,
        AttendanceStatus status = AttendanceStatus.Present,
        decimal workingHours = 0,
        decimal overtimeHours = 0,
        int? shiftId = null,
        string? remarks = null)
    {
        return new AttendanceRecord
        {
            EmployeeId = employeeId,
            AttendanceDate = attendanceDate,
            CheckInTime = checkInTime,
            CheckOutTime = checkOutTime,
            Status = status,
            WorkingHours = workingHours,
            OvertimeHours = overtimeHours,
            ShiftId = shiftId,
            Remarks = remarks,
            IsActive = true
        };
    }

    /// <summary>
    /// Registers employee check-in.
    /// </summary>
    public void CheckIn(DateTimeOffset checkInTime, AttendanceStatus status = AttendanceStatus.Present)
    {
        CheckInTime = checkInTime;
        Status = status;
    }

    /// <summary>
    /// Registers employee check-out and computes worked hours.
    /// </summary>
    public void CheckOut(DateTimeOffset checkOutTime, decimal expectedShiftHours = 8.0m)
    {
        CheckOutTime = checkOutTime;
        if (CheckInTime.HasValue)
        {
            var duration = (decimal)(checkOutTime - CheckInTime.Value).TotalHours;
            WorkingHours = Math.Max(0, Math.Round(duration, 2));
            if (WorkingHours > expectedShiftHours)
            {
                OvertimeHours = Math.Round(WorkingHours - expectedShiftHours, 2);
            }
        }
    }

    /// <summary>
    /// Applies an approved correction to the attendance record.
    /// </summary>
    public void ApplyCorrection(DateTimeOffset? checkInTime, DateTimeOffset? checkOutTime, AttendanceStatus status, decimal expectedShiftHours = 8.0m)
    {
        CheckInTime = checkInTime;
        CheckOutTime = checkOutTime;
        Status = status;

        if (CheckInTime.HasValue && CheckOutTime.HasValue)
        {
            var duration = (decimal)(CheckOutTime.Value - CheckInTime.Value).TotalHours;
            WorkingHours = Math.Max(0, Math.Round(duration, 2));
            if (WorkingHours > expectedShiftHours)
            {
                OvertimeHours = Math.Round(WorkingHours - expectedShiftHours, 2);
            }
            else
            {
                OvertimeHours = 0;
            }
        }
    }
}
