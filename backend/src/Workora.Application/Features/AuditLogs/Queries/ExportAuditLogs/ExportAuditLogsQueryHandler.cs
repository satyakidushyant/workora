using MediatR;
using Workora.Shared.Responses;

using Workora.Application.Features.AuditLogs.DTOs;
namespace Workora.Application.Features.AuditLogs.Queries.ExportAuditLogs;

/// <summary>
/// Handler for <see cref="ExportAuditLogsQuery"/>.
/// </summary>
public class ExportAuditLogsQueryHandler : IRequestHandler<ExportAuditLogsQuery, ApiResponse<string>>
{
    /// <summary>
    /// Handles generation of audit log CSV download link.
    /// </summary>
    public Task<ApiResponse<string>> Handle(ExportAuditLogsQuery request, CancellationToken cancellationToken)
    {
        var downloadUrl = $"/api/v1/audit-logs/download-csv?companyId={request.CompanyId}";
        return Task.FromResult(ApiResponse<string>.Success(downloadUrl, "Audit log CSV export generated successfully."));
    }
}
