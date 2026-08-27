using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Commands.PushBiometricDevicePunches;

/// <summary>
/// Validator for <see cref="PushBiometricDevicePunchesCommand"/>.
/// </summary>
public class PushBiometricDevicePunchesCommandValidator : AbstractValidator<PushBiometricDevicePunchesCommand>
{
    /// <summary>
    /// Initializes validation rules for PushBiometricDevicePunchesCommand.
    /// </summary>
    public PushBiometricDevicePunchesCommandValidator()
    {
        RuleFor(x => x.Punches).NotEmpty().WithMessage("Biometric punch batch cannot be empty.");
    }
}
