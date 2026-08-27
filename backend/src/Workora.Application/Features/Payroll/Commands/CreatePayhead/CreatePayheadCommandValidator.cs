using FluentValidation;

using Workora.Application.Features.Payroll.DTOs;
namespace Workora.Application.Features.Payroll.Commands.CreatePayhead;

/// <summary>
/// Validator for <see cref="CreatePayheadCommand"/>.
/// </summary>
public class CreatePayheadCommandValidator : AbstractValidator<CreatePayheadCommand>
{
    /// <summary>
    /// Initializes validation rules for CreatePayheadCommand.
    /// </summary>
    public CreatePayheadCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Payhead name is required.");
        RuleFor(x => x.Code).NotEmpty().WithMessage("Payhead code is required.");
    }
}
