using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.DTOs;

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
