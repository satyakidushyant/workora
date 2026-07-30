using FluentValidation;

namespace Workora.Application.Features.Users.Commands.AdminResetPassword;

/// <summary>
/// Validator for <see cref="AdminResetPasswordCommand"/>.
/// </summary>
public class AdminResetPasswordCommandValidator : AbstractValidator<AdminResetPasswordCommand>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AdminResetPasswordCommandValidator"/> class.
    /// </summary>
    public AdminResetPasswordCommandValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage("User ID must be greater than 0.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required.")
            .MinimumLength(8).WithMessage("New password must be at least 8 characters long.");
    }
}
