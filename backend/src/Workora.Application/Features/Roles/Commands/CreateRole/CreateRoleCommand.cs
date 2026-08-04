using MediatR;
using Workora.Application.Features.Roles.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Roles.Commands.CreateRole;

/// <summary>
/// Command to create a new system or custom role.
/// </summary>
/// <param name="Name">The role name.</param>
/// <param name="Description">The role description.</param>
/// <param name="PermissionIds">Initial list of permission IDs.</param>
public record CreateRoleCommand(
    string Name,
    string? Description = null,
    List<int>? PermissionIds = null
) : IRequest<ApiResponse<RoleDto>>;
