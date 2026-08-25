using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.FieldTracking.Commands.CheckInClientVisit;
using Workora.Application.Features.FieldTracking.Commands.CheckOutClientVisit;
using Workora.Application.Features.FieldTracking.Commands.RecordLiveGpsPing;
using Workora.Application.Features.FieldTracking.DTOs;
using Workora.Application.Features.FieldTracking.Queries.GetEmployeeVisitHistory;
using Workora.Application.Features.FieldTracking.Queries.GetFieldLiveLocations;
using Workora.Application.Features.FieldTracking.Queries.GetTravelDistanceReport;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing field employees, live GPS tracking, and client visit logs.
/// </summary>
[ApiController]
[Route("api/v1/field")]
public class FieldTrackingController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="FieldTrackingController"/> class.
    /// </summary>
    public FieldTrackingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets real-time GPS locations of all active field agents.
    /// </summary>
    [HttpGet("locations")]
    [Authorize(Policy = "field.view")]
    public async Task<ApiResponse<List<LiveLocationDto>>> GetLiveLocations()
        => await _mediator.Send(new GetFieldLiveLocationsQuery());

    /// <summary>
    /// Gets visit history for a specific employee within a date range.
    /// </summary>
    [HttpGet("visits/history/{employeeId:int}")]
    [Authorize(Policy = "field.view")]
    public async Task<ApiResponse<List<FieldVisitDto>>> GetVisitHistory(int employeeId, [FromQuery] DateOnly? fromDate, [FromQuery] DateOnly? toDate)
        => await _mediator.Send(new GetEmployeeVisitHistoryQuery(employeeId, fromDate, toDate));

    /// <summary>
    /// Gets distance traveled metrics for an employee.
    /// </summary>
    [HttpGet("reports/travel-km/{employeeId:int}")]
    [Authorize(Policy = "field.view")]
    public async Task<ApiResponse<TravelDistanceSummaryDto>> GetTravelDistanceReport(int employeeId, [FromQuery] DateOnly fromDate, [FromQuery] DateOnly toDate)
        => await _mediator.Send(new GetTravelDistanceReportQuery(employeeId, fromDate, toDate));

    /// <summary>
    /// Records periodic GPS telemetry ping from mobile device.
    /// </summary>
    [HttpPost("ping-location")]
    [Authorize(Policy = "field.track")]
    public async Task<ApiResponse<bool>> RecordGpsPing([FromBody] RecordLiveGpsPingCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Checks in at a client location.
    /// </summary>
    [HttpPost("visits/check-in")]
    [Authorize(Policy = "field.track")]
    public async Task<ApiResponse<FieldVisitDto>> CheckInVisit([FromBody] CheckInClientVisitCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Checks out from a client location.
    /// </summary>
    [HttpPost("visits/check-out")]
    [Authorize(Policy = "field.track")]
    public async Task<ApiResponse<FieldVisitDto>> CheckOutVisit([FromBody] CheckOutClientVisitCommand command)
        => await _mediator.Send(command);
}
