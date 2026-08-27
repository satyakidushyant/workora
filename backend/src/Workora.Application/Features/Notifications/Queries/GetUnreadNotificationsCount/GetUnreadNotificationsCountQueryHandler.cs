using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Notifications.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Notifications.Queries.GetUnreadNotificationsCount;

/// <summary>
/// Handler for <see cref="GetUnreadNotificationsCountQuery"/>.
/// </summary>
public class GetUnreadNotificationsCountQueryHandler : IRequestHandler<GetUnreadNotificationsCountQuery, ApiResponse<UnreadNotificationCountDto>>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetUnreadNotificationsCountQueryHandler"/> class.
    /// </summary>
    public GetUnreadNotificationsCountQueryHandler(
        INotificationRepository notificationRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<UnreadNotificationCountDto>> Handle(GetUnreadNotificationsCountQuery request, CancellationToken ct)
    {
        if (!_currentUserService.UserId.HasValue)
        {
            return ApiResponse<UnreadNotificationCountDto>.Fail(ResponseMessage.Unauthorized.GetDescription());
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<UnreadNotificationCountDto>.Fail(ResponseMessage.UserNotFound.GetDescription());
        }

        var count = await _notificationRepository.GetUnreadCountAsync(user.Id, ct);
        return ApiResponse<UnreadNotificationCountDto>.Success(new UnreadNotificationCountDto(count));
    }
}
