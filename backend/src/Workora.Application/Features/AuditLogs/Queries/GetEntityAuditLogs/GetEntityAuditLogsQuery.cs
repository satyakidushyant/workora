using MediatR;
using Workora.Application.Features.AuditLogs.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.AuditLogs.Queries.GetEntityAuditLogs;

/// <summary>
/// Query to retrieve entity-specific change logs.
/// </summary>
public record GetEntityAuditLogsQuery(string EntityName, int EntityId) : IRequest<ApiResponse<IReadOnlyList<AuditLogDto>>>;
