using MediatR;

namespace Workora.Application.Features.Authentication.Commands.ForgotPassword;

/// <summary>
/// Command for initiating the forgot password flow.
/// </summary>
/// <param name="Email">The email address of the user.</param>
public record ForgotPasswordCommand(string Email) : IRequest;
