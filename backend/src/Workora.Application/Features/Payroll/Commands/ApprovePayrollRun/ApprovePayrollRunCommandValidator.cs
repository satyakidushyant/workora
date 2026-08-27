using FluentValidation;

using Workora.Application.Features.Payroll.DTOs;
namespace Workora.Application.Features.Payroll.Commands.ApprovePayrollRun;

/// <summary>
/// Validator for <see cref="ApprovePayrollRunCommand"/>.
/// </summary>
public class ApprovePayrollRunCommandValidator : AbstractValidator<ApprovePayrollRunCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="ApprovePayrollRunCommand"/>.
    /// </summary>
    public ApprovePayrollRunCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
