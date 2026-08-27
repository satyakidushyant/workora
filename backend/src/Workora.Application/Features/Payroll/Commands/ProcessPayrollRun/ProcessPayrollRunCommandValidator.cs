using FluentValidation;

using Workora.Application.Features.Payroll.DTOs;
namespace Workora.Application.Features.Payroll.Commands.ProcessPayrollRun;

/// <summary>
/// Validator for <see cref="ProcessPayrollRunCommand"/>.
/// </summary>
public class ProcessPayrollRunCommandValidator : AbstractValidator<ProcessPayrollRunCommand>
{
    /// <summary>
    /// Initializes validation rules for ProcessPayrollRunCommand.
    /// </summary>
    public ProcessPayrollRunCommandValidator()
    {
        RuleFor(x => x.PayrollRunId).GreaterThan(0).WithMessage("Valid payroll run ID is required.");
    }
}
