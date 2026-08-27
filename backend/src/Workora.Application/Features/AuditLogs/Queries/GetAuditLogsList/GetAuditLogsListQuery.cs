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
