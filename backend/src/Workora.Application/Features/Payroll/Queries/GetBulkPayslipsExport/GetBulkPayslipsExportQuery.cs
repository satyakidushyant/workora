using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetBulkPayslipsExport;

/// <summary>
/// Query to download all generated payslips for a payroll run in bulk.
/// </summary>
public record GetBulkPayslipsExportQuery(int PayrollRunId) : IRequest<ApiResponse<BulkPayslipsExportDto>>;
