using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.ReactivateEmployee;

/// <summary>
/// Validator for <see cref="ReactivateEmployeeCommand"/>.
/// </summary>
public class ReactivateEmployeeCommandValidator : AbstractValidator<ReactivateEmployeeCommand>
{
    /// <summary>
    /// Initializes validation rules for rehiring an employee.
    /// </summary>
    public ReactivateEmployeeCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.DepartmentId).GreaterThan(0).WithMessage("Valid department ID is required.");
        RuleFor(x => x.DesignationId).GreaterThan(0).WithMessage("Valid designation ID is required.");
        RuleFor(x => x.BranchId).GreaterThan(0).WithMessage("Valid branch ID is required.");
    }
}
