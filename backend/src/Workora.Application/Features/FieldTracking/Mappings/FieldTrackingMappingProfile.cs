using AutoMapper;
using Workora.Application.Features.FieldTracking.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.FieldTracking.Mappings;

/// <summary>
/// AutoMapper profile for field tracking entities.
/// </summary>
public class FieldTrackingMappingProfile : Profile
{
    /// <summary>
    /// Initializes mappings.
    /// </summary>
    public FieldTrackingMappingProfile()
    {
        CreateMap<FieldVisit, FieldVisitDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}".Trim() : null))
            .ForMember(d => d.EmployeeCode, opt => opt.MapFrom(s => s.Employee != null ? s.Employee.EmployeeCode : null));

        CreateMap<FieldGpsPing, LiveLocationDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}".Trim() : null))
            .ForMember(d => d.EmployeeCode, opt => opt.MapFrom(s => s.Employee != null ? s.Employee.EmployeeCode : null));
    }
}
