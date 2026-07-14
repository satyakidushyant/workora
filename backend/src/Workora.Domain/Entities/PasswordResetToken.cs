using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a token used for password resets.
/// </summary>
public class PasswordResetToken : AuditableEntity
{
    /// <summary>
    /// The ID of the user requesting the reset.
    /// </summary>
    public int UserId { get; private set; }

    /// <summary>
    /// The hashed reset token.
    /// </summary>
    public string TokenHash { get; private set; } = null!;

    /// <summary>
    /// Expiration date of the token.
    /// </summary>
    public DateTimeOffset ExpiresAt { get; private set; }

    /// <summary>
    /// Indicates whether the token was already used.
    /// </summary>
    public bool IsUsed { get; private set; }

    /// <summary>
    /// Gets a value indicating whether the token is valid (not used and not expired).
    /// </summary>
    public bool IsValid => !IsUsed && DateTimeOffset.UtcNow <= ExpiresAt;

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private PasswordResetToken() { } // For EF Core

    /// <summary>
    /// Creates a new PasswordResetToken instance and raises a domain event.
    /// </summary>
    /// <param name="userId">The ID of the user requesting the reset.</param>
    /// <param name="tokenHash">The hashed reset token.</param>
    /// <param name="expiresAt">The expiration date and time.</param>
    /// <param name="email">The user's email address.</param>
    /// <param name="resetLink">The full reset link.</param>
    /// <returns>A new PasswordResetToken entity.</returns>
    public static PasswordResetToken Create(int userId, string tokenHash, DateTimeOffset expiresAt, string email, string resetLink)
    {
        var token = new PasswordResetToken
        {
            UserId = userId,
            TokenHash = tokenHash,
            ExpiresAt = expiresAt
        };

        token.AddDomainEvent(new Workora.Domain.Events.Authentication.PasswordResetRequestedEvent(email, resetLink));
        
        return token;
    }

    /// <summary>
    /// Marks the token as used so it cannot be used again.
    /// </summary>
    public void MarkAsUsed()
    {
        IsUsed = true;
    }
}
