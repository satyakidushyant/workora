namespace Workora.Application.Features.Authentication.DTOs;

/// <summary>
/// Data transfer object representing a user's active session/device.
/// </summary>
/// <param name="Id">The unique identifier representing the session (refresh token's Uuid).</param>
/// <param name="CreatedByIp">The IP address from which the session was created.</param>
/// <param name="CreatedByUserAgent">The client User-Agent header from which the session was created.</param>
/// <param name="ExpiresAt">The date and time when the session expires.</param>
public record UserSessionDto(
    Guid Id,
    string CreatedByIp,
    string CreatedByUserAgent,
    DateTimeOffset ExpiresAt
);
