namespace Workora.Domain.Enums;

/// <summary>
/// Status of an individual or team performance goal/KPI.
/// </summary>
public enum GoalStatus
{
    /// <summary>
    /// Goal is actively in progress.
    /// </summary>
    InProgress = 1,

    /// <summary>
    /// Goal successfully achieved.
    /// </summary>
    Completed = 2,

    /// <summary>
    /// Goal cancelled or deferred.
    /// </summary>
    Cancelled = 3
}
