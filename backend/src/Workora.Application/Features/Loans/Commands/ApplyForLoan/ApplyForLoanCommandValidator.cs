using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Commands.ApplyForLoan;

/// <summary>
/// Validator for <see cref="ApplyForLoanCommand"/>.
/// </summary>
public class ApplyForLoanCommandValidator : AbstractValidator<ApplyForLoanCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public ApplyForLoanCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid EmployeeId is required.");
        RuleFor(x => x.PrincipalAmount).GreaterThan(0).WithMessage("Principal amount must be greater than zero.");
        RuleFor(x => x.TenureMonths).InclusiveBetween(1, 60).WithMessage("Tenure months must be between 1 and 60.");
        RuleFor(x => x.Reason).NotEmpty().MaximumLength(500).WithMessage("Reason for loan is required.");
    }
}
