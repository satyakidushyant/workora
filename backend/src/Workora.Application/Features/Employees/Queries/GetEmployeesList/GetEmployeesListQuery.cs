using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetEmployeesList;

/// <summary>
/// Query to retrieve a paginated and filtered list of employees with dynamic pagination and filtering.
/// </summary>
public record GetEmployeesListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<EmployeeDto>>>
{
    /// <summary>
    /// Gets or init optional filter for department ID.
    /// </summary>
    public int? DepartmentId { get; init; }

    /// <summary>
    /// Gets or init optional filter for designation ID.
    /// </summary>
    public int? DesignationId { get; init; }

    /// <summary>
    /// Gets or init optional filter for branch ID.
    /// </summary>
    public int? BranchId { get; init; }

    /// <summary>
    /// Gets or init optional filter for employment status.
    /// </summary>
    public EmploymentStatus? Status { get; init; }

    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }
}

