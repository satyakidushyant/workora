using MediatR;
using Workora.Application.Common.Exceptions;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Queries.GetMyProfile;

/// <summary>
/// Handler for <see cref="GetMyProfileQuery"/>.
/// </summary>
public class GetMyProfileQueryHandler : IRequestHandler<GetMyProfileQuery, ApiResponse<UserProfileDto>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserRepository _userRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetMyProfileQueryHandler"/> class.
    /// </summary>
    /// <param name="currentUserService">The current user context service.</param>
    /// <param name="userRepository">The user repository.</param>
    public GetMyProfileQueryHandler(ICurrentUserService currentUserService, IUserRepository userRepository)
    {
        _currentUserService = currentUserService;
        _userRepository = userRepository;
    }

    /// <summary>
    /// Handles the query request to retrieve profile details for the currently authenticated user.
    /// </summary>
    /// <param name="request">The query request.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>An API response with the user profile DTO.</returns>
    /// <exception cref="UnauthorizedException">Thrown when user context is null.</exception>
    /// <exception cref="NotFoundException">Thrown when current user does not exist in repository.</exception>
    public async Task<ApiResponse<UserProfileDto>> Handle(GetMyProfileQuery request, CancellationToken cancellationToken)
    {
        var userUuid = _currentUserService.UserId;
        if (userUuid == null)
        {
            throw new UnauthorizedException("User is not authenticated.");
        }

        var user = await _userRepository.GetByUuidAsync(userUuid.Value, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException(nameof(User), userUuid.Value);
        }

        // Roles and permissions are empty arrays for now, matching login logic
        var roles = new List<string>();
        var permissions = new List<string>();

        var profileDto = new UserProfileDto(
            user.Uuid,
            user.Email.Value,
            user.FirstName,
            user.LastName,
            user.EmployeeId,
            roles,
            permissions
        );

        return ApiResponse<UserProfileDto>.Success(profileDto);
    }
}
