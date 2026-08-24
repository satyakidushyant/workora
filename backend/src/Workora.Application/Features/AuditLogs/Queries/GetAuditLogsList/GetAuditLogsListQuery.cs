using AutoMapper;
using MediatR;
using Workora.Application.Features.AuditLogs.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.AuditLogs.Queries.GetAuditLogsList;

/// <summary>
/// Query to search and paginate system audit logs.
/// </summary>
public record GetAuditLogsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    int? UserId = null,
    string? Action = null,
    string? EntityName = null,
    DateTimeOffset? FromDate = null,
    DateTimeOffset? ToDate = null) : IRequest<ApiResponse<PagedResponse<AuditLogDto>>>;

/// <summary>
/// Handler for <see cref="GetAuditLogsListQuery"/>.
/// </summary>
public class GetAuditLogsListQueryHandler : IRequestHandler<GetAuditLogsListQuery, ApiResponse<PagedResponse<AuditLogDto>>>
{
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetAuditLogsListQueryHandler"/> class.
    /// </summary>
    public GetAuditLogsListQueryHandler(IAuditLogRepository auditLogRepository, IMapper mapper)
    {
        _auditLogRepository = auditLogRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<AuditLogDto>>> Handle(GetAuditLogsListQuery request, CancellationToken ct)
    {
        var logs = await _auditLogRepository.GetAuditLogsPagedAsync(
            request.PageNumber,
            request.PageSize,
            request.UserId,
            request.Action,
            request.EntityName,
            request.FromDate,
            request.ToDate,
            ct);

        var totalCount = await _auditLogRepository.GetAuditLogsCountAsync(
            request.UserId,
            request.Action,
            request.EntityName,
            request.FromDate,
            request.ToDate,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<AuditLogDto>>(logs);
        var paged = new PagedResponse<AuditLogDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<AuditLogDto>>.Success(paged);
    }
}
