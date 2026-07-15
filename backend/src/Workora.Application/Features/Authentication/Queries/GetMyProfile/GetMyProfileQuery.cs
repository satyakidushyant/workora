using MediatR;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Queries.GetMyProfile;

/// <summary>
/// Query for retrieving the current user's profile details.
/// </summary>
public record GetMyProfileQuery : IRequest<ApiResponse<UserProfileDto>>;
