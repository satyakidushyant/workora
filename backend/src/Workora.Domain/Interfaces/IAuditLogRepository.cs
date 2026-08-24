using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for system audit logging.
/// </summary>
public interface IAuditLogRepository : IRepository<AuditLog>
{
    /// <summary>
    /// Gets a paginated list of audit logs with filtering.
    /// </summary>
    Task<IReadOnlyList<AuditLog>> GetAuditLogsPagedAsync(
        int pageNumber,
        int pageSize,
        int? userId = null,
        string? action = null,
        string? entityName = null,
        DateTimeOffset? fromDate = null,
        DateTimeOffset? toDate = null,
        CancellationToken ct = default);

    /// <summary>
    /// Gets total count of audit logs matching criteria.
    /// </summary>
    Task<int> GetAuditLogsCountAsync(
        int? userId = null,
        string? action = null,
        string? entityName = null,
        DateTimeOffset? fromDate = null,
        DateTimeOffset? toDate = null,
        CancellationToken ct = default);
}
