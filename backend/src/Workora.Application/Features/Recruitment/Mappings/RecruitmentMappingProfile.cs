using AutoMapper;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Recruitment.Mappings;

/// <summary>
/// AutoMapper profile for Recruitment domain entities.
/// </summary>
public class RecruitmentMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for Recruitment.
    /// </summary>
    public RecruitmentMappingProfile()
    {
        CreateMap<JobPosting, JobPostingDto>()
            .ForMember(d => d.DepartmentName, opt => opt.MapFrom(s => s.Department != null ? s.Department.Name : null))
            .ForMember(d => d.ApplicantsCount, opt => opt.MapFrom(s => s.Candidates.Count));

        CreateMap<Candidate, CandidateDto>()
            .ForMember(d => d.FullName, opt => opt.MapFrom(s => $"{s.FirstName} {s.LastName}".Trim()))
            .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email.Value))
            .ForMember(d => d.JobTitle, opt => opt.MapFrom(s => s.JobPosting != null ? s.JobPosting.Title : null));

        CreateMap<Candidate, CandidateDetailDto>()
            .ForMember(d => d.FullName, opt => opt.MapFrom(s => $"{s.FirstName} {s.LastName}".Trim()))
            .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email.Value))
            .ForMember(d => d.JobTitle, opt => opt.MapFrom(s => s.JobPosting != null ? s.JobPosting.Title : null))
            .ForMember(d => d.Interviews, opt => opt.MapFrom(s => s.Interviews))
            .ForMember(d => d.Offers, opt => opt.MapFrom(s => s.Offers));

        CreateMap<Interview, InterviewDto>()
            .ForMember(d => d.CandidateName, opt => opt.MapFrom(s => s.Candidate != null ? $"{s.Candidate.FirstName} {s.Candidate.LastName}".Trim() : null))
            .ForMember(d => d.InterviewerName, opt => opt.MapFrom(s => s.Interviewer != null ? $"{s.Interviewer.FirstName} {s.Interviewer.LastName}".Trim() : null));

        CreateMap<JobOffer, JobOfferDto>()
            .ForMember(d => d.CandidateName, opt => opt.MapFrom(s => s.Candidate != null ? $"{s.Candidate.FirstName} {s.Candidate.LastName}".Trim() : null));
    }
}
