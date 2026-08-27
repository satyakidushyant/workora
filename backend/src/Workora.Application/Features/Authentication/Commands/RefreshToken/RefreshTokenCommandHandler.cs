using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Application.Common.Exceptions;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Commands.RefreshToken;

/// <summary>
/// Handler for the <see cref="RefreshTokenCommand"/>. Generates new access and refresh tokens preserving roles and permissions.
/// </summary>
public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, ApiResponse<AuthResultDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IPermissionRepository _permissionRepository;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="RefreshTokenCommandHandler"/> class.
    /// </summary>
    public RefreshTokenCommandHandler(
        IUserRepository userRepository,
        IPermissionRepository permissionRepository,
        ITokenService tokenService,
        IRefreshTokenRepository refreshTokenRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _permissionRepository = permissionRepository;
        _tokenService = tokenService;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Handles the token refresh request.
    /// </summary>
    /// <param name="request">The refresh token command.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A new AuthResultDto containing fresh tokens.</returns>
    public async Task<ApiResponse<AuthResultDto>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var hashedToken = _tokenService.HashToken(request.RefreshToken);
        var existingToken = await _refreshTokenRepository.GetByTokenHashAsync(hashedToken, cancellationToken);

        if (existingToken == null || !existingToken.IsActiveToken)
        {
            throw new UnauthorizedException(ResponseMessage.InvalidToken.GetDescription());
        }

        var user = await _userRepository.GetByIdAsync(existingToken.UserId, cancellationToken);
        if (user == null || !user.IsActive)
        {
            throw new UnauthorizedException(ResponseMessage.UserNotFound.GetDescription());
        }

        // Revoke the old token
        existingToken.Revoke();
        _refreshTokenRepository.Update(existingToken);

        // Dynamically resolve roles and permissions
        var roles = user.UserRoles
            .Where(ur => ur.Role != null)
            .Select(ur => ur.Role.Name)
            .Distinct()
            .ToList();

        if (!roles.Any())
        {
            roles.Add("Employee");
        }

        List<string> permissions;
        if (roles.Contains("SuperAdmin"))
        {
            var allPermissions = await _permissionRepository.GetAllAsync(cancellationToken);
            permissions = allPermissions.Select(p => p.Code).Distinct().ToList();
        }
        else
        {
            permissions = user.UserRoles
                .Where(ur => ur.Role != null)
                .SelectMany(ur => ur.Role.RolePermissions)
                .Where(rp => rp.Permission != null)
                .Select(rp => rp.Permission.Code)
                .Distinct()
                .ToList();
        }

        var accessToken = _tokenService.GenerateAccessToken(user, roles, permissions);
        var newRefreshTokenStr = _tokenService.GenerateRefreshToken();
        var newHashedRefreshToken = _tokenService.HashToken(newRefreshTokenStr);

        var newRefreshTokenEntity = Workora.Domain.Entities.RefreshToken.Create(
            user.Id,
            newHashedRefreshToken,
            DateTimeOffset.UtcNow.AddDays(7),
            "127.0.0.1",
            "Unknown"
        );

        await _refreshTokenRepository.AddAsync(newRefreshTokenEntity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ApiResponse<AuthResultDto>.Success(new AuthResultDto(accessToken, newRefreshTokenStr, 15 * 60));
    }
}
