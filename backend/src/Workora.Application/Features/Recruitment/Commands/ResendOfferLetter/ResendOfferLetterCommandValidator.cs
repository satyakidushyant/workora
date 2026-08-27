using FluentValidation;

using Workora.Application.Features.Recruitment.DTOs;
namespace Workora.Application.Features.Recruitment.Commands.ResendOfferLetter;

/// <summary>
/// Validator for <see cref="ResendOfferLetterCommand"/>.
/// </summary>
public class ResendOfferLetterCommandValidator : AbstractValidator<ResendOfferLetterCommand>
{
    /// <summary>
    /// Initializes validation rules for ResendOfferLetterCommand.
    /// </summary>
    public ResendOfferLetterCommandValidator()
    {
        RuleFor(x => x.OfferId).GreaterThan(0).WithMessage("Valid offer ID is required.");
    }
}
