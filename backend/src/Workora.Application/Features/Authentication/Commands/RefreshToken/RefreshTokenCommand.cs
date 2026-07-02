using MediatR;
using Workora.Application.Features.Authentication.DTOs;

namespace Workora.Application.Features.Authentication.Commands.RefreshToken;

/// <summary>
/// Command for refreshing an access token using a refresh token.
/// </summary>
public record RefreshTokenCommand(string RefreshToken) : IRequest<AuthResultDto>;
