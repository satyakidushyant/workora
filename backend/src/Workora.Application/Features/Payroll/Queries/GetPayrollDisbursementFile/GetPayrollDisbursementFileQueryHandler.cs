using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetPayrollDisbursementFile;

/// <summary>
/// Handler for <see cref="GetPayrollDisbursementFileQuery"/>.
/// </summary>
public class GetPayrollDisbursementFileQueryHandler : IRequestHandler<GetPayrollDisbursementFileQuery, ApiResponse<PayrollDisbursementFileDto>>
{
    private readonly IGenericRepository<PayrollRun> _runRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPayrollDisbursementFileQueryHandler"/> class.
    /// </summary>
    public GetPayrollDisbursementFileQueryHandler(IGenericRepository<PayrollRun> runRepository)
    {
        _runRepository = runRepository;
    }

    /// <summary>
    /// Handles generation of bank disbursement export file.
    /// </summary>
    public async Task<ApiResponse<PayrollDisbursementFileDto>> Handle(GetPayrollDisbursementFileQuery request, CancellationToken cancellationToken)
    {
        var run = await _runRepository.GetByIdAsync(request.PayrollRunId, cancellationToken);
        if (run == null)
        {
            return ApiResponse<PayrollDisbursementFileDto>.Fail($"Payroll run {request.PayrollRunId} not found.");
        }

        var dto = new PayrollDisbursementFileDto
        {
            PayrollRunId = run.Id,
            TotalAmount = run.TotalNetPay,
            DownloadUrl = $"/api/v1/payroll/runs/{run.Id}/download-disbursement-csv"
        };

        return ApiResponse<PayrollDisbursementFileDto>.Success(dto, "Bank disbursement payment file generated successfully.");
    }
}
