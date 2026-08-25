using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="FieldVisit"/>.
/// </summary>
public class FieldVisitRepository : GenericRepository<FieldVisit>, IFieldVisitRepository
{
    /// <inheritdoc />
    public FieldVisitRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<List<FieldVisit>> GetVisitsByEmployeeAsync(int employeeId, DateOnly? fromDate, DateOnly? toDate, CancellationToken ct = default)
    {
        var query = _dbContext.Set<FieldVisit>()
            .Where(x => x.EmployeeId == employeeId);

        if (fromDate.HasValue)
        {
            var fromDto = new DateTimeOffset(fromDate.Value.ToDateTime(TimeOnly.MinValue), TimeSpan.Zero);
            query = query.Where(x => x.CheckInTime >= fromDto);
        }

        if (toDate.HasValue)
        {
            var toDto = new DateTimeOffset(toDate.Value.ToDateTime(TimeOnly.MaxValue), TimeSpan.Zero);
            query = query.Where(x => x.CheckInTime <= toDto);
        }

        return await query.OrderByDescending(x => x.CheckInTime).ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<List<FieldVisit>> GetTodayFieldVisitsAsync(CancellationToken ct = default)
    {
        var today = DateTimeOffset.UtcNow.Date;
        return await _dbContext.Set<FieldVisit>()
            .Include(x => x.Employee)
            .Where(x => x.CheckInTime >= today)
            .OrderByDescending(x => x.CheckInTime)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task AddGpsPingAsync(FieldGpsPing ping, CancellationToken ct = default)
    {
        await _dbContext.Set<FieldGpsPing>().AddAsync(ping, ct);
    }

    /// <inheritdoc />
    public async Task<List<FieldGpsPing>> GetLatestGpsLocationsAsync(CancellationToken ct = default)
    {
        var latestPings = await _dbContext.Set<FieldGpsPing>()
            .Include(x => x.Employee)
            .GroupBy(x => x.EmployeeId)
            .Select(g => g.OrderByDescending(p => p.RecordedAt).First())
            .ToListAsync(ct);

        return latestPings;
    }
}
