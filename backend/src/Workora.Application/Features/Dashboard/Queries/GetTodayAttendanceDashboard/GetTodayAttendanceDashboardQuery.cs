using MediatR;
using Workora.Application.Features.Dashboard.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.Queries.GetTodayAttendanceDashboard;

/// <summary>
/// Query to retrieve today's real-time attendance KPIs for the dashboard.
/// </summary>
public record GetTodayAttendanceDashboardQuery(int CompanyId) : IRequest<ApiResponse<TodayAttendanceDashboardDto>>;
