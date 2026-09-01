using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Roles.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Roles.Queries.GetRolesList;

/// <summary>
/// Query to retrieve a paginated list of system and custom roles with dynamic pagination and filtering.
/// </summary>
public record GetRolesListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<RoleDto>>>;

