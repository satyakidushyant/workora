using FluentValidation;

using Workora.Application.Features.Authentication.DTOs;
namespace Workora.Application.Features.Authentication.Commands.LogoutAll;

/// <summary>
/// Validator for <see cref="LogoutAllCommand"/>.
/// </summary>
public class LogoutAllCommandValidator : AbstractValidator<LogoutAllCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="LogoutAllCommand"/>.
    /// </summary>
    public LogoutAllCommandValidator()
    {
    }
}
