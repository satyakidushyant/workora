using FluentValidation;
using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Shifts.DTOs;
namespace Workora.Application.Features.Shifts.Commands.UnassignShift;

/// <summary>
/// Command to end / unassign an active shift from an employee.
/// </summary>
public record UnassignShiftCommand(int EmployeeId, DateOnly EffectiveTo) : IRequest<ApiResponse<bool>>;
