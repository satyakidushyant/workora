using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Notifications.DTOs;
namespace Workora.Application.Features.Notifications.Commands.MarkAllNotificationsRead;

/// <summary>
/// Command to mark all notifications as read for the authenticated user.
/// </summary>
public record MarkAllNotificationsReadCommand : IRequest<ApiResponse<bool>>;
