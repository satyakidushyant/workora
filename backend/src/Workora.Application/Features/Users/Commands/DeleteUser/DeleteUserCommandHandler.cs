using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Users.DTOs;
namespace Workora.Application.Features.Users.Commands.DeleteUser;

/// <summary>
/// Handler for <see cref="DeleteUserCommand"/>.
/// </summary>
public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, ApiResponse<bool>>
{
    private readonly IUserRepository _userRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeleteUserCommandHandler"/> class.
    /// </summary>
    /// <param name="userRepository">The user repository.</param>
    public DeleteUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(DeleteUserCommand request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, ct);
        if (user == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.UserNotFound.GetDescription());
        }

        var hasOtherAdmin = await _userRepository.HasOtherSuperAdminAsync(user.Id, ct);
        if (!hasOtherAdmin)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.CannotDeleteSoleUser.GetDescription());
        }

        _userRepository.Remove(user);
        return ApiResponse<bool>.Success(true);
    }
}
