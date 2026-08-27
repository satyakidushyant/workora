using AutoMapper;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Loans.Mappings;

/// <summary>
/// AutoMapper profile for Loan and EMI entities.
/// </summary>
public class LoanMappingProfile : Profile
{
    /// <summary>
    /// Initializes mappings.
    /// </summary>
    public LoanMappingProfile()
    {
        CreateMap<LoanRecord, LoanDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}".Trim() : null))
            .ForMember(d => d.EmployeeCode, opt => opt.MapFrom(s => s.Employee != null ? s.Employee.EmployeeCode : null));

        CreateMap<LoanEmiSchedule, LoanEmiScheduleDto>();
    }
}
