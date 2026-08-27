using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.DTOs;

/// <summary>
/// Request payload for submitting manager evaluation.
/// </summary>
public record SubmitManagerReviewRequestDto(
    string Comments,
    int Rating);
