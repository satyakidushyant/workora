using FluentValidation;

using Workora.Application.Features.Roles.DTOs;
namespace Workora.Application.Features.Roles.Commands.CloneRole;

/// <summary>
/// Validator for <see cref="CloneRoleCommand"/>.
/// </summary>
public class CloneRoleCommandValidator : AbstractValidator<CloneRoleCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public CloneRoleCommandValidator()
    {
        RuleFor(x => x.SourceRoleId)
            .GreaterThan(0).WithMessage("Valid source role ID is required.");

        RuleFor(x => x.NewName)
            .NotEmpty().WithMessage("New role name is required.")
            .MaximumLength(100).WithMessage("Role name must not exceed 100 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");
    }
}
