using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="OvertimeRequest"/> entity.
/// </summary>
public class OvertimeRequestRepository : GenericRepository<OvertimeRequest>, IOvertimeRequestRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="OvertimeRequestRepository"/> class.
    /// </summary>
    public OvertimeRequestRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<OvertimeRequest?> GetWithDetailsAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<OvertimeRequest>()
            .Include(o => o.Employee)
            .FirstOrDefaultAsync(o => o.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<bool> HasOverlappingRequestAsync(int employeeId, DateOnly overtimeDate, int? excludeId = null, CancellationToken ct = default)
    {
        return await _dbContext.Set<OvertimeRequest>()
            .AnyAsync(o => o.EmployeeId == employeeId
                && o.OvertimeDate == overtimeDate
                && o.Status != OvertimeRequestStatus.Rejected
                && o.Status != OvertimeRequestStatus.Cancelled
                && o.IsActive
                && (excludeId == null || o.Id != excludeId), ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<OvertimeRequest>> GetPagedListAsync(
        int pageNumber,
        int pageSize,
        int? employeeId = null,
        int? departmentId = null,
        OvertimeRequestStatus? status = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        CancellationToken ct = default)
    {
        var query = _dbContext.Set<OvertimeRequest>()
            .Include(o => o.Employee)
            .AsNoTracking()
            .AsQueryable();

        if (employeeId.HasValue)
            query = query.Where(o => o.EmployeeId == employeeId.Value);

        if (departmentId.HasValue)
            query = query.Where(o => o.Employee != null && o.Employee.DepartmentId == departmentId.Value);

        if (status.HasValue)
            query = query.Where(o => o.Status == status.Value);

        if (fromDate.HasValue)
            query = query.Where(o => o.OvertimeDate >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(o => o.OvertimeDate <= toDate.Value);

        return await query
            .OrderByDescending(o => o.OvertimeDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetCountAsync(
        int? employeeId = null,
        int? departmentId = null,
        OvertimeRequestStatus? status = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        CancellationToken ct = default)
    {
        var query = _dbContext.Set<OvertimeRequest>()
            .AsNoTracking()
            .AsQueryable();

        if (employeeId.HasValue)
            query = query.Where(o => o.EmployeeId == employeeId.Value);

        if (departmentId.HasValue)
            query = query.Where(o => o.Employee != null && o.Employee.DepartmentId == departmentId.Value);

        if (status.HasValue)
            query = query.Where(o => o.Status == status.Value);

        if (fromDate.HasValue)
            query = query.Where(o => o.OvertimeDate >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(o => o.OvertimeDate <= toDate.Value);

        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<OvertimeRequest>> GetEmployeeOvertimeReportAsync(
        int employeeId,
        DateOnly fromDate,
        DateOnly toDate,
        CancellationToken ct = default)
    {
        return await _dbContext.Set<OvertimeRequest>()
            .Include(o => o.Employee)
            .AsNoTracking()
            .Where(o => o.EmployeeId == employeeId
                && o.OvertimeDate >= fromDate
                && o.OvertimeDate <= toDate
                && o.Status == OvertimeRequestStatus.Approved)
            .OrderBy(o => o.OvertimeDate)
            .ToListAsync(ct);
    }
}