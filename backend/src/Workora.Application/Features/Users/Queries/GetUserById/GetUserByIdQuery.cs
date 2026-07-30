using MediatR;
using Workora.Application.Features.Users.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Queries.GetUserById;

/// <summary>
/// Query to retrieve a single user's detailed information by ID.
/// </summary>
/// <param name="Id">The unique identifier of the user.</param>
public record GetUserByIdQuery(int Id) : IRequest<ApiResponse<UserDetailDto>>;
