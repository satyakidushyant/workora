using Workora.Domain.Enums;

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

/// <summary>
/// Detailed DTO for an employee with contacts, bank info, and history.
/// </summary>
public class EmployeeDetailDto : EmployeeDto
{
    /// <summary>Termination reason notes.</summary>
    public string? TerminationReason { get; set; }

    /// <summary>Residential address.</summary>
    public string? Address { get; set; }

    /// <summary>Emergency contacts collection.</summary>
    public List<EmergencyContactDto> EmergencyContacts { get; set; } = new();

    /// <summary>Bank details collection.</summary>
    public List<BankDetailDto> BankDetails { get; set; } = new();

    /// <summary>Employment transitions history.</summary>
    public List<EmploymentHistoryDto> EmploymentHistory { get; set; } = new();
}

/// <summary>
/// Emergency contact DTO.
/// </summary>
public class EmergencyContactDto
{
    /// <summary>Identifier.</summary>
    public int Id { get; set; }

    /// <summary>Contact name.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Relationship description.</summary>
    public string Relationship { get; set; } = string.Empty;

    /// <summary>Phone number.</summary>
    public string PhoneNumber { get; set; } = string.Empty;

    /// <summary>Alternative phone number.</summary>
    public string? AlternativePhoneNumber { get; set; }

    /// <summary>Primary contact flag.</summary>
    public bool IsPrimary { get; set; }
}

/// <summary>
/// Bank detail DTO.
/// </summary>
public class BankDetailDto
{
    /// <summary>Identifier.</summary>
    public int Id { get; set; }

    /// <summary>Bank institution name.</summary>
    public string BankName { get; set; } = string.Empty;

    /// <summary>Bank account number.</summary>
    public string AccountNumber { get; set; } = string.Empty;

    /// <summary>Account holder name.</summary>
    public string AccountHolderName { get; set; } = string.Empty;

    /// <summary>Branch routing code.</summary>
    public string? BranchCode { get; set; }

    /// <summary>SWIFT or BIC code.</summary>
    public string? SwiftCode { get; set; }

    /// <summary>Primary bank account flag.</summary>
    public bool IsPrimary { get; set; }
}

/// <summary>
/// Employment history transition DTO.
/// </summary>
public class EmploymentHistoryDto
{
    /// <summary>Identifier.</summary>
    public int Id { get; set; }

    /// <summary>Effective transition date.</summary>
    public DateOnly EffectiveDate { get; set; }

    /// <summary>Event type description.</summary>
    public string EventType { get; set; } = string.Empty;

    /// <summary>Previous department ID.</summary>
    public int? PreviousDepartmentId { get; set; }

    /// <summary>New department ID.</summary>
    public int? NewDepartmentId { get; set; }

    /// <summary>Previous designation ID.</summary>
    public int? PreviousDesignationId { get; set; }

    /// <summary>New designation ID.</summary>
    public int? NewDesignationId { get; set; }

    /// <summary>Previous branch ID.</summary>
    public int? PreviousBranchId { get; set; }

    /// <summary>New branch ID.</summary>
    public int? NewBranchId { get; set; }

    /// <summary>Notes on transition.</summary>
    public string? Notes { get; set; }

    /// <summary>Creation timestamp.</summary>
    public DateTimeOffset CreatedAt { get; set; }
}

/// <summary>
/// Org chart tree node DTO.
/// </summary>
public class OrgChartNodeDto
{
    /// <summary>Default constructor.</summary>
    public OrgChartNodeDto() { }

    /// <summary>Parameterized constructor.</summary>
    public OrgChartNodeDto(int id, string employeeCode, string fullName, string? designationTitle, string? departmentName, int? managerId, List<OrgChartNodeDto> directReports)
    {
        Id = id;
        EmployeeCode = employeeCode;
        FullName = fullName;
        DesignationTitle = designationTitle;
        DepartmentName = departmentName;
        ManagerId = managerId;
        DirectReports = directReports;
    }

    /// <summary>Employee ID.</summary>
    public int Id { get; set; }

    /// <summary>Employee code.</summary>
    public string EmployeeCode { get; set; } = string.Empty;

    /// <summary>Full name.</summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>Designation title.</summary>
    public string? DesignationTitle { get; set; }

    /// <summary>Department name.</summary>
    public string? DepartmentName { get; set; }

    /// <summary>Reporting manager ID.</summary>
    public int? ManagerId { get; set; }

    /// <summary>Subordinate direct reports.</summary>
    public List<OrgChartNodeDto> DirectReports { get; set; } = new();
}

/// <summary>
/// Request payload for onboarding / creating an employee.
/// </summary>
public record CreateEmployeeRequestDto(
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string NationalId,
    DateOnly DateOfBirth,
    Gender Gender,
    MaritalStatus MaritalStatus,
    DateOnly HireDate,
    int DepartmentId,
    int DesignationId,
    int BranchId,
    int? ManagerId,
    EmploymentType EmploymentType,
    string? Address);

/// <summary>
/// Request payload for updating an employee's profile by HR/Admin.
/// </summary>
public record UpdateEmployeeRequestDto(
    string FirstName,
    string LastName,
    string? Phone,
    DateOnly DateOfBirth,
    Gender Gender,
    MaritalStatus MaritalStatus,
    int? ManagerId,
    string? Address);

/// <summary>
/// Request payload for self-service profile update by an employee.
/// </summary>
public record UpdateMyProfileRequestDto(
    string? Phone,
    string? Address);

/// <summary>
/// Request payload for transfer / promotion of an employee.
/// </summary>
public record TransferEmployeeRequestDto(
    int DepartmentId,
    int DesignationId,
    int BranchId,
    int? ManagerId,
    string? Notes);

/// <summary>
/// Request payload for terminating an employee.
/// </summary>
public record TerminateEmployeeRequestDto(
    DateOnly TerminationDate,
    string? Reason);

/// <summary>
/// Request payload for reactivating / rehiring an employee.
/// </summary>
public record ReactivateEmployeeRequestDto(
    int DepartmentId,
    int DesignationId,
    int BranchId,
    int? ManagerId,
    string? Notes);

/// <summary>
/// Request payload for adding or updating an emergency contact.
/// </summary>
public record UpsertEmergencyContactRequestDto(
    int? Id,
    string Name,
    string Relationship,
    string PhoneNumber,
    string? AlternativePhoneNumber,
    bool IsPrimary);

/// <summary>
/// Request payload for adding or updating bank details.
/// </summary>
public record UpsertBankDetailsRequestDto(
    int? Id,
    string BankName,
    string AccountNumber,
    string AccountHolderName,
    string? BranchCode,
    string? SwiftCode,
    bool IsPrimary);
