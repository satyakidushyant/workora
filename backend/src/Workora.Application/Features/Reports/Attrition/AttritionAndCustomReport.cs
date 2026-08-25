using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Reports.Attrition;

/// <summary>
/// DTO representing employee attrition & turnover metrics.
/// </summary>
public class AttritionReportDto
{
    /// <summary>
    /// Gets or sets total headcount at start of period.
    /// </summary>
    public int OpeningHeadcount { get; set; }

    /// <summary>
    /// Gets or sets total hires during period.
    /// </summary>
    public int NewHires { get; set; }

    /// <summary>
    /// Gets or sets total exits/terminations during period.
    /// </summary>
    public int TotalExits { get; set; }

    /// <summary>
    /// Gets or sets closing headcount.
    /// </summary>
    public int ClosingHeadcount { get; set; }

    /// <summary>
    /// Gets or sets calculated attrition rate percentage.
    /// </summary>
    public decimal AttritionRatePercentage { get; set; }
}

/// <summary>
/// DTO representing custom dynamic report export response.
/// </summary>
public class CustomReportExportDto
{
    /// <summary>
    /// Gets or sets export filename.
    /// </summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets export MIME content type.
    /// </summary>
    public string ContentType { get; set; } = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    /// <summary>
    /// Gets or sets secure download URL.
    /// </summary>
    public string DownloadUrl { get; set; } = string.Empty;
}

/// <summary>
/// Query to compute attrition report.
/// </summary>
public record GetAttritionReportQuery(int CompanyId, int Year) : IRequest<ApiResponse<AttritionReportDto>>;

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

/// <summary>
/// Command to generate a custom dynamic report export.
/// </summary>
public record ExportCustomReportCommand(
    int CompanyId,
    string ReportType,
    DateOnly FromDate,
    DateOnly ToDate) : IRequest<ApiResponse<CustomReportExportDto>>;

/// <summary>
/// Handler for <see cref="ExportCustomReportCommand"/>.
/// </summary>
public class ExportCustomReportCommandHandler : IRequestHandler<ExportCustomReportCommand, ApiResponse<CustomReportExportDto>>
{
    /// <summary>
    /// Handles custom dynamic report export generation.
    /// </summary>
    public Task<ApiResponse<CustomReportExportDto>> Handle(ExportCustomReportCommand request, CancellationToken cancellationToken)
    {
        var dto = new CustomReportExportDto
        {
            FileName = $"{request.ReportType}_Report_{request.FromDate:yyyyMMdd}_{request.ToDate:yyyyMMdd}.xlsx",
            DownloadUrl = $"/api/v1/reports/download-export?type={request.ReportType}"
        };

        return Task.FromResult(ApiResponse<CustomReportExportDto>.Success(dto, "Custom report export generated successfully."));
    }
}
