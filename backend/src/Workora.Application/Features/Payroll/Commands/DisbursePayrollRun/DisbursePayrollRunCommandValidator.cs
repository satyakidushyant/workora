using FluentValidation;

using Workora.Application.Features.Payroll.DTOs;
namespace Workora.Application.Features.Payroll.Commands.DisbursePayrollRun;

/// <summary>
/// Validator for <see cref="DisbursePayrollRunCommand"/>.
/// </summary>
public class DisbursePayrollRunCommandValidator : AbstractValidator<DisbursePayrollRunCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="DisbursePayrollRunCommand"/>.
    /// </summary>
    public DisbursePayrollRunCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
