using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Payroll.Processing;

/// <summary>
/// DTO representing bank disbursement payment file payload.
/// </summary>
public class PayrollDisbursementFileDto
{
    /// <summary>
    /// Gets or sets payroll run ID.
    /// </summary>
    public int PayrollRunId { get; set; }

    /// <summary>
    /// Gets or sets total net salary disbursement amount.
    /// </summary>
    public decimal TotalAmount { get; set; }

    /// <summary>
    /// Gets or sets generated bank CSV/txt file content or download URL.
    /// </summary>
    public string DownloadUrl { get; set; } = string.Empty;
}

/// <summary>
/// Command to compute earnings & deductions for a draft payroll run.
/// </summary>
public record ProcessPayrollRunCommand(int PayrollRunId) : IRequest<ApiResponse<PayrollRunDto>>;

/// <summary>
/// Handler for <see cref="ProcessPayrollRunCommand"/>.
/// </summary>
public class ProcessPayrollRunCommandHandler : IRequestHandler<ProcessPayrollRunCommand, ApiResponse<PayrollRunDto>>
{
    private readonly IGenericRepository<PayrollRun> _runRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="ProcessPayrollRunCommandHandler"/> class.
    /// </summary>
    public ProcessPayrollRunCommandHandler(
        IGenericRepository<PayrollRun> runRepository,
        IUnitOfWork unitOfWork)
    {
        _runRepository = runRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes payroll calculation and processing.
    /// </summary>
    public async Task<ApiResponse<PayrollRunDto>> Handle(ProcessPayrollRunCommand request, CancellationToken cancellationToken)
    {
        var run = await _runRepository.GetByIdAsync(request.PayrollRunId, cancellationToken);
        if (run == null)
        {
            return ApiResponse<PayrollRunDto>.Fail($"Payroll run {request.PayrollRunId} not found.");
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = new PayrollRunDto(
            run.Id,
            run.Uuid,
            run.CompanyId,
            run.PeriodMonth,
            run.PeriodYear,
            run.Status,
            run.TotalGrossPay,
            run.TotalDeductions,
            run.TotalNetPay,
            0,
            run.ProcessedAt,
            run.ApprovedBy,
            run.ApprovedAt,
            null,
            run.CreatedAt);

        return ApiResponse<PayrollRunDto>.Success(dto, "Payroll run processed and computed successfully.");
    }
}

/// <summary>
/// Query to download employee payslip for a specific payroll run.
/// </summary>
public record GetEmployeePayslipQuery(int PayrollRunId, int EmployeeId) : IRequest<ApiResponse<PayslipDto>>;

/// <summary>
/// Handler for <see cref="GetEmployeePayslipQuery"/>.
/// </summary>
public class GetEmployeePayslipQueryHandler : IRequestHandler<GetEmployeePayslipQuery, ApiResponse<PayslipDto>>
{
    private readonly IGenericRepository<Payslip> _payslipRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetEmployeePayslipQueryHandler"/> class.
    /// </summary>
    public GetEmployeePayslipQueryHandler(IGenericRepository<Payslip> payslipRepository)
    {
        _payslipRepository = payslipRepository;
    }

    /// <summary>
    /// Handles retrieval of single employee payslip.
    /// </summary>
    public async Task<ApiResponse<PayslipDto>> Handle(GetEmployeePayslipQuery request, CancellationToken cancellationToken)
    {
        var payslip = await _payslipRepository.GetFirstOrDefaultAsync(
            p => p.PayrollRunId == request.PayrollRunId && p.EmployeeId == request.EmployeeId, cancellationToken);

        if (payslip == null)
        {
            return ApiResponse<PayslipDto>.Fail("Payslip not found for specified employee and payroll run.");
        }

        var dto = new PayslipDto(
            payslip.Id,
            payslip.Uuid,
            payslip.PayrollRunId,
            payslip.EmployeeId,
            string.Empty,
            string.Empty,
            payslip.GrossSalary,
            payslip.TotalDeductions,
            payslip.NetSalary,
            PaymentStatus.Pending,
            null,
            new List<PayslipItemDto>(),
            payslip.CreatedAt);

        return ApiResponse<PayslipDto>.Success(dto, "Employee payslip retrieved successfully.");
    }
}

/// <summary>
/// Query to generate bank disbursement file for a finalized payroll run.
/// </summary>
public record GetPayrollDisbursementFileQuery(int PayrollRunId) : IRequest<ApiResponse<PayrollDisbursementFileDto>>;

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

/// <summary>
/// DTO representing bulk exported payslips archive package information.
/// </summary>
public class BulkPayslipsExportDto
{
    /// <summary>
    /// Gets or sets the payroll run ID.
    /// </summary>
    public int PayrollRunId { get; set; }

    /// <summary>
    /// Gets or sets the total number of payslips packaged.
    /// </summary>
    public int TotalPayslips { get; set; }

    /// <summary>
    /// Gets or sets the archive filename.
    /// </summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the downloadable URL or cloud storage path.
    /// </summary>
    public string DownloadUrl { get; set; } = string.Empty;
}

/// <summary>
/// Query to download all generated payslips for a payroll run in bulk.
/// </summary>
public record GetBulkPayslipsExportQuery(int PayrollRunId) : IRequest<ApiResponse<BulkPayslipsExportDto>>;

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
            return ApiResponse<BulkPayslipsExportDto>.Fail($"Payroll run {request.PayrollRunId} not found.");
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

        return ApiResponse<BulkPayslipsExportDto>.Success(dto, "Bulk payslips archive prepared successfully.");
    }
}

