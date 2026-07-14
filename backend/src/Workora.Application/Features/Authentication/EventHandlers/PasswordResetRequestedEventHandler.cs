using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Events.Authentication;

namespace Workora.Application.Features.Authentication.EventHandlers;

/// <summary>
/// Event handler that sends the password reset email when the event is published.
/// </summary>
public class PasswordResetRequestedEventHandler : INotificationHandler<PasswordResetRequestedEvent>
{
    private readonly IEmailService _emailService;

    /// <summary>
    /// Initializes a new instance of the <see cref="PasswordResetRequestedEventHandler"/> class.
    /// </summary>
    /// <param name="emailService">The email service.</param>
    public PasswordResetRequestedEventHandler(IEmailService emailService)
    {
        _emailService = emailService;
    }

    /// <summary>
    /// Handles the password reset requested event by sending an email.
    /// </summary>
    /// <param name="notification">The domain event.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    public async Task Handle(PasswordResetRequestedEvent notification, CancellationToken cancellationToken)
    {
        await _emailService.SendPasswordResetEmailAsync(notification.Email, notification.ResetLink, cancellationToken);
    }
}
