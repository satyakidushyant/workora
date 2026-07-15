using MediatR;
using Workora.Application.Common.Exceptions;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Commands.LogoutAll;

/// <summary>
/// Handler for the <see cref="LogoutAllCommand"/>. Revokes all active refresh tokens for the current user.
/// </summary>
public class LogoutAllCommandHandler : IRequestHandler<LogoutAllCommand, ApiResponse<LogoutResponseDto>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="LogoutAllCommandHandler"/> class.
    /// </summary>
    /// <param name="currentUserService">The current user context service.</param>
    /// <param name="userRepository">The user repository.</param>
    /// <param name="refreshTokenRepository">The refresh token repository.</param>
    /// <param name="unitOfWork">The unit of work committing transactions.</param>
    public LogoutAllCommandHandler(
        ICurrentUserService currentUserService,
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IUnitOfWork unitOfWork)
    {
        _currentUserService = currentUserService;
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Handles the command by revoking all refresh tokens for the currently authenticated user.
    /// </summary>
    /// <param name="request">The logout all command.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A logout response containing success message.</returns>
    /// <exception cref="UnauthorizedException">Thrown when user context is null.</exception>
    /// <exception cref="NotFoundException">Thrown when current user does not exist in repository.</exception>
    public async Task<ApiResponse<LogoutResponseDto>> Handle(LogoutAllCommand request, CancellationToken cancellationToken)
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

        await _refreshTokenRepository.RevokeAllForUserAsync(user.Id, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ApiResponse<LogoutResponseDto>.Success(new LogoutResponseDto(ResponseMessage.Success.GetDescription()));
    }
}
