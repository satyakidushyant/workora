using AutoMapper;
using MediatR;
using Workora.Application.Features.Roles.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Roles.Commands.UpdateRole;

/// <summary>
/// Handler for <see cref="UpdateRoleCommand"/>.
/// </summary>
public class UpdateRoleCommandHandler : IRequestHandler<UpdateRoleCommand, ApiResponse<RoleDto>>
{
    private readonly IRoleRepository _roleRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateRoleCommandHandler"/> class.
    /// </summary>
    public UpdateRoleCommandHandler(IRoleRepository roleRepository, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _roleRepository = roleRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<RoleDto>> Handle(UpdateRoleCommand request, CancellationToken ct)
    {
        var role = await _roleRepository.GetByIdWithPermissionsAsync(request.Id, ct);
        if (role == null)
        {
            return ApiResponse<RoleDto>.Fail($"Role with ID {request.Id} was not found.");
        }

        var isUnique = await _roleRepository.IsNameUniqueAsync(request.Name, request.Id, ct);
        if (!isUnique)
        {
            return ApiResponse<RoleDto>.Fail($"Another role with the name '{request.Name}' already exists.");
        }

        role.Update(request.Name, request.Description);
        _roleRepository.Update(role);
        await _unitOfWork.SaveChangesAsync(ct);


        var dto = _mapper.Map<RoleDto>(role);
        return ApiResponse<RoleDto>.Success(dto);
    }
}
