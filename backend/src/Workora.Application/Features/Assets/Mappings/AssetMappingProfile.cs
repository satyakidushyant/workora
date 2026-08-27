using AutoMapper;
using Workora.Application.Features.Assets.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Assets.Mappings;

/// <summary>
/// AutoMapper profile for Asset entities.
/// </summary>
public class AssetMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for Assets.
    /// </summary>
    public AssetMappingProfile()
    {
        CreateMap<Asset, AssetDto>()
            .ForMember(d => d.CurrentAssignedEmployeeId, opt => opt.MapFrom(s => s.Assignments.FirstOrDefault(a => a.IsActive && !a.ReturnedDate.HasValue) != null ? s.Assignments.FirstOrDefault(a => a.IsActive && !a.ReturnedDate.HasValue)!.EmployeeId : (int?)null))
            .ForMember(d => d.CurrentAssignedEmployeeName, opt => opt.MapFrom(s => s.Assignments.FirstOrDefault(a => a.IsActive && !a.ReturnedDate.HasValue) != null && s.Assignments.FirstOrDefault(a => a.IsActive && !a.ReturnedDate.HasValue)!.Employee != null ? $"{s.Assignments.FirstOrDefault(a => a.IsActive && !a.ReturnedDate.HasValue)!.Employee.FirstName} {s.Assignments.FirstOrDefault(a => a.IsActive && !a.ReturnedDate.HasValue)!.Employee.LastName}".Trim() : null));

        CreateMap<AssetAssignment, AssetAssignmentDto>()
            .ForMember(d => d.AssetName, opt => opt.MapFrom(s => s.Asset != null ? s.Asset.Name : null))
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}".Trim() : null));
    }
}
