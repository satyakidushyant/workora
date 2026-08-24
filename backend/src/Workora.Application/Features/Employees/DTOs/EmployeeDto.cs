using Workora.Domain.Enums;

namespace Workora.Application.Features.Employees.DTOs;

/// <summary>
/// Summary DTO for an employee in lists.
/// </summary>
public record EmployeeDto(
    int Id,
    Guid Uuid,
    string EmployeeCode,
    string FirstName,
    string LastName,
    string FullName,
    string Email,
    string? Phone,
    string NationalId,
    DateOnly DateOfBirth,
    Gender Gender,
    MaritalStatus MaritalStatus,
    DateOnly HireDate,
    int DepartmentId,
    string? DepartmentName,
    int DesignationId,
    string? DesignationTitle,
    int BranchId,
    string? BranchName,
    int? ManagerId,
    string? ManagerName,
    int? UserId,
    EmploymentStatus EmploymentStatus,
    EmploymentType EmploymentType,
    DateOnly? TerminationDate,
    bool IsActive,
    DateTimeOffset CreatedAt);

/// <summary>
/// Detailed DTO for an employee with contacts, bank info, and history.
/// </summary>
public record EmployeeDetailDto(
    int Id,
    Guid Uuid,
    string EmployeeCode,
    string FirstName,
    string LastName,
    string FullName,
    string Email,
    string? Phone,
    string NationalId,
    DateOnly DateOfBirth,
    Gender Gender,
    MaritalStatus MaritalStatus,
    DateOnly HireDate,
    int DepartmentId,
    string? DepartmentName,
    int DesignationId,
    string? DesignationTitle,
    int BranchId,
    string? BranchName,
    int? ManagerId,
    string? ManagerName,
    int? UserId,
    EmploymentStatus EmploymentStatus,
    EmploymentType EmploymentType,
    DateOnly? TerminationDate,
    string? TerminationReason,
    string? Address,
    IReadOnlyList<EmergencyContactDto> EmergencyContacts,
    IReadOnlyList<BankDetailDto> BankDetails,
    IReadOnlyList<EmploymentHistoryDto> EmploymentHistory,
    bool IsActive,
    DateTimeOffset CreatedAt);

/// <summary>
/// Emergency contact DTO.
/// </summary>
public record EmergencyContactDto(
    int Id,
    string Name,
    string Relationship,
    string PhoneNumber,
    string? AlternativePhoneNumber,
    bool IsPrimary);

/// <summary>
/// Bank detail DTO.
/// </summary>
public record BankDetailDto(
    int Id,
    string BankName,
    string AccountNumber,
    string AccountHolderName,
    string? BranchCode,
    string? SwiftCode,
    bool IsPrimary);

/// <summary>
/// Employment history transition DTO.
/// </summary>
public record EmploymentHistoryDto(
    int Id,
    DateOnly EffectiveDate,
    string EventType,
    int? PreviousDepartmentId,
    int? NewDepartmentId,
    int? PreviousDesignationId,
    int? NewDesignationId,
    int? PreviousBranchId,
    int? NewBranchId,
    string? Notes,
    DateTimeOffset CreatedAt);

/// <summary>
/// Org chart tree node DTO.
/// </summary>
public record OrgChartNodeDto(
    int Id,
    string EmployeeCode,
    string FullName,
    string? DesignationTitle,
    string? DepartmentName,
    int? ManagerId,
    IReadOnlyList<OrgChartNodeDto> DirectReports);

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
