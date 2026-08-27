using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Dashboard.DTOs;
using Workora.Application.Features.Dashboard.Queries.GetDashboardSummary;
using Workora.Application.Features.Dashboard.Queries.GetHeadcountByDepartment;
using Workora.Application.Features.Dashboard.Queries.GetRecentActivities;
using Workora.Application.Features.Dashboard.Queries.GetTodayAttendanceDashboard;
using Workora.Application.Features.Dashboard.Queries.GetUpcomingLeaves;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for high-level executive dashboard summaries, departmental counts, attendance KPIs, upcoming leaves, and activity streams.
/// </summary>
[ApiController]
[Route("api/v1/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="DashboardController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets top-level company HRMS summary statistics.
    /// </summary>
    /// <param name="companyId">The company ID.</param>
    /// <returns>Executive dashboard summary.</returns>
    [HttpGet("summary")]
    [Authorize(Policy = "dashboard.view")]
    public async Task<ApiResponse<DashboardSummaryDto>> GetSummary([FromQuery] int companyId)
        => await _mediator.Send(new GetDashboardSummaryQuery(companyId));

    /// <summary>
    /// Gets headcount distribution by department for visual donut / bar charts.
    /// </summary>
    /// <param name="companyId">The company ID.</param>
    /// <returns>Headcount counts by department.</returns>
    [HttpGet("headcount-by-department")]
    [Authorize(Policy = "dashboard.view")]
    public async Task<ApiResponse<IReadOnlyList<DepartmentHeadcountDto>>> GetHeadcountByDepartment([FromQuery] int companyId)
        => await _mediator.Send(new GetHeadcountByDepartmentQuery(companyId));

    /// <summary>
    /// Gets a stream of recent system-wide actions for the dashboard activity feed.
    /// </summary>
    /// <param name="limit">Number of activity items to retrieve (default: 10).</param>
    /// <returns>Recent activity list.</returns>
    [HttpGet("recent-activities")]
    [Authorize(Policy = "dashboard.view")]
    public async Task<ApiResponse<IReadOnlyList<RecentActivityDto>>> GetRecentActivities([FromQuery] int limit = 10)
        => await _mediator.Send(new GetRecentActivitiesQuery(limit));

    /// <summary>
    /// Gets upcoming approved leaves for the next 7 days.
    /// </summary>
    /// <param name="companyId">The company ID.</param>
    /// <param name="daysAhead">Days ahead horizon (default: 7).</param>
    /// <returns>Upcoming leaves list.</returns>
    [HttpGet("upcoming-leaves")]
    [Authorize(Policy = "dashboard.view")]
    public async Task<ApiResponse<IReadOnlyList<UpcomingLeaveDto>>> GetUpcomingLeaves(
        [FromQuery] int companyId,
        [FromQuery] int daysAhead = 7)
        => await _mediator.Send(new GetUpcomingLeavesQuery(companyId, daysAhead));

    /// <summary>
    /// Gets real-time attendance KPIs for today.
    /// </summary>
    /// <param name="companyId">The company ID.</param>
    /// <returns>Today's attendance metrics.</returns>
    [HttpGet("attendance-today")]
    [Authorize(Policy = "dashboard.view")]
    public async Task<ApiResponse<TodayAttendanceDashboardDto>> GetTodayAttendance([FromQuery] int companyId)
        => await _mediator.Send(new GetTodayAttendanceDashboardQuery(companyId));
}
