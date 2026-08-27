using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Reports.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Queries.GetAttritionReport;

/// <summary>
/// Handler for <see cref="GetAttritionReportQuery"/>.
/// Computes attrition and turnover rate scoped to the tenant's company.
/// </summary>
public class GetAttritionReportQueryHandler : IRequestHandler<GetAttritionReportQuery, ApiResponse<AttritionReportDto>>
{
    private readonly IGenericRepository<Employee> _employeeRepository;
    private readonly ITenantResolutionService _tenantResolutionService;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetAttritionReportQueryHandler"/> class.
    /// </summary>
    public GetAttritionReportQueryHandler(
        IGenericRepository<Employee> employeeRepository,
        ITenantResolutionService tenantResolutionService)
    {
        _employeeRepository = employeeRepository;
        _tenantResolutionService = tenantResolutionService;
    }

    /// <summary>
    /// Executes calculation of company attrition metrics.
    /// </summary>
    public async Task<ApiResponse<AttritionReportDto>> Handle(GetAttritionReportQuery request, CancellationToken cancellationToken)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, cancellationToken);
        
        var query = _employeeRepository.GetQueryable();
        if (targetCompanyId.HasValue)
        {
            var cid = targetCompanyId.Value;
            query = query.Where(e => (e.Department != null && e.Department.CompanyId == cid) || (e.Branch != null && e.Branch.CompanyId == cid));
        }

        var employees = query.ToList();
        var activeCount = employees.Count(e => e.IsActive);
        var terminatedCount = employees.Count(e => !e.IsActive);

        var total = activeCount + terminatedCount;
        var rate = total > 0 ? Math.Round((decimal)terminatedCount / total * 100, 2) : 0;

        var dto = new AttritionReportDto
        {
            OpeningHeadcount = total,
            NewHires = activeCount,
            TotalExits = terminatedCount,
            ClosingHeadcount = activeCount,
            AttritionRatePercentage = rate
        };

        return ApiResponse<AttritionReportDto>.Success(dto, ResponseMessage.AttritionReportComputed.GetDescription());
    }
}
