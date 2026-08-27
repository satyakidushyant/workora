using MediatR;
using Workora.Shared.Responses;

using Workora.Application.Features.Shifts.DTOs;
namespace Workora.Application.Features.Shifts.Commands.AssignRotationalRoster;

/// <summary>
/// Command to bulk assign rotational shift roster for a group of employees.
/// </summary>
public record AssignRotationalRosterCommand(
    List<int> EmployeeIds,
    int ShiftId,
    DateOnly EffectiveFrom,
    DateOnly? EffectiveTo = null) : IRequest<ApiResponse<bool>>;
