using MediatR;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Roles.Commands.SetRolePermissions;

/// <summary>
/// Handler for <see cref="SetRolePermissionsCommand"/>.
/// </summary>
public class SetRolePermissionsCommandHandler : IRequestHandler<SetRolePermissionsCommand, ApiResponse<bool>>
{
    private readonly IRoleRepository _roleRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="SetRolePermissionsCommandHandler"/> class.
    /// </summary>
    public SetRolePermissionsCommandHandler(
        IRoleRepository roleRepository,
        IUnitOfWork unitOfWork)
    {
        _roleRepository = roleRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(SetRolePermissionsCommand request, CancellationToken ct)
    {
        var role = await _roleRepository.GetByIdAsync(request.RoleId, ct);
        if (role == null)
        {
            return ApiResponse<bool>.Fail($"Role with ID {request.RoleId} was not found.");
        }

        await _roleRepository.SetRolePermissionsAsync(request.RoleId, request.PermissionIds, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true);
    }
}
