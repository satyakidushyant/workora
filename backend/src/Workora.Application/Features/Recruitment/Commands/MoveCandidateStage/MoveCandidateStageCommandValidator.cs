using FluentValidation;

using Workora.Application.Features.Recruitment.DTOs;
namespace Workora.Application.Features.Recruitment.Commands.MoveCandidateStage;

/// <summary>
/// Validator for <see cref="MoveCandidateStageCommand"/>.
/// </summary>
public class MoveCandidateStageCommandValidator : AbstractValidator<MoveCandidateStageCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="MoveCandidateStageCommand"/>.
    /// </summary>
    public MoveCandidateStageCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
