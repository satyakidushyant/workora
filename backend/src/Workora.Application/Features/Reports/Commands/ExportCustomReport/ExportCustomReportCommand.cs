using MediatR;
using Workora.Application.Features.Reports.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Commands.ExportCustomReport;

/// <summary>
/// Command to generate a custom dynamic report export.
/// </summary>
public record ExportCustomReportCommand(
    int CompanyId,
    string ReportType,
    DateOnly FromDate,
    DateOnly ToDate) : IRequest<ApiResponse<CustomReportExportDto>>;
