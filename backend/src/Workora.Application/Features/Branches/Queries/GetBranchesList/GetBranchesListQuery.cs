using AutoMapper;
using MediatR;
using Workora.Application.Features.Branches.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.Queries.GetBranchesList;

/// <summary>
/// Query to get a paginated list of branches.
/// </summary>
public record GetBranchesListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    string? SearchTerm = null,
    bool? IsActive = null) : IRequest<ApiResponse<PagedResponse<BranchDto>>>;

/// <summary>
/// Handler for <see cref="GetBranchesListQuery"/>.
/// </summary>
public class GetBranchesListQueryHandler : IRequestHandler<GetBranchesListQuery, ApiResponse<PagedResponse<BranchDto>>>
{
    private readonly IBranchRepository _branchRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetBranchesListQueryHandler"/> class.
    /// </summary>
    public GetBranchesListQueryHandler(IBranchRepository branchRepository, IMapper mapper)
    {
        _branchRepository = branchRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<BranchDto>>> Handle(GetBranchesListQuery request, CancellationToken ct)
    {
        var branches = await _branchRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            request.IsActive,
            ct);

        var totalCount = await _branchRepository.GetCountAsync(
            request.SearchTerm,
            request.IsActive,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<BranchDto>>(branches);
        var paged = new PagedResponse<BranchDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<BranchDto>>.Success(paged);
    }
}
