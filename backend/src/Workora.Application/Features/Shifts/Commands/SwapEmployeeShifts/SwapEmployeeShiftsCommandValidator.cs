using FluentValidation;

using Workora.Application.Features.Shifts.DTOs;
namespace Workora.Application.Features.Shifts.Commands.SwapEmployeeShifts;

/// <summary>
/// Validator for <see cref="SwapEmployeeShiftsCommand"/>.
/// </summary>
public class SwapEmployeeShiftsCommandValidator : AbstractValidator<SwapEmployeeShiftsCommand>
{
    /// <summary>
    /// Initializes validation rules for SwapEmployeeShiftsCommand.
    /// </summary>
    public SwapEmployeeShiftsCommandValidator()
    {
        RuleFor(x => x.EmployeeId1).GreaterThan(0).WithMessage("Valid Employee 1 ID is required.");
        RuleFor(x => x.EmployeeId2).GreaterThan(0).WithMessage("Valid Employee 2 ID is required.");
    }
}
