using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.DTOs;

/// <summary>
/// Request payload for submitting interview feedback.
/// </summary>
public record SubmitInterviewFeedbackRequestDto(
    string Feedback,
    int Rating);
