using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Assets.Commands.AssignAsset;
using Workora.Application.Features.Assets.Commands.CreateAsset;
using Workora.Application.Features.Assets.Commands.ReturnAsset;
using Workora.Application.Features.Assets.DTOs;
using Workora.Application.Features.Assets.Queries.GetAssetsList;
using Workora.Shared.Responses;
using Workora.Application.Features.Assets.Queries.GetAssetById;
using Workora.Application.Features.Assets.Commands.UpdateAsset;
using Workora.Application.Features.Assets.Queries.GetMyAssignedAssets;
namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for corporate hardware, inventory assets, and checkout assignments.
/// </summary>
[ApiController]
[Route("api/v1/assets")]
public class AssetsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="AssetsController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public AssetsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets a paginated list of corporate assets.
    /// </summary>
    /// <param name="query">Filter parameters.</param>
    /// <returns>A paginated list of assets.</returns>
    [HttpGet]
    [Authorize(Policy = "assets.view")]
    public async Task<ApiResponse<PagedResponse<AssetDto>>> GetAssets([FromQuery] GetAssetsListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Creates a new asset inventory record.
    /// </summary>
    /// <param name="command">The creation command payload.</param>
    /// <returns>The created asset.</returns>
    [HttpPost]
    [Authorize(Policy = "assets.manage")]
    public async Task<ApiResponse<AssetDto>> CreateAsset([FromBody] CreateAssetCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Checks out / assigns an asset to an employee.
    /// </summary>
    /// <param name="command">The assignment command payload.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPost("assign")]
    [Authorize(Policy = "assets.manage")]
    public async Task<ApiResponse<bool>> AssignAsset([FromBody] AssignAssetCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Returns an assigned asset back to company inventory.
    /// </summary>
    /// <param name="command">The return command payload.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPost("return")]
    [Authorize(Policy = "assets.manage")]
    public async Task<ApiResponse<bool>> ReturnAsset([FromBody] ReturnAssetCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Gets asset details by ID.
    /// </summary>
    /// <param name="id">The asset ID.</param>
    /// <returns>Asset detail object.</returns>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "assets.view")]
    public async Task<ApiResponse<AssetDto>> GetAssetById(int id)
        => await _mediator.Send(new GetAssetByIdQuery(id));

    /// <summary>
    /// Updates metadata for an existing asset.
    /// </summary>
    /// <param name="id">The asset ID.</param>
    /// <param name="command">Update payload.</param>
    /// <returns>Updated asset details.</returns>
    [HttpPut("{id:int}")]
    [Authorize(Policy = "assets.manage")]
    public async Task<ApiResponse<AssetDto>> UpdateAsset(int id, [FromBody] UpdateAssetCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Retrieves all assets currently checked out to the caller.
    /// </summary>
    /// <returns>List of assigned assets.</returns>
    [HttpGet("me")]
    [Authorize]
    public async Task<ApiResponse<IReadOnlyList<AssetDto>>> GetMyAssets()
        => await _mediator.Send(new GetMyAssignedAssetsQuery());
}
