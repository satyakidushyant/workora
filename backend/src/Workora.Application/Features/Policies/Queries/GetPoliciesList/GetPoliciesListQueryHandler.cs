using AutoMapper;
using MediatR;
using Workora.Application.Features.Policies.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Policies.Queries.GetPoliciesList;

/// <summary>
/// Handler for <see cref="GetPoliciesListQuery"/>.
/// </summary>
public class GetPoliciesListQueryHandler : IRequestHandler<GetPoliciesListQuery, ApiResponse<PagedResponse<PolicyDto>>>
{
    private readonly IPolicyRepository _policyRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPoliciesListQueryHandler"/> class.
    /// </summary>
    public GetPoliciesListQueryHandler(IPolicyRepository policyRepository, IMapper mapper)
    {
        _policyRepository = policyRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<PolicyDto>>> Handle(GetPoliciesListQuery request, CancellationToken ct)
    {
        var policies = await _policyRepository.GetPoliciesPagedAsync(request.PageNumber, request.PageSize, request.CompanyId, ct);
        var totalCount = await _policyRepository.GetPoliciesCountAsync(request.CompanyId, ct);

        var dtos = _mapper.Map<IReadOnlyList<PolicyDto>>(policies);
        var paged = new PagedResponse<PolicyDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<PolicyDto>>.Success(paged);
    }
}
