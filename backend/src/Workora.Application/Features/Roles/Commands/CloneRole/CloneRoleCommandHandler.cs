using AutoMapper;
using MediatR;
using Workora.Application.Features.Roles.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Roles.Commands.CloneRole;

/// <summary>
/// Handler for <see cref="CloneRoleCommand"/>.
/// </summary>
public class CloneRoleCommandHandler : IRequestHandler<CloneRoleCommand, ApiResponse<RoleDto>>
{
    private readonly IRoleRepository _roleRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CloneRoleCommandHandler"/> class.
    /// </summary>
    public CloneRoleCommandHandler(IRoleRepository roleRepository, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _roleRepository = roleRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<RoleDto>> Handle(CloneRoleCommand request, CancellationToken ct)
    {
        var sourceRole = await _roleRepository.GetByIdWithPermissionsAsync(request.SourceRoleId, ct);
        if (sourceRole == null)
        {
            return ApiResponse<RoleDto>.Fail(ResponseMessage.RoleNotFound.GetDescription());
        }

        var isUnique = await _roleRepository.IsNameUniqueAsync(request.NewName, ct: ct);
        if (!isUnique)
        {
            return ApiResponse<RoleDto>.Fail($"A role with the name '{request.NewName}' already exists.");
        }

        var description = request.Description ?? $"Cloned from {sourceRole.Name}";
        var newRole = Role.Create(request.NewName, description);

        await _roleRepository.AddAsync(newRole, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        if (sourceRole.RolePermissions.Any())
        {
            var permissionIds = sourceRole.RolePermissions.Select(rp => rp.PermissionId).ToList();
            await _roleRepository.SetRolePermissionsAsync(newRole.Id, permissionIds, ct);
            await _unitOfWork.SaveChangesAsync(ct);
        }

        var resultRole = await _roleRepository.GetByIdWithPermissionsAsync(newRole.Id, ct) ?? newRole;
        var dto = _mapper.Map<RoleDto>(resultRole);
        return ApiResponse<RoleDto>.Success(dto, ResponseMessage.RoleCreated.GetDescription());
    }
}
