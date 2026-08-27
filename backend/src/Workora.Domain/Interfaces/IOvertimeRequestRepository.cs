using Workora.Domain.Entities;
using Workora.Domain.Enums;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for <see cref="OvertimeRequest"/> entity.
/// </summary>
public interface IOvertimeRequestRepository : IRepository<OvertimeRequest>
{
    /// <summary>
    /// Gets an overtime request with its employee details.
    /// </summary>
    Task<OvertimeRequest?> GetWithDetailsAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Checks if an employee already has a pending/approved overtime request on a given date.
    /// </summary>
    Task<bool> HasOverlappingRequestAsync(int employeeId, DateOnly overtimeDate, int? excludeId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets a paginated list of overtime requests with filters.
    /// </summary>
    Task<IReadOnlyList<OvertimeRequest>> GetPagedListAsync(
        int pageNumber,
        int pageSize,
        int? employeeId = null,
        int? departmentId = null,
        OvertimeRequestStatus? status = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        CancellationToken ct = default);

    /// <summary>
    /// Gets total count of overtime requests matching filters.
    /// </summary>
    Task<int> GetCountAsync(
        int? employeeId = null,
        int? departmentId = null,
        OvertimeRequestStatus? status = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        CancellationToken ct = default);

    /// <summary>
    /// Gets overtime report for a specific employee within a date range.
    /// </summary>
    Task<IReadOnlyList<OvertimeRequest>> GetEmployeeOvertimeReportAsync(
        int employeeId,
        DateOnly fromDate,
        DateOnly toDate,
        CancellationToken ct = default);
}