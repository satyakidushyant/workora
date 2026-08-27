using FluentValidation;
using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Employees.DTOs;
namespace Workora.Application.Features.Employees.Commands.TerminateEmployee;

/// <summary>
/// Validator for <see cref="TerminateEmployeeCommand"/>.
/// </summary>
public class TerminateEmployeeCommandValidator : AbstractValidator<TerminateEmployeeCommand>
{
    /// <summary>
    /// Initializes validation rules for terminating an employee.
    /// </summary>
    public TerminateEmployeeCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid employee ID is required.");
    }
}
