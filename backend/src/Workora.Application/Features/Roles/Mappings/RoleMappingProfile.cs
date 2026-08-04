using AutoMapper;
using Workora.Application.Features.Roles.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Roles.Mappings;

/// <summary>
/// AutoMapper profile for Role entities and DTOs.
/// </summary>
public class RoleMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping definitions for Role features.
    /// </summary>
    public RoleMappingProfile()
    {
        CreateMap<Role, RoleDto>()
            .ForMember(dest => dest.UserCount, opt => opt.MapFrom(src => src.UserRoles.Count))
            .ForMember(dest => dest.PermissionCount, opt => opt.MapFrom(src => src.RolePermissions.Count));

        CreateMap<Role, RoleDetailDto>()
            .ForMember(dest => dest.UserCount, opt => opt.MapFrom(src => src.UserRoles.Count))
            .ForMember(dest => dest.PermissionCount, opt => opt.MapFrom(src => src.RolePermissions.Count))
            .ForMember(dest => dest.Permissions, opt => opt.MapFrom(src => src.RolePermissions.Select(rp => rp.Permission)));
    }
}
