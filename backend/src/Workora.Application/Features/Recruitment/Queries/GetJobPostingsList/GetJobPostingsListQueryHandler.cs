using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetJobPostingsList;

/// <summary>
/// Handler for <see cref="GetJobPostingsListQuery"/>.
/// </summary>
public class GetJobPostingsListQueryHandler : IRequestHandler<GetJobPostingsListQuery, ApiResponse<PagedResponse<JobPostingDto>>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly ITenantResolutionService _tenantResolutionService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetJobPostingsListQueryHandler"/> class.
    /// </summary>
    public GetJobPostingsListQueryHandler(
        IRecruitmentRepository recruitmentRepository,
        ITenantResolutionService tenantResolutionService,
        IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _tenantResolutionService = tenantResolutionService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<JobPostingDto>>> Handle(GetJobPostingsListQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);

        var jobs = await _recruitmentRepository.GetJobsPagedAsync(
            request.PageNumber,
            request.PageSize,
            targetCompanyId,
            request.DepartmentId,
            request.Status,
            request.SearchTerm,
            ct);

        var totalCount = await _recruitmentRepository.GetJobsCountAsync(
            targetCompanyId,
            request.DepartmentId,
            request.Status,
            request.SearchTerm,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<JobPostingDto>>(jobs);
        var paged = new PagedResponse<JobPostingDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<JobPostingDto>>.Success(paged);
    }
}
