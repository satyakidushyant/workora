using AutoMapper;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetPayslipById;

/// <summary>
/// Handler for <see cref="GetPayslipByIdQuery"/>.
/// </summary>
public class GetPayslipByIdQueryHandler : IRequestHandler<GetPayslipByIdQuery, ApiResponse<PayslipDto>>
{
    private readonly IPayrollRepository _payrollRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPayslipByIdQueryHandler"/> class.
    /// </summary>
    public GetPayslipByIdQueryHandler(IPayrollRepository payrollRepository, IMapper mapper)
    {
        _payrollRepository = payrollRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PayslipDto>> Handle(GetPayslipByIdQuery request, CancellationToken ct)
    {
        var payslip = await _payrollRepository.GetPayslipByIdAsync(request.Id, ct);
        if (payslip == null)
        {
            return ApiResponse<PayslipDto>.Fail("Payslip not found.");
        }

        var dto = _mapper.Map<PayslipDto>(payslip);
        return ApiResponse<PayslipDto>.Success(dto);
    }
}
