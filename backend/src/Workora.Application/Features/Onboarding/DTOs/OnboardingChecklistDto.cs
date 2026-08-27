using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.DTOs;

/// <summary>
/// Data transfer object for an onboarding checklist item.
/// </summary>
public record OnboardingChecklistDto(
    int Id,
    Guid Uuid,
    string TaskName,
    string AssignedRole,
    bool IsMandatory,
    DateTimeOffset CreatedAt);
