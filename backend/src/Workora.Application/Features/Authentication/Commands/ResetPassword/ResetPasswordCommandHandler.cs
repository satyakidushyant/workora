using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Interfaces;
using Workora.Application.Common.Exceptions;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Commands.ResetPassword;

/// <summary>
/// Handler for the <see cref="ResetPasswordCommand"/>. Validates token and updates the password.
/// </summary>
public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, ApiResponse<ResetPasswordResponseDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordResetTokenRepository _resetTokenRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="ResetPasswordCommandHandler"/> class.
    /// </summary>
    public ResetPasswordCommandHandler(
        IUserRepository userRepository,
        IPasswordResetTokenRepository resetTokenRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _resetTokenRepository = resetTokenRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Handles the reset password request.
    /// </summary>
    /// <param name="request">The reset password command.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A DTO containing the response message.</returns>
    public async Task<ApiResponse<ResetPasswordResponseDto>> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(Workora.Domain.ValueObjects.EmailAddress.Create(request.Email), cancellationToken);
        if (user == null || !user.IsActive)
        {
            throw new UnauthorizedException(ResponseMessage.InvalidToken.GetDescription());
        }

        var hashedToken = _tokenService.HashToken(request.Token);
        var resetTokenEntity = await _resetTokenRepository.GetByTokenHashAsync(hashedToken, cancellationToken);

        if (resetTokenEntity == null || !resetTokenEntity.IsValid || resetTokenEntity.UserId != user.Id)
        {
            throw new UnauthorizedException(ResponseMessage.InvalidToken.GetDescription());
        }

        user.UpdatePassword(_passwordHasher.HashPassword(request.NewPassword));
        _userRepository.Update(user);

        resetTokenEntity.MarkAsUsed();
        _resetTokenRepository.Update(resetTokenEntity);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ApiResponse<ResetPasswordResponseDto>.Success(new ResetPasswordResponseDto(ResponseMessage.Success.GetDescription()));
    }
}
