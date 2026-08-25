using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for field visits and real-time GPS tracking.
/// </summary>
public interface IFieldVisitRepository : IRepository<FieldVisit>
{
    /// <summary>
    /// Gets visit history for a specific employee within a date range.
    /// </summary>
    Task<List<FieldVisit>> GetVisitsByEmployeeAsync(int employeeId, DateOnly? fromDate, DateOnly? toDate, CancellationToken ct = default);

    /// <summary>
    /// Gets all active/today's visits across the field workforce.
    /// </summary>
    Task<List<FieldVisit>> GetTodayFieldVisitsAsync(CancellationToken ct = default);

    /// <summary>
    /// Records a real-time GPS telemetry ping from mobile device.
    /// </summary>
    Task AddGpsPingAsync(FieldGpsPing ping, CancellationToken ct = default);

    /// <summary>
    /// Gets the most recent GPS locations of all active field employees.
    /// </summary>
    Task<List<FieldGpsPing>> GetLatestGpsLocationsAsync(CancellationToken ct = default);
}
