using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Commands.UpdateDepartment;

/// <summary>
/// Validator for <see cref="UpdateDepartmentCommand"/>.
/// </summary>
public class UpdateDepartmentCommandValidator : AbstractValidator<UpdateDepartmentCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="UpdateDepartmentCommand"/>.
    /// </summary>
    public UpdateDepartmentCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid department ID is required.");
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50).WithMessage("Department code is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200).WithMessage("Department name is required.");
    }
}
