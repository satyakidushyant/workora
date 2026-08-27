namespace Workora.Application.Common.Interfaces;

/// <summary>
/// Service contract for resolving the tenant company scope for the current authenticated user context.
/// </summary>
public interface ITenantResolutionService
{
    /// <summary>
    /// Resolves the effective Company ID for the current execution context.
    /// SuperAdmin users can query all companies (returns null or requested ID).
    /// Tenant administrators and employees are strictly constrained to their tenant company ID.
    /// If an unlinked tenant user has no matched company, returns -1 to prevent leaking global platform data.
    /// </summary>
    /// <param name="requestedCompanyId">Optional company ID explicitly requested in the query parameter.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The resolved company ID, or null for platform-wide SuperAdmin queries, or -1 for unlinked tenant accounts.</returns>
    Task<int?> GetCurrentCompanyIdAsync(int? requestedCompanyId = null, CancellationToken ct = default);
}
