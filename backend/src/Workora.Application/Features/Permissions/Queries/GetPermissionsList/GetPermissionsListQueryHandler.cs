using AutoMapper;
using MediatR;
using Workora.Application.Features.Permissions.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Permissions.Queries.GetPermissionsList;

/// <summary>
/// Handler for <see cref="GetPermissionsListQuery"/>.
/// </summary>
public class GetPermissionsListQueryHandler : IRequestHandler<GetPermissionsListQuery, ApiResponse<IReadOnlyList<ModulePermissionsDto>>>
{
    private readonly IPermissionRepository _permissionRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPermissionsListQueryHandler"/> class.
    /// </summary>
    public GetPermissionsListQueryHandler(IPermissionRepository permissionRepository, IMapper mapper)
    {
        _permissionRepository = permissionRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<ModulePermissionsDto>>> Handle(GetPermissionsListQuery request, CancellationToken ct)
    {
        var permissions = await _permissionRepository.GetAllAsync(ct);
        var permissionDtos = _mapper.Map<IReadOnlyList<PermissionDto>>(permissions);

        var grouped = permissionDtos
            .GroupBy(p => p.Module)
            .Select(g => new ModulePermissionsDto
            {
                Module = g.Key,
                Permissions = g.ToList()
            })
            .OrderBy(m => m.Module)
            .ToList();

        return ApiResponse<IReadOnlyList<ModulePermissionsDto>>.Success(grouped);
    }
}
