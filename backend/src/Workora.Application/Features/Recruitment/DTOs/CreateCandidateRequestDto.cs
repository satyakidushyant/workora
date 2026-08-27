using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.DTOs;

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
