using Workora.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace Workora.Infrastructure.Email;

/// <summary>
/// Dummy implementation of <see cref="IEmailService"/> for local development.
/// </summary>
public class SmtpEmailService : IEmailService
{
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(ILogger<SmtpEmailService> logger)
    {
        _logger = logger;
    }

    /// <inheritdoc />
    public Task SendPasswordResetEmailAsync(string toEmail, string resetLink, CancellationToken ct = default)
    {
        _logger.LogInformation("Sending password reset email to {Email}. Link: {Link}", toEmail, resetLink);
        // Implement real SMTP sending logic here (e.g. using MailKit)
        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public Task SendWelcomeEmailAsync(string toEmail, string name, CancellationToken ct = default)
    {
        _logger.LogInformation("Sending welcome email to {Email}", toEmail);
        return Task.CompletedTask;
    }
}
