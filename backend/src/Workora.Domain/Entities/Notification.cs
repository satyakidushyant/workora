using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an in-app notification delivered to a user.
/// </summary>
public class Notification : BaseEntity
{
    /// <summary>
    /// Foreign key identifier for the recipient user.
    /// </summary>
    public int UserId { get; private set; }

    /// <summary>
    /// Navigation property to the recipient user.
    /// </summary>
    public User User { get; private set; } = null!;

    /// <summary>
    /// Title header of the notification.
    /// </summary>
    public string Title { get; private set; } = null!;

    /// <summary>
    /// Message body content.
    /// </summary>
    public string Message { get; private set; } = null!;

    /// <summary>
    /// Type categorization.
    /// </summary>
    public NotificationType Type { get; private set; } = NotificationType.Info;

    /// <summary>
    /// Optional deep-link URL or UI route to navigate when clicked.
    /// </summary>
    public string? ActionUrl { get; private set; }

    /// <summary>
    /// Indicates whether the recipient has read the notification.
    /// </summary>
    public bool IsRead { get; private set; }

    /// <summary>
    /// Timestamp when notification was read.
    /// </summary>
    public DateTimeOffset? ReadAt { get; private set; }

    /// <summary>
    /// Timestamp when notification was created.
    /// </summary>
    public DateTimeOffset CreatedAt { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Notification() { }

    /// <summary>
    /// Creates a new Notification instance.
    /// </summary>
    public static Notification Create(
        int userId,
        string title,
        string message,
        NotificationType type = NotificationType.Info,
        string? actionUrl = null)
    {
        return new Notification
        {
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            ActionUrl = actionUrl,
            IsRead = false,
            CreatedAt = DateTimeOffset.UtcNow,
            IsActive = true
        };
    }

    /// <summary>
    /// Marks the notification as read.
    /// </summary>
    public void MarkAsRead()
    {
        IsRead = true;
        ReadAt = DateTimeOffset.UtcNow;
    }
}
