using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Shifts.DTOs;
namespace Workora.Application.Features.Shifts.Commands.AssignShift;

/// <summary>
/// Command to assign a shift to an employee.
/// </summary>
public record AssignShiftCommand(
    int EmployeeId,
    int ShiftId,
    DateOnly EffectiveFrom,
    DateOnly? EffectiveTo) : IRequest<ApiResponse<bool>>;
