using AutoMapper;
using Workora.Application.Features.Policies.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Policies.Mappings;

/// <summary>
/// AutoMapper profile for Policy entities.
/// </summary>
public class PolicyMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for Policy.
    /// </summary>
    public PolicyMappingProfile()
    {
        CreateMap<Policy, PolicyDto>()
            .ForMember(d => d.AcknowledgmentsCount, opt => opt.MapFrom(s => s.Acknowledgments.Count));
    }
}
