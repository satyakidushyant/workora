using AutoMapper;
using MediatR;
using Workora.Application.Features.Roles.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Roles.Queries.GetRolesList;

/// <summary>
/// Handler for <see cref="GetRolesListQuery"/>.
/// </summary>
public class GetRolesListQueryHandler : IRequestHandler<GetRolesListQuery, ApiResponse<PagedResponse<RoleDto>>>
{
    private readonly IRoleRepository _roleRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetRolesListQueryHandler"/> class.
    /// </summary>
    public GetRolesListQueryHandler(IRoleRepository roleRepository, IMapper mapper)
    {
        _roleRepository = roleRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<RoleDto>>> Handle(GetRolesListQuery request, CancellationToken ct)
    {
        var roles = await _roleRepository.GetPagedListAsync(request.PageNumber, request.PageSize, request.SearchTerm, ct);
        var totalCount = await _roleRepository.GetCountAsync(request.SearchTerm, ct);

        var dtos = _mapper.Map<IReadOnlyList<RoleDto>>(roles);

        var pagedResponse = new PagedResponse<RoleDto>
        {
            Items = dtos,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };

        return ApiResponse<PagedResponse<RoleDto>>.Success(pagedResponse);
    }
}
