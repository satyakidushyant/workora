using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.UpdateEmployee;

/// <summary>
/// Validator for <see cref="UpdateEmployeeCommand"/>.
/// </summary>
public class UpdateEmployeeCommandValidator : AbstractValidator<UpdateEmployeeCommand>
{
    /// <summary>
    /// Initializes validation rules for updating an employee.
    /// </summary>
    public UpdateEmployeeCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100).WithMessage("First name is required.");
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100).WithMessage("Last name is required.");
    }
}
