using FluentValidation;
using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Shifts.DTOs;
namespace Workora.Application.Features.Shifts.Commands.UnassignShift;

/// <summary>
/// Validator for <see cref="UnassignShiftCommand"/>.
/// </summary>
public class UnassignShiftCommandValidator : AbstractValidator<UnassignShiftCommand>
{
    /// <summary>
    /// Initializes validation rules for unassigning a shift.
    /// </summary>
    public UnassignShiftCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
    }
}
