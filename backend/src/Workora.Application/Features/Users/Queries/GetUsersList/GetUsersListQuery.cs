using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Users.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Queries.GetUsersList;

/// <summary>
/// Query to retrieve a paginated list of users with dynamic pagination and filtering.
/// </summary>
public record GetUsersListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<UserDto>>>
{
    /// <summary>
    /// Gets or init optional filter for user active status.
    /// </summary>
    public bool? IsActive { get; init; }

    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }
}

