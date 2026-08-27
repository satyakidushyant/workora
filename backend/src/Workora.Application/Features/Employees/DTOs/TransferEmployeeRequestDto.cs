using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.DTOs;

/// <summary>
/// Request payload for transfer / promotion of an employee.
/// </summary>
public record TransferEmployeeRequestDto(
    int DepartmentId,
    int DesignationId,
    int BranchId,
    int? ManagerId,
    string? Notes);
