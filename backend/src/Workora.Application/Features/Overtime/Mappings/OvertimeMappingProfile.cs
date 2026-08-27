using AutoMapper;
using Workora.Application.Features.Overtime.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Overtime.Mappings;

/// <summary>
/// AutoMapper profile for Overtime entities.
/// </summary>
public class OvertimeMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for Overtime.
    /// </summary>
    public OvertimeMappingProfile()
    {
        CreateMap<OvertimeRequest, OvertimeRequestDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}".Trim() : null))
            .ForMember(d => d.EmployeeCode, opt => opt.MapFrom(s => s.Employee != null ? s.Employee.EmployeeCode : null));
    }
}
