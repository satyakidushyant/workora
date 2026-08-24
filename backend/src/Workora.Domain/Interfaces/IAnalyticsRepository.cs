using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for aggregation and analytics queries across HRMS modules.
/// </summary>
public interface IAnalyticsRepository
{
    /// <summary>
    /// Gets executive aggregate dashboard statistics for a company.
    /// </summary>
    Task<(int TotalEmployees, int ActiveEmployees, int OnLeaveToday, int PresentToday, decimal MonthlyPayrollCost)> GetDashboardSummaryAsync(int companyId, CancellationToken ct = default);

    /// <summary>
    /// Gets departmental headcount distribution.
    /// </summary>
    Task<IReadOnlyDictionary<string, int>> GetHeadcountByDepartmentAsync(int companyId, CancellationToken ct = default);

    /// <summary>
    /// Gets upcoming approved leaves for the next N days.
    /// </summary>
    Task<IReadOnlyList<LeaveRequest>> GetUpcomingLeavesAsync(int companyId, int daysAhead = 7, CancellationToken ct = default);

    /// <summary>
    /// Gets real-time attendance check-in metrics for today.
    /// </summary>
    Task<(int TotalPresent, int OnTime, int Late, int CheckedOut)> GetTodayAttendanceMetricsAsync(int companyId, CancellationToken ct = default);

    /// <summary>
    /// Gets monthly headcount trend over the last 12 months.
    /// </summary>
    Task<IReadOnlyList<(string MonthYear, int Headcount, int Joiners, int Leavers)>> GetHeadcountTrendAsync(int companyId, CancellationToken ct = default);

    /// <summary>
    /// Gets monthly leave utilization breakdown by leave type.
    /// </summary>
    Task<IReadOnlyDictionary<string, int>> GetLeaveUtilizationAsync(int companyId, int year, CancellationToken ct = default);

    /// <summary>
    /// Gets monthly payroll expense history for the past year.
    /// </summary>
    Task<IReadOnlyList<(string Period, decimal GrossTotal, decimal DeductionsTotal, decimal NetTotal)>> GetPayrollExpenseTrendAsync(int companyId, CancellationToken ct = default);
}
