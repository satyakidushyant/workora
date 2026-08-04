using MediatR;
using Workora.Application.Features.Roles.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Roles.Commands.UpdateRole;

/// <summary>
/// Command to update role details.
/// </summary>
/// <param name="Id">The role ID.</param>
/// <param name="Name">The updated role name.</param>
/// <param name="Description">The updated description.</param>
public record UpdateRoleCommand(
    int Id,
    string Name,
    string? Description = null
) : IRequest<ApiResponse<RoleDto>>;
