using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.DTOs;

/// <summary>
/// Request payload for updating a job opening.
/// </summary>
public record UpdateJobPostingRequestDto(
    int DepartmentId,
    string Title,
    string Description,
    string Requirements,
    EmploymentType EmploymentType,
    string Location,
    int ExperienceYearsMin,
    int ExperienceYearsMax,
    decimal? SalaryMin,
    decimal? SalaryMax,
    DateOnly? ClosingDate);
