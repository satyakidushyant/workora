using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.UpdateSalaryStructure;

/// <summary>
/// Validator for <see cref="UpdateSalaryStructureCommand"/>.
/// </summary>
public class UpdateSalaryStructureCommandValidator : AbstractValidator<UpdateSalaryStructureCommand>
{
    /// <summary>
    /// Initializes validation rules for updating a salary structure.
    /// </summary>
    public UpdateSalaryStructureCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid structure ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150).WithMessage("Structure name is required.");
    }
}
