using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.DTOs;

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
