using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Exceptions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Commands.RejectExpenseClaim;

/// <summary>
/// Validator for <see cref="RejectExpenseClaimCommand"/>.
/// </summary>
public class RejectExpenseClaimCommandValidator : AbstractValidator<RejectExpenseClaimCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public RejectExpenseClaimCommandValidator()
    {
        RuleFor(x => x.Reason).NotEmpty().MaximumLength(500).WithMessage("Rejection reason is required.");
    }
}
