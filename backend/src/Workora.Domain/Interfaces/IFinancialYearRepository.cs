using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for <see cref="FinancialYear"/> entity.
/// </summary>
public interface IFinancialYearRepository : IRepository<FinancialYear>
{
    /// <summary>
    /// Gets all financial years for a company.
    /// </summary>
    Task<IReadOnlyList<FinancialYear>> GetByCompanyIdAsync(int companyId, CancellationToken ct = default);

    /// <summary>
    /// Gets the current active financial year for a company.
    /// </summary>
    Task<FinancialYear?> GetCurrentAsync(int companyId, CancellationToken ct = default);

    /// <summary>
    /// Checks if a financial year name already exists for a company.
    /// </summary>
    Task<bool> ExistsByNameAsync(int companyId, string name, int? excludeId = null, CancellationToken ct = default);

    /// <summary>
    /// Checks if there is already a current financial year for a company.
     /// </summary>
    Task<bool> HasCurrentYearAsync(int companyId, CancellationToken ct = default);
}