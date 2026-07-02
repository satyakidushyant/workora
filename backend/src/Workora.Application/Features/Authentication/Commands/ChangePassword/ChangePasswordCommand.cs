using MediatR;

namespace Workora.Application.Features.Authentication.Commands.ChangePassword;

/// <summary>
/// Command for an authenticated user to change their password.
/// </summary>
public record ChangePasswordCommand(int UserId, string OldPassword, string NewPassword) : IRequest;
