using MediatR;
using Workora.Shared.Responses;

using Workora.Application.Features.Roles.DTOs;
namespace Workora.Application.Features.Roles.Commands.DeleteRole;

/// <summary>
/// Command to delete a role.
/// </summary>
/// <param name="Id">The role ID to delete.</param>
public record DeleteRoleCommand(int Id) : IRequest<ApiResponse<bool>>;
