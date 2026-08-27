using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.DTOs;

/// <summary>
/// Headcount count per department.
/// </summary>
public record DepartmentHeadcountDto(
    string DepartmentName,
    int Count);
