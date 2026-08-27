using MediatR;
using Workora.Application.Features.Shifts.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.Queries.GetMonthlyShiftRoster;

/// <summary>
/// Query to retrieve monthly rotational shift roster.
/// </summary>
public record GetMonthlyShiftRosterQuery(int CompanyId, int Month, int Year) : IRequest<ApiResponse<IReadOnlyList<EmployeeRosterDto>>>;
