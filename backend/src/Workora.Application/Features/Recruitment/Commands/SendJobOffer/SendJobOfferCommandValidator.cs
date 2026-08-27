using FluentValidation;

using Workora.Application.Features.Recruitment.DTOs;
namespace Workora.Application.Features.Recruitment.Commands.SendJobOffer;

/// <summary>
/// Validator for <see cref="SendJobOfferCommand"/>.
/// </summary>
public class SendJobOfferCommandValidator : AbstractValidator<SendJobOfferCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="SendJobOfferCommand"/>.
    /// </summary>
    public SendJobOfferCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
