using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.DTOs;

/// <summary>
/// Request payload for verifying an onboarding item.
/// </summary>
public record VerifyOnboardingItemDto(
    int EmployeeId,
    int ChecklistId);
