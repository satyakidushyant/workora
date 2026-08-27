using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.CreateSalaryStructure;

/// <summary>
/// Validator for <see cref="CreateSalaryStructureCommand"/>.
/// </summary>
public class CreateSalaryStructureCommandValidator : AbstractValidator<CreateSalaryStructureCommand>
{
    /// <summary>
    /// Initializes validation rules for salary structure creation.
    /// </summary>
    public CreateSalaryStructureCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150).WithMessage("Structure name is required.");
        RuleFor(x => x.Components).NotEmpty().WithMessage("At least one salary component is required.");
    }
}
