using MediatR;
using Workora.Application.Features.Roles.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Roles.Commands.CloneRole;

/// <summary>
/// Command to clone an existing role and its permission assignments under a new role name.
/// </summary>
/// <param name="SourceRoleId">The existing role ID to clone from.</param>
/// <param name="NewName">The name for the new cloned role.</param>
/// <param name="Description">Optional description for the new role.</param>
public record CloneRoleCommand(
    int SourceRoleId,
    string NewName,
    string? Description = null
) : IRequest<ApiResponse<RoleDto>>;
