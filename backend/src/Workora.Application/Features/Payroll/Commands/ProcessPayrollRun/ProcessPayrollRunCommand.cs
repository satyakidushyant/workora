using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.ProcessPayrollRun;

/// <summary>
/// Command to compute earnings & deductions for a draft payroll run.
/// </summary>
public record ProcessPayrollRunCommand(int PayrollRunId) : IRequest<ApiResponse<PayrollRunDto>>;
