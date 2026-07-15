using MediatR;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Commands.ChangePassword;

/// <summary>
/// Command for an authenticated user to change their password.
/// </summary>
/// <param name="UserId">The ID of the user.</param>
/// <param name="OldPassword">The user's current password.</param>
/// <param name="NewPassword">The new password to set.</param>
public record ChangePasswordCommand(int UserId, string OldPassword, string NewPassword) : IRequest<ApiResponse<ChangePasswordResponseDto>>;
