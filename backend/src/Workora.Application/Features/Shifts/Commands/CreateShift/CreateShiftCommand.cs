using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Shifts.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.Commands.CreateShift;

/// <summary>
/// Command to create a new shift definition.
/// </summary>
public record CreateShiftCommand(
    int CompanyId,
    string Name,
    string Code,
    TimeOnly StartTime,
    TimeOnly EndTime,
    bool SpansMidnight,
    int GracePeriodMinutes,
    int BreakMinutes,
    int? BranchId,
    string? Description) : IRequest<ApiResponse<ShiftDto>>;
