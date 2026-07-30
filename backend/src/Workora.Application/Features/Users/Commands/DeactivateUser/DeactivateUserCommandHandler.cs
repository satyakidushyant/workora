using MediatR;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Commands.DeactivateUser;

/// <summary>
/// Handler for <see cref="DeactivateUserCommand"/>.
/// </summary>
public class DeactivateUserCommandHandler : IRequestHandler<DeactivateUserCommand, ApiResponse<bool>>
{
    private readonly IUserRepository _userRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeactivateUserCommandHandler"/> class.
    /// </summary>
    /// <param name="userRepository">The user repository.</param>
    public DeactivateUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(DeactivateUserCommand request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, ct);
        if (user == null)
        {
            return ApiResponse<bool>.Fail($"User with ID {request.Id} was not found.");
        }

        var hasOtherAdmin = await _userRepository.HasOtherSuperAdminAsync(user.Id, ct);
        if (!hasOtherAdmin)
        {
            return ApiResponse<bool>.Fail("Cannot deactivate the sole active user account in the system.");
        }

        user.Deactivate();
        _userRepository.Update(user);

        return ApiResponse<bool>.Success(true);
    }
}
