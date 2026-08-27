using FluentValidation;

using Workora.Application.Features.Leave.DTOs;
namespace Workora.Application.Features.Leave.Commands.ApproveLeave;

/// <summary>
/// Validator for <see cref="ApproveLeaveCommand"/>.
/// </summary>
public class ApproveLeaveCommandValidator : AbstractValidator<ApproveLeaveCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="ApproveLeaveCommand"/>.
    /// </summary>
    public ApproveLeaveCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
