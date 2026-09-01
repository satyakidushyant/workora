using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Branches.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.Queries.GetBranchesList;

/// <summary>
/// Query to get a paginated list of branches with dynamic pagination and filtering.
/// </summary>
public record GetBranchesListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<BranchDto>>>
{
    /// <summary>
    /// Gets or init optional filter for active status.
    /// </summary>
    public bool? IsActive { get; init; }

    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }
}

