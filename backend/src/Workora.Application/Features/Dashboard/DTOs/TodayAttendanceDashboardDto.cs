using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.DTOs;

/// <summary>
/// Real-time today attendance metrics.
/// </summary>
public record TodayAttendanceDashboardDto(
    int TotalPresent,
    int OnTime,
    int Late,
    int CheckedOut);
