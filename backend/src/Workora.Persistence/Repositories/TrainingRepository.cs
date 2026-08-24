using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for training courses and enrollments.
/// </summary>
public class TrainingRepository : GenericRepository<TrainingProgram>, ITrainingRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="TrainingRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public TrainingRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<TrainingProgram>> GetProgramsPagedAsync(int pageNumber, int pageSize, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<TrainingProgram>()
            .AsNoTracking()
            .Include(t => t.Enrollments)
            .AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(t => t.CompanyId == companyId.Value);
        }

        return await query
            .OrderByDescending(t => t.StartDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetProgramsCountAsync(int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<TrainingProgram>().AsNoTracking().AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(t => t.CompanyId == companyId.Value);
        }

        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task<TrainingProgram?> GetWithEnrollmentsAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<TrainingProgram>()
            .Include(t => t.Enrollments)
            .ThenInclude(e => e.Employee)
            .FirstOrDefaultAsync(t => t.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task AddEnrollmentAsync(TrainingEnrollment enrollment, CancellationToken ct = default)
    {
        await _dbContext.Set<TrainingEnrollment>().AddAsync(enrollment, ct);
    }

    /// <inheritdoc />
    public async Task<TrainingEnrollment?> GetEnrollmentByIdAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<TrainingEnrollment>()
            .Include(e => e.TrainingProgram)
            .Include(e => e.Employee)
            .FirstOrDefaultAsync(e => e.Id == id, ct);
    }

    /// <inheritdoc />
    public void UpdateEnrollment(TrainingEnrollment enrollment)
    {
        _dbContext.Set<TrainingEnrollment>().Update(enrollment);
    }
}
