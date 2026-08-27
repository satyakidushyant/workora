using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.AuditLogs.DTOs;
using Workora.Application.Features.AuditLogs.Queries.GetAuditLogsList;
using Workora.Shared.Responses;
using Workora.Application.Features.AuditLogs.Queries.GetEntityAuditLogs;
using Workora.Application.Features.AuditLogs.Queries.ExportAuditLogs;

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

    /// <summary>
    /// Gets entity-specific change history logs.
    /// </summary>
    /// <param name="entity">Target entity name (e.g. Employee, PayrollRun).</param>
    /// <param name="id">Target entity ID.</param>
    /// <returns>List of audit log change entries.</returns>
    [HttpGet("{entity}/{id:int}")]
    [Authorize(Policy = "audit.view")]
    public async Task<ApiResponse<IReadOnlyList<AuditLogDto>>> GetEntityAuditLogs(string entity, int id)
        => await _mediator.Send(new GetEntityAuditLogsQuery(entity, id));

    /// <summary>
    /// Exports audit log records as a CSV file.
    /// </summary>
    /// <param name="companyId">Company identifier.</param>
    /// <returns>CSV file download URL.</returns>
    [HttpGet("export")]
    [Authorize(Policy = "audit.view")]
    public async Task<ApiResponse<string>> ExportAuditLogs([FromQuery] int companyId)
        => await _mediator.Send(new ExportAuditLogsQuery(companyId));
}
