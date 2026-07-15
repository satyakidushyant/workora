using MediatR;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Commands.ResetPassword;

/// <summary>
/// Command for resetting a user's password using a valid reset token.
/// </summary>
/// <param name="Email">The user's email address.</param>
/// <param name="Token">The password reset token.</param>
/// <param name="NewPassword">The new password to set.</param>
public record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest<ApiResponse<ResetPasswordResponseDto>>;
