using MediatR;
using Workora.Shared.Responses;

using Workora.Application.Features.AuditLogs.DTOs;
namespace Workora.Application.Features.AuditLogs.Queries.ExportAuditLogs;

/// <summary>
/// Query to export audit logs as CSV metadata.
/// </summary>
public record ExportAuditLogsQuery(int CompanyId) : IRequest<ApiResponse<string>>;
