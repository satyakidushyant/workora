using FluentValidation;

using Workora.Application.Features.Holidays.DTOs;
namespace Workora.Application.Features.Holidays.Commands.UpdateWeeklyOffPolicy;

/// <summary>
/// Validator for <see cref="UpdateWeeklyOffPolicyCommand"/>.
/// </summary>
public class UpdateWeeklyOffPolicyCommandValidator : AbstractValidator<UpdateWeeklyOffPolicyCommand>
{
    /// <summary>
    /// Initializes validation rules for UpdateWeeklyOffPolicyCommand.
    /// </summary>
    public UpdateWeeklyOffPolicyCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0);
        RuleFor(x => x.WeeklyOffDays).NotEmpty().WithMessage("Weekly off days setting is required.");
    }
}
