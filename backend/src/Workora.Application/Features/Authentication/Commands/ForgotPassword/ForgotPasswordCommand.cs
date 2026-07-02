using MediatR;

namespace Workora.Application.Features.Authentication.Commands.ForgotPassword;

/// <summary>
/// Command for initiating the forgot password flow.
/// </summary>
public record ForgotPasswordCommand(string Email) : IRequest;
