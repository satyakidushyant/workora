using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Shifts.DTOs;
namespace Workora.Application.Features.Shifts.Commands.AssignShift;

/// <summary>
/// Validator for <see cref="AssignShiftCommand"/>.
/// </summary>
public class AssignShiftCommandValidator : AbstractValidator<AssignShiftCommand>
{
    /// <summary>
    /// Initializes validation rules for shift assignment.
    /// </summary>
    public AssignShiftCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.ShiftId).GreaterThan(0).WithMessage("Valid shift ID is required.");
    }
}
