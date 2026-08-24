using Workora.Domain.Enums;

namespace Workora.Application.Features.Notifications.DTOs;

/// <summary>
/// DTO representing an in-app user notification.
/// </summary>
public record NotificationDto(
    int Id,
    Guid Uuid,
    int UserId,
    string Title,
    string Message,
    NotificationType Type,
    string? ActionUrl,
    bool IsRead,
    DateTimeOffset? ReadAt,
    DateTimeOffset CreatedAt);

/// <summary>
/// DTO representing unread notification count.
/// </summary>
public record UnreadNotificationCountDto(
    int UnreadCount);
