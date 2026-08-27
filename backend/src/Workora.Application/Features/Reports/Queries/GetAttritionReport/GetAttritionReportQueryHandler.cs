using MediatR;
using Workora.Application.Features.Reports.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Queries.GetAttritionReport;

/// <summary>
/// Handler for <see cref="GetAttritionReportQuery"/>.
/// </summary>
public class GetAttritionReportQueryHandler : IRequestHandler<GetAttritionReportQuery, ApiResponse<AttritionReportDto>>
{
    private readonly IGenericRepository<Employee> _employeeRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetAttritionReportQueryHandler"/> class.
    /// </summary>
    public GetAttritionReportQueryHandler(IGenericRepository<Employee> employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    /// <summary>
    /// Executes calculation of company attrition metrics.
    /// </summary>
    public Task<ApiResponse<AttritionReportDto>> Handle(GetAttritionReportQuery request, CancellationToken cancellationToken)
    {
        var allEmployees = _employeeRepository.GetQueryable().ToList();
        var activeCount = allEmployees.Count(e => e.IsActive);
        var terminatedCount = allEmployees.Count(e => !e.IsActive);

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

        return Task.FromResult(ApiResponse<AttritionReportDto>.Success(dto, "Attrition report metrics computed successfully."));
    }
}
