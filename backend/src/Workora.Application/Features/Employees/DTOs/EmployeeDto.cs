using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.DTOs;

/// <summary>
/// Summary DTO for an employee in lists.
/// </summary>
public class EmployeeDto
{
    /// <summary>Unique identifier.</summary>
    public int Id { get; set; }

    /// <summary>Global unique identifier.</summary>
    public Guid Uuid { get; set; }

    /// <summary>Employee code (e.g. EMP-001).</summary>
    public string EmployeeCode { get; set; } = string.Empty;

    /// <summary>First name.</summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>Last name.</summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>Full concatenated name.</summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>Official email address.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Phone number.</summary>
    public string? Phone { get; set; }

    /// <summary>National identification number.</summary>
    public string NationalId { get; set; } = string.Empty;

    /// <summary>Date of birth.</summary>
    public DateOnly DateOfBirth { get; set; }

    /// <summary>Gender.</summary>
    public Gender Gender { get; set; }

    /// <summary>Marital status.</summary>
    public MaritalStatus MaritalStatus { get; set; }

    /// <summary>Date of hire.</summary>
    public DateOnly HireDate { get; set; }

    /// <summary>Department ID.</summary>
    public int DepartmentId { get; set; }

    /// <summary>Department name.</summary>
    public string? DepartmentName { get; set; }

    /// <summary>Designation ID.</summary>
    public int DesignationId { get; set; }

    /// <summary>Designation title.</summary>
    public string? DesignationTitle { get; set; }

    /// <summary>Branch ID.</summary>
    public int BranchId { get; set; }

    /// <summary>Branch name.</summary>
    public string? BranchName { get; set; }

    /// <summary>Manager ID.</summary>
    public int? ManagerId { get; set; }

    /// <summary>Manager name.</summary>
    public string? ManagerName { get; set; }

    /// <summary>Linked user account ID.</summary>
    public int? UserId { get; set; }

    /// <summary>Employment status.</summary>
    public EmploymentStatus EmploymentStatus { get; set; }

    /// <summary>Employment type.</summary>
    public EmploymentType EmploymentType { get; set; }

    /// <summary>Termination date.</summary>
    public DateOnly? TerminationDate { get; set; }

    /// <summary>Is active flag.</summary>
    public bool IsActive { get; set; }

    /// <summary>Creation timestamp.</summary>
    public DateTimeOffset CreatedAt { get; set; }
}
