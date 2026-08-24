using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for user notifications.
/// </summary>
public interface INotificationRepository : IRepository<Notification>
{
    /// <summary>
    /// Gets a paginated list of notifications for a user.
    /// </summary>
    Task<IReadOnlyList<Notification>> GetUserNotificationsPagedAsync(int userId, int pageNumber, int pageSize, bool? unreadOnly = null, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of notifications for a user.
    /// </summary>
    Task<int> GetUserNotificationsCountAsync(int userId, bool? unreadOnly = null, CancellationToken ct = default);

    /// <summary>
    /// Gets unread notification count for a user.
    /// </summary>
    Task<int> GetUnreadCountAsync(int userId, CancellationToken ct = default);

    /// <summary>
    /// Marks all notifications as read for a user.
    /// </summary>
    Task MarkAllAsReadAsync(int userId, CancellationToken ct = default);
}
