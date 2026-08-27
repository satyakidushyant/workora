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
/// Model for a single holiday row in a bulk import payload.
/// </summary>
public record BulkHolidayItem(
    string Name,
    DateOnly Date,
    HolidayType Type,
    int? BranchId,
    int CompanyId);
