using Workora.Domain.Entities;

namespace Workora.Application.Common.Interfaces;

/// <summary>
/// Service for generating and managing JWT and refresh tokens.
/// </summary>
public interface ITokenService
{
    /// <summary>
    /// Generates a JWT access token for the specified user.
    /// </summary>
    /// <param name="user">The authenticated user.</param>
    /// <param name="roles">The roles assigned to the user.</param>
    /// <param name="permissions">The permissions granted to the user.</param>
    /// <returns>A JWT string.</returns>
    string GenerateAccessToken(User user, IEnumerable<string> roles, IEnumerable<string> permissions);

    /// <summary>
    /// Generates a cryptographically secure, random refresh token string.
    /// </summary>
    /// <returns>A random token string.</returns>
    string GenerateRefreshToken();

    /// <summary>
    /// Computes a hash for the given token string to be stored securely.
    /// </summary>
    /// <param name="token">The plain-text token.</param>
    /// <returns>The hashed token.</returns>
    string HashToken(string token);
}
