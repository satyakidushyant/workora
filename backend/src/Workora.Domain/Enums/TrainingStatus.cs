namespace Workora.Domain.Enums;

/// <summary>
/// Status of an employee's enrollment in a training program.
/// </summary>
public enum TrainingStatus
{
    /// <summary>
    /// Enrolled in program.
    /// </summary>
    Enrolled = 1,

    /// <summary>
    /// Course currently in progress.
    /// </summary>
    InProgress = 2,

    /// <summary>
    /// Course completed.
    /// </summary>
    Completed = 3,

    /// <summary>
    /// Dropped or discontinued.
    /// </summary>
    Dropped = 4
}
