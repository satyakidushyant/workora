using Workora.Domain.Enums;

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

/// <summary>
/// DTO representing an applicant candidate.
/// </summary>
public record CandidateDto(
    int Id,
    Guid Uuid,
    int JobPostingId,
    string? JobTitle,
    string FirstName,
    string LastName,
    string FullName,
    string Email,
    string? Phone,
    string? ResumeUrl,
    CandidateStage Stage,
    string? RejectionReason,
    DateTimeOffset AppliedDate);

/// <summary>
/// DTO representing a detailed candidate profile with interview rounds and offers.
/// </summary>
public record CandidateDetailDto(
    int Id,
    Guid Uuid,
    int JobPostingId,
    string? JobTitle,
    string FirstName,
    string LastName,
    string FullName,
    string Email,
    string? Phone,
    string? ResumeUrl,
    CandidateStage Stage,
    string? RejectionReason,
    DateTimeOffset AppliedDate,
    IReadOnlyList<InterviewDto> Interviews,
    IReadOnlyList<JobOfferDto> Offers);

/// <summary>
/// DTO representing an interview round.
/// </summary>
public record InterviewDto(
    int Id,
    Guid Uuid,
    int CandidateId,
    string? CandidateName,
    int InterviewerEmployeeId,
    string? InterviewerName,
    DateTimeOffset ScheduledAt,
    string LocationOrLink,
    InterviewStatus Status,
    string? Feedback,
    int? Rating,
    DateTimeOffset? ConductedAt);

/// <summary>
/// DTO representing an employment job offer.
/// </summary>
public record JobOfferDto(
    int Id,
    Guid Uuid,
    int CandidateId,
    string? CandidateName,
    decimal OfferedSalary,
    DateOnly JoiningDate,
    DateOnly ExpiryDate,
    OfferStatus Status,
    DateTimeOffset? SentAt,
    DateTimeOffset? RespondedAt,
    string? Notes);

/// <summary>
/// Recruitment pipeline stage summary DTO.
/// </summary>
public record PipelineStageMetricsDto(
    CandidateStage Stage,
    int Count);

/// <summary>
/// Recruitment pipeline overview response DTO.
/// </summary>
public record RecruitmentPipelineDto(
    IReadOnlyList<PipelineStageMetricsDto> Stages,
    int TotalCandidates);

/// <summary>
/// Request payload for creating a job opening.
/// </summary>
public record CreateJobPostingRequestDto(
    int CompanyId,
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

/// <summary>
/// Request payload for creating an applicant candidate.
/// </summary>
public record CreateCandidateRequestDto(
    int JobPostingId,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? ResumeUrl);

/// <summary>
/// Request payload for advancing a candidate's stage.
/// </summary>
public record MoveCandidateStageRequestDto(
    CandidateStage Stage);

/// <summary>
/// Request payload for rejecting a candidate.
/// </summary>
public record RejectCandidateRequestDto(
    string? Reason);

/// <summary>
/// Request payload for scheduling an interview.
/// </summary>
public record ScheduleInterviewRequestDto(
    int CandidateId,
    int InterviewerEmployeeId,
    DateTimeOffset ScheduledAt,
    string LocationOrLink);

/// <summary>
/// Request payload for submitting interview feedback.
/// </summary>
public record SubmitInterviewFeedbackRequestDto(
    string Feedback,
    int Rating);

/// <summary>
/// Request payload for generating a job offer.
/// </summary>
public record CreateJobOfferRequestDto(
    int CandidateId,
    decimal OfferedSalary,
    DateOnly JoiningDate,
    DateOnly ExpiryDate,
    string? Notes);
