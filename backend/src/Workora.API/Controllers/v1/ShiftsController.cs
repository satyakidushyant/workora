using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Shifts.Commands.AssignShift;
using Workora.Application.Features.Shifts.Commands.CreateShift;
using Workora.Application.Features.Shifts.Commands.DeleteShift;
using Workora.Application.Features.Shifts.Commands.UnassignShift;
using Workora.Application.Features.Shifts.Commands.UpdateShift;
using Workora.Application.Features.Shifts.DTOs;
using Workora.Application.Features.Shifts.Queries.GetShiftById;
using Workora.Application.Features.Shifts.Queries.GetShiftsList;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing work shifts and employee scheduling.
/// </summary>
[ApiController]
[Route("api/v1/shifts")]
public class ShiftsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="ShiftsController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public ShiftsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets a paginated list of configured shifts.
    /// </summary>
    /// <param name="query">The search and pagination query.</param>
    /// <returns>A paginated list of shifts.</returns>
    [HttpGet]
    [Authorize(Policy = "shifts.view")]
    public async Task<ApiResponse<PagedResponse<ShiftDto>>> GetShifts([FromQuery] GetShiftsListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets details for a single shift.
    /// </summary>
    /// <param name="id">The shift ID.</param>
    /// <returns>The shift details.</returns>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "shifts.view")]
    public async Task<ApiResponse<ShiftDto>> GetShiftById(int id)
        => await _mediator.Send(new GetShiftByIdQuery(id));

    /// <summary>
    /// Creates a new shift definition.
    /// </summary>
    /// <param name="command">The create shift command payload.</param>
    /// <returns>The newly created shift.</returns>
    [HttpPost]
    [Authorize(Policy = "shifts.manage")]
    public async Task<ApiResponse<ShiftDto>> CreateShift([FromBody] CreateShiftCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Updates an existing shift definition.
    /// </summary>
    /// <param name="id">The shift ID.</param>
    /// <param name="command">The update shift command payload.</param>
    /// <returns>The updated shift.</returns>
    [HttpPut("{id:int}")]
    [Authorize(Policy = "shifts.manage")]
    public async Task<ApiResponse<ShiftDto>> UpdateShift(int id, [FromBody] UpdateShiftCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Deletes a shift.
    /// </summary>
    /// <param name="id">The shift ID.</param>
    /// <returns>A confirmation response.</returns>
    [HttpDelete("{id:int}")]
    [Authorize(Policy = "shifts.manage")]
    public async Task<ApiResponse<bool>> DeleteShift(int id)
        => await _mediator.Send(new DeleteShiftCommand(id));

    /// <summary>
    /// Assigns a shift to an employee.
    /// </summary>
    /// <param name="command">The shift assignment command payload.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPost("assign")]
    [Authorize(Policy = "shifts.manage")]
    public async Task<ApiResponse<bool>> AssignShift([FromBody] AssignShiftCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Unassigns / ends an active shift assignment for an employee.
    /// </summary>
    /// <param name="command">The unassign shift command payload.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPost("unassign")]
    [Authorize(Policy = "shifts.manage")]
    public async Task<ApiResponse<bool>> UnassignShift([FromBody] UnassignShiftCommand command)
        => await _mediator.Send(command);
}
