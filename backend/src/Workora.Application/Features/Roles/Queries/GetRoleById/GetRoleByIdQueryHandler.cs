using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Features.Roles.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Roles.Queries.GetRoleById;

/// <summary>
/// Handler for <see cref="GetRoleByIdQuery"/>.
/// </summary>
public class GetRoleByIdQueryHandler : IRequestHandler<GetRoleByIdQuery, ApiResponse<RoleDetailDto>>
{
    private readonly IRoleRepository _roleRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetRoleByIdQueryHandler"/> class.
    /// </summary>
    public GetRoleByIdQueryHandler(IRoleRepository roleRepository, IMapper mapper)
    {
        _roleRepository = roleRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<RoleDetailDto>> Handle(GetRoleByIdQuery request, CancellationToken ct)
    {
        var role = await _roleRepository.GetByIdWithPermissionsAsync(request.Id, ct);
        if (role == null)
        {
            return ApiResponse<RoleDetailDto>.Fail(ResponseMessage.RoleNotFound.GetDescription());
        }

        var dto = _mapper.Map<RoleDetailDto>(role);
        return ApiResponse<RoleDetailDto>.Success(dto);
    }
}
