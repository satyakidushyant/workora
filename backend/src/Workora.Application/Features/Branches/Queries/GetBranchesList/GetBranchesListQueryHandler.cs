using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Branches.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.Queries.GetBranchesList;

/// <summary>
/// Handler for <see cref="GetBranchesListQuery"/>.
/// </summary>
public class GetBranchesListQueryHandler : IRequestHandler<GetBranchesListQuery, ApiResponse<PagedResponse<BranchDto>>>
{
    private readonly IBranchRepository _branchRepository;
    private readonly ITenantResolutionService _tenantResolutionService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetBranchesListQueryHandler"/> class.
    /// </summary>
    public GetBranchesListQueryHandler(
        IBranchRepository branchRepository,
        ITenantResolutionService tenantResolutionService,
        IMapper mapper)
    {
        _branchRepository = branchRepository;
        _tenantResolutionService = tenantResolutionService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<BranchDto>>> Handle(GetBranchesListQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);

        var branches = await _branchRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            request.IsActive,
            targetCompanyId,
            ct);

        var totalCount = await _branchRepository.GetCountAsync(
            request.SearchTerm,
            request.IsActive,
            targetCompanyId,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<BranchDto>>(branches);
        var paged = new PagedResponse<BranchDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<BranchDto>>.Success(paged);
    }
}
