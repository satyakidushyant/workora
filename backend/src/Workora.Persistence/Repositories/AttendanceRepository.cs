using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for attendance logs and corrections.
/// </summary>
public class AttendanceRepository : GenericRepository<AttendanceRecord>, IAttendanceRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AttendanceRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public AttendanceRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<AttendanceRecord?> GetByDateAsync(int employeeId, DateOnly date, CancellationToken ct = default)
    {
        return await _dbContext.Set<AttendanceRecord>()
            .Include(a => a.Shift)
            .Include(a => a.Corrections)
            .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.AttendanceDate == date, ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<AttendanceRecord>> GetHistoryAsync(int employeeId, DateOnly startDate, DateOnly endDate, CancellationToken ct = default)
    {
        return await _dbContext.Set<AttendanceRecord>()
            .AsNoTracking()
            .Include(a => a.Shift)
            .Where(a => a.EmployeeId == employeeId && a.AttendanceDate >= startDate && a.AttendanceDate <= endDate)
            .OrderByDescending(a => a.AttendanceDate)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<AttendanceCorrection>> GetCorrectionsPagedAsync(int pageNumber, int pageSize, CorrectionStatus? status = null, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<AttendanceCorrection>()
            .AsNoTracking()
            .Include(c => c.AttendanceRecord)
            .ThenInclude(a => a.Employee)
            .AsQueryable();

        if (companyId.HasValue)
        {
            var cid = companyId.Value;
            query = query.Where(c => c.AttendanceRecord.Employee != null &&
                ((c.AttendanceRecord.Employee.Department != null && c.AttendanceRecord.Employee.Department.CompanyId == cid) ||
                 (c.AttendanceRecord.Employee.Branch != null && c.AttendanceRecord.Employee.Branch.CompanyId == cid)));
        }

        if (status.HasValue)
        {
            query = query.Where(c => c.Status == status.Value);
        }

        return await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetCorrectionsCountAsync(CorrectionStatus? status = null, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<AttendanceCorrection>()
            .AsNoTracking()
            .Include(c => c.AttendanceRecord)
            .ThenInclude(a => a.Employee)
            .AsQueryable();

        if (companyId.HasValue)
        {
            var cid = companyId.Value;
            query = query.Where(c => c.AttendanceRecord.Employee != null &&
                ((c.AttendanceRecord.Employee.Department != null && c.AttendanceRecord.Employee.Department.CompanyId == cid) ||
                 (c.AttendanceRecord.Employee.Branch != null && c.AttendanceRecord.Employee.Branch.CompanyId == cid)));
        }

        if (status.HasValue)
        {
            query = query.Where(c => c.Status == status.Value);
        }

        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task<AttendanceCorrection?> GetCorrectionByIdAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<AttendanceCorrection>()
            .Include(c => c.AttendanceRecord)
            .ThenInclude(a => a.Employee)
            .FirstOrDefaultAsync(c => c.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task AddCorrectionAsync(AttendanceCorrection correction, CancellationToken ct = default)
    {
        await _dbContext.Set<AttendanceCorrection>().AddAsync(correction, ct);
    }

    /// <inheritdoc />
    public async Task BulkAddAsync(IEnumerable<AttendanceRecord> records, CancellationToken ct = default)
    {
        await _dbContext.Set<AttendanceRecord>().AddRangeAsync(records, ct);
    }
}
