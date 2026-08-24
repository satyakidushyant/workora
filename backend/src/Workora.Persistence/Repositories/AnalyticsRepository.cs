using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for aggregations, analytics metrics, and dashboard queries.
/// </summary>
public class AnalyticsRepository : IAnalyticsRepository
{
    private readonly AppDbContext _dbContext;

    /// <summary>
    /// Initializes a new instance of the <see cref="AnalyticsRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public AnalyticsRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <inheritdoc />
    public async Task<(int TotalEmployees, int ActiveEmployees, int OnLeaveToday, int PresentToday, decimal MonthlyPayrollCost)> GetDashboardSummaryAsync(int companyId, CancellationToken ct = default)
    {
        var total = await _dbContext.Set<Employee>()
            .Include(e => e.Department)
            .CountAsync(e => e.Department != null && e.Department.CompanyId == companyId, ct);

        var active = await _dbContext.Set<Employee>()
            .Include(e => e.Department)
            .CountAsync(e => e.Department != null && e.Department.CompanyId == companyId && e.EmploymentStatus == EmploymentStatus.Active, ct);

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var onLeave = await _dbContext.Set<LeaveRequest>()
            .Include(l => l.Employee)
            .ThenInclude(e => e.Department)
            .CountAsync(l => l.Employee.Department != null && l.Employee.Department.CompanyId == companyId && l.Status == LeaveRequestStatus.Approved && l.StartDate <= today && l.EndDate >= today, ct);

        var present = await _dbContext.Set<AttendanceRecord>()
            .Include(a => a.Employee)
            .ThenInclude(e => e.Department)
            .CountAsync(a => a.Employee.Department != null && a.Employee.Department.CompanyId == companyId && a.AttendanceDate == today && a.Status != AttendanceStatus.Absent, ct);

        var currentMonth = DateTime.UtcNow.Month;
        var currentYear = DateTime.UtcNow.Year;
        var payrollCost = await _dbContext.Set<PayrollRun>()
            .Where(p => p.CompanyId == companyId && p.PeriodMonth == currentMonth && p.PeriodYear == currentYear && p.Status != PayrollStatus.Draft)
            .Select(p => p.TotalGrossPay)
            .FirstOrDefaultAsync(ct);

        return (total, active, onLeave, present, payrollCost);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyDictionary<string, int>> GetHeadcountByDepartmentAsync(int companyId, CancellationToken ct = default)
    {
        var counts = await _dbContext.Set<Employee>()
            .Include(e => e.Department)
            .Where(e => e.Department != null && e.Department.CompanyId == companyId && e.EmploymentStatus == EmploymentStatus.Active)
            .GroupBy(e => e.Department!.Name)
            .Select(g => new { Department = g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.Department, g => g.Count, ct);

        return counts;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<LeaveRequest>> GetUpcomingLeavesAsync(int companyId, int daysAhead = 7, CancellationToken ct = default)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var targetDate = today.AddDays(daysAhead);

        return await _dbContext.Set<LeaveRequest>()
            .Include(l => l.Employee)
            .ThenInclude(e => e.Department)
            .Include(l => l.LeaveType)
            .Where(l => l.Employee.Department != null && l.Employee.Department.CompanyId == companyId && l.Status == LeaveRequestStatus.Approved && l.StartDate >= today && l.StartDate <= targetDate)
            .OrderBy(l => l.StartDate)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<(int TotalPresent, int OnTime, int Late, int CheckedOut)> GetTodayAttendanceMetricsAsync(int companyId, CancellationToken ct = default)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var records = await _dbContext.Set<AttendanceRecord>()
            .Include(a => a.Employee)
            .ThenInclude(e => e.Department)
            .Where(a => a.Employee.Department != null && a.Employee.Department.CompanyId == companyId && a.AttendanceDate == today)
            .ToListAsync(ct);

        var present = records.Count(r => r.Status != AttendanceStatus.Absent);
        var onTime = records.Count(r => r.Status == AttendanceStatus.Present);
        var late = records.Count(r => r.Status == AttendanceStatus.Late);
        var checkedOut = records.Count(r => r.CheckOutTime.HasValue);

        return (present, onTime, late, checkedOut);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<(string MonthYear, int Headcount, int Joiners, int Leavers)>> GetHeadcountTrendAsync(int companyId, CancellationToken ct = default)
    {
        var result = new List<(string MonthYear, int Headcount, int Joiners, int Leavers)>();
        var now = DateTime.UtcNow;

        var employees = await _dbContext.Set<Employee>()
            .AsNoTracking()
            .Include(e => e.Department)
            .Where(e => e.Department != null && e.Department.CompanyId == companyId)
            .ToListAsync(ct);

        for (int i = 11; i >= 0; i--)
        {
            var date = now.AddMonths(-i);
            var periodLabel = date.ToString("MMM yyyy");
            var month = date.Month;
            var year = date.Year;

            var joiners = employees.Count(e => e.HireDate.Month == month && e.HireDate.Year == year);
            var leavers = employees.Count(e => e.TerminationDate.HasValue && e.TerminationDate.Value.Month == month && e.TerminationDate.Value.Year == year);
            var headcount = employees.Count(e => e.HireDate <= DateOnly.FromDateTime(new DateTime(year, month, DateTime.DaysInMonth(year, month))) && (!e.TerminationDate.HasValue || e.TerminationDate.Value > DateOnly.FromDateTime(new DateTime(year, month, 1))));

            result.Add((periodLabel, headcount, joiners, leavers));
        }

        return result;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyDictionary<string, int>> GetLeaveUtilizationAsync(int companyId, int year, CancellationToken ct = default)
    {
        var leaves = await _dbContext.Set<LeaveRequest>()
            .Include(l => l.Employee)
            .ThenInclude(e => e.Department)
            .Include(l => l.LeaveType)
            .Where(l => l.Employee.Department != null && l.Employee.Department.CompanyId == companyId && l.Status == LeaveRequestStatus.Approved && l.StartDate.Year == year)
            .GroupBy(l => l.LeaveType.Name)
            .Select(g => new { LeaveType = g.Key, Days = g.Sum(x => x.DaysCount) })
            .ToDictionaryAsync(g => g.LeaveType, g => (int)g.Days, ct);

        return leaves;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<(string Period, decimal GrossTotal, decimal DeductionsTotal, decimal NetTotal)>> GetPayrollExpenseTrendAsync(int companyId, CancellationToken ct = default)
    {
        var runs = await _dbContext.Set<PayrollRun>()
            .Where(p => p.CompanyId == companyId && p.Status != PayrollStatus.Draft)
            .OrderByDescending(p => p.PeriodYear)
            .ThenByDescending(p => p.PeriodMonth)
            .Take(12)
            .ToListAsync(ct);

        return runs.Select(r => ($"{r.PeriodMonth:D2}/{r.PeriodYear}", r.TotalGrossPay, r.TotalDeductions, r.TotalNetPay)).ToList();
    }
}
