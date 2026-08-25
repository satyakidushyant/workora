using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="TaskItem"/>.
/// </summary>
public class TaskItemRepository : GenericRepository<TaskItem>, ITaskItemRepository
{
    /// <inheritdoc />
    public TaskItemRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<List<TaskItem>> GetTasksByAssigneeAsync(int employeeId, TaskItemStatus? status, CancellationToken ct = default)
    {
        var query = _dbContext.Set<TaskItem>()
            .Include(x => x.CreatedByEmployee)
            .Where(x => x.AssignedToEmployeeId == employeeId);

        if (status.HasValue)
        {
            query = query.Where(x => x.Status == status.Value);
        }

        return await query.OrderBy(x => x.DueDate).ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<List<TaskItem>> GetTasksByCreatorAsync(int employeeId, CancellationToken ct = default)
    {
        return await _dbContext.Set<TaskItem>()
            .Include(x => x.AssignedToEmployee)
            .Where(x => x.CreatedByEmployeeId == employeeId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<List<TaskItem>> GetCompanyTasksAsync(int? companyId, TaskItemStatus? status, TaskPriority? priority, CancellationToken ct = default)
    {
        var query = _dbContext.Set<TaskItem>()
            .Include(x => x.AssignedToEmployee)
            .Include(x => x.CreatedByEmployee)
            .AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(x => x.CompanyId == companyId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(x => x.Status == status.Value);
        }

        if (priority.HasValue)
        {
            query = query.Where(x => x.Priority == priority.Value);
        }

        return await query.OrderBy(x => x.DueDate).ToListAsync(ct);
    }
}
