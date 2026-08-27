using FluentValidation;

using Workora.Application.Features.Expenses.DTOs;
namespace Workora.Application.Features.Expenses.Commands.ApproveExpenseClaim;

/// <summary>
/// Validator for <see cref="ApproveExpenseClaimCommand"/>.
/// </summary>
public class ApproveExpenseClaimCommandValidator : AbstractValidator<ApproveExpenseClaimCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="ApproveExpenseClaimCommand"/>.
    /// </summary>
    public ApproveExpenseClaimCommandValidator()
    {
        RuleFor(x => x.ClaimId).GreaterThan(0).WithMessage("Valid ClaimId is required.");
        RuleFor(x => x.ApproverUserId).GreaterThan(0).WithMessage("Valid ApproverUserId is required.");
    }
}
