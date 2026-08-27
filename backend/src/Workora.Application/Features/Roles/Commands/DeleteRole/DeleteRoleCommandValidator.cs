using FluentValidation;

using Workora.Application.Features.Roles.DTOs;
namespace Workora.Application.Features.Roles.Commands.DeleteRole;

/// <summary>
/// Validator for <see cref="DeleteRoleCommand"/>.
/// </summary>
public class DeleteRoleCommandValidator : AbstractValidator<DeleteRoleCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="DeleteRoleCommand"/>.
    /// </summary>
    public DeleteRoleCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
