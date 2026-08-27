using Workora.Shared.Responses;

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
