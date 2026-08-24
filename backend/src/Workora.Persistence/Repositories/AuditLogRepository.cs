using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for system audit logs.
/// </summary>
public class AuditLogRepository : GenericRepository<AuditLog>, IAuditLogRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AuditLogRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public AuditLogRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<AuditLog>> GetAuditLogsPagedAsync(
        int pageNumber,
        int pageSize,
        int? userId = null,
        string? action = null,
        string? entityName = null,
        DateTimeOffset? fromDate = null,
        DateTimeOffset? toDate = null,
        CancellationToken ct = default)
    {
        var query = BuildQuery(userId, action, entityName, fromDate, toDate);

        return await query
            .OrderByDescending(a => a.Timestamp)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetAuditLogsCountAsync(
        int? userId = null,
        string? action = null,
        string? entityName = null,
        DateTimeOffset? fromDate = null,
        DateTimeOffset? toDate = null,
        CancellationToken ct = default)
    {
        var query = BuildQuery(userId, action, entityName, fromDate, toDate);
        return await query.CountAsync(ct);
    }

    private IQueryable<AuditLog> BuildQuery(
        int? userId,
        string? action,
        string? entityName,
        DateTimeOffset? fromDate,
        DateTimeOffset? toDate)
    {
        var query = _dbContext.Set<AuditLog>().AsNoTracking().AsQueryable();

        if (userId.HasValue)
        {
            query = query.Where(a => a.UserId == userId.Value);
        }

        if (!string.IsNullOrWhiteSpace(action))
        {
            query = query.Where(a => a.Action.ToLower() == action.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(entityName))
        {
            query = query.Where(a => a.EntityName.ToLower() == entityName.ToLower());
        }

        if (fromDate.HasValue)
        {
            query = query.Where(a => a.Timestamp >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(a => a.Timestamp <= toDate.Value);
        }

        return query;
    }
}
