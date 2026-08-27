using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.CreateEmployee;

/// <summary>
/// Validator for <see cref="CreateEmployeeCommand"/>.
/// </summary>
public class CreateEmployeeCommandValidator : AbstractValidator<CreateEmployeeCommand>
{
    /// <summary>
    /// Initializes validation rules for onboarding an employee.
    /// </summary>
    public CreateEmployeeCommandValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100).WithMessage("First name is required.");
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100).WithMessage("Last name is required.");
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Valid email is required.");
        RuleFor(x => x.NationalId).NotEmpty().MaximumLength(50).WithMessage("National ID is required.");
        RuleFor(x => x.DepartmentId).GreaterThan(0).WithMessage("Valid department ID is required.");
        RuleFor(x => x.DesignationId).GreaterThan(0).WithMessage("Valid designation ID is required.");
        RuleFor(x => x.BranchId).GreaterThan(0).WithMessage("Valid branch ID is required.");
        RuleFor(x => x.DateOfBirth)
            .Must((cmd, dob) => dob <= cmd.HireDate.AddYears(-18))
            .WithMessage("Employee must be at least 18 years old at the time of hire.");
    }
}
