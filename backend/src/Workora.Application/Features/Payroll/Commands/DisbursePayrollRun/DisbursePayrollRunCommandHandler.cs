using AutoMapper;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.DisbursePayrollRun;

/// <summary>
/// Handler for <see cref="DisbursePayrollRunCommand"/>.
/// </summary>
public class DisbursePayrollRunCommandHandler : IRequestHandler<DisbursePayrollRunCommand, ApiResponse<PayrollRunDto>>
{
    private readonly IPayrollRepository _payrollRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="DisbursePayrollRunCommandHandler"/> class.
    /// </summary>
    public DisbursePayrollRunCommandHandler(
        IPayrollRepository payrollRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _payrollRepository = payrollRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PayrollRunDto>> Handle(DisbursePayrollRunCommand request, CancellationToken ct)
    {
        var run = await _payrollRepository.GetWithPayslipsAsync(request.Id, ct);
        if (run == null)
        {
            return ApiResponse<PayrollRunDto>.Fail(ResponseMessage.PayrollRunNotFound.GetDescription());
        }

        if (run.Status != PayrollStatus.Approved)
        {
            return ApiResponse<PayrollRunDto>.Fail("Only approved payroll runs can be disbursed.");
        }

        run.Disburse();
        _payrollRepository.Update(run);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<PayrollRunDto>(run);
        return ApiResponse<PayrollRunDto>.Success(dto, ResponseMessage.PayrollRunDisbursed.GetDescription());
    }
}
