using Workora.Application.Features.Designations.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.DTOs;

/// <summary>
/// Request payload for updating a department.
/// </summary>
public record UpdateDepartmentRequestDto(
    string Code,
    string Name,
    int? HeadEmployeeId,
    int? ParentDepartmentId);
