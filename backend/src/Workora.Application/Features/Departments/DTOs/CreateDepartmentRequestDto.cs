using Workora.Application.Features.Designations.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.DTOs;

/// <summary>
/// Request payload for creating a department.
/// </summary>
public record CreateDepartmentRequestDto(
    int CompanyId,
    string Code,
    string Name,
    int? HeadEmployeeId,
    int? ParentDepartmentId);
