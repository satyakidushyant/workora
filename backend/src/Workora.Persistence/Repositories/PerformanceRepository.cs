using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for appraisals and goals.
/// </summary>
public class PerformanceRepository : GenericRepository<Appraisal>, IPerformanceRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="PerformanceRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public PerformanceRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Appraisal>> GetAppraisalsPagedAsync(int pageNumber, int pageSize, int? employeeId = null, int? reviewerId = null, int? year = null, AppraisalStatus? status = null, CancellationToken ct = default)
    {
        var query = BuildAppraisalQuery(employeeId, reviewerId, year, status);

        return await query
            .OrderByDescending(a => a.Year)
            .ThenByDescending(a => a.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetAppraisalsCountAsync(int? employeeId = null, int? reviewerId = null, int? year = null, AppraisalStatus? status = null, CancellationToken ct = default)
    {
        var query = BuildAppraisalQuery(employeeId, reviewerId, year, status);
        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task<Appraisal?> GetAppraisalWithDetailsAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<Appraisal>()
            .Include(a => a.Employee)
            .Include(a => a.Reviewer)
            .FirstOrDefaultAsync(a => a.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task AddGoalAsync(Goal goal, CancellationToken ct = default)
    {
        await _dbContext.Set<Goal>().AddAsync(goal, ct);
    }

    /// <inheritdoc />
    public async Task<Goal?> GetGoalByIdAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<Goal>()
            .Include(g => g.Employee)
            .FirstOrDefaultAsync(g => g.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Goal>> GetEmployeeGoalsAsync(int employeeId, GoalStatus? status = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<Goal>()
            .AsNoTracking()
            .Where(g => g.EmployeeId == employeeId);

        if (status.HasValue)
        {
            query = query.Where(g => g.Status == status.Value);
        }

        return await query.OrderByDescending(g => g.CreatedAt).ToListAsync(ct);
    }

    /// <inheritdoc />
    public void UpdateGoal(Goal goal)
    {
        _dbContext.Set<Goal>().Update(goal);
    }

    private IQueryable<Appraisal> BuildAppraisalQuery(int? employeeId, int? reviewerId, int? year, AppraisalStatus? status)
    {
        var query = _dbContext.Set<Appraisal>()
            .AsNoTracking()
            .Include(a => a.Employee)
            .Include(a => a.Reviewer)
            .AsQueryable();

        if (employeeId.HasValue)
        {
            query = query.Where(a => a.EmployeeId == employeeId.Value);
        }

        if (reviewerId.HasValue)
        {
            query = query.Where(a => a.ReviewerEmployeeId == reviewerId.Value);
        }

        if (year.HasValue)
        {
            query = query.Where(a => a.Year == year.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(a => a.Status == status.Value);
        }

        return query;
    }
}
