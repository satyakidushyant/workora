using AutoMapper;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Helpdesk.Mappings;

/// <summary>
/// AutoMapper profile for HelpdeskTicket and HelpdeskTicketComment entities.
/// </summary>
public class HelpdeskMappingProfile : Profile
{
    /// <summary>
    /// Initializes mappings.
    /// </summary>
    public HelpdeskMappingProfile()
    {
        CreateMap<HelpdeskTicket, HelpdeskTicketDto>()
            .ForMember(d => d.RaisedByEmployeeName, opt => opt.MapFrom(s => s.RaisedByEmployee != null ? $"{s.RaisedByEmployee.FirstName} {s.RaisedByEmployee.LastName}".Trim() : null))
            .ForMember(d => d.AssignedToEmployeeName, opt => opt.MapFrom(s => s.AssignedToEmployee != null ? $"{s.AssignedToEmployee.FirstName} {s.AssignedToEmployee.LastName}".Trim() : null))
            .ForMember(d => d.Comments, opt => opt.MapFrom(s => s.Comments));

        CreateMap<HelpdeskTicketComment, TicketCommentDto>()
            .ForMember(d => d.AuthorName, opt => opt.MapFrom(s => s.User != null ? $"{s.User.FirstName} {s.User.LastName}".Trim() : null));
    }
}
