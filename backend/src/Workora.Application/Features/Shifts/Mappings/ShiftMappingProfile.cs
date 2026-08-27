using AutoMapper;
using Workora.Application.Features.Shifts.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Shifts.Mappings;

/// <summary>
/// AutoMapper profile for <see cref="Shift"/> and shift assignments.
/// </summary>
public class ShiftMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping configuration.
    /// </summary>
    public ShiftMappingProfile()
    {
        CreateMap<Shift, ShiftDto>();
        CreateMap<EmployeeShiftAssignment, ShiftAssignmentDto>()
            .ForMember(d => d.ShiftName, opt => opt.MapFrom(s => s.Shift != null ? s.Shift.Name : string.Empty))
            .ForMember(d => d.StartTime, opt => opt.MapFrom(s => s.Shift != null ? s.Shift.StartTime : default))
            .ForMember(d => d.EndTime, opt => opt.MapFrom(s => s.Shift != null ? s.Shift.EndTime : default));
    }
}
