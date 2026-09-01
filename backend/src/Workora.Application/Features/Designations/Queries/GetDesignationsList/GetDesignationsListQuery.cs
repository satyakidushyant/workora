using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Designations.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.Queries.GetDesignationsList;

/// <summary>
/// Query to get a paginated list of designations with dynamic pagination and filtering.
/// </summary>
public record GetDesignationsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<DesignationDto>>>
{
    /// <summary>
    /// Gets or init optional filter for department ID.
    /// </summary>
    public int? DepartmentId { get; init; }

    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }
}

