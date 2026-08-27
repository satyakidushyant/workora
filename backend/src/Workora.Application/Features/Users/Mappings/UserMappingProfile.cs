using AutoMapper;
using Workora.Application.Features.Users.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Users.Mappings;

/// <summary>
/// AutoMapper profile for User entity to DTO mappings.
/// </summary>
public class UserMappingProfile : Profile
{
    /// <summary>
    /// Initializes a new instance of the <see cref="UserMappingProfile"/> class.
    /// </summary>
    public UserMappingProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email.Value))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
            .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles.Where(ur => ur.Role != null).Select(ur => ur.Role.Name)));

        CreateMap<User, UserDetailDto>()
            .IncludeBase<User, UserDto>()
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email.Value))
            .ForMember(dest => dest.IsLockedOut, opt => opt.MapFrom(src => src.IsLockedOut))
            .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles.Where(ur => ur.Role != null).Select(ur => ur.Role.Name)));

    }
}
