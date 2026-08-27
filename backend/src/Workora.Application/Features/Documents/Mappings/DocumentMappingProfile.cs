using AutoMapper;
using Workora.Application.Features.Documents.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Documents.Mappings;

/// <summary>
/// AutoMapper profile for Document entities.
/// </summary>
public class DocumentMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for Document.
    /// </summary>
    public DocumentMappingProfile()
    {
        CreateMap<Document, DocumentDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}".Trim() : null));
    }
}
