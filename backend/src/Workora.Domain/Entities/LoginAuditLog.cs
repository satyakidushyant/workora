using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an audit log entry for login attempts.
/// </summary>
public class LoginAuditLog : BaseEntity
{
    /// <summary>
    /// The email address attempted for login.
    /// </summary>
    public string Email { get; private set; } = null!;

    /// <summary>
    /// Whether the login was successful.
    /// </summary>
    public bool IsSuccess { get; private set; }

    /// <summary>
    /// IP address of the client.
    /// </summary>
    public string IpAddress { get; private set; } = null!;

    /// <summary>
    /// User agent string of the client.
    /// </summary>
    public string UserAgent { get; private set; } = null!;

    /// <summary>
    /// Additional details about the attempt (e.g., failure reason).
    /// </summary>
    public string? Details { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private LoginAuditLog() { } // For EF Core

    /// <summary>
    /// Creates a new login audit log entry.
    /// </summary>
    /// <param name="email">The email attempted.</param>
    /// <param name="isSuccess">Indicates whether the attempt was successful.</param>
    /// <param name="ipAddress">The IP address of the client.</param>
    /// <param name="userAgent">The user agent of the client.</param>
    /// <param name="details">Optional details about the attempt.</param>
    /// <returns>A new instance of LoginAuditLog.</returns>
    public static LoginAuditLog Create(string email, bool isSuccess, string ipAddress, string userAgent, string? details = null)
    {
        return new LoginAuditLog
        {
            Email = email,
            IsSuccess = isSuccess,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            Details = details,
            CreatedAt = DateTimeOffset.UtcNow // Added standard tracking
        };
    }

    // Explicitly add CreatedAt as BaseEntity doesn't have it by default unless it's AuditableEntity
    /// <summary>
    /// The timestamp when the attempt occurred.
    /// </summary>
    public DateTimeOffset CreatedAt { get; private set; }
}
