using AutoMapper;
using Workora.Application.Features.Companies.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Companies.Mappings;

/// <summary>
/// AutoMapper profile for <see cref="Company"/> entity and its DTOs.
/// </summary>
public class CompanyMappingProfile : Profile
{
    /// <summary>
    /// Initializes a new instance of the <see cref="CompanyMappingProfile"/> class.
    /// </summary>
    public CompanyMappingProfile()
    {
        CreateMap<Company, CompanyDto>();
    }
}
