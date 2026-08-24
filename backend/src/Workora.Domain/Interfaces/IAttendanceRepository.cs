using Workora.Domain.Entities;
using Workora.Domain.Enums;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for attendance tracking and correction operations.
/// </summary>
public interface IAttendanceRepository : IRepository<AttendanceRecord>
{
    /// <summary>
    /// Gets an attendance record for an employee on a specific date.
    /// </summary>
    Task<AttendanceRecord?> GetByDateAsync(int employeeId, DateOnly date, CancellationToken ct = default);

    /// <summary>
    /// Gets attendance history for an employee within a date range.
    /// </summary>
    Task<IReadOnlyList<AttendanceRecord>> GetHistoryAsync(int employeeId, DateOnly startDate, DateOnly endDate, CancellationToken ct = default);

    /// <summary>
    /// Gets a paginated list of attendance corrections with optional status filter.
    /// </summary>
    Task<IReadOnlyList<AttendanceCorrection>> GetCorrectionsPagedAsync(int pageNumber, int pageSize, CorrectionStatus? status = null, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of corrections matching filters.
    /// </summary>
    Task<int> GetCorrectionsCountAsync(CorrectionStatus? status = null, CancellationToken ct = default);

    /// <summary>
    /// Gets a specific attendance correction request by ID.
    /// </summary>
    Task<AttendanceCorrection?> GetCorrectionByIdAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Adds an attendance correction request.
    /// </summary>
    Task AddCorrectionAsync(AttendanceCorrection correction, CancellationToken ct = default);

    /// <summary>
    /// Bulk imports attendance records.
    /// </summary>
    Task BulkAddAsync(IEnumerable<AttendanceRecord> records, CancellationToken ct = default);
}
