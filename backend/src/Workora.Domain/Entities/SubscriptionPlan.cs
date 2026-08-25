using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a platform subscription plan in the SuperAdmin module.
/// </summary>
public class SubscriptionPlan : AuditableEntity
{
    /// <summary>
    /// Gets the unique plan name.
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// Gets the plan description.
    /// </summary>
    public string Description { get; private set; } = string.Empty;

    /// <summary>
    /// Gets the price per employee/user per cycle.
    /// </summary>
    public decimal Price { get; private set; }

    /// <summary>
    /// Gets the maximum allowed active employees under this plan.
    /// </summary>
    public int MaxEmployees { get; private set; }

    /// <summary>
    /// Gets the billing cycle frequency.
    /// </summary>
    public SubscriptionBillingCycle BillingCycle { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private SubscriptionPlan() { }

    /// <summary>
    /// Factory method to create a new SubscriptionPlan entity.
    /// </summary>
    public static SubscriptionPlan Create(
        string name,
        string description,
        decimal price,
        int maxEmployees,
        SubscriptionBillingCycle billingCycle)
    {
        return new SubscriptionPlan
        {
            Name = name,
            Description = description,
            Price = price,
            MaxEmployees = maxEmployees,
            BillingCycle = billingCycle,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates subscription plan details.
    /// </summary>
    public void Update(
        string name,
        string description,
        decimal price,
        int maxEmployees,
        SubscriptionBillingCycle billingCycle,
        bool isActive)
    {
        Name = name;
        Description = description;
        Price = price;
        MaxEmployees = maxEmployees;
        BillingCycle = billingCycle;
        IsActive = isActive;
    }
}
