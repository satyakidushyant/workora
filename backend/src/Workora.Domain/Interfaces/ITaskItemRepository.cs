using Workora.Domain.Entities;
using Workora.Domain.Enums;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for workplace and HR tasks.
/// </summary>
public interface ITaskItemRepository : IRepository<TaskItem>
{
    /// <summary>
    /// Gets tasks assigned to a specific employee.
    /// </summary>
    Task<List<TaskItem>> GetTasksByAssigneeAsync(int employeeId, TaskItemStatus? status, CancellationToken ct = default);

    /// <summary>
    /// Gets tasks created by a manager or team lead.
    /// </summary>
    Task<List<TaskItem>> GetTasksByCreatorAsync(int employeeId, CancellationToken ct = default);

    /// <summary>
    /// Gets company tasks filtered by status and priority.
    /// </summary>
    Task<List<TaskItem>> GetCompanyTasksAsync(int? companyId, TaskItemStatus? status, TaskPriority? priority, CancellationToken ct = default);
}
