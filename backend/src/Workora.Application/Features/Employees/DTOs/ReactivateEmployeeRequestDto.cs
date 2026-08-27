using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.DTOs;

/// <summary>
/// Request payload for reactivating / rehiring an employee.
/// </summary>
public record ReactivateEmployeeRequestDto(
    int DepartmentId,
    int DesignationId,
    int BranchId,
    int? ManagerId,
    string? Notes);
