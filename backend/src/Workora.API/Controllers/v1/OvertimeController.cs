using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Overtime.Commands.ApproveOvertimeRequest;
using Workora.Application.Features.Overtime.Commands.CancelOvertimeRequest;
using Workora.Application.Features.Overtime.Commands.CreateOvertimeRequest;
using Workora.Application.Features.Overtime.Commands.RejectOvertimeRequest;
using Workora.Application.Features.Overtime.DTOs;
using Workora.Application.Features.Overtime.Queries.GetOvertimeReport;
using Workora.Application.Features.Overtime.Queries.GetOvertimeRequestsList;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for overtime request management and approval workflows.
/// </summary>
[ApiController]
[Route("api/v1/overtime")]
public class OvertimeController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="OvertimeController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public OvertimeController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Creates a new overtime request for an employee.
    /// </summary>
    /// <param name="command">The overtime request details.</param>
    /// <returns>The created overtime request.</returns>
    [HttpPost]
    [Authorize(Policy = "overtime.create")]
    public async Task<ApiResponse<OvertimeRequestDto>> Create([FromBody] CreateOvertimeRequestCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Gets a paginated list of overtime requests with optional filters.
    /// </summary>
    /// <param name="query">Pagination and filter parameters.</param>
    /// <returns>A paginated list of overtime requests.</returns>
    [HttpGet]
    [Authorize(Policy = "overtime.view")]
    public async Task<ApiResponse<PagedResponse<OvertimeRequestDto>>> GetList([FromQuery] GetOvertimeRequestsListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets an overtime report for a specific employee within a date range.
    /// </summary>
    /// <param name="employeeId">The employee ID.</param>
    /// <param name="fromDate">The start date.</param>
    /// <param name="toDate">The end date.</param>
    /// <returns>Overtime report summary.</returns>
    [HttpGet("report")]
    [Authorize(Policy = "overtime.view")]
    public async Task<ApiResponse<OvertimeReportDto>> GetReport(
        [FromQuery] int employeeId,
        [FromQuery] DateOnly fromDate,
        [FromQuery] DateOnly toDate)
        => await _mediator.Send(new GetOvertimeReportQuery(employeeId, fromDate, toDate));

    /// <summary>
    /// Approves a pending overtime request.
    /// </summary>
    /// <param name="id">The overtime request ID.</param>
    /// <param name="command">Optional approval comments.</param>
    /// <returns>The updated overtime request.</returns>
    [HttpPatch("{id:int}/approve")]
    [Authorize(Policy = "overtime.approve")]
    public async Task<ApiResponse<OvertimeRequestDto>> Approve(int id, [FromBody] ProcessOvertimeRequestDto? command)
        => await _mediator.Send(new ApproveOvertimeRequestCommand(id, command?.Comments));

    /// <summary>
    /// Rejects a pending overtime request.
    /// </summary>
    /// <param name="id">The overtime request ID.</param>
    /// <param name="command">Optional rejection comments.</param>
    /// <returns>The updated overtime request.</returns>
    [HttpPatch("{id:int}/reject")]
    [Authorize(Policy = "overtime.approve")]
    public async Task<ApiResponse<OvertimeRequestDto>> Reject(int id, [FromBody] ProcessOvertimeRequestDto? command)
        => await _mediator.Send(new RejectOvertimeRequestCommand(id, command?.Comments));

    /// <summary>
    /// Cancels a pending overtime request.
    /// </summary>
    /// <param name="id">The overtime request ID.</param>
    /// <returns>The updated overtime request.</returns>
    [HttpPatch("{id:int}/cancel")]
    [Authorize(Policy = "overtime.self")]
    public async Task<ApiResponse<OvertimeRequestDto>> Cancel(int id)
        => await _mediator.Send(new CancelOvertimeRequestCommand(id));
}