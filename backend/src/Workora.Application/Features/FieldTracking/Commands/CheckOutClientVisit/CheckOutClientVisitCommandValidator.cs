using FluentValidation;

using Workora.Application.Features.FieldTracking.DTOs;
namespace Workora.Application.Features.FieldTracking.Commands.CheckOutClientVisit;

/// <summary>
/// Validator for <see cref="CheckOutClientVisitCommand"/>.
/// </summary>
public class CheckOutClientVisitCommandValidator : AbstractValidator<CheckOutClientVisitCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="CheckOutClientVisitCommand"/>.
    /// </summary>
    public CheckOutClientVisitCommandValidator()
    {
        RuleFor(x => x.VisitId).GreaterThan(0).WithMessage("Valid VisitId is required.");
    }
}
