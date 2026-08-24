using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Roles.Commands.CloneRole;
using Workora.Application.Features.Roles.Commands.CreateRole;
using Workora.Application.Features.Roles.Commands.DeleteRole;
using Workora.Application.Features.Roles.Commands.SetRolePermissions;
using Workora.Application.Features.Roles.Commands.UpdateRole;
using Workora.Application.Features.Roles.DTOs;
using Workora.Application.Features.Roles.Queries.GetRoleById;
using Workora.Application.Features.Roles.Queries.GetRolesList;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing system and custom roles.
/// </summary>
[ApiController]
[Route("api/v1/roles")]
public class RolesController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="RolesController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public RolesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lists all roles with pagination and search filtering.
    /// </summary>
    /// <param name="query">The query parameters.</param>
    /// <returns>A paginated list of roles.</returns>
    [HttpGet]
    [Authorize(Policy = "roles.view")]
    public async Task<ApiResponse<PagedResponse<RoleDto>>> GetRoles([FromQuery] GetRolesListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets role details including assigned permissions by ID.
    /// </summary>
    /// <param name="id">The role ID.</param>
    /// <returns>The role detail object.</returns>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "roles.view")]
    public async Task<ApiResponse<RoleDetailDto>> GetRoleById(int id)
        => await _mediator.Send(new GetRoleByIdQuery(id));

    /// <summary>
    /// Creates a new custom or system role.
    /// </summary>
    /// <param name="command">The role creation command payload.</param>
    /// <returns>The newly created role summary.</returns>
    [HttpPost]
    [Authorize(Policy = "roles.create")]
    public async Task<ApiResponse<RoleDto>> CreateRole([FromBody] CreateRoleCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Updates an existing role's name and description.
    /// </summary>
    /// <param name="id">The role ID.</param>
    /// <param name="command">The update command payload.</param>
    /// <returns>The updated role summary.</returns>
    [HttpPut("{id:int}")]
    [Authorize(Policy = "roles.update")]
    public async Task<ApiResponse<RoleDto>> UpdateRole(int id, [FromBody] UpdateRoleCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Deletes a custom role (protected system roles and in-use roles cannot be deleted).
    /// </summary>
    /// <param name="id">The role ID to delete.</param>
    /// <returns>A confirmation response.</returns>
    [HttpDelete("{id:int}")]
    [Authorize(Policy = "roles.delete")]
    public async Task<ApiResponse<bool>> DeleteRole(int id)
        => await _mediator.Send(new DeleteRoleCommand(id));

    /// <summary>
    /// Sets the full list of permissions assigned to a role.
    /// </summary>
    /// <param name="id">The target role ID.</param>
    /// <param name="command">The permission IDs command payload.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPut("{id:int}/permissions")]
    [Authorize(Policy = "roles.manage-permissions")]
    public async Task<ApiResponse<bool>> SetRolePermissions(int id, [FromBody] SetRolePermissionsCommand command)
        => await _mediator.Send(command with { RoleId = id });

    /// <summary>
    /// Clones an existing role along with its assigned permissions as a new role.
    /// </summary>
    /// <param name="id">The source role ID.</param>
    /// <param name="command">The clone command payload.</param>
    /// <returns>The new cloned role summary.</returns>
    [HttpPost("{id:int}/clone")]
    [Authorize(Policy = "roles.create")]
    public async Task<ApiResponse<RoleDto>> CloneRole(int id, [FromBody] CloneRoleCommand command)
        => await _mediator.Send(command with { SourceRoleId = id });
}
