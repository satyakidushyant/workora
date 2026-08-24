using AutoMapper;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Holidays.Mappings;

/// <summary>
/// AutoMapper profile for <see cref="Holiday"/> entity and its DTOs.
/// </summary>
public class HolidayMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for Holiday.
    /// </summary>
    public HolidayMappingProfile()
    {
        CreateMap<Holiday, HolidayDto>()
            .ForMember(d => d.BranchName, opt => opt.MapFrom(s => s.Branch != null ? s.Branch.Name : null));
    }
}
