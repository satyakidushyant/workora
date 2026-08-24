using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an emergency contact record for an employee.
/// </summary>
public class EmployeeEmergencyContact : BaseEntity
{
    /// <summary>
    /// Foreign key identifier for the employee.
    /// </summary>
    public int EmployeeId { get; private set; }

    /// <summary>
    /// Navigation property to the employee.
    /// </summary>
    public Employee Employee { get; private set; } = null!;

    /// <summary>
    /// Full contact name.
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// Relationship to the employee (e.g., "Spouse", "Parent", "Sibling", "Friend").
    /// </summary>
    public string Relationship { get; private set; } = null!;

    /// <summary>
    /// Primary telephone contact number.
    /// </summary>
    public string PhoneNumber { get; private set; } = null!;

    /// <summary>
    /// Secondary / alternative phone number.
    /// </summary>
    public string? AlternativePhoneNumber { get; private set; }

    /// <summary>
    /// Indicates whether this is the primary emergency contact.
    /// </summary>
    public bool IsPrimary { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private EmployeeEmergencyContact() { }

    /// <summary>
    /// Creates a new EmployeeEmergencyContact instance.
    /// </summary>
    public static EmployeeEmergencyContact Create(
        int employeeId,
        string name,
        string relationship,
        string phoneNumber,
        string? alternativePhoneNumber = null,
        bool isPrimary = true)
    {
        return new EmployeeEmergencyContact
        {
            EmployeeId = employeeId,
            Name = name,
            Relationship = relationship,
            PhoneNumber = phoneNumber,
            AlternativePhoneNumber = alternativePhoneNumber,
            IsPrimary = isPrimary,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates the emergency contact details.
    /// </summary>
    public void Update(string name, string relationship, string phoneNumber, string? alternativePhoneNumber, bool isPrimary)
    {
        Name = name;
        Relationship = relationship;
        PhoneNumber = phoneNumber;
        AlternativePhoneNumber = alternativePhoneNumber;
        IsPrimary = isPrimary;
    }
}
