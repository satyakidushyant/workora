using Workora.Application.Features.Designations.DTOs;

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

/// <summary>
/// Request payload for creating a department.
/// </summary>
public record CreateDepartmentRequestDto(
    int CompanyId,
    string Code,
    string Name,
    int? HeadEmployeeId,
    int? ParentDepartmentId);

/// <summary>
/// Request payload for updating a department.
/// </summary>
public record UpdateDepartmentRequestDto(
    string Code,
    string Name,
    int? HeadEmployeeId,
    int? ParentDepartmentId);

/// <summary>
/// Request payload for assigning a department head.
/// </summary>
public record AssignDepartmentHeadRequestDto(
    int? HeadEmployeeId);
