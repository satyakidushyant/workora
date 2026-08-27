using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Notifications.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Notifications.Queries.GetNotificationsList;

/// <summary>
/// Handler for <see cref="GetNotificationsListQuery"/>.
/// </summary>
public class GetNotificationsListQueryHandler : IRequestHandler<GetNotificationsListQuery, ApiResponse<PagedResponse<NotificationDto>>>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetNotificationsListQueryHandler"/> class.
    /// </summary>
    public GetNotificationsListQueryHandler(
        INotificationRepository notificationRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<NotificationDto>>> Handle(GetNotificationsListQuery request, CancellationToken ct)
    {
        if (!_currentUserService.UserId.HasValue)
        {
            return ApiResponse<PagedResponse<NotificationDto>>.Fail("User not authenticated.");
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<PagedResponse<NotificationDto>>.Fail("User not found.");
        }

        var notifications = await _notificationRepository.GetUserNotificationsPagedAsync(
            user.Id,
            request.PageNumber,
            request.PageSize,
            request.UnreadOnly,
            ct);

        var totalCount = await _notificationRepository.GetUserNotificationsCountAsync(
            user.Id,
            request.UnreadOnly,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<NotificationDto>>(notifications);
        var paged = new PagedResponse<NotificationDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<NotificationDto>>.Success(paged);
    }
}
