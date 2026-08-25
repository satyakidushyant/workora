namespace Workora.Domain.Enums;

/// <summary>
/// Defines the execution state of an assigned task.
/// </summary>
public enum TaskItemStatus
{
    /// <summary>
    /// Task has been created and is waiting to be started.
    /// </summary>
    ToDo = 1,

    /// <summary>
    /// Task is currently actively being worked on.
    /// </summary>
    InProgress = 2,

    /// <summary>
    /// Task is completed and pending creator review.
    /// </summary>
    InReview = 3,

    /// <summary>
    /// Task is verified and completed.
    /// </summary>
    Completed = 4,

    /// <summary>
    /// Task is cancelled.
    /// </summary>
    Cancelled = 5
}
