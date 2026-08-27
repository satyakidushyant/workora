using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.Commands.CreateHoliday;

/// <summary>
/// Command to create a new holiday.
/// </summary>
public record CreateHolidayCommand(
    int CompanyId,
    string Name,
    DateOnly Date,
    HolidayType Type,
    int? BranchId,
    string? Description) : IRequest<ApiResponse<HolidayDto>>;
