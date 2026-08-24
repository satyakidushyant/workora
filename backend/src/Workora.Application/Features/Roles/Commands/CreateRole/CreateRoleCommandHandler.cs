using AutoMapper;
using MediatR;
using Workora.Application.Features.Roles.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Roles.Commands.CreateRole;

/// <summary>
/// Handler for <see cref="CreateRoleCommand"/>.
/// </summary>
public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, ApiResponse<RoleDto>>
{
    private readonly IRoleRepository _roleRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateRoleCommandHandler"/> class.
    /// </summary>
    public CreateRoleCommandHandler(
        IRoleRepository roleRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _roleRepository = roleRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<RoleDto>> Handle(CreateRoleCommand request, CancellationToken ct)
    {
        var isUnique = await _roleRepository.IsNameUniqueAsync(request.Name, ct: ct);
        if (!isUnique)
        {
            return ApiResponse<RoleDto>.Fail($"A role with the name '{request.Name}' already exists.");
        }

        var role = Role.Create(request.Name, request.Description);
        await _roleRepository.AddAsync(role, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        if (request.PermissionIds != null && request.PermissionIds.Any())
        {
            await _roleRepository.SetRolePermissionsAsync(role.Id, request.PermissionIds, ct);
            await _unitOfWork.SaveChangesAsync(ct);
        }

        var createdRole = await _roleRepository.GetByIdWithPermissionsAsync(role.Id, ct) ?? role;
        var dto = _mapper.Map<RoleDto>(createdRole);
        return ApiResponse<RoleDto>.Success(dto, ResponseMessage.RoleCreated.GetDescription());
    }
}
