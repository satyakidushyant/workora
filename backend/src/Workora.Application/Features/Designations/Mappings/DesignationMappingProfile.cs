using AutoMapper;
using Workora.Application.Features.Designations.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Designations.Mappings;

/// <summary>
/// AutoMapper profile for <see cref="Designation"/> entity and its DTOs.
/// </summary>
public class DesignationMappingProfile : Profile
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DesignationMappingProfile"/> class.
    /// </summary>
    public DesignationMappingProfile()
    {
        CreateMap<Designation, DesignationDto>()
            .ForMember(d => d.DepartmentName, opt => opt.MapFrom(s => s.Department != null ? s.Department.Name : null));
    }
}
