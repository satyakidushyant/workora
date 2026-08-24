using Workora.Domain.Entities;
using Workora.Domain.Enums;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for corporate asset tracking and checkouts.
/// </summary>
public interface IAssetRepository : IRepository<Asset>
{
    /// <summary>
    /// Gets a paginated list of assets with category and status filters.
    /// </summary>
    Task<IReadOnlyList<Asset>> GetAssetsPagedAsync(int pageNumber, int pageSize, int? companyId = null, string? category = null, AssetStatus? status = null, string? searchTerm = null, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of assets.
    /// </summary>
    Task<int> GetAssetsCountAsync(int? companyId = null, string? category = null, AssetStatus? status = null, string? searchTerm = null, CancellationToken ct = default);

    /// <summary>
    /// Gets an asset by ID with assignment history.
    /// </summary>
    Task<Asset?> GetWithAssignmentsAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Gets the current active assignment for an asset.
    /// </summary>
    Task<AssetAssignment?> GetActiveAssignmentAsync(int assetId, CancellationToken ct = default);

    /// <summary>
    /// Adds an asset assignment record.
    /// </summary>
    Task AddAssignmentAsync(AssetAssignment assignment, CancellationToken ct = default);

    /// <summary>
    /// Updates an assignment record.
    /// </summary>
    void UpdateAssignment(AssetAssignment assignment);
}
