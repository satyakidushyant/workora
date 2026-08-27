using MediatR;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Users.DTOs;
namespace Workora.Application.Features.Users.Commands.ActivateUser;

/// <summary>
/// Handler for <see cref="ActivateUserCommand"/>.
/// </summary>
public class ActivateUserCommandHandler : IRequestHandler<ActivateUserCommand, ApiResponse<bool>>
{
    private readonly IUserRepository _userRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="ActivateUserCommandHandler"/> class.
    /// </summary>
    /// <param name="userRepository">The user repository.</param>
    public ActivateUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(ActivateUserCommand request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, ct);
        if (user == null)
        {
            return ApiResponse<bool>.Fail($"User with ID {request.Id} was not found.");
        }

        user.Activate();
        _userRepository.Update(user);

        return ApiResponse<bool>.Success(true);
    }
}
