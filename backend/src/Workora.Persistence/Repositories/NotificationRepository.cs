using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for notifications.
/// </summary>
public class NotificationRepository : GenericRepository<Notification>, INotificationRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="NotificationRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public NotificationRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Notification>> GetUserNotificationsPagedAsync(int userId, int pageNumber, int pageSize, bool? unreadOnly = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<Notification>()
            .AsNoTracking()
            .Where(n => n.UserId == userId);

        if (unreadOnly.HasValue && unreadOnly.Value)
        {
            query = query.Where(n => !n.IsRead);
        }

        return await query
            .OrderByDescending(n => n.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetUserNotificationsCountAsync(int userId, bool? unreadOnly = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<Notification>()
            .AsNoTracking()
            .Where(n => n.UserId == userId);

        if (unreadOnly.HasValue && unreadOnly.Value)
        {
            query = query.Where(n => !n.IsRead);
        }

        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetUnreadCountAsync(int userId, CancellationToken ct = default)
    {
        return await _dbContext.Set<Notification>()
            .AsNoTracking()
            .CountAsync(n => n.UserId == userId && !n.IsRead, ct);
    }

    /// <inheritdoc />
    public async Task MarkAllAsReadAsync(int userId, CancellationToken ct = default)
    {
        await _dbContext.Set<Notification>()
            .Where(n => n.UserId == userId && !n.IsRead)
            .ExecuteUpdateAsync(s => s
                .SetProperty(n => n.IsRead, true)
                .SetProperty(n => n.ReadAt, DateTimeOffset.UtcNow), ct);
    }
}
