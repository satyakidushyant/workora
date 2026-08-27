using FluentValidation;

using Workora.Application.Features.Departments.DTOs;
namespace Workora.Application.Features.Departments.Commands.AssignDepartmentHead;

/// <summary>
/// Validator for <see cref="AssignDepartmentHeadCommand"/>.
/// </summary>
public class AssignDepartmentHeadCommandValidator : AbstractValidator<AssignDepartmentHeadCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="AssignDepartmentHeadCommand"/>.
    /// </summary>
    public AssignDepartmentHeadCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
