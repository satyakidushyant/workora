using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Notifications.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Notifications.Queries.GetNotificationsList;

/// <summary>
/// Query to retrieve a paginated list of notifications for the authenticated user with dynamic pagination and filtering.
/// </summary>
public record GetNotificationsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<NotificationDto>>>
{
    /// <summary>
    /// Gets or init optional filter to retrieve unread notifications only.
    /// </summary>
    public bool? UnreadOnly { get; init; }
}

