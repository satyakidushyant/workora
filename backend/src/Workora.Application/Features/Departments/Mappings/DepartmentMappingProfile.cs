using AutoMapper;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Departments.Mappings;

/// <summary>
/// AutoMapper profile for <see cref="Department"/> entity and its DTOs.
/// </summary>
public class DepartmentMappingProfile : Profile
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DepartmentMappingProfile"/> class.
    /// </summary>
    public DepartmentMappingProfile()
    {
        CreateMap<Department, DepartmentDto>()
            .ForMember(d => d.CompanyName, opt => opt.MapFrom(s => s.Company != null ? s.Company.Name : null))
            .ForMember(d => d.ParentDepartmentName, opt => opt.MapFrom(s => s.ParentDepartment != null ? s.ParentDepartment.Name : null))
            .ForMember(d => d.DesignationsCount, opt => opt.MapFrom(s => s.Designations != null ? s.Designations.Count : 0));

        CreateMap<Department, DepartmentDetailDto>()
            .ForMember(d => d.CompanyName, opt => opt.MapFrom(s => s.Company != null ? s.Company.Name : null))
            .ForMember(d => d.ParentDepartmentName, opt => opt.MapFrom(s => s.ParentDepartment != null ? s.ParentDepartment.Name : null))
            .ForMember(d => d.Designations, opt => opt.MapFrom(s => s.Designations))
            .ForMember(d => d.SubDepartments, opt => opt.MapFrom(s => s.SubDepartments));
    }
}
