using FluentValidation;

using Workora.Application.Features.Designations.DTOs;
namespace Workora.Application.Features.Designations.Commands.DeleteDesignation;

/// <summary>
/// Validator for <see cref="DeleteDesignationCommand"/>.
/// </summary>
public class DeleteDesignationCommandValidator : AbstractValidator<DeleteDesignationCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="DeleteDesignationCommand"/>.
    /// </summary>
    public DeleteDesignationCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
