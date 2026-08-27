using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for <see cref="OnboardingChecklist"/> and <see cref="EmployeeOnboarding"/> entities.
/// </summary>
public interface IOnboardingRepository : IRepository<OnboardingChecklist>
{
    /// <summary>
    /// Gets all onboarding checklists for a company.
    /// </summary>
    Task<IReadOnlyList<OnboardingChecklist>> GetChecklistsAsync(CancellationToken ct = default);

    /// <summary>
    /// Gets onboarding status for a specific employee.
    /// </summary>
    Task<IReadOnlyList<EmployeeOnboarding>> GetEmployeeOnboardingAsync(int employeeId, CancellationToken ct = default);

    /// <summary>
    /// Gets a specific employee onboarding record by checklist ID.
    /// </summary>
    Task<EmployeeOnboarding?> GetEmployeeOnboardingItemAsync(int employeeId, int checklistId, CancellationToken ct = default);

    /// <summary>
    /// Checks if an employee already has an onboarding record for a checklist item.
    /// </summary>
    Task<bool> HasExistingOnboardingAsync(int employeeId, int checklistId, CancellationToken ct = default);

    /// <summary>
    /// Adds an employee onboarding record.
    /// </summary>
    Task AddEmployeeOnboardingAsync(EmployeeOnboarding onboarding, CancellationToken ct = default);

    /// <summary>
    /// Updates an employee onboarding record.
    /// </summary>
    void UpdateEmployeeOnboarding(EmployeeOnboarding onboarding);
}