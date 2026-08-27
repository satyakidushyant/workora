using FluentValidation;

using Workora.Application.Features.Leave.DTOs;
namespace Workora.Application.Features.Leave.Commands.CancelLeave;

/// <summary>
/// Validator for <see cref="CancelLeaveCommand"/>.
/// </summary>
public class CancelLeaveCommandValidator : AbstractValidator<CancelLeaveCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="CancelLeaveCommand"/>.
    /// </summary>
    public CancelLeaveCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
