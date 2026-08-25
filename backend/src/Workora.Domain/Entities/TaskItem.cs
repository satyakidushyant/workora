using Workora.Domain.Common;
using Workora.Domain.Enums;
using Workora.Domain.Exceptions;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an operational or HR task assigned to an employee.
/// </summary>
public class TaskItem : AuditableEntity
{
    /// <summary>
    /// Foreign key to the company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// Task headline / title.
    /// </summary>
    public string Title { get; private set; } = string.Empty;

    /// <summary>
    /// Detailed description or instructions.
    /// </summary>
    public string? Description { get; private set; }

    /// <summary>
    /// The employee assigned to execute this task.
    /// </summary>
    public int AssignedToEmployeeId { get; private set; }

    /// <summary>
    /// Gets the navigation property for the assigned employee.
    /// </summary>
    public Employee AssignedToEmployee { get; private set; } = null!;

    /// <summary>
    /// The employee who created/assigned this task.
    /// </summary>
    public int CreatedByEmployeeId { get; private set; }

    /// <summary>
    /// Gets the navigation property for the creator employee.
    /// </summary>
    public Employee CreatedByEmployee { get; private set; } = null!;

    /// <summary>
    /// Priority level (Low, Medium, High, Urgent).
    /// </summary>
    public TaskPriority Priority { get; private set; }

    /// <summary>
    /// Due date for completion.
    /// </summary>
    public DateOnly DueDate { get; private set; }

    /// <summary>
    /// Current execution state (ToDo, InProgress, InReview, Completed, Cancelled).
    /// </summary>
    public TaskItemStatus Status { get; private set; }

    /// <summary>
    /// Timestamp of completion.
    /// </summary>
    public DateTimeOffset? CompletedAt { get; private set; }

    private TaskItem() { } // EF Core

    /// <summary>
    /// Factory method to create a new task.
    /// </summary>
    public static TaskItem Create(
        int companyId,
        string title,
        string? description,
        int assignedToEmployeeId,
        int createdByEmployeeId,
        TaskPriority priority,
        DateOnly dueDate)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Task title is required.");

        return new TaskItem
        {
            CompanyId = companyId,
            Title = title,
            Description = description,
            AssignedToEmployeeId = assignedToEmployeeId,
            CreatedByEmployeeId = createdByEmployeeId,
            Priority = priority,
            DueDate = dueDate,
            Status = TaskItemStatus.ToDo
        };
    }

    /// <summary>
    /// Updates the status of the task.
    /// </summary>
    public void UpdateStatus(TaskItemStatus newStatus)
    {
        Status = newStatus;
        if (newStatus == TaskItemStatus.Completed)
        {
            CompletedAt = DateTimeOffset.UtcNow;
        }
        else
        {
            CompletedAt = null;
        }
    }

    /// <summary>
    /// Reassigns the task to another employee.
    /// </summary>
    public void Reassign(int newAssignedEmployeeId)
    {
        AssignedToEmployeeId = newAssignedEmployeeId;
    }
}
