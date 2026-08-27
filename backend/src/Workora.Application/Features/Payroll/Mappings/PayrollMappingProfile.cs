using AutoMapper;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Payroll.Mappings;

/// <summary>
/// AutoMapper profile for Salary Structure and Payroll entities.
/// </summary>
public class PayrollMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for Payroll.
    /// </summary>
    public PayrollMappingProfile()
    {
        CreateMap<SalaryComponent, SalaryComponentDto>();
        CreateMap<SalaryStructure, SalaryStructureDto>()
            .ForMember(d => d.Components, opt => opt.MapFrom(s => s.Components));

        CreateMap<EmployeeSalaryAssignment, EmployeeSalaryAssignmentDto>()
            .ForMember(d => d.SalaryStructureName, opt => opt.MapFrom(s => s.SalaryStructure != null ? s.SalaryStructure.Name : string.Empty))
            .ForMember(d => d.Components, opt => opt.MapFrom(s => s.SalaryStructure != null ? s.SalaryStructure.Components : null));

        CreateMap<PayslipItem, PayslipItemDto>();
        CreateMap<Payslip, PayslipDto>()
            .ForMember(d => d.Items, opt => opt.MapFrom(s => s.Items));

        CreateMap<PayrollRun, PayrollRunDto>()
            .ForMember(d => d.TotalEmployees, opt => opt.MapFrom(s => s.Payslips.Count));

        CreateMap<PayrollRun, PayrollRunDetailDto>()
            .ForMember(d => d.Payslips, opt => opt.MapFrom(s => s.Payslips));
    }
}
