using FluentValidation;

using Workora.Application.Features.Recruitment.DTOs;
namespace Workora.Application.Features.Recruitment.Commands.CloseJobPosting;

/// <summary>
/// Validator for <see cref="CloseJobPostingCommand"/>.
/// </summary>
public class CloseJobPostingCommandValidator : AbstractValidator<CloseJobPostingCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="CloseJobPostingCommand"/>.
    /// </summary>
    public CloseJobPostingCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
