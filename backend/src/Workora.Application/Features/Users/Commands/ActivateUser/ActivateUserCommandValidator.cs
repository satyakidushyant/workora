using FluentValidation;

using Workora.Application.Features.Users.DTOs;
namespace Workora.Application.Features.Users.Commands.ActivateUser;

/// <summary>
/// Validator for <see cref="ActivateUserCommand"/>.
/// </summary>
public class ActivateUserCommandValidator : AbstractValidator<ActivateUserCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="ActivateUserCommand"/>.
    /// </summary>
    public ActivateUserCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
