using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Notifications.DTOs;
namespace Workora.Application.Features.Notifications.Commands.MarkNotificationRead;

/// <summary>
/// Handler for <see cref="MarkNotificationReadCommand"/>.
/// </summary>
public class MarkNotificationReadCommandHandler : IRequestHandler<MarkNotificationReadCommand, ApiResponse<bool>>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="MarkNotificationReadCommandHandler"/> class.
    /// </summary>
    public MarkNotificationReadCommandHandler(INotificationRepository notificationRepository, IUnitOfWork unitOfWork)
    {
        _notificationRepository = notificationRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(MarkNotificationReadCommand request, CancellationToken ct)
    {
        var notification = await _notificationRepository.GetByIdAsync(request.Id, ct);
        if (notification == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.NotificationNotFound.GetDescription());
        }

        notification.MarkAsRead();
        _notificationRepository.Update(notification);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.NotificationMarkedRead.GetDescription());
    }
}
