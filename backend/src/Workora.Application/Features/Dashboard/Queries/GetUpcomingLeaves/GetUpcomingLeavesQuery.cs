using MediatR;
using Workora.Application.Features.Dashboard.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.Queries.GetUpcomingLeaves;

/// <summary>
/// Query to retrieve upcoming scheduled leaves for the dashboard widget.
/// </summary>
public record GetUpcomingLeavesQuery(
    int? CompanyId = null,
    int DaysAhead = 7) : IRequest<ApiResponse<IReadOnlyList<UpcomingLeaveDto>>>;
