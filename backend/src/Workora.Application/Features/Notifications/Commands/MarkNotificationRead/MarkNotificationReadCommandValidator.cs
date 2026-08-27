using FluentValidation;

using Workora.Application.Features.Notifications.DTOs;
namespace Workora.Application.Features.Notifications.Commands.MarkNotificationRead;

/// <summary>
/// Validator for <see cref="MarkNotificationReadCommand"/>.
/// </summary>
public class MarkNotificationReadCommandValidator : AbstractValidator<MarkNotificationReadCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="MarkNotificationReadCommand"/>.
    /// </summary>
    public MarkNotificationReadCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
