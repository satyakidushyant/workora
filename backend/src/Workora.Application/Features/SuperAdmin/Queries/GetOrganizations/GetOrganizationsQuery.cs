using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Queries.GetOrganizations;

/// <summary>
/// Query to retrieve paginated list of tenant organizations for SuperAdmin with dynamic pagination and filtering.
/// </summary>
public record GetOrganizationsQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<OrganizationDto>>>
{
    /// <summary>
    /// Gets or init optional filter for active status.
    /// </summary>
    public bool? IsActive { get; init; }
}

