using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Users.DTOs;
namespace Workora.Application.Features.Users.Commands.AdminResetPassword;

/// <summary>
/// Handler for <see cref="AdminResetPasswordCommand"/>.
/// </summary>
public class AdminResetPasswordCommandHandler : IRequestHandler<AdminResetPasswordCommand, ApiResponse<bool>>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    /// <summary>
    /// Initializes a new instance of the <see cref="AdminResetPasswordCommandHandler"/> class.
    /// </summary>
    /// <param name="userRepository">The user repository.</param>
    /// <param name="passwordHasher">The password hasher service.</param>
    public AdminResetPasswordCommandHandler(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(AdminResetPasswordCommand request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, ct);
        if (user == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.UserNotFound.GetDescription());
        }

        var newPasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        user.UpdatePassword(newPasswordHash);
        user.ResetFailedLogin();
        _userRepository.Update(user);

        return ApiResponse<bool>.Success(true);
    }
}
