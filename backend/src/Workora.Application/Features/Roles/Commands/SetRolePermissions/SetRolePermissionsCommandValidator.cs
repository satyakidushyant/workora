using FluentValidation;

using Workora.Application.Features.Roles.DTOs;
namespace Workora.Application.Features.Roles.Commands.SetRolePermissions;

/// <summary>
/// Validator for <see cref="SetRolePermissionsCommand"/>.
/// </summary>
public class SetRolePermissionsCommandValidator : AbstractValidator<SetRolePermissionsCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public SetRolePermissionsCommandValidator()
    {
        RuleFor(x => x.RoleId)
            .GreaterThan(0).WithMessage("Valid role ID is required.");

        RuleFor(x => x.PermissionIds)
            .NotNull().WithMessage("Permission IDs list must not be null.");
    }
}
