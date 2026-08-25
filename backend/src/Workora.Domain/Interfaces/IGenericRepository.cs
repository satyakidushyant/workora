using System.Linq.Expressions;
using Workora.Domain.Common;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Defines generic queryable repository operations for CQRS handlers.
/// </summary>
/// <typeparam name="T">Entity type inheriting from BaseEntity.</typeparam>
public interface IGenericRepository<T> where T : BaseEntity
{
    /// <summary>
    /// Gets the LINQ queryable expression tree for the entity set.
    /// </summary>
    IQueryable<T> GetQueryable();

    /// <summary>
    /// Gets an entity by its integer identifier.
    /// </summary>
    Task<T?> GetByIdAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Gets the first entity matching the specified predicate expression.
    /// </summary>
    Task<T?> GetFirstOrDefaultAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);

    /// <summary>
    /// Adds a new entity to the repository.
    /// </summary>
    Task<T> AddAsync(T entity, CancellationToken ct = default);

    /// <summary>
    /// Updates an existing entity.
    /// </summary>
    void Update(T entity);

    /// <summary>
    /// Removes an entity.
    /// </summary>
    void Remove(T entity);
}
