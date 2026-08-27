using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Notifications.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Notifications.Queries.GetUnreadNotificationsCount;

/// <summary>
/// Query to count unread notifications for the authenticated user.
/// </summary>
public record GetUnreadNotificationsCountQuery : IRequest<ApiResponse<UnreadNotificationCountDto>>;
