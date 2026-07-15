using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Interfaces;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Commands.Logout;

/// <summary>
/// Handler for the <see cref="LogoutCommand"/>. Revokes the user's refresh tokens.
/// </summary>
public class LogoutCommandHandler : IRequestHandler<LogoutCommand, ApiResponse<LogoutResponseDto>>
{
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="LogoutCommandHandler"/> class.
    /// </summary>
    public LogoutCommandHandler(
        ITokenService tokenService,
        IRefreshTokenRepository refreshTokenRepository,
        IUnitOfWork unitOfWork)
    {
        _tokenService = tokenService;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Handles the logout request by revoking all refresh tokens for the user.
    /// </summary>
    /// <param name="request">The logout command.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A DTO containing the response message.</returns>
    public async Task<ApiResponse<LogoutResponseDto>> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        var hashedToken = _tokenService.HashToken(request.RefreshToken);
        var existingToken = await _refreshTokenRepository.GetByTokenHashAsync(hashedToken, cancellationToken);

        if (existingToken != null && existingToken.IsActiveToken)
        {
            existingToken.Revoke();
            _refreshTokenRepository.Update(existingToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return ApiResponse<LogoutResponseDto>.Success(new LogoutResponseDto(ResponseMessage.Success.GetDescription()));
    }
}
