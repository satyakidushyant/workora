using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Holidays.Commands.BulkImportHolidays;

/// <summary>
/// Validator for <see cref="BulkImportHolidaysCommand"/>.
/// </summary>
public class BulkImportHolidaysCommandValidator : AbstractValidator<BulkImportHolidaysCommand>
{
    /// <summary>
    /// Initializes validation rules for BulkImportHolidaysCommand.
    /// </summary>
    public BulkImportHolidaysCommandValidator()
    {
        RuleFor(x => x.Holidays)
            .NotEmpty().WithMessage("Holiday import list cannot be empty.");
    }
}
