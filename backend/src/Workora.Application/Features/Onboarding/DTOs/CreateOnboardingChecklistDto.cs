using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.DTOs;

/// <summary>
/// Request payload for creating an onboarding checklist.
/// </summary>
public record CreateOnboardingChecklistDto(
    string TaskName,
    string AssignedRole,
    bool IsMandatory = true);
