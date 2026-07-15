using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="RefreshToken"/> entities.
/// </summary>
public class RefreshTokenRepository : GenericRepository<RefreshToken>, IRefreshTokenRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="RefreshTokenRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public RefreshTokenRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<RefreshToken?> GetByTokenHashAsync(string tokenHash, CancellationToken ct = default)
    {
        return await _dbContext.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash, ct);
    }

    /// <inheritdoc />
    public async Task RevokeAllForUserAsync(int userId, CancellationToken ct = default)
    {
        var tokens = await _dbContext.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.IsRevoked)
            .ToListAsync(ct);

        foreach (var token in tokens)
        {
            token.Revoke();
        }
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<RefreshToken>> GetActiveSessionsByUserIdAsync(int userId, CancellationToken ct = default)
    {
        return await _dbContext.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.IsRevoked && rt.ExpiresAt > DateTimeOffset.UtcNow)
            .ToListAsync(ct);
    }
}
