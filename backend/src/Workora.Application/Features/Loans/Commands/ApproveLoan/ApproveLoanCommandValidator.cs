using FluentValidation;

using Workora.Application.Features.Loans.DTOs;
namespace Workora.Application.Features.Loans.Commands.ApproveLoan;

/// <summary>
/// Validator for <see cref="ApproveLoanCommand"/>.
/// </summary>
public class ApproveLoanCommandValidator : AbstractValidator<ApproveLoanCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="ApproveLoanCommand"/>.
    /// </summary>
    public ApproveLoanCommandValidator()
    {
        RuleFor(x => x.LoanId).GreaterThan(0).WithMessage("Valid LoanId is required.");
        RuleFor(x => x.ApprovedByUserId).GreaterThan(0).WithMessage("Valid ApprovedByUserId is required.");
    }
}
