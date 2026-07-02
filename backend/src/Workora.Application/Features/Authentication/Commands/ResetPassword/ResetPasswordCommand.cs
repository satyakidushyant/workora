using MediatR;

namespace Workora.Application.Features.Authentication.Commands.ResetPassword;

/// <summary>
/// Command for resetting a user's password using a valid reset token.
/// </summary>
public record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest;
