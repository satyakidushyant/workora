using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetBulkPayslipsExport;

/// <summary>
/// Handler for <see cref="GetBulkPayslipsExportQuery"/>.
/// </summary>
public class GetBulkPayslipsExportQueryHandler : IRequestHandler<GetBulkPayslipsExportQuery, ApiResponse<BulkPayslipsExportDto>>
{
    private readonly IGenericRepository<PayrollRun> _runRepository;
    private readonly IGenericRepository<Payslip> _payslipRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetBulkPayslipsExportQueryHandler"/> class.
    /// </summary>
    public GetBulkPayslipsExportQueryHandler(
        IGenericRepository<PayrollRun> runRepository,
        IGenericRepository<Payslip> payslipRepository)
    {
        _runRepository = runRepository;
        _payslipRepository = payslipRepository;
    }

    /// <summary>
    /// Executes bulk payslips package retrieval.
    /// </summary>
    public async Task<ApiResponse<BulkPayslipsExportDto>> Handle(GetBulkPayslipsExportQuery request, CancellationToken cancellationToken)
    {
        var run = await _runRepository.GetByIdAsync(request.PayrollRunId, cancellationToken);
        if (run == null)
        {
            return ApiResponse<BulkPayslipsExportDto>.Fail(ResponseMessage.PayrollRunNotFound.GetDescription());
        }

        var count = _payslipRepository.GetQueryable()
            .Count(p => p.PayrollRunId == request.PayrollRunId);

        var dto = new BulkPayslipsExportDto
        {
            PayrollRunId = run.Id,
            TotalPayslips = count,
            FileName = $"Payslips_Run_{run.Id}_{run.PeriodYear}_{run.PeriodMonth:D2}.zip",
            DownloadUrl = $"/api/v1/payroll/runs/{run.Id}/payslips/download-bulk-zip"
        };

        return ApiResponse<BulkPayslipsExportDto>.Success(dto, ResponseMessage.BulkPayslipsArchivePrepared.GetDescription());
    }
}
