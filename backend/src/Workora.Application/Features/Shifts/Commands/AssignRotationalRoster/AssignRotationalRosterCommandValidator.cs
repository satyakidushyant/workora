using FluentValidation;

using Workora.Application.Features.Shifts.DTOs;
namespace Workora.Application.Features.Shifts.Commands.AssignRotationalRoster;

/// <summary>
/// Validator for <see cref="AssignRotationalRosterCommand"/>.
/// </summary>
public class AssignRotationalRosterCommandValidator : AbstractValidator<AssignRotationalRosterCommand>
{
    /// <summary>
    /// Initializes validation rules for AssignRotationalRosterCommand.
    /// </summary>
    public AssignRotationalRosterCommandValidator()
    {
        RuleFor(x => x.EmployeeIds).NotEmpty().WithMessage("At least one employee ID is required.");
        RuleFor(x => x.ShiftId).GreaterThan(0).WithMessage("Valid shift ID is required.");
    }
}
