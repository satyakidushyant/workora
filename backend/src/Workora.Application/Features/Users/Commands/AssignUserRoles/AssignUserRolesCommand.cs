using MediatR;
using Workora.Shared.Responses;

using Workora.Application.Features.Users.DTOs;
namespace Workora.Application.Features.Users.Commands.AssignUserRoles;

/// <summary>
/// Command to assign a set of role IDs to a user account.
/// </summary>
/// <param name="UserId">The ID of the target user.</param>
/// <param name="RoleIds">The collection of role IDs to assign.</param>
public record AssignUserRolesCommand(int UserId, List<int> RoleIds) : IRequest<ApiResponse<bool>>;
