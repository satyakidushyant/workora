using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Designations.Commands.CreateDesignation;
using Workora.Application.Features.Designations.Commands.DeleteDesignation;
using Workora.Application.Features.Designations.Commands.UpdateDesignation;
using Workora.Application.Features.Designations.DTOs;
using Workora.Application.Features.Designations.Queries.GetDesignationById;
using Workora.Application.Features.Designations.Queries.GetDesignationsList;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing job designations and titles.
/// </summary>
[ApiController]
[Route("api/v1/designations")]
public class DesignationsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="DesignationsController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public DesignationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets a paginated list of designations.
    /// </summary>
    /// <param name="query">The query parameters.</param>
    /// <returns>A paginated list of designations.</returns>
    [HttpGet]
    [Authorize(Policy = "designations.view")]
    public async Task<ApiResponse<PagedResponse<DesignationDto>>> GetDesignations([FromQuery] GetDesignationsListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets detailed information for a single designation.
    /// </summary>
    /// <param name="id">The designation ID.</param>
    /// <returns>The designation details.</returns>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "designations.view")]
    public async Task<ApiResponse<DesignationDto>> GetDesignationById(int id)
        => await _mediator.Send(new GetDesignationByIdQuery(id));

    /// <summary>
    /// Creates a new designation.
    /// </summary>
    /// <param name="command">The create designation command payload.</param>
    /// <returns>The newly created designation.</returns>
    [HttpPost]
    [Authorize(Policy = "designations.create")]
    public async Task<ApiResponse<DesignationDto>> CreateDesignation([FromBody] CreateDesignationCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Updates an existing designation.
    /// </summary>
    /// <param name="id">The designation ID.</param>
    /// <param name="command">The update designation command payload.</param>
    /// <returns>The updated designation.</returns>
    [HttpPut("{id:int}")]
    [Authorize(Policy = "designations.update")]
    public async Task<ApiResponse<DesignationDto>> UpdateDesignation(int id, [FromBody] UpdateDesignationCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Deletes a designation.
    /// </summary>
    /// <param name="id">The designation ID.</param>
    /// <returns>A confirmation response.</returns>
    [HttpDelete("{id:int}")]
    [Authorize(Policy = "designations.delete")]
    public async Task<ApiResponse<bool>> DeleteDesignation(int id)
        => await _mediator.Send(new DeleteDesignationCommand(id));
}
