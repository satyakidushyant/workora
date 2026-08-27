using FluentValidation;

using Workora.Application.Features.Users.DTOs;
namespace Workora.Application.Features.Users.Commands.DeactivateUser;

/// <summary>
/// Validator for <see cref="DeactivateUserCommand"/>.
/// </summary>
public class DeactivateUserCommandValidator : AbstractValidator<DeactivateUserCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="DeactivateUserCommand"/>.
    /// </summary>
    public DeactivateUserCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
