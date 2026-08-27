using FluentValidation;

using Workora.Application.Features.Payroll.DTOs;
namespace Workora.Application.Features.Payroll.Commands.UpdatePayhead;

/// <summary>
/// Validator for <see cref="UpdatePayheadCommand"/>.
/// </summary>
public class UpdatePayheadCommandValidator : AbstractValidator<UpdatePayheadCommand>
{
    /// <summary>
    /// Initializes validation rules for UpdatePayheadCommand.
    /// </summary>
    public UpdatePayheadCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid payhead ID is required.");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Payhead name is required.");
        RuleFor(x => x.Code).NotEmpty().WithMessage("Payhead code is required.");
    }
}
