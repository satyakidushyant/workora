using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Notifications.Commands.MarkAllNotificationsRead;
using Workora.Application.Features.Notifications.Commands.MarkNotificationRead;
using Workora.Application.Features.Notifications.DTOs;
using Workora.Application.Features.Notifications.Queries.GetNotificationsList;
using Workora.Application.Features.Notifications.Queries.GetUnreadNotificationsCount;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for user inbox notifications and unread counters.
/// </summary>
[ApiController]
[Route("api/v1/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="NotificationsController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public NotificationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets a paginated list of notifications for the authenticated user.
    /// </summary>
    /// <param name="query">Pagination and read status filter.</param>
    /// <returns>A paginated list of notifications.</returns>
    [HttpGet]
    public async Task<ApiResponse<PagedResponse<NotificationDto>>> GetNotifications([FromQuery] GetNotificationsListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets the count of unread notifications for the user's top-bar badge.
    /// </summary>
    /// <returns>The unread count.</returns>
    [HttpGet("unread-count")]
    public async Task<ApiResponse<UnreadNotificationCountDto>> GetUnreadCount()
        => await _mediator.Send(new GetUnreadNotificationsCountQuery());

    /// <summary>
    /// Marks a specific notification as read.
    /// </summary>
    /// <param name="id">The notification ID.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPatch("{id:int}/read")]
    public async Task<ApiResponse<bool>> MarkRead(int id)
        => await _mediator.Send(new MarkNotificationReadCommand(id));

    /// <summary>
    /// Marks all notifications as read for the authenticated user.
    /// </summary>
    /// <returns>A confirmation response.</returns>
    [HttpPatch("read-all")]
    public async Task<ApiResponse<bool>> MarkAllRead()
        => await _mediator.Send(new MarkAllNotificationsReadCommand());
}
