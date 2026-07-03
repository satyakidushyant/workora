using MediatR;

namespace Workora.Application.Features.Authentication.Commands.Logout;

/// <summary>
/// Command for logging out a user by revoking all their refresh tokens.
/// </summary>
/// <param name="RefreshToken">The active refresh token to be revoked.</param>
public record LogoutCommand(string RefreshToken) : IRequest;
