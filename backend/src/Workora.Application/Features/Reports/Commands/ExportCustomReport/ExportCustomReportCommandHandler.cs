using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Reports.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Commands.ExportCustomReport;

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

        return Task.FromResult(ApiResponse<CustomReportExportDto>.Success(dto, ResponseMessage.CustomReportExportGenerated.GetDescription()));
    }
}
