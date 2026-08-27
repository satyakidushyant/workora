using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Notifications.DTOs;

/// <summary>
/// DTO representing unread notification count.
/// </summary>
public record UnreadNotificationCountDto(
    int UnreadCount);
