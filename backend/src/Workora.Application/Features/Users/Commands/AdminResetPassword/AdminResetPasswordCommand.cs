using MediatR;
using Workora.Shared.Responses;

using Workora.Application.Features.Users.DTOs;
namespace Workora.Application.Features.Users.Commands.AdminResetPassword;

/// <summary>
/// Command for an administrator to reset a user's password.
/// </summary>
/// <param name="UserId">The ID of the user whose password is being reset.</param>
/// <param name="NewPassword">The new plain-text password to assign.</param>
public record AdminResetPasswordCommand(int UserId, string NewPassword) : IRequest<ApiResponse<bool>>;
