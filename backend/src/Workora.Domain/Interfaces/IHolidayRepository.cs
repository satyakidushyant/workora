using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for <see cref="Holiday"/> entities.
/// </summary>
public interface IHolidayRepository : IRepository<Holiday>
{
    /// <summary>
    /// Gets holidays for a given year and optional branch.
    /// </summary>
    Task<IReadOnlyList<Holiday>> GetHolidaysAsync(int year, int? branchId = null, int? companyId = null, CancellationToken ct = default);

    /// <summary>
    /// Checks if a holiday date already exists for the company/branch scope.
    /// </summary>
    Task<bool> IsDateUniqueAsync(int companyId, DateOnly date, int? branchId = null, int? excludeId = null, CancellationToken ct = default);
}
