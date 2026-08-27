using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Users.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Queries.GetUsersList;

/// <summary>
/// Handler for <see cref="GetUsersListQuery"/>.
/// </summary>
public class GetUsersListQueryHandler : IRequestHandler<GetUsersListQuery, ApiResponse<PagedResponse<UserDto>>>
{
    private readonly IUserRepository _userRepository;
    private readonly ITenantResolutionService _tenantResolutionService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetUsersListQueryHandler"/> class.
    /// </summary>
    public GetUsersListQueryHandler(
        IUserRepository userRepository,
        ITenantResolutionService tenantResolutionService,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _tenantResolutionService = tenantResolutionService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<UserDto>>> Handle(GetUsersListQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);

        var users = await _userRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            request.IsActive,
            targetCompanyId,
            ct);

        var totalCount = await _userRepository.GetCountAsync(
            request.SearchTerm,
            request.IsActive,
            targetCompanyId,
            ct);

        var dtos = _mapper.Map<List<UserDto>>(users);

        var pagedResponse = new PagedResponse<UserDto>
        {
            Items = dtos,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };

        return ApiResponse<PagedResponse<UserDto>>.Success(pagedResponse);
    }
}
