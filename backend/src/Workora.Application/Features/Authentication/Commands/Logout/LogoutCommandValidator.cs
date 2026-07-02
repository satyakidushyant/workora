using FluentValidation;

namespace Workora.Application.Features.Authentication.Commands.Logout;

/// <summary>
/// Validator for the <see cref="LogoutCommand"/>.
/// </summary>
public class LogoutCommandValidator : AbstractValidator<LogoutCommand>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="LogoutCommandValidator"/> class.
    /// </summary>
    public LogoutCommandValidator()
    {
        RuleFor(v => v.RefreshToken).NotEmpty();
    }
}
