using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetPayrollDisbursementFile;

/// <summary>
/// Query to generate bank disbursement file for a finalized payroll run.
/// </summary>
public record GetPayrollDisbursementFileQuery(int PayrollRunId) : IRequest<ApiResponse<PayrollDisbursementFileDto>>;
