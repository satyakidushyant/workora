using FluentValidation;

using Workora.Application.Features.FieldTracking.DTOs;
namespace Workora.Application.Features.FieldTracking.Commands.RecordLiveGpsPing;

/// <summary>
/// Validator for <see cref="RecordLiveGpsPingCommand"/>.
/// </summary>
public class RecordLiveGpsPingCommandValidator : AbstractValidator<RecordLiveGpsPingCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="RecordLiveGpsPingCommand"/>.
    /// </summary>
    public RecordLiveGpsPingCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid EmployeeId is required.");
    }
}
