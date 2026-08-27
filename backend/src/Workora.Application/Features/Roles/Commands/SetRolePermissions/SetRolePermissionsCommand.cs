using MediatR;
using Workora.Shared.Responses;

using Workora.Application.Features.Roles.DTOs;
namespace Workora.Application.Features.Roles.Commands.SetRolePermissions;

/// <summary>
/// Command to update the list of permissions assigned to a role.
/// </summary>
/// <param name="RoleId">The target role ID.</param>
/// <param name="PermissionIds">The complete list of permission IDs to assign.</param>
public record SetRolePermissionsCommand(
    int RoleId,
    List<int> PermissionIds
) : IRequest<ApiResponse<bool>>;
