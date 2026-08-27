using Workora.Application.Features.Designations.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.DTOs;

/// <summary>
/// Request payload for assigning a department head.
/// </summary>
public record AssignDepartmentHeadRequestDto(
    int? HeadEmployeeId);
