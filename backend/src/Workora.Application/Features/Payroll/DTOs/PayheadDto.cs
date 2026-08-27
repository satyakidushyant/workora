using Workora.Domain.Enums;

namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// DTO representing a payhead / salary component definition.
/// </summary>
public class PayheadDto
{
    /// <summary>
    /// Gets or sets component ID.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets component name.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets component code.
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets component type (Earning or Deduction).
    /// </summary>
    public ComponentType Type { get; set; }

    /// <summary>
    /// Gets or sets calculation type.
    /// </summary>
    public CalculationType CalculationType { get; set; }

    /// <summary>
    /// Gets or sets default value.
    /// </summary>
    public decimal DefaultValue { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether component is taxable.
    /// </summary>
    public bool IsTaxable { get; set; }
}
