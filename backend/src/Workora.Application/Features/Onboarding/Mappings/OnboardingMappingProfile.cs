using AutoMapper;
using Workora.Application.Features.Onboarding.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Onboarding.Mappings;

/// <summary>
/// AutoMapper profile for Onboarding entities.
/// </summary>
public class OnboardingMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for Onboarding.
    /// </summary>
    public OnboardingMappingProfile()
    {
        CreateMap<OnboardingChecklist, OnboardingChecklistDto>();

        CreateMap<EmployeeOnboarding, EmployeeOnboardingItemDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}".Trim() : null))
            .ForMember(d => d.TaskName, opt => opt.MapFrom(s => s.Checklist != null ? s.Checklist.TaskName : string.Empty))
            .ForMember(d => d.AssignedRole, opt => opt.MapFrom(s => s.Checklist != null ? s.Checklist.AssignedRole : string.Empty))
            .ForMember(d => d.IsMandatory, opt => opt.MapFrom(s => s.Checklist != null && s.Checklist.IsMandatory))
            .ForMember(d => d.VerifiedByEmployeeName, opt => opt.MapFrom(s => s.VerifiedByEmployee != null ? $"{s.VerifiedByEmployee.FirstName} {s.VerifiedByEmployee.LastName}".Trim() : null));
    }
}
