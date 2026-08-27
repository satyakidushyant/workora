using FluentValidation;

using Workora.Application.Features.Overtime.DTOs;
namespace Workora.Application.Features.Overtime.Commands.RejectOvertimeRequest;

/// <summary>
/// Validator for <see cref="RejectOvertimeRequestCommand"/>.
/// </summary>
public class RejectOvertimeRequestCommandValidator : AbstractValidator<RejectOvertimeRequestCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="RejectOvertimeRequestCommand"/>.
    /// </summary>
    public RejectOvertimeRequestCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
