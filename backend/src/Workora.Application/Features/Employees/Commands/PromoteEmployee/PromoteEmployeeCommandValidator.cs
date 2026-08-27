using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.PromoteEmployee;

/// <summary>
/// Validator for <see cref="PromoteEmployeeCommand"/>.
/// </summary>
public class PromoteEmployeeCommandValidator : AbstractValidator<PromoteEmployeeCommand>
{
    /// <summary>
    /// Initializes validation rules for promoting an employee.
    /// </summary>
    public PromoteEmployeeCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.NewDesignationId).GreaterThan(0).WithMessage("Valid new designation ID is required.");
        RuleFor(x => x.NewBasicSalary)
            .GreaterThan(0).When(x => x.NewBasicSalary.HasValue)
            .WithMessage("Salary must be greater than zero if provided.");
        RuleFor(x => x.Remarks)
            .MaximumLength(500).WithMessage("Remarks cannot exceed 500 characters.");
    }
}
