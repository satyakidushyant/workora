using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.DTOs;

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
