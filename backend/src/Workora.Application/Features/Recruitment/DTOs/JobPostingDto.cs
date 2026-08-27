using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.DTOs;

/// <summary>
/// DTO representing a job vacancy posting.
/// </summary>
public record JobPostingDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    int DepartmentId,
    string? DepartmentName,
    string Title,
    string Description,
    string Requirements,
    EmploymentType EmploymentType,
    string Location,
    int ExperienceYearsMin,
    int ExperienceYearsMax,
    decimal? SalaryMin,
    decimal? SalaryMax,
    JobStatus Status,
    DateOnly? ClosingDate,
    int ApplicantsCount,
    bool IsActive,
    DateTimeOffset CreatedAt);
