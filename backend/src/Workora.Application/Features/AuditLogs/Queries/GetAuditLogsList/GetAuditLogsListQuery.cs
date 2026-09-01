using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.AuditLogs.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.AuditLogs.Queries.GetAuditLogsList;

/// <summary>
/// Query to search and paginate system audit logs with dynamic pagination and filtering.
/// </summary>
public record GetAuditLogsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<AuditLogDto>>>
{
    /// <summary>
    /// Gets or init optional filter for user ID.
    /// </summary>
    public int? UserId { get; init; }

    /// <summary>
    /// Gets or init optional filter for audit action.
    /// </summary>
    public string? Action { get; init; }

    /// <summary>
    /// Gets or init optional filter for target entity name.
    /// </summary>
    public string? EntityName { get; init; }

    /// <summary>
    /// Gets or init optional start date boundary.
    /// </summary>
    public DateTimeOffset? FromDate { get; init; }

    /// <summary>
    /// Gets or init optional end date boundary.
    /// </summary>
    public DateTimeOffset? ToDate { get; init; }
}

