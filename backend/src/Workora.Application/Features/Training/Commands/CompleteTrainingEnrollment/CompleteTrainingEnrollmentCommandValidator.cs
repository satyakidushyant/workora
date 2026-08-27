using FluentValidation;

using Workora.Application.Features.Training.DTOs;
namespace Workora.Application.Features.Training.Commands.CompleteTrainingEnrollment;

/// <summary>
/// Validator for <see cref="CompleteTrainingEnrollmentCommand"/>.
/// </summary>
public class CompleteTrainingEnrollmentCommandValidator : AbstractValidator<CompleteTrainingEnrollmentCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="CompleteTrainingEnrollmentCommand"/>.
    /// </summary>
    public CompleteTrainingEnrollmentCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
