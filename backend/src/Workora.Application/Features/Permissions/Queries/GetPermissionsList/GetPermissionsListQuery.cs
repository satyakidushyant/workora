using MediatR;
using Workora.Application.Features.Permissions.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Permissions.Queries.GetPermissionsList;

/// <summary>
/// Query to retrieve all permissions grouped by their parent module.
/// </summary>
public record GetPermissionsListQuery : IRequest<ApiResponse<IReadOnlyList<ModulePermissionsDto>>>;
