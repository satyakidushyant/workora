using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.DTOs;

/// <summary>
/// Data transfer object for an employee's onboarding status.
/// </summary>
public record EmployeeOnboardingItemDto(
    int Id,
    int EmployeeId,
    string? EmployeeName,
    int ChecklistId,
    string TaskName,
    string AssignedRole,
    bool IsMandatory,
    bool IsCompleted,
    int? VerifiedByEmployeeId,
    string? VerifiedByEmployeeName,
    DateTimeOffset? VerifiedAt);
