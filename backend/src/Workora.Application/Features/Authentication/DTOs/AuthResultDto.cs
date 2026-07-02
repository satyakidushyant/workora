namespace Workora.Application.Features.Authentication.DTOs;

/// <summary>
/// Data transfer object containing the authentication tokens.
/// </summary>
/// <param name="AccessToken">The JWT access token.</param>
/// <param name="RefreshToken">The refresh token.</param>
/// <param name="ExpiresIn">Seconds until the access token expires.</param>
public record AuthResultDto(string AccessToken, string RefreshToken, int ExpiresIn);
