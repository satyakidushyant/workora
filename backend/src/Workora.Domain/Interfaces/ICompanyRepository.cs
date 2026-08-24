using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for <see cref="Company"/> entities.
/// </summary>
public interface ICompanyRepository : IRepository<Company>
{
    /// <summary>
    /// Gets the primary or first active company profile.
    /// </summary>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>The company entity if found; otherwise, null.</returns>
    Task<Company?> GetDefaultCompanyAsync(CancellationToken ct = default);

    /// <summary>
    /// Checks if a company code is unique across all companies.
    /// </summary>
    /// <param name="code">The company code.</param>
    /// <param name="excludeId">Optional company ID to exclude when updating.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>True if unique; otherwise, false.</returns>
    Task<bool> IsCodeUniqueAsync(string code, int? excludeId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets a list of all active companies.
    /// </summary>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>A list of company entities.</returns>
    Task<IReadOnlyList<Company>> GetAllCompaniesAsync(CancellationToken ct = default);
}
