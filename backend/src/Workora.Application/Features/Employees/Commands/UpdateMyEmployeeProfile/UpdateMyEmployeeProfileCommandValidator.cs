using FluentValidation;

using Workora.Application.Features.Employees.DTOs;
namespace Workora.Application.Features.Employees.Commands.UpdateMyEmployeeProfile;

/// <summary>
/// Validator for <see cref="UpdateMyEmployeeProfileCommand"/>.
/// </summary>
public class UpdateMyEmployeeProfileCommandValidator : AbstractValidator<UpdateMyEmployeeProfileCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="UpdateMyEmployeeProfileCommand"/>.
    /// </summary>
    public UpdateMyEmployeeProfileCommandValidator()
    {
    }
}
