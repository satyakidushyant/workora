using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.DTOs;

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
