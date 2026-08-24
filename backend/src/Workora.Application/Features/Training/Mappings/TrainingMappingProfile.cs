using AutoMapper;
using Workora.Application.Features.Training.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Training.Mappings;

/// <summary>
/// AutoMapper profile for Training courses and enrollments.
/// </summary>
public class TrainingMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for Training.
    /// </summary>
    public TrainingMappingProfile()
    {
        CreateMap<TrainingProgram, TrainingProgramDto>()
            .ForMember(d => d.EnrolledCount, opt => opt.MapFrom(s => s.Enrollments.Count));

        CreateMap<TrainingEnrollment, TrainingEnrollmentDto>()
            .ForMember(d => d.ProgramTitle, opt => opt.MapFrom(s => s.TrainingProgram != null ? s.TrainingProgram.Title : null))
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}".Trim() : null));
    }
}
