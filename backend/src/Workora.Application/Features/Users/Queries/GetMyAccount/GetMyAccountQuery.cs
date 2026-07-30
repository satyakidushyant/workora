using MediatR;
using Workora.Application.Features.Users.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Queries.GetMyAccount;

/// <summary>
/// Query to retrieve the currently authenticated user's own account details.
/// </summary>
public record GetMyAccountQuery : IRequest<ApiResponse<UserDetailDto>>;
