using System.Collections.Generic;
using System.Linq;
using MediatR;
using Workora.Application.Common.Exceptions;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Queries.ListMySessions;

/// <summary>
/// Handler for <see cref="ListMySessionsQuery"/>.
/// </summary>
public class ListMySessionsQueryHandler : IRequestHandler<ListMySessionsQuery, ApiResponse<IReadOnlyList<UserSessionDto>>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="ListMySessionsQueryHandler"/> class.
    /// </summary>
    /// <param name="currentUserService">The current user context service.</param>
    /// <param name="userRepository">The user repository.</param>
    /// <param name="refreshTokenRepository">The refresh token repository.</param>
    public ListMySessionsQueryHandler(
        ICurrentUserService currentUserService,
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository)
    {
        _currentUserService = currentUserService;
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
    }

    /// <summary>
    /// Handles the query request to list all active sessions for the currently authenticated user.
    /// </summary>
    /// <param name="request">The query request.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>An API response with the collection of active sessions.</returns>
    /// <exception cref="UnauthorizedException">Thrown when user context is null.</exception>
    /// <exception cref="NotFoundException">Thrown when current user does not exist in repository.</exception>
    public async Task<ApiResponse<IReadOnlyList<UserSessionDto>>> Handle(ListMySessionsQuery request, CancellationToken cancellationToken)
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

        var activeTokens = await _refreshTokenRepository.GetActiveSessionsByUserIdAsync(user.Id, cancellationToken);

        var sessionsDto = activeTokens.Select(rt => new UserSessionDto(
            rt.Uuid,
            rt.CreatedByIp,
            rt.CreatedByUserAgent,
            rt.ExpiresAt
        )).ToList();

        return ApiResponse<IReadOnlyList<UserSessionDto>>.Success(sessionsDto);
    }
}
