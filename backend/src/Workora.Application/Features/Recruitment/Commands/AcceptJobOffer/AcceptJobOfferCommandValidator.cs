using FluentValidation;

using Workora.Application.Features.Recruitment.DTOs;
namespace Workora.Application.Features.Recruitment.Commands.AcceptJobOffer;

/// <summary>
/// Validator for <see cref="AcceptJobOfferCommand"/>.
/// </summary>
public class AcceptJobOfferCommandValidator : AbstractValidator<AcceptJobOfferCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="AcceptJobOfferCommand"/>.
    /// </summary>
    public AcceptJobOfferCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
