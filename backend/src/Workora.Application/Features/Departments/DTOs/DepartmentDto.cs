using Workora.Application.Features.Designations.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.DTOs;

/// <summary>
/// Data transfer object representing a department summary.
/// </summary>
public record DepartmentDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    string? CompanyName,
    string Code,
    string Name,
    int? HeadEmployeeId,
    int? ParentDepartmentId,
    string? ParentDepartmentName,
    int DesignationsCount,
    bool IsActive,
    DateTimeOffset CreatedAt);
