using Workora.Domain.Common;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Generic repository interface for entities.
/// </summary>
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<T?> GetByUuidAsync(Guid uuid, CancellationToken ct = default);
    Task<T> AddAsync(T entity, CancellationToken ct = default);
    void Update(T entity);
    void Remove(T entity);
}
