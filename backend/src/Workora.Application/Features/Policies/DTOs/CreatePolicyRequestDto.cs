using Workora.Shared.Responses;

namespace Workora.Application.Features.Policies.DTOs;

/// <summary>
/// Request payload for creating a policy.
/// </summary>
public record CreatePolicyRequestDto(
    int CompanyId,
    string Title,
    string Content,
    string Version,
    DateOnly EffectiveDate,
    bool RequiresAcknowledgment = true);
