using FluentValidation;

using Workora.Application.Features.Branches.DTOs;
namespace Workora.Application.Features.Branches.Commands.DeleteBranch;

/// <summary>
/// Validator for <see cref="DeleteBranchCommand"/>.
/// </summary>
public class DeleteBranchCommandValidator : AbstractValidator<DeleteBranchCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="DeleteBranchCommand"/>.
    /// </summary>
    public DeleteBranchCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
