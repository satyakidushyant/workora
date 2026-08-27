using FluentValidation;

using Workora.Application.Features.Recruitment.DTOs;
namespace Workora.Application.Features.Recruitment.Commands.RejectCandidate;

/// <summary>
/// Validator for <see cref="RejectCandidateCommand"/>.
/// </summary>
public class RejectCandidateCommandValidator : AbstractValidator<RejectCandidateCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="RejectCandidateCommand"/>.
    /// </summary>
    public RejectCandidateCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
