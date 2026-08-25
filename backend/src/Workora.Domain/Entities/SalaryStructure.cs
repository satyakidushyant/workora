using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Defines a compensation salary package template.
/// </summary>
public class SalaryStructure : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the parent company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// Descriptive name of the salary package (e.g., "Executive Level 1", "Engineering Standard").
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// Brief description of the salary package.
    /// </summary>
    public string? Description { get; private set; }

    private readonly List<SalaryComponent> _components = new();
    /// <summary>
    /// Collection of earning and deduction breakdown components.
    /// </summary>
    public IReadOnlyCollection<SalaryComponent> Components => _components.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private SalaryStructure() { }

    /// <summary>
    /// Creates a new SalaryStructure instance.
    /// </summary>
    public static SalaryStructure Create(
        int companyId,
        string name,
        string? description = null)
    {
        return new SalaryStructure
        {
            CompanyId = companyId,
            Name = name,
            Description = description,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates salary structure details.
    /// </summary>
    public void Update(string name, string? description)
    {
        Name = name;
        Description = description;
    }

    /// <summary>
    /// Adds a component breakdown item to the structure.
    /// </summary>
    public void AddComponent(SalaryComponent component)
    {
        _components.Add(component);
    }

    /// <summary>
    /// Clears and replaces all components.
    /// </summary>
    public void SetComponents(IEnumerable<SalaryComponent> components)
    {
        _components.Clear();
        _components.AddRange(components);
    }
}

/// <summary>
/// Line item breakdown component for a salary structure.
/// </summary>
public class SalaryComponent : BaseEntity
{
    /// <summary>
    /// Foreign key identifier for the parent salary structure.
    /// </summary>
    public int SalaryStructureId { get; private set; }

    /// <summary>
    /// Navigation property to the salary structure.
    /// </summary>
    public SalaryStructure SalaryStructure { get; private set; } = null!;

    /// <summary>
    /// Display name of the component (e.g. Basic Salary, HRA, Medical, Provident Fund).
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// Code identifier (e.g. BASIC, HRA, PF, TAX).
    /// </summary>
    public string Code { get; private set; } = null!;

    /// <summary>
    /// Earning or Deduction.
    /// </summary>
    public ComponentType Type { get; private set; }

    /// <summary>
    /// Fixed or Percentage.
    /// </summary>
    public CalculationType CalculationType { get; private set; }

    /// <summary>
    /// Default rate or percentage amount.
    /// </summary>
    public decimal DefaultValue { get; private set; }

    /// <summary>
    /// Indicates whether this component is subject to income tax calculation.
    /// </summary>
    public bool IsTaxable { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private SalaryComponent() { }

    /// <summary>
    /// Creates a new SalaryComponent item.
    /// </summary>
    public static SalaryComponent Create(
        int salaryStructureId,
        string name,
        string code,
        ComponentType type,
        CalculationType calculationType,
        decimal defaultValue,
        bool isTaxable = true)
    {
        return new SalaryComponent
        {
            SalaryStructureId = salaryStructureId,
            Name = name,
            Code = code.ToUpperInvariant(),
            Type = type,
            CalculationType = calculationType,
            DefaultValue = defaultValue,
            IsTaxable = isTaxable,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates the salary component parameters.
    /// </summary>
    public void Update(
        string name,
        string code,
        ComponentType type,
        CalculationType calculationType,
        decimal defaultValue,
        bool isTaxable)
    {
        Name = name;
        Code = code.ToUpperInvariant();
        Type = type;
        CalculationType = calculationType;
        DefaultValue = defaultValue;
        IsTaxable = isTaxable;
    }
}

