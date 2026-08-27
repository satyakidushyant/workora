using FluentValidation;

using Workora.Application.Features.Overtime.DTOs;
namespace Workora.Application.Features.Overtime.Commands.ApproveOvertimeRequest;

/// <summary>
/// Validator for <see cref="ApproveOvertimeRequestCommand"/>.
/// </summary>
public class ApproveOvertimeRequestCommandValidator : AbstractValidator<ApproveOvertimeRequestCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="ApproveOvertimeRequestCommand"/>.
    /// </summary>
    public ApproveOvertimeRequestCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
