using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.SystemSettings.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SystemSettings.Commands.UpdateCompanySettings;

/// <summary>
/// Validator for <see cref="UpdateCompanySettingsCommand"/>.
/// </summary>
public class UpdateCompanySettingsCommandValidator : AbstractValidator<UpdateCompanySettingsCommand>
{
    /// <summary>
    /// Initializes validation rules for settings updates.
    /// </summary>
    public UpdateCompanySettingsCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Settings).NotEmpty().WithMessage("At least one setting parameter is required.");
    }
}
