using MediatR;
using Workora.Shared.Responses;

using Workora.Application.Features.Shifts.DTOs;
namespace Workora.Application.Features.Shifts.Commands.SwapEmployeeShifts;

/// <summary>
/// Command to swap assigned shift rosters between two employees.
/// </summary>
public record SwapEmployeeShiftsCommand(
    int EmployeeId1,
    int EmployeeId2,
    DateOnly SwapDate) : IRequest<ApiResponse<bool>>;
