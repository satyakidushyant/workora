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
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="AssignUserRolesCommandHandler"/> class.
    /// </summary>
    /// <param name="userRepository">The user repository.</param>
    /// <param name="unitOfWork">The unit of work.</param>
    public AssignUserRolesCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(AssignUserRolesCommand request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, ct);
        if (user == null)
        {
            return ApiResponse<bool>.Fail($"User with ID {request.UserId} was not found.");
        }

        await _userRepository.AssignUserRolesAsync(request.UserId, request.RoleIds ?? new List<int>(), ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true);
    }
}
