using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="LeaveRequest"/> and <see cref="LeaveType"/> entities.
/// </summary>
public class LeaveRequestRepository : GenericRepository<LeaveRequest>, ILeaveRequestRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="LeaveRequestRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public LeaveRequestRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<LeaveRequest?> GetWithDetailsAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<LeaveRequest>()
            .Include(l => l.Employee)
            .Include(l => l.LeaveType)
            .Include(l => l.Approvals)
            .FirstOrDefaultAsync(l => l.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<bool> HasOverlappingApprovedLeaveAsync(int employeeId, DateOnly startDate, DateOnly endDate, int? excludeId = null, CancellationToken ct = default)
    {
        return await _dbContext.Set<LeaveRequest>()
            .AnyAsync(l => l.EmployeeId == employeeId &&
                           l.Status == LeaveRequestStatus.Approved &&
                           l.StartDate <= endDate &&
                           l.EndDate >= startDate &&
                           (!excludeId.HasValue || l.Id != excludeId.Value), ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<LeaveRequest>> GetPagedListAsync(
        int pageNumber,
        int pageSize,
        int? employeeId = null,
        int? departmentId = null,
        LeaveRequestStatus? status = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        CancellationToken ct = default)
    {
        var query = BuildQuery(employeeId, departmentId, status, fromDate, toDate);

        return await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetCountAsync(
        int? employeeId = null,
        int? departmentId = null,
        LeaveRequestStatus? status = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        CancellationToken ct = default)
    {
        var query = BuildQuery(employeeId, departmentId, status, fromDate, toDate);
        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<LeaveRequest>> GetCalendarListAsync(DateOnly startDate, DateOnly endDate, int? departmentId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<LeaveRequest>()
            .AsNoTracking()
            .Include(l => l.Employee)
            .Include(l => l.LeaveType)
            .Where(l => l.Status == LeaveRequestStatus.Approved && l.StartDate <= endDate && l.EndDate >= startDate);

        if (departmentId.HasValue)
        {
            query = query.Where(l => l.Employee.DepartmentId == departmentId.Value);
        }

        return await query.OrderBy(l => l.StartDate).ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<LeaveType>> GetLeaveTypesAsync(int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<LeaveType>().AsNoTracking().AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(t => t.CompanyId == companyId.Value);
        }

        return await query.OrderBy(t => t.Name).ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<LeaveType?> GetLeaveTypeByIdAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<LeaveType>().FirstOrDefaultAsync(t => t.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task AddLeaveTypeAsync(LeaveType leaveType, CancellationToken ct = default)
    {
        await _dbContext.Set<LeaveType>().AddAsync(leaveType, ct);
    }

    /// <inheritdoc />
    public void UpdateLeaveType(LeaveType leaveType)
    {
        _dbContext.Set<LeaveType>().Update(leaveType);
    }

    private IQueryable<LeaveRequest> BuildQuery(
        int? employeeId,
        int? departmentId,
        LeaveRequestStatus? status,
        DateOnly? fromDate,
        DateOnly? toDate)
    {
        var query = _dbContext.Set<LeaveRequest>()
            .AsNoTracking()
            .Include(l => l.Employee)
            .Include(l => l.LeaveType)
            .Include(l => l.Approvals)
            .AsQueryable();

        if (employeeId.HasValue)
        {
            query = query.Where(l => l.EmployeeId == employeeId.Value);
        }

        if (departmentId.HasValue)
        {
            query = query.Where(l => l.Employee.DepartmentId == departmentId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(l => l.Status == status.Value);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(l => l.StartDate >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(l => l.EndDate <= toDate.Value);
        }

        return query;
    }
}
