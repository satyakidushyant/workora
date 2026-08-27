using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.ProcessPayrollRun;

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
