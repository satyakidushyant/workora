namespace Workora.Domain.Enums;

/// <summary>
/// Represents the attendance status for an employee on a given calendar day.
/// </summary>
public enum AttendanceStatus
{
    /// <summary>
    /// Present on time.
    /// </summary>
    Present = 1,

    /// <summary>
    /// Arrived after grace period.
    /// </summary>
    Late = 2,

    /// <summary>
    /// Worked less than minimum full day threshold.
    /// </summary>
    HalfDay = 3,

    /// <summary>
    /// Unexcused absence.
    /// </summary>
    Absent = 4,

    /// <summary>
    /// Approved leave.
    /// </summary>
    OnLeave = 5,

    /// <summary>
    /// Company holiday.
    /// </summary>
    Holiday = 6,

    /// <summary>
    /// Regular scheduled weekend / rest day.
    /// </summary>
    Weekend = 7
}
