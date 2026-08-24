using AutoMapper;
using Workora.Application.Features.Notifications.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Notifications.Mappings;

/// <summary>
/// AutoMapper profile for Notification entities.
/// </summary>
public class NotificationMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for Notification.
    /// </summary>
    public NotificationMappingProfile()
    {
        CreateMap<Notification, NotificationDto>();
    }
}
