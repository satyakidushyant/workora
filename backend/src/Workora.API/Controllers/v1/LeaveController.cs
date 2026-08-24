using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Leave.Commands.ApplyLeave;
using Workora.Application.Features.Leave.Commands.ApproveLeave;
using Workora.Application.Features.Leave.Commands.CancelLeave;
using Workora.Application.Features.Leave.Commands.CreateLeaveType;
using Workora.Application.Features.Leave.Commands.RejectLeave;
using Workora.Application.Features.Leave.Commands.UpdateLeaveType;
using Workora.Application.Features.Leave.DTOs;
using Workora.Application.Features.Leave.Queries.GetLeaveBalances;
using Workora.Application.Features.Leave.Queries.GetLeaveCalendar;
using Workora.Application.Features.Leave.Queries.GetLeaveRequestsList;
using Workora.Application.Features.Leave.Queries.GetLeaveTypesList;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for leave applications, balances, approvals, policy types, and team calendars.
/// </summary>
[ApiController]
[Route("api/v1/leave")]
public class LeaveController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="LeaveController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public LeaveController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Submits a new leave request application.
    /// </summary>
    /// <param name="command">The leave application command payload.</param>
    /// <returns>The created leave request.</returns>
    [HttpPost("requests")]
    [Authorize(Policy = "leave.apply")]
    public async Task<ApiResponse<LeaveRequestDto>> ApplyLeave([FromBody] ApplyLeaveCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Gets a paginated list of leave requests with filters.
    /// </summary>
    /// <param name="query">Filter parameters.</param>
    /// <returns>A paginated list of leave requests.</returns>
    [HttpGet("requests")]
    [Authorize(Policy = "leave.view")]
    public async Task<ApiResponse<PagedResponse<LeaveRequestDto>>> GetLeaveRequests([FromQuery] GetLeaveRequestsListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Approves a pending leave request.
    /// </summary>
    /// <param name="id">The leave request ID.</param>
    /// <param name="command">Optional approval command.</param>
    /// <returns>The updated leave request.</returns>
    [HttpPatch("requests/{id:int}/approve")]
    [Authorize(Policy = "leave.approve")]
    public async Task<ApiResponse<LeaveRequestDto>> ApproveLeave(int id, [FromBody] ApproveLeaveCommand? command)
        => await _mediator.Send((command ?? new ApproveLeaveCommand(id, null)) with { Id = id });

    /// <summary>
    /// Rejects a pending leave request.
    /// </summary>
    /// <param name="id">The leave request ID.</param>
    /// <param name="command">Optional rejection command.</param>
    /// <returns>The updated leave request.</returns>
    [HttpPatch("requests/{id:int}/reject")]
    [Authorize(Policy = "leave.approve")]
    public async Task<ApiResponse<LeaveRequestDto>> RejectLeave(int id, [FromBody] RejectLeaveCommand? command)
        => await _mediator.Send((command ?? new RejectLeaveCommand(id, null)) with { Id = id });

    /// <summary>
    /// Cancels a leave request.
    /// </summary>
    /// <param name="id">The leave request ID.</param>
    /// <returns>The updated leave request.</returns>
    [HttpPatch("requests/{id:int}/cancel")]
    [Authorize(Policy = "leave.apply")]
    public async Task<ApiResponse<LeaveRequestDto>> CancelLeave(int id)
        => await _mediator.Send(new CancelLeaveCommand(id));

    /// <summary>
    /// Gets an employee's annual leave balance quotas.
    /// </summary>
    /// <param name="employeeId">The employee ID.</param>
    /// <param name="year">The calendar year.</param>
    /// <returns>A list of balances by leave type.</returns>
    [HttpGet("balances/{employeeId:int}")]
    [Authorize(Policy = "leave.view")]
    public async Task<ApiResponse<IReadOnlyList<LeaveBalanceDto>>> GetLeaveBalances(int employeeId, [FromQuery] int year)
        => await _mediator.Send(new GetLeaveBalancesQuery(employeeId, year));

    /// <summary>
    /// Gets all configured leave types.
    /// </summary>
    /// <param name="companyId">Optional company identifier.</param>
    /// <returns>A list of leave types.</returns>
    [HttpGet("types")]
    [Authorize(Policy = "leave.view")]
    public async Task<ApiResponse<IReadOnlyList<LeaveTypeDto>>> GetLeaveTypes([FromQuery] int? companyId = null)
        => await _mediator.Send(new GetLeaveTypesListQuery(companyId));

    /// <summary>
    /// Creates a new leave type policy.
    /// </summary>
    /// <param name="command">The leave type creation command payload.</param>
    /// <returns>The created leave type.</returns>
    [HttpPost("types")]
    [Authorize(Policy = "leave.manage")]
    public async Task<ApiResponse<LeaveTypeDto>> CreateLeaveType([FromBody] CreateLeaveTypeCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Updates an existing leave type policy.
    /// </summary>
    /// <param name="id">The leave type ID.</param>
    /// <param name="command">The update leave type command payload.</param>
    /// <returns>The updated leave type.</returns>
    [HttpPut("types/{id:int}")]
    [Authorize(Policy = "leave.manage")]
    public async Task<ApiResponse<LeaveTypeDto>> UpdateLeaveType(int id, [FromBody] UpdateLeaveTypeCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Retrieves approved leave schedule across employees for calendar display.
    /// </summary>
    /// <param name="startDate">The start date.</param>
    /// <param name="endDate">The end date.</param>
    /// <param name="departmentId">Optional department filter.</param>
    /// <returns>A list of calendar leave events.</returns>
    [HttpGet("calendar")]
    [Authorize(Policy = "leave.view")]
    public async Task<ApiResponse<IReadOnlyList<LeaveCalendarItemDto>>> GetLeaveCalendar(
        [FromQuery] DateOnly startDate,
        [FromQuery] DateOnly endDate,
        [FromQuery] int? departmentId = null)
        => await _mediator.Send(new GetLeaveCalendarQuery(startDate, endDate, departmentId));
}
