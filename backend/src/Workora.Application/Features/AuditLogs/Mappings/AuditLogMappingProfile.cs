using AutoMapper;
using Workora.Application.Features.AuditLogs.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.AuditLogs.Mappings;

/// <summary>
/// AutoMapper profile for AuditLog entities.
/// </summary>
public class AuditLogMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for AuditLog.
    /// </summary>
    public AuditLogMappingProfile()
    {
        CreateMap<AuditLog, AuditLogDto>();
    }
}
