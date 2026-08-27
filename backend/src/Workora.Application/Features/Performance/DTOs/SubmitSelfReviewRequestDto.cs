using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.DTOs;

/// <summary>
/// Request payload for submitting self review.
/// </summary>
public record SubmitSelfReviewRequestDto(
    string Comments,
    int Rating);
