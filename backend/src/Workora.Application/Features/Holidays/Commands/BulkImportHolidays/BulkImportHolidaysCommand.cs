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
/// Command to bulk import holiday calendar entries.
/// </summary>
public record BulkImportHolidaysCommand(List<BulkHolidayItem> Holidays) : IRequest<ApiResponse<int>>;
