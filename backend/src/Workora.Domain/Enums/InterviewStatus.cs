namespace Workora.Domain.Enums;

/// <summary>
/// Status of a candidate interview event.
/// </summary>
public enum InterviewStatus
{
    /// <summary>
    /// Scheduled and pending execution.
    /// </summary>
    Scheduled = 1,

    /// <summary>
    /// Completed and feedback provided.
    /// </summary>
    Completed = 2,

    /// <summary>
    /// Cancelled or rescheduled.
    /// </summary>
    Cancelled = 3
}
