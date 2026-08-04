using MediatR;
using Workora.Application.Features.Roles.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Roles.Queries.GetRolesList;

/// <summary>
/// Query to retrieve a paginated list of system and custom roles.
/// </summary>
/// <param name="PageNumber">The 1-based page number (default: 1).</param>
/// <param name="PageSize">The page size (default: 10).</param>
/// <param name="SearchTerm">Optional filter by role name or description.</param>
public record GetRolesListQuery(
    int PageNumber = 1,
    int PageSize = 10,
    string? SearchTerm = null
) : IRequest<ApiResponse<PagedResponse<RoleDto>>>;
