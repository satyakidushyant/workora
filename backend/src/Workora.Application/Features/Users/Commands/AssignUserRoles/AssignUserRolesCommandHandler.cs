using MediatR;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Commands.AssignUserRoles;

/// <summary>
/// Handler for <see cref="AssignUserRolesCommand"/>.
/// </summary>
public class AssignUserRolesCommandHandler : IRequestHandler<AssignUserRolesCommand, ApiResponse<bool>>
{
    private readonly IUserRepository _userRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="AssignUserRolesCommandHandler"/> class.
    /// </summary>
    /// <param name="userRepository">The user repository.</param>
    public AssignUserRolesCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(AssignUserRolesCommand request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, ct);
        if (user == null)
        {
            return ApiResponse<bool>.Fail($"User with ID {request.UserId} was not found.");
        }

        // Roles assignment logic can be persisted via UserRepository / AppDbContext
        return ApiResponse<bool>.Success(true);
    }
}
