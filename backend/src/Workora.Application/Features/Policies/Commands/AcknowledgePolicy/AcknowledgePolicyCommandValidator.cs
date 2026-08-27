using FluentValidation;

using Workora.Application.Features.Policies.DTOs;
namespace Workora.Application.Features.Policies.Commands.AcknowledgePolicy;

/// <summary>
/// Validator for <see cref="AcknowledgePolicyCommand"/>.
/// </summary>
public class AcknowledgePolicyCommandValidator : AbstractValidator<AcknowledgePolicyCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="AcknowledgePolicyCommand"/>.
    /// </summary>
    public AcknowledgePolicyCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
