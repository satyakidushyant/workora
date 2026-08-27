using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Designations.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.Queries.GetDesignationsList;

/// <summary>
/// Handler for <see cref="GetDesignationsListQuery"/>.
/// </summary>
public class GetDesignationsListQueryHandler : IRequestHandler<GetDesignationsListQuery, ApiResponse<PagedResponse<DesignationDto>>>
{
    private readonly IDesignationRepository _designationRepository;
    private readonly ITenantResolutionService _tenantResolutionService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetDesignationsListQueryHandler"/> class.
    /// </summary>
    public GetDesignationsListQueryHandler(
        IDesignationRepository designationRepository,
        ITenantResolutionService tenantResolutionService,
        IMapper mapper)
    {
        _designationRepository = designationRepository;
        _tenantResolutionService = tenantResolutionService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<DesignationDto>>> Handle(GetDesignationsListQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);

        var designations = await _designationRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            request.DepartmentId,
            targetCompanyId,
            ct);

        var totalCount = await _designationRepository.GetCountAsync(
            request.SearchTerm,
            request.DepartmentId,
            targetCompanyId,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<DesignationDto>>(designations);
        var paged = new PagedResponse<DesignationDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<DesignationDto>>.Success(paged);
    }
}
