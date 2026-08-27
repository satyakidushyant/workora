using AutoMapper;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Performance.Mappings;

/// <summary>
/// AutoMapper profile for performance appraisals and goals.
/// </summary>
public class PerformanceMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for Performance.
    /// </summary>
    public PerformanceMappingProfile()
    {
        CreateMap<Appraisal, AppraisalDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}".Trim() : null))
            .ForMember(d => d.EmployeeCode, opt => opt.MapFrom(s => s.Employee != null ? s.Employee.EmployeeCode : null))
            .ForMember(d => d.ReviewerName, opt => opt.MapFrom(s => s.Reviewer != null ? $"{s.Reviewer.FirstName} {s.Reviewer.LastName}".Trim() : null));

        CreateMap<Goal, GoalDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}".Trim() : null));
    }
}
