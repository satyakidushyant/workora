using FluentValidation;

namespace Workora.Application.Features.Users.Commands.AssignUserRoles;

/// <summary>
/// Validator for <see cref="AssignUserRolesCommand"/>.
/// </summary>
public class AssignUserRolesCommandValidator : AbstractValidator<AssignUserRolesCommand>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AssignUserRolesCommandValidator"/> class.
    /// </summary>
    public AssignUserRolesCommandValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage("User ID must be greater than 0.");

        RuleFor(x => x.RoleIds)
            .NotNull().WithMessage("Role IDs list cannot be null.");
    }
}
