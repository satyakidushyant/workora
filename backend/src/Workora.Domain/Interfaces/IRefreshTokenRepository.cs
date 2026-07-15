using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for RefreshToken entities.
/// </summary>
public interface IRefreshTokenRepository : IRepository<RefreshToken>
{
    /// <summary>
    /// Gets a refresh token by its hashed value.
    /// </summary>
    /// <param name="tokenHash">The hashed token string.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>The refresh token if found; otherwise, null.</returns>
    Task<RefreshToken?> GetByTokenHashAsync(string tokenHash, CancellationToken ct = default);

    /// <summary>
    /// Revokes all active refresh tokens for a specific user.
    /// </summary>
    /// <param name="userId">The ID of the user.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task RevokeAllForUserAsync(int userId, CancellationToken ct = default);

    /// <summary>
    /// Gets all active refresh tokens for a specific user.
    /// </summary>
    /// <param name="userId">The ID of the user.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>A list of active refresh tokens.</returns>
    Task<IReadOnlyList<RefreshToken>> GetActiveSessionsByUserIdAsync(int userId, CancellationToken ct = default);
}
