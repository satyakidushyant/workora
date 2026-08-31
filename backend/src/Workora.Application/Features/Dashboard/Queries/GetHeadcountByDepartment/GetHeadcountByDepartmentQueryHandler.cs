using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Dashboard.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.Queries.GetHeadcountByDepartment;

/// <summary>
/// Handler for <see cref="GetHeadcountByDepartmentQuery"/>.
/// </summary>
public class GetHeadcountByDepartmentQueryHandler : IRequestHandler<GetHeadcountByDepartmentQuery, ApiResponse<IReadOnlyList<DepartmentHeadcountDto>>>
{
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly ITenantResolutionService _tenantResolutionService;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetHeadcountByDepartmentQueryHandler"/> class.
    /// </summary>
    public GetHeadcountByDepartmentQueryHandler(
        IAnalyticsRepository analyticsRepository,
        ITenantResolutionService tenantResolutionService)
    {
        _analyticsRepository = analyticsRepository;
        _tenantResolutionService = tenantResolutionService;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<DepartmentHeadcountDto>>> Handle(GetHeadcountByDepartmentQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);
        var effectiveCompanyId = targetCompanyId ?? 0;

        if (effectiveCompanyId <= 0 && targetCompanyId.HasValue)
        {
            return ApiResponse<IReadOnlyList<DepartmentHeadcountDto>>.Success(Array.Empty<DepartmentHeadcountDto>());
        }

        var dict = await _analyticsRepository.GetHeadcountByDepartmentAsync(effectiveCompanyId, ct);
        var list = dict.Select(kv => new DepartmentHeadcountDto(kv.Key, kv.Value)).ToList();
        return ApiResponse<IReadOnlyList<DepartmentHeadcountDto>>.Success(list);
    }
}
