using AutoMapper;
using Workora.Application.Features.SystemSettings.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.SystemSettings.Mappings;

/// <summary>
/// AutoMapper profile for SystemSetting entity.
/// </summary>
public class SystemSettingMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for SystemSetting.
    /// </summary>
    public SystemSettingMappingProfile()
    {
        CreateMap<SystemSetting, SystemSettingDto>();
    }
}
