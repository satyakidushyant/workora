using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for PasswordResetToken entities.
/// </summary>
public interface IPasswordResetTokenRepository : IRepository<PasswordResetToken>
{
    /// <summary>
    /// Gets a password reset token by its hashed value.
    /// </summary>
    /// <param name="tokenHash">The hashed token string.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>The password reset token if found; otherwise, null.</returns>
    Task<PasswordResetToken?> GetByTokenHashAsync(string tokenHash, CancellationToken ct = default);
}
