using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.DTOs;

/// <summary>
/// Executive aggregate dashboard metrics.
/// </summary>
public record DashboardSummaryDto(
    int TotalEmployees,
    int ActiveEmployees,
    int OnLeaveToday,
    int PresentToday,
    decimal MonthlyPayrollCost);
