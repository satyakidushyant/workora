using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetEmployeePayslip;

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
            return ApiResponse<PayslipDto>.Fail(ResponseMessage.PayslipNotFound.GetDescription());
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

        return ApiResponse<PayslipDto>.Success(dto, ResponseMessage.PayslipRetrieved.GetDescription());
    }
}
