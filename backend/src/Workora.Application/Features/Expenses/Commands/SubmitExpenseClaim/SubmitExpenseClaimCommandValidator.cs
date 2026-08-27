using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Commands.SubmitExpenseClaim;

/// <summary>
/// Validator for <see cref="SubmitExpenseClaimCommand"/>.
/// </summary>
public class SubmitExpenseClaimCommandValidator : AbstractValidator<SubmitExpenseClaimCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public SubmitExpenseClaimCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid EmployeeId is required.");
        RuleFor(x => x.Amount).GreaterThan(0).WithMessage("Amount must be greater than zero.");
        RuleFor(x => x.Description).NotEmpty().MaximumLength(500).WithMessage("Description is required.");
        RuleFor(x => x.ReceiptUrl).NotEmpty().WithMessage("Receipt attachment URL is required.");
    }
}
