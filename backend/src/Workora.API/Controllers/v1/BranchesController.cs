using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Branches.Commands.CreateBranch;
using Workora.Application.Features.Branches.Commands.DeleteBranch;
using Workora.Application.Features.Branches.Commands.UpdateBranch;
using Workora.Application.Features.Branches.DTOs;
using Workora.Application.Features.Branches.Queries.GetBranchById;
using Workora.Application.Features.Branches.Queries.GetBranchesList;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing company branches and office locations.
/// </summary>
[ApiController]
[Route("api/v1/branches")]
public class BranchesController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="BranchesController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public BranchesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets a paginated list of branches.
    /// </summary>
    /// <param name="query">The search and pagination query parameters.</param>
    /// <returns>A paginated list of branches.</returns>
    [HttpGet]
    [Authorize(Policy = "branches.view")]
    public async Task<ApiResponse<PagedResponse<BranchDto>>> GetBranches([FromQuery] GetBranchesListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets detailed information for a single branch.
    /// </summary>
    /// <param name="id">The branch ID.</param>
    /// <returns>The branch details.</returns>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "branches.view")]
    public async Task<ApiResponse<BranchDto>> GetBranchById(int id)
        => await _mediator.Send(new GetBranchByIdQuery(id));

    /// <summary>
    /// Creates a new branch office.
    /// </summary>
    /// <param name="command">The create branch command payload.</param>
    /// <returns>The newly created branch.</returns>
    [HttpPost]
    [Authorize(Policy = "branches.manage")]
    public async Task<ApiResponse<BranchDto>> CreateBranch([FromBody] CreateBranchCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Updates an existing branch office.
    /// </summary>
    /// <param name="id">The branch ID.</param>
    /// <param name="command">The update branch command payload.</param>
    /// <returns>The updated branch.</returns>
    [HttpPut("{id:int}")]
    [Authorize(Policy = "branches.manage")]
    public async Task<ApiResponse<BranchDto>> UpdateBranch(int id, [FromBody] UpdateBranchCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Deletes a branch office.
    /// </summary>
    /// <param name="id">The branch ID.</param>
    /// <returns>A confirmation response.</returns>
    [HttpDelete("{id:int}")]
    [Authorize(Policy = "branches.manage")]
    public async Task<ApiResponse<bool>> DeleteBranch(int id)
        => await _mediator.Send(new DeleteBranchCommand(id));
}
