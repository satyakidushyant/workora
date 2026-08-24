using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.AuditLogs.DTOs;
using Workora.Application.Features.AuditLogs.Queries.GetAuditLogsList;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for querying system-wide audit trail logs.
/// </summary>
[ApiController]
[Route("api/v1/audit-logs")]
public class AuditLogsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="AuditLogsController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public AuditLogsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Queries the immutable system audit trail with filtering criteria.
    /// </summary>
    /// <param name="query">Filter parameters.</param>
    /// <returns>A paginated list of audit records.</returns>
    [HttpGet]
    [Authorize(Policy = "audit.view")]
    public async Task<ApiResponse<PagedResponse<AuditLogDto>>> GetAuditLogs([FromQuery] GetAuditLogsListQuery query)
        => await _mediator.Send(query);
}
