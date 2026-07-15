using MediatR;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Commands.RefreshToken;

/// <summary>
/// Command for refreshing an access token using a refresh token.
/// </summary>
/// <param name="RefreshToken">The active refresh token.</param>
public record RefreshTokenCommand(string RefreshToken) : IRequest<ApiResponse<AuthResultDto>>;
