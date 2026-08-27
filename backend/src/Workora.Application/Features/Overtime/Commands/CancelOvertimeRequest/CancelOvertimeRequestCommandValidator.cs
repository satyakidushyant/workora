using FluentValidation;

using Workora.Application.Features.Overtime.DTOs;
namespace Workora.Application.Features.Overtime.Commands.CancelOvertimeRequest;

/// <summary>
/// Validator for <see cref="CancelOvertimeRequestCommand"/>.
/// </summary>
public class CancelOvertimeRequestCommandValidator : AbstractValidator<CancelOvertimeRequestCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="CancelOvertimeRequestCommand"/>.
    /// </summary>
    public CancelOvertimeRequestCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
