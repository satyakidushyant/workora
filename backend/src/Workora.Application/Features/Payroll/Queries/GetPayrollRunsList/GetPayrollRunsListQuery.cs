using AutoMapper;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetPayrollRunsList;

/// <summary>
/// Query to retrieve a paginated list of payroll run cycles.
/// </summary>
public record GetPayrollRunsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    int? CompanyId = null,
    PayrollStatus? Status = null) : IRequest<ApiResponse<PagedResponse<PayrollRunDto>>>;

/// <summary>
/// Handler for <see cref="GetPayrollRunsListQuery"/>.
/// </summary>
public class GetPayrollRunsListQueryHandler : IRequestHandler<GetPayrollRunsListQuery, ApiResponse<PagedResponse<PayrollRunDto>>>
{
    private readonly IPayrollRepository _payrollRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPayrollRunsListQueryHandler"/> class.
    /// </summary>
    public GetPayrollRunsListQueryHandler(IPayrollRepository payrollRepository, IMapper mapper)
    {
        _payrollRepository = payrollRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<PayrollRunDto>>> Handle(GetPayrollRunsListQuery request, CancellationToken ct)
    {
        var runs = await _payrollRepository.GetPagedRunsAsync(request.PageNumber, request.PageSize, request.CompanyId, request.Status, ct);
        var totalCount = await _payrollRepository.GetRunsCountAsync(request.CompanyId, request.Status, ct);

        var dtos = _mapper.Map<IReadOnlyList<PayrollRunDto>>(runs);
        var paged = new PagedResponse<PayrollRunDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<PayrollRunDto>>.Success(paged);
    }
}
