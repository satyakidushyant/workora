using Workora.Domain.Enums;

namespace Workora.Application.Features.SuperAdmin.DTOs;

/// <summary>
/// Data Transfer Object representing a platform subscription plan.
/// </summary>
public class SubscriptionPlanDto
{
    /// <summary>
    /// Gets or sets the unique plan ID.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the plan name.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the plan description.
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the price per user.
    /// </summary>
    public decimal Price { get; set; }

    /// <summary>
    /// Gets or sets max allowed employees under the plan.
    /// </summary>
    public int MaxEmployees { get; set; }

    /// <summary>
    /// Gets or sets the billing cycle.
    /// </summary>
    public SubscriptionBillingCycle BillingCycle { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the plan is active.
    /// </summary>
    public bool IsActive { get; set; }
}
