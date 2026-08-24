using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Notifications.Commands.MarkAllNotificationsRead;

/// <summary>
/// Command to mark all notifications as read for the authenticated user.
/// </summary>
public record MarkAllNotificationsReadCommand : IRequest<ApiResponse<bool>>;

/// <summary>
/// Handler for <see cref="MarkAllNotificationsReadCommand"/>.
/// </summary>
public class MarkAllNotificationsReadCommandHandler : IRequestHandler<MarkAllNotificationsReadCommand, ApiResponse<bool>>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    /// <summary>
    /// Initializes a new instance of the <see cref="MarkAllNotificationsReadCommandHandler"/> class.
    /// </summary>
    public MarkAllNotificationsReadCommandHandler(
        INotificationRepository notificationRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(MarkAllNotificationsReadCommand request, CancellationToken ct)
    {
        if (!_currentUserService.UserId.HasValue)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.UserContextUnavailable.GetDescription());
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.UserNotFound.GetDescription());
        }

        await _notificationRepository.MarkAllAsReadAsync(user.Id, ct);
        return ApiResponse<bool>.Success(true, ResponseMessage.AllNotificationsMarkedRead.GetDescription());
    }
}
