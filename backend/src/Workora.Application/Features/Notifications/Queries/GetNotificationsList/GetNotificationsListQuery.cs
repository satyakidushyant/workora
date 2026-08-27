using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Notifications.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Notifications.Queries.GetNotificationsList;

/// <summary>
/// Query to retrieve a paginated list of notifications for the authenticated user.
/// </summary>
public record GetNotificationsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    bool? UnreadOnly = null) : IRequest<ApiResponse<PagedResponse<NotificationDto>>>;
