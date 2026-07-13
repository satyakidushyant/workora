using Workora.Domain.Entities;
using Workora.Domain.ValueObjects;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for User entities.
/// </summary>
public interface IUserRepository : IRepository<User>
{
    /// <summary>
    /// Gets a user by their email address.
    /// </summary>
    /// <param name="email">The email address.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>The user if found; otherwise, null.</returns>
    Task<User?> GetByEmailAsync(EmailAddress email, CancellationToken ct = default);

    /// <summary>
    /// Checks if an email is unique across all users.
    /// </summary>
    /// <param name="email">The email to check.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>True if the email is unique; otherwise, false.</returns>
    Task<bool> IsEmailUniqueAsync(EmailAddress email, CancellationToken ct = default);
}
