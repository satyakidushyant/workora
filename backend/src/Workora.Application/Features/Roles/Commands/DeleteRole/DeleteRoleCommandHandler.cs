using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Roles.DTOs;
namespace Workora.Application.Features.Roles.Commands.DeleteRole;

/// <summary>
/// Handler for <see cref="DeleteRoleCommand"/>.
/// </summary>
public class DeleteRoleCommandHandler : IRequestHandler<DeleteRoleCommand, ApiResponse<bool>>
{
    private readonly IRoleRepository _roleRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeleteRoleCommandHandler"/> class.
    /// </summary>
    public DeleteRoleCommandHandler(IRoleRepository roleRepository, IUnitOfWork unitOfWork)
    {
        _roleRepository = roleRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(DeleteRoleCommand request, CancellationToken ct)
    {
        var role = await _roleRepository.GetByIdAsync(request.Id, ct);
        if (role == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.RoleNotFound.GetDescription());
        }

        if (role.IsSystemRole)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.SystemRoleImmutable.GetDescription());
        }

        var inUse = await _roleRepository.IsInUseAsync(request.Id, ct);
        if (inUse)
        {
            return ApiResponse<bool>.Fail($"Role '{role.Name}' cannot be deleted because it is currently assigned to one or more users.");
        }

        _roleRepository.Remove(role);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.RoleDeleted.GetDescription());
    }
}
