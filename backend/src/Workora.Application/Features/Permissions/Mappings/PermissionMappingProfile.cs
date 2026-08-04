using AutoMapper;
using Workora.Application.Features.Permissions.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Permissions.Mappings;

/// <summary>
/// AutoMapper profile for Permission entities and DTOs.
/// </summary>
public class PermissionMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping definitions for Permission features.
    /// </summary>
    public PermissionMappingProfile()
    {
        CreateMap<Permission, PermissionDto>();
    }
}
