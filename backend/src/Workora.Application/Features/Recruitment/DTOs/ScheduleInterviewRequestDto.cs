using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.DTOs;

/// <summary>
/// Request payload for scheduling an interview.
/// </summary>
public record ScheduleInterviewRequestDto(
    int CandidateId,
    int InterviewerEmployeeId,
    DateTimeOffset ScheduledAt,
    string LocationOrLink);
