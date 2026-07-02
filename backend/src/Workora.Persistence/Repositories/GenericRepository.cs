using Microsoft.EntityFrameworkCore;
using Workora.Domain.Common;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Generic repository implementation for standard CRUD operations.
/// </summary>
/// <typeparam name="T">The type of the entity.</typeparam>
public class GenericRepository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly AppDbContext _dbContext;

    /// <summary>
    /// Initializes a new instance of the <see cref="GenericRepository{T}"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public GenericRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <inheritdoc />
    public virtual async Task<T?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<T>().FindAsync(new object[] { id }, ct);
    }

    public virtual async Task<T?> GetByUuidAsync(Guid uuid, CancellationToken ct = default)
    {
        return await _dbContext.Set<T>().FirstOrDefaultAsync(x => x.Uuid == uuid, ct);
    }

    /// <inheritdoc />
    public virtual async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default)
    {
        return await _dbContext.Set<T>().ToListAsync(ct);
    }

    public virtual async Task<T> AddAsync(T entity, CancellationToken ct = default)
    {
        await _dbContext.Set<T>().AddAsync(entity, ct);
        return entity;
    }

    /// <inheritdoc />
    public virtual void Update(T entity)
    {
        _dbContext.Set<T>().Update(entity);
    }

    public virtual void Remove(T entity)
    {
        _dbContext.Set<T>().Remove(entity);
    }
}
