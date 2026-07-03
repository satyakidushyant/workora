using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="PasswordResetToken"/> entities.
/// </summary>
public class PasswordResetTokenRepository : GenericRepository<PasswordResetToken>, IPasswordResetTokenRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="PasswordResetTokenRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public PasswordResetTokenRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<PasswordResetToken?> GetByTokenHashAsync(string tokenHash, CancellationToken ct = default)
    {
        return await _dbContext.PasswordResetTokens.FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash, ct);
    }
}
