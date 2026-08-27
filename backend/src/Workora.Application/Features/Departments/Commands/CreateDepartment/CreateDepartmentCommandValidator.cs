using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Commands.CreateDepartment;

/// <summary>
/// Validator for <see cref="CreateDepartmentCommand"/>.
/// </summary>
public class CreateDepartmentCommandValidator : AbstractValidator<CreateDepartmentCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="CreateDepartmentCommand"/>.
    /// </summary>
    public CreateDepartmentCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50).WithMessage("Department code is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200).WithMessage("Department name is required.");
    }
}
