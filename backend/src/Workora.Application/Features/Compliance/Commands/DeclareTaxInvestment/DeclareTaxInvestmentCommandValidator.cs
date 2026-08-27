using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Compliance.Commands.DeclareTaxInvestment;

/// <summary>
/// Validator for <see cref="DeclareTaxInvestmentCommand"/>.
/// </summary>
public class DeclareTaxInvestmentCommandValidator : AbstractValidator<DeclareTaxInvestmentCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public DeclareTaxInvestmentCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid EmployeeId is required.");
        RuleFor(x => x.FinancialYear).NotEmpty().WithMessage("Financial year is required (e.g. 2026-2027).");
        RuleFor(x => x.Section80CAmount).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Section80DAmount).GreaterThanOrEqualTo(0);
    }
}
