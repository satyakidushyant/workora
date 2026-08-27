using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.DTOs;

/// <summary>
/// Data transfer object for an employee's full onboarding state.
/// </summary>
public record EmployeeOnboardingStateDto(
    int EmployeeId,
    string EmployeeName,
    string EmployeeCode,
    int TotalItems,
    int CompletedItems,
    int PendingItems,
    decimal CompletionPercentage,
    IReadOnlyList<EmployeeOnboardingItemDto> Items);
