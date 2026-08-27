using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.Commands.UpdateHoliday;

/// <summary>
/// Command to update an existing holiday.
/// </summary>
public record UpdateHolidayCommand(
    int Id,
    string Name,
    DateOnly Date,
    HolidayType Type,
    int? BranchId,
    string? Description) : IRequest<ApiResponse<HolidayDto>>;
