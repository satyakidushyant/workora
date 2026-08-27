using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.DTOs;

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
