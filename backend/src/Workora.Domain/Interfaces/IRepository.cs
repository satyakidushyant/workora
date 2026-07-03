using Workora.Domain.Common;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Generic repository interface for entities.
/// </summary>
public interface IRepository<T> where T : BaseEntity
{
    /// <summary>
    /// Retrieves an entity by its integer ID.
    /// </summary>
    /// <param name="id">The integer ID.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>The entity if found; otherwise, null.</returns>
    Task<T?> GetByIdAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Retrieves an entity by its globally unique identifier.
    /// </summary>
    /// <param name="uuid">The Guid representing the UUID.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>The entity if found; otherwise, null.</returns>
    Task<T?> GetByUuidAsync(Guid uuid, CancellationToken ct = default);

    /// <summary>
    /// Adds a new entity to the repository.
    /// </summary>
    /// <param name="entity">The entity to add.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>The added entity.</returns>
    Task<T> AddAsync(T entity, CancellationToken ct = default);

    /// <summary>
    /// Updates an existing entity in the repository.
    /// </summary>
    /// <param name="entity">The entity to update.</param>
    void Update(T entity);

    /// <summary>
    /// Removes an entity from the repository. Note that for soft-deletable entities, this might only set the soft-delete flag.
    /// </summary>
    /// <param name="entity">The entity to remove.</param>
    void Remove(T entity);
}
