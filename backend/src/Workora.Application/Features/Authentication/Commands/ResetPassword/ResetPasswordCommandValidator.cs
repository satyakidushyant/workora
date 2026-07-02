using FluentValidation;

namespace Workora.Application.Features.Authentication.Commands.ResetPassword;

/// <summary>
/// Validator for the <see cref="ResetPasswordCommand"/>.
/// </summary>
public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ResetPasswordCommandValidator"/> class.
    /// </summary>
    public ResetPasswordCommandValidator()
    {
        RuleFor(v => v.Token).NotEmpty();
        RuleFor(v => v.Email).NotEmpty().EmailAddress();
        RuleFor(v => v.NewPassword)
            .NotEmpty()
            .MinimumLength(8)
            .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
            .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
            .Matches("[0-9]").WithMessage("Password must contain at least one digit.")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");
    }
}
