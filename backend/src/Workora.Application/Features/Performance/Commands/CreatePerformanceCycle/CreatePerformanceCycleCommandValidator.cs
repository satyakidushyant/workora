using FluentValidation;

using Workora.Application.Features.Performance.DTOs;
namespace Workora.Application.Features.Performance.Commands.CreatePerformanceCycle;

/// <summary>
/// Validator for <see cref="CreatePerformanceCycleCommand"/>.
/// </summary>
public class CreatePerformanceCycleCommandValidator : AbstractValidator<CreatePerformanceCycleCommand>
{
    /// <summary>
    /// Initializes validation rules for CreatePerformanceCycleCommand.
    /// </summary>
    public CreatePerformanceCycleCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().WithMessage("Performance cycle title is required.");
        RuleFor(x => x.CompanyId).GreaterThan(0);
        RuleFor(x => x.Year).GreaterThan(2000);
    }
}
