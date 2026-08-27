using FluentValidation;

using Workora.Application.Features.Policies.DTOs;
namespace Workora.Application.Features.Policies.Commands.CreatePolicyVersion;

/// <summary>
/// Validator for <see cref="CreatePolicyVersionCommand"/>.
/// </summary>
public class CreatePolicyVersionCommandValidator : AbstractValidator<CreatePolicyVersionCommand>
{
    /// <summary>
    /// Initializes validation rules for CreatePolicyVersionCommand.
    /// </summary>
    public CreatePolicyVersionCommandValidator()
    {
        RuleFor(x => x.PolicyId).GreaterThan(0).WithMessage("Valid policy ID is required.");
        RuleFor(x => x.VersionNumber).NotEmpty().WithMessage("Version number is required.");
        RuleFor(x => x.Content).NotEmpty().WithMessage("Policy content is required.");
    }
}
