using FluentValidation;

using Workora.Application.Features.Tasks.DTOs;
namespace Workora.Application.Features.Tasks.Commands.AssignTask;

/// <summary>
/// Validator for <see cref="AssignTaskCommand"/>.
/// </summary>
public class AssignTaskCommandValidator : AbstractValidator<AssignTaskCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="AssignTaskCommand"/>.
    /// </summary>
    public AssignTaskCommandValidator()
    {
        RuleFor(x => x.TaskId).GreaterThan(0).WithMessage("Valid TaskId is required.");
        RuleFor(x => x.NewAssigneeEmployeeId).GreaterThan(0).WithMessage("Valid NewAssigneeEmployeeId is required.");
    }
}
