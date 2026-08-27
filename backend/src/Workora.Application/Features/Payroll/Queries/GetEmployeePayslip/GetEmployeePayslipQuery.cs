using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetEmployeePayslip;

/// <summary>
/// Query to download employee payslip for a specific payroll run.
/// </summary>
public record GetEmployeePayslipQuery(int PayrollRunId, int EmployeeId) : IRequest<ApiResponse<PayslipDto>>;
