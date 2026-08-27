using AutoMapper;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetPayrollRunById;

/// <summary>
/// Handler for <see cref="GetPayrollRunByIdQuery"/>.
/// </summary>
public class GetPayrollRunByIdQueryHandler : IRequestHandler<GetPayrollRunByIdQuery, ApiResponse<PayrollRunDetailDto>>
{
    private readonly IPayrollRepository _payrollRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPayrollRunByIdQueryHandler"/> class.
    /// </summary>
    public GetPayrollRunByIdQueryHandler(IPayrollRepository payrollRepository, IMapper mapper)
    {
        _payrollRepository = payrollRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PayrollRunDetailDto>> Handle(GetPayrollRunByIdQuery request, CancellationToken ct)
    {
        var run = await _payrollRepository.GetWithPayslipsAsync(request.Id, ct);
        if (run == null)
        {
            return ApiResponse<PayrollRunDetailDto>.Fail("Payroll run not found.");
        }

        var dto = _mapper.Map<PayrollRunDetailDto>(run);
        return ApiResponse<PayrollRunDetailDto>.Success(dto);
    }
}
