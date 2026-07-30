using MediatR;
using Workora.Application.Features.Users.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Queries.GetUsersList;

/// <summary>
/// Query to retrieve a paginated list of users.
/// </summary>
/// <param name="PageNumber">The 1-based page number (default: 1).</param>
/// <param name="PageSize">The page size (default: 10).</param>
/// <param name="SearchTerm">Optional search term for filtering.</param>
/// <param name="IsActive">Optional filter for user active status.</param>
public record GetUsersListQuery(
    int PageNumber = 1,
    int PageSize = 10,
    string? SearchTerm = null,
    bool? IsActive = null
) : IRequest<ApiResponse<PagedResponse<UserDto>>>;
