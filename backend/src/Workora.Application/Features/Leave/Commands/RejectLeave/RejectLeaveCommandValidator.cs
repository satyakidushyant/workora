using FluentValidation;

using Workora.Application.Features.Leave.DTOs;
namespace Workora.Application.Features.Leave.Commands.RejectLeave;

/// <summary>
/// Validator for <see cref="RejectLeaveCommand"/>.
/// </summary>
public class RejectLeaveCommandValidator : AbstractValidator<RejectLeaveCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="RejectLeaveCommand"/>.
    /// </summary>
    public RejectLeaveCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
