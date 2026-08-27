using FluentValidation;

using Workora.Application.Features.Users.DTOs;
namespace Workora.Application.Features.Users.Commands.DeleteUser;

/// <summary>
/// Validator for <see cref="DeleteUserCommand"/>.
/// </summary>
public class DeleteUserCommandValidator : AbstractValidator<DeleteUserCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="DeleteUserCommand"/>.
    /// </summary>
    public DeleteUserCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
