using FluentValidation;

using Workora.Application.Features.Departments.DTOs;
namespace Workora.Application.Features.Departments.Commands.DeleteDepartment;

/// <summary>
/// Validator for <see cref="DeleteDepartmentCommand"/>.
/// </summary>
public class DeleteDepartmentCommandValidator : AbstractValidator<DeleteDepartmentCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="DeleteDepartmentCommand"/>.
    /// </summary>
    public DeleteDepartmentCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
