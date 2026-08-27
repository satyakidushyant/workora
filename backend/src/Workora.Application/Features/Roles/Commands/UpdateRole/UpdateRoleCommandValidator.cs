using FluentValidation;

using Workora.Application.Features.Roles.DTOs;
namespace Workora.Application.Features.Roles.Commands.UpdateRole;

/// <summary>
/// Validator for <see cref="UpdateRoleCommand"/>.
/// </summary>
public class UpdateRoleCommandValidator : AbstractValidator<UpdateRoleCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public UpdateRoleCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Valid role ID is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Role name is required.")
            .MaximumLength(100).WithMessage("Role name must not exceed 100 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");
    }
}
