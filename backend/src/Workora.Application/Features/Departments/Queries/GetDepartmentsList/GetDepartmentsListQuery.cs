using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Departments.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Queries.GetDepartmentsList;

/// <summary>
/// Query to get a paginated list of departments with dynamic pagination and filtering.
/// </summary>
public record GetDepartmentsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<DepartmentDto>>>
{
    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }
}

