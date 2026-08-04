using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Permissions.DTOs;
using Workora.Application.Features.Permissions.Queries.GetPermissionsList;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for viewing the system permissions catalog.
/// </summary>
[ApiController]
[Route("api/v1/permissions")]
public class PermissionsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="PermissionsController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public PermissionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lists all system permissions grouped by parent module.
    /// </summary>
    /// <returns>A collection of permissions grouped by module.</returns>
    [HttpGet]
    [Authorize(Policy = "permissions.view")]
    public async Task<ApiResponse<IReadOnlyList<ModulePermissionsDto>>> GetPermissions()
        => await _mediator.Send(new GetPermissionsListQuery());
}
