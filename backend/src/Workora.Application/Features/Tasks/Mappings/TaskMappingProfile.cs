using AutoMapper;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Tasks.Mappings;

/// <summary>
/// AutoMapper profile for TaskItem entity.
/// </summary>
public class TaskMappingProfile : Profile
{
    /// <summary>
    /// Initializes mappings.
    /// </summary>
    public TaskMappingProfile()
    {
        CreateMap<TaskItem, TaskItemDto>()
            .ForMember(d => d.AssignedToEmployeeName, opt => opt.MapFrom(s => s.AssignedToEmployee != null ? $"{s.AssignedToEmployee.FirstName} {s.AssignedToEmployee.LastName}".Trim() : null))
            .ForMember(d => d.CreatedByEmployeeName, opt => opt.MapFrom(s => s.CreatedByEmployee != null ? $"{s.CreatedByEmployee.FirstName} {s.CreatedByEmployee.LastName}".Trim() : null));
    }
}
