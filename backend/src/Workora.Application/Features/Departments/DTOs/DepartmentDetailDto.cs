using Workora.Application.Features.Designations.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.DTOs;

/// <summary>
/// Data transfer object representing department details including designations and sub-departments.
/// </summary>
public record DepartmentDetailDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    string? CompanyName,
    string Code,
    string Name,
    int? HeadEmployeeId,
    int? ParentDepartmentId,
    string? ParentDepartmentName,
    IReadOnlyList<DesignationDto> Designations,
    IReadOnlyList<DepartmentDto> SubDepartments,
    bool IsActive,
    DateTimeOffset CreatedAt);
