using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Queries.GetOrganizations;

/// <summary>
/// Query to retrieve paginated list of tenant organizations for SuperAdmin.
/// </summary>
public record GetOrganizationsQuery(
    int PageNumber = 1,
    int PageSize = 10,
    string? SearchTerm = null,
    bool? IsActive = null) : IRequest<ApiResponse<PagedResponse<OrganizationDto>>>;
