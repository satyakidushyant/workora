using AutoMapper;
using Workora.Application.Features.FinancialYears.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.FinancialYears.Mappings;

/// <summary>
/// AutoMapper profile for FinancialYear entities.
/// </summary>
public class FinancialYearMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for FinancialYear.
    /// </summary>
    public FinancialYearMappingProfile()
    {
        CreateMap<FinancialYear, FinancialYearDto>();
    }
}