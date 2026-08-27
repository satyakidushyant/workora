using FluentValidation;

using Workora.Application.Features.Notifications.DTOs;
namespace Workora.Application.Features.Notifications.Commands.MarkAllNotificationsRead;

/// <summary>
/// Validator for <see cref="MarkAllNotificationsReadCommand"/>.
/// </summary>
public class MarkAllNotificationsReadCommandValidator : AbstractValidator<MarkAllNotificationsReadCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="MarkAllNotificationsReadCommand"/>.
    /// </summary>
    public MarkAllNotificationsReadCommandValidator()
    {
    }
}
