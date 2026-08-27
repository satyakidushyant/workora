using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.DTOs;

/// <summary>
/// Request payload for rejecting a candidate.
/// </summary>
public record RejectCandidateRequestDto(
    string? Reason);
