using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a refresh token for maintaining user sessions.
/// </summary>
public class RefreshToken : AuditableEntity
{
    /// <summary>
    /// The hashed token string.
    /// </summary>
    public string TokenHash { get; private set; } = null!;

    /// <summary>
    /// The ID of the user that owns this token.
    /// </summary>
    public int UserId { get; private set; }

    /// <summary>
    /// Expiration date of the refresh token.
    /// </summary>
    public DateTimeOffset ExpiresAt { get; private set; }

    /// <summary>
    /// The IP address that requested the token.
    /// </summary>
    public string CreatedByIp { get; private set; } = null!;

    /// <summary>
    /// The user agent that requested the token.
    /// </summary>
    public string CreatedByUserAgent { get; private set; } = null!;

    /// <summary>
    /// Indicates whether the token has been revoked.
    /// </summary>
    public bool IsRevoked { get; private set; }

    /// <summary>
    /// Date when the token was revoked.
    /// </summary>
    public DateTimeOffset? RevokedAt { get; private set; }

    /// <summary>
    /// Gets a value indicating whether the token has expired.
    /// </summary>
    public bool IsExpired => DateTimeOffset.UtcNow >= ExpiresAt;

    /// <summary>
    /// Gets a value indicating whether the token is currently active and not revoked.
    /// </summary>
    public bool IsActiveToken => !IsRevoked && !IsExpired;

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private RefreshToken() { } // For EF Core

    /// <summary>
    /// Creates a new RefreshToken instance.
    /// </summary>
    /// <param name="userId">The ID of the user owning the token.</param>
    /// <param name="tokenHash">The hashed token string.</param>
    /// <param name="expiresAt">The expiration date and time.</param>
    /// <param name="ipAddress">The IP address from which the token was requested.</param>
    /// <param name="userAgent">The user agent from which the token was requested.</param>
    /// <returns>A new RefreshToken entity.</returns>
    public static RefreshToken Create(int userId, string tokenHash, DateTimeOffset expiresAt, string ipAddress, string userAgent)
    {
        return new RefreshToken
        {
            UserId = userId,
            TokenHash = tokenHash,
            ExpiresAt = expiresAt,
            CreatedByIp = ipAddress,
            CreatedByUserAgent = userAgent
        };
    }

    /// <summary>
    /// Revokes the refresh token.
    /// </summary>
    public void Revoke()
    {
        IsRevoked = true;
        RevokedAt = DateTimeOffset.UtcNow;
    }
}
