using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="OnboardingChecklist"/> and <see cref="EmployeeOnboarding"/> entities.
/// </summary>
public class OnboardingRepository : GenericRepository<OnboardingChecklist>, IOnboardingRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="OnboardingRepository"/> class.
    /// </summary>
    public OnboardingRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<OnboardingChecklist>> GetChecklistsAsync(CancellationToken ct = default)
    {
        return await _dbContext.Set<OnboardingChecklist>()
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.TaskName)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<EmployeeOnboarding>> GetEmployeeOnboardingAsync(int employeeId, CancellationToken ct = default)
    {
        return await _dbContext.Set<EmployeeOnboarding>()
            .Include(eo => eo.Checklist)
            .Include(eo => eo.VerifiedByEmployee)
            .AsNoTracking()
            .Where(eo => eo.EmployeeId == employeeId && eo.IsActive)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<EmployeeOnboarding?> GetEmployeeOnboardingItemAsync(int employeeId, int checklistId, CancellationToken ct = default)
    {
        return await _dbContext.Set<EmployeeOnboarding>()
            .FirstOrDefaultAsync(eo => eo.EmployeeId == employeeId && eo.ChecklistId == checklistId && eo.IsActive, ct);
    }

    /// <inheritdoc />
    public async Task<bool> HasExistingOnboardingAsync(int employeeId, int checklistId, CancellationToken ct = default)
    {
        return await _dbContext.Set<EmployeeOnboarding>()
            .AnyAsync(eo => eo.EmployeeId == employeeId && eo.ChecklistId == checklistId && eo.IsActive, ct);
    }

    /// <inheritdoc />
    public async Task AddEmployeeOnboardingAsync(EmployeeOnboarding onboarding, CancellationToken ct = default)
    {
        await _dbContext.Set<EmployeeOnboarding>().AddAsync(onboarding, ct);
    }

    /// <inheritdoc />
    public void UpdateEmployeeOnboarding(EmployeeOnboarding onboarding)
    {
        _dbContext.Set<EmployeeOnboarding>().Update(onboarding);
    }
}