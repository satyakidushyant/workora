using MediatR;
using Workora.Application.Features.Reports.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Queries.GetPayrollReport;

/// <summary>
/// Query to generate payroll expense history analytics.
/// </summary>
public record GetPayrollReportQuery(int CompanyId) : IRequest<ApiResponse<PayrollReportDto>>;
