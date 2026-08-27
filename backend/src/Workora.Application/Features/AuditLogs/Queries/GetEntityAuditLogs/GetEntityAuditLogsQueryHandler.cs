using MediatR;
using Workora.Application.Features.AuditLogs.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.AuditLogs.Queries.GetEntityAuditLogs;

/// <summary>
/// Handler for <see cref="GetEntityAuditLogsQuery"/>.
/// </summary>
public class GetEntityAuditLogsQueryHandler : IRequestHandler<GetEntityAuditLogsQuery, ApiResponse<IReadOnlyList<AuditLogDto>>>
{
    private readonly IGenericRepository<AuditLog> _auditRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetEntityAuditLogsQueryHandler"/> class.
    /// </summary>
    public GetEntityAuditLogsQueryHandler(IGenericRepository<AuditLog> auditRepository)
    {
        _auditRepository = auditRepository;
    }

    /// <summary>
    /// Executes retrieval of entity audit logs.
    /// </summary>
    public Task<ApiResponse<IReadOnlyList<AuditLogDto>>> Handle(GetEntityAuditLogsQuery request, CancellationToken cancellationToken)
    {
        var logs = _auditRepository.GetQueryable()
            .Where(a => a.EntityName.ToLower() == request.EntityName.ToLower() && a.EntityId == request.EntityId.ToString())
            .ToList()
            .Select(a => new AuditLogDto(
                a.Id,
                a.UserId,
                a.ActorEmail,
                a.Action,
                a.EntityName,
                a.EntityId,
                a.OldValues,
                a.NewValues,
                a.IpAddress,
                a.UserAgent,
                a.Timestamp))
            .ToList();

        return Task.FromResult(ApiResponse<IReadOnlyList<AuditLogDto>>.Success(logs, $"Audit logs for {request.EntityName} ID {request.EntityId} retrieved successfully."));
    }
}
