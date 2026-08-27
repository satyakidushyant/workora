using AutoMapper;
using Workora.Application.Features.Branches.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Branches.Mappings;

/// <summary>
/// AutoMapper profile for <see cref="Branch"/> entity and its DTOs.
/// </summary>
public class BranchMappingProfile : Profile
{
    /// <summary>
    /// Initializes a new instance of the <see cref="BranchMappingProfile"/> class.
    /// </summary>
    public BranchMappingProfile()
    {
        CreateMap<Branch, BranchDto>()
            .ForMember(d => d.CompanyName, opt => opt.MapFrom(s => s.Company != null ? s.Company.Name : null));
    }
}
