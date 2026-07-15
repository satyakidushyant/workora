using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Interfaces;
using Workora.Application.Common.Exceptions;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Commands.ChangePassword;

/// <summary>
/// Handler for the <see cref="ChangePasswordCommand"/>. Verifies old password and updates it.
/// </summary>
public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, ApiResponse<ChangePasswordResponseDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="ChangePasswordCommandHandler"/> class.
    /// </summary>
    public ChangePasswordCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Handles the change password request.
    /// </summary>
    /// <param name="request">The change password command.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A DTO containing the response message.</returns>
    public async Task<ApiResponse<ChangePasswordResponseDto>> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user == null || !user.IsActive)
        {
            throw new UnauthorizedException(ResponseMessage.UserNotFound.GetDescription());
        }

        if (!_passwordHasher.VerifyPassword(request.OldPassword, user.PasswordHash))
        {
            throw new UnauthorizedException(ResponseMessage.IncorrectOldPassword.GetDescription());
        }

        user.UpdatePassword(_passwordHasher.HashPassword(request.NewPassword));
        _userRepository.Update(user);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ApiResponse<ChangePasswordResponseDto>.Success(new ChangePasswordResponseDto(ResponseMessage.Success.GetDescription()));
    }
}
