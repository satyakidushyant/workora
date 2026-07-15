using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using System.Security.Cryptography;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Commands.ForgotPassword;

/// <summary>
/// Handler for the <see cref="ForgotPasswordCommand"/>. Prepares the reset token and triggers a domain event.
/// </summary>
public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, ApiResponse<ForgotPasswordResponseDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordResetTokenRepository _resetTokenRepository;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="ForgotPasswordCommandHandler"/> class.
    /// </summary>
    public ForgotPasswordCommandHandler(
        IUserRepository userRepository,
        IPasswordResetTokenRepository resetTokenRepository,
        ITokenService tokenService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _resetTokenRepository = resetTokenRepository;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Handles the forgot password request.
    /// </summary>
    /// <param name="request">The forgot password command.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A DTO containing the response message.</returns>
    public async Task<ApiResponse<ForgotPasswordResponseDto>> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(Workora.Domain.ValueObjects.EmailAddress.Create(request.Email), cancellationToken);
        if (user == null || !user.IsActive)
        {
            // For security, don't reveal that the user does not exist
            return ApiResponse<ForgotPasswordResponseDto>.Success(new ForgotPasswordResponseDto(ResponseMessage.Success.GetDescription()));
        }

        var resetTokenRaw = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var resetTokenHash = _tokenService.HashToken(resetTokenRaw);

        // Normally you'd construct the link from appsettings/config
        var resetLink = $"https://app.workora.com/auth/reset-password?token={Uri.EscapeDataString(resetTokenRaw)}&email={Uri.EscapeDataString(user.Email.Value)}";

        var resetTokenEntity = PasswordResetToken.Create(
            user.Id,
            resetTokenHash,
            DateTimeOffset.UtcNow.AddMinutes(30),
            user.Email.Value,
            resetLink
        );

        await _resetTokenRepository.AddAsync(resetTokenEntity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ApiResponse<ForgotPasswordResponseDto>.Success(new ForgotPasswordResponseDto(ResponseMessage.Success.GetDescription()));
    }
}
