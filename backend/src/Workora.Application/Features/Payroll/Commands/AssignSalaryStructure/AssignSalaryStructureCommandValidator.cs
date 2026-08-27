using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Payroll.DTOs;
namespace Workora.Application.Features.Payroll.Commands.AssignSalaryStructure;

/// <summary>
/// Validator for <see cref="AssignSalaryStructureCommand"/>.
/// </summary>
public class AssignSalaryStructureCommandValidator : AbstractValidator<AssignSalaryStructureCommand>
{
    /// <summary>
    /// Initializes validation rules for assigning a salary structure.
    /// </summary>
    public AssignSalaryStructureCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.SalaryStructureId).GreaterThan(0).WithMessage("Valid salary structure ID is required.");
        RuleFor(x => x.BaseSalary).GreaterThan(0).WithMessage("Base salary must be greater than zero.");
    }
}
