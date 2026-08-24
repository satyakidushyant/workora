using AutoMapper;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Employees.Mappings;

/// <summary>
/// AutoMapper profile for <see cref="Employee"/> entity and its DTOs.
/// </summary>
public class EmployeeMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for <see cref="Employee"/>.
    /// </summary>
    public EmployeeMappingProfile()
    {
        CreateMap<EmployeeEmergencyContact, EmergencyContactDto>();
        CreateMap<EmployeeBankDetail, BankDetailDto>();
        CreateMap<EmployeeEmploymentHistory, EmploymentHistoryDto>();

        CreateMap<Employee, EmployeeDto>()
            .ForMember(d => d.FullName, opt => opt.MapFrom(s => $"{s.FirstName} {s.LastName}".Trim()))
            .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email.Value))
            .ForMember(d => d.DepartmentName, opt => opt.MapFrom(s => s.Department != null ? s.Department.Name : null))
            .ForMember(d => d.DesignationTitle, opt => opt.MapFrom(s => s.Designation != null ? s.Designation.Title : null))
            .ForMember(d => d.BranchName, opt => opt.MapFrom(s => s.Branch != null ? s.Branch.Name : null))
            .ForMember(d => d.ManagerName, opt => opt.MapFrom(s => s.Manager != null ? $"{s.Manager.FirstName} {s.Manager.LastName}".Trim() : null));

        CreateMap<Employee, EmployeeDetailDto>()
            .ForMember(d => d.FullName, opt => opt.MapFrom(s => $"{s.FirstName} {s.LastName}".Trim()))
            .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email.Value))
            .ForMember(d => d.DepartmentName, opt => opt.MapFrom(s => s.Department != null ? s.Department.Name : null))
            .ForMember(d => d.DesignationTitle, opt => opt.MapFrom(s => s.Designation != null ? s.Designation.Title : null))
            .ForMember(d => d.BranchName, opt => opt.MapFrom(s => s.Branch != null ? s.Branch.Name : null))
            .ForMember(d => d.ManagerName, opt => opt.MapFrom(s => s.Manager != null ? $"{s.Manager.FirstName} {s.Manager.LastName}".Trim() : null))
            .ForMember(d => d.EmergencyContacts, opt => opt.MapFrom(s => s.EmergencyContacts))
            .ForMember(d => d.BankDetails, opt => opt.MapFrom(s => s.BankDetails))
            .ForMember(d => d.EmploymentHistory, opt => opt.MapFrom(s => s.EmploymentHistory));
    }
}
