using FluentValidation;

namespace Workora.Application.Features.Authentication.Commands.ForgotPassword;

/// <summary>
/// Validator for the <see cref="ForgotPasswordCommand"/>.
/// </summary>
public class ForgotPasswordCommandValidator : AbstractValidator<ForgotPasswordCommand>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ForgotPasswordCommandValidator"/> class.
    /// </summary>
    public ForgotPasswordCommandValidator()
    {
        RuleFor(v => v.Email).NotEmpty().EmailAddress();
    }
}
