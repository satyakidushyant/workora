using FluentValidation;

using Workora.Application.Features.Tasks.DTOs;
namespace Workora.Application.Features.Tasks.Commands.UpdateTaskStatus;

/// <summary>
/// Validator for <see cref="UpdateTaskStatusCommand"/>.
/// </summary>
public class UpdateTaskStatusCommandValidator : AbstractValidator<UpdateTaskStatusCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="UpdateTaskStatusCommand"/>.
    /// </summary>
    public UpdateTaskStatusCommandValidator()
    {
        RuleFor(x => x.TaskId).GreaterThan(0).WithMessage("Valid TaskId is required.");
    }
}
