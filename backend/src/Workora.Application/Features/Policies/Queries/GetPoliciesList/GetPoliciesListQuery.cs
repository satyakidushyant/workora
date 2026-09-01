using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Policies.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Policies.Queries.GetPoliciesList;

/// <summary>
/// Query to retrieve a paginated list of company policies with dynamic pagination and filtering.
/// </summary>
public record GetPoliciesListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<PolicyDto>>>
{
    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }
}

