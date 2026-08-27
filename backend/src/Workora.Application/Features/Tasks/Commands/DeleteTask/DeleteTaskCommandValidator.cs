using FluentValidation;

using Workora.Application.Features.Tasks.DTOs;
namespace Workora.Application.Features.Tasks.Commands.DeleteTask;

/// <summary>
/// Validator for <see cref="DeleteTaskCommand"/>.
/// </summary>
public class DeleteTaskCommandValidator : AbstractValidator<DeleteTaskCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="DeleteTaskCommand"/>.
    /// </summary>
    public DeleteTaskCommandValidator()
    {
        RuleFor(x => x.TaskId).GreaterThan(0).WithMessage("Valid TaskId is required.");
    }
}
