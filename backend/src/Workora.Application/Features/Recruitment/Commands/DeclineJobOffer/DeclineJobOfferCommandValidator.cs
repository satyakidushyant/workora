using FluentValidation;

using Workora.Application.Features.Recruitment.DTOs;
namespace Workora.Application.Features.Recruitment.Commands.DeclineJobOffer;

/// <summary>
/// Validator for <see cref="DeclineJobOfferCommand"/>.
/// </summary>
public class DeclineJobOfferCommandValidator : AbstractValidator<DeclineJobOfferCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="DeclineJobOfferCommand"/>.
    /// </summary>
    public DeclineJobOfferCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
