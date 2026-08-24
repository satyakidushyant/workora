using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an organizational department within a company.
/// </summary>
public class Department : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the parent company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// The parent company navigation property.
    /// </summary>
    public Company Company { get; private set; } = null!;

    /// <summary>
    /// The unique department code within the company.
    /// </summary>
    public string Code { get; private set; } = null!;

    /// <summary>
    /// The name of the department.
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// Optional foreign key to an employee who heads this department.
    /// </summary>
    public int? HeadEmployeeId { get; private set; }

    /// <summary>
    /// Optional foreign key to a parent department (for hierarchical org structures).
    /// </summary>
    public int? ParentDepartmentId { get; private set; }

    /// <summary>
    /// Navigation property to parent department.
    /// </summary>
    public Department? ParentDepartment { get; private set; }

    private readonly List<Department> _subDepartments = new();
    /// <summary>
    /// Navigation property to child departments.
    /// </summary>
    public IReadOnlyCollection<Department> SubDepartments => _subDepartments.AsReadOnly();

    private readonly List<Designation> _designations = new();
    /// <summary>
    /// Navigation property to designations in this department.
    /// </summary>
    public IReadOnlyCollection<Designation> Designations => _designations.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Department() { }

    /// <summary>
    /// Creates a new Department instance.
    /// </summary>
    public static Department Create(
        int companyId,
        string code,
        string name,
        int? headEmployeeId = null,
        int? parentDepartmentId = null)
    {
        return new Department
        {
            CompanyId = companyId,
            Code = code.ToUpperInvariant(),
            Name = name,
            HeadEmployeeId = headEmployeeId,
            ParentDepartmentId = parentDepartmentId,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates the department details.
    /// </summary>
    public void Update(string code, string name, int? headEmployeeId, int? parentDepartmentId)
    {
        Code = code.ToUpperInvariant();
        Name = name;
        HeadEmployeeId = headEmployeeId;
        ParentDepartmentId = parentDepartmentId;
    }

    /// <summary>
    /// Assigns or unassigns a head employee to the department.
    /// </summary>
    public void AssignHead(int? headEmployeeId)
    {
        HeadEmployeeId = headEmployeeId;
    }
}
