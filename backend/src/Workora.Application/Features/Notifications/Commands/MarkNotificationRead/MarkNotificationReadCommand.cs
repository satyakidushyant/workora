using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Notifications.DTOs;
namespace Workora.Application.Features.Notifications.Commands.MarkNotificationRead;

/// <summary>
/// Command to mark a notification as read.
/// </summary>
public record MarkNotificationReadCommand(int Id) : IRequest<ApiResponse<bool>>;
