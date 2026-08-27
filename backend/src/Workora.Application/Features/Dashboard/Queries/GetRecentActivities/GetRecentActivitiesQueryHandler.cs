using MediatR;
using Workora.Application.Features.Dashboard.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.Queries.GetRecentActivities;

/// <summary>
/// Handler for <see cref="GetRecentActivitiesQuery"/>.
/// </summary>
public class GetRecentActivitiesQueryHandler : IRequestHandler<GetRecentActivitiesQuery, ApiResponse<IReadOnlyList<RecentActivityDto>>>
{
    private readonly IAuditLogRepository _auditLogRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetRecentActivitiesQueryHandler"/> class.
    /// </summary>
    public GetRecentActivitiesQueryHandler(IAuditLogRepository auditLogRepository)
    {
        _auditLogRepository = auditLogRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<RecentActivityDto>>> Handle(GetRecentActivitiesQuery request, CancellationToken ct)
    {
        var logs = await _auditLogRepository.GetAuditLogsPagedAsync(
            pageNumber: 1,
            pageSize: Math.Clamp(request.Limit, 1, 50),
            ct: ct);

        var dtos = logs.Select(l => new RecentActivityDto(
            l.Id,
            l.ActorEmail,
            l.Action,
            l.EntityName,
            l.EntityId,
            l.Timestamp)).ToList();

        return ApiResponse<IReadOnlyList<RecentActivityDto>>.Success(dtos);
    }
}
