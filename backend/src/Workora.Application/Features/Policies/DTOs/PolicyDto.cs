namespace Workora.Application.Features.Policies.DTOs;

/// <summary>
/// DTO representing an organizational policy.
/// </summary>
public record PolicyDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    string Title,
    string Content,
    string Version,
    DateOnly EffectiveDate,
    bool RequiresAcknowledgment,
    int AcknowledgmentsCount,
    bool IsActive,
    DateTimeOffset CreatedAt);

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
