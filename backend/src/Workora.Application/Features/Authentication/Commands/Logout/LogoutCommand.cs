using MediatR;

namespace Workora.Application.Features.Authentication.Commands.Logout;

/// <summary>
/// Command for logging out a user by revoking all their refresh tokens.
/// </summary>
public record LogoutCommand(string RefreshToken) : IRequest;
