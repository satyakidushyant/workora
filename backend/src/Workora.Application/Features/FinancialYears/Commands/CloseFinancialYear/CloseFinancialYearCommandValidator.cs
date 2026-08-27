using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.FinancialYears.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FinancialYears.Commands.CloseFinancialYear;

/// <summary>
/// Validator for <see cref="CloseFinancialYearCommand"/>.
/// </summary>
public class CloseFinancialYearCommandValidator : AbstractValidator<CloseFinancialYearCommand>
{
    /// <summary>
    /// Initializes validation rules for closing a financial year.
    /// </summary>
    public CloseFinancialYearCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid financial year ID is required.");
    }
}
