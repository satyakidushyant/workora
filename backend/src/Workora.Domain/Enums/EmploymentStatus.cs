namespace Workora.Domain.Enums;

/// <summary>
/// Represents the employment status of an employee.
/// </summary>
public enum EmploymentStatus
{
    /// <summary>
    /// Active full-time or permanent employee.
    /// </summary>
    Active = 1,

    /// <summary>
    /// Employee currently on probation period.
    /// </summary>
    Probation = 2,

    /// <summary>
    /// Employee currently on extended leave.
    /// </summary>
    OnLeave = 3,

    /// <summary>
    /// Employee has resigned.
    /// </summary>
    Resigned = 4,

    /// <summary>
    /// Employee employment was terminated.
    /// </summary>
    Terminated = 5
}
