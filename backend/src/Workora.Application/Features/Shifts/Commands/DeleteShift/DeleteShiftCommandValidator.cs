using FluentValidation;

using Workora.Application.Features.Shifts.DTOs;
namespace Workora.Application.Features.Shifts.Commands.DeleteShift;

/// <summary>
/// Validator for <see cref="DeleteShiftCommand"/>.
/// </summary>
public class DeleteShiftCommandValidator : AbstractValidator<DeleteShiftCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="DeleteShiftCommand"/>.
    /// </summary>
    public DeleteShiftCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
