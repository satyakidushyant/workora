namespace Workora.Application.Features.Reports.DTOs;

/// <summary>
/// Headcount trend data point.
/// </summary>
public record HeadcountTrendItemDto(
    string Period,
    int Headcount,
    int Joiners,
    int Leavers);

/// <summary>
/// Headcount report response DTO.
/// </summary>
public record HeadcountReportDto(
    int TotalEmployees,
    int ActiveEmployees,
    IReadOnlyList<HeadcountTrendItemDto> Trend);

/// <summary>
/// Real-time today attendance analytics report DTO.
/// </summary>
public record AttendanceReportDto(
    int TotalPresent,
    int OnTime,
    int Late,
    int CheckedOut);

/// <summary>
/// Leave utilization report DTO.
/// </summary>
public record LeaveReportDto(
    int Year,
    IReadOnlyDictionary<string, int> UtilizationByType);

/// <summary>
/// Payroll expense item DTO.
/// </summary>
public record PayrollExpenseItemDto(
    string Period,
    decimal GrossTotal,
    decimal DeductionsTotal,
    decimal NetTotal);

/// <summary>
/// Payroll expense report DTO.
/// </summary>
public record PayrollReportDto(
    IReadOnlyList<PayrollExpenseItemDto> History);
