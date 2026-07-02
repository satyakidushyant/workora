namespace Workora.Application.Common.Interfaces;

/// <summary>
/// Service for sending emails.
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Sends a password reset email containing a reset link.
    /// </summary>
    /// <param name="toEmail">The recipient's email address.</param>
    /// <param name="resetLink">The secure password reset link.</param>
    /// <param name="ct">The cancellation token.</param>
    Task SendPasswordResetEmailAsync(string toEmail, string resetLink, CancellationToken ct = default);

    /// <summary>
    /// Sends a welcome email to newly registered users.
    /// </summary>
    /// <param name="toEmail">The recipient's email address.</param>
    /// <param name="name">The recipient's name.</param>
    /// <param name="ct">The cancellation token.</param>
    Task SendWelcomeEmailAsync(string toEmail, string name, CancellationToken ct = default);
}
