using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.CreatePayrollRun;

/// <summary>
/// Validator for <see cref="CreatePayrollRunCommand"/>.
/// </summary>
public class CreatePayrollRunCommandValidator : AbstractValidator<CreatePayrollRunCommand>
{
    /// <summary>
    /// Initializes validation rules for initiating payroll run.
    /// </summary>
    public CreatePayrollRunCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.PeriodMonth).InclusiveBetween(1, 12).WithMessage("Month must be between 1 and 12.");
        RuleFor(x => x.PeriodYear).GreaterThanOrEqualTo(2020).WithMessage("Valid year is required.");
    }
}
