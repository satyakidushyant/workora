using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for company policies and employee acknowledgments.
/// </summary>
public interface IPolicyRepository : IRepository<Policy>
{
    /// <summary>
    /// Gets all policies for a company.
    /// </summary>
    Task<IReadOnlyList<Policy>> GetPoliciesPagedAsync(int pageNumber, int pageSize, int? companyId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of policies.
    /// </summary>
    Task<int> GetPoliciesCountAsync(int? companyId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets a policy with its employee acknowledgments.
    /// </summary>
    Task<Policy?> GetWithAcknowledgmentsAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Checks if an employee has acknowledged a policy.
    /// </summary>
    Task<bool> HasAcknowledgedAsync(int policyId, int employeeId, CancellationToken ct = default);

    /// <summary>
    /// Records an employee's policy acknowledgment.
    /// </summary>
    Task AddAcknowledgmentAsync(PolicyAcknowledgment acknowledgment, CancellationToken ct = default);
}
