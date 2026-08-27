using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetPayrollRunsList;

/// <summary>
/// Handler for <see cref="GetPayrollRunsListQuery"/>.
/// </summary>
public class GetPayrollRunsListQueryHandler : IRequestHandler<GetPayrollRunsListQuery, ApiResponse<PagedResponse<PayrollRunDto>>>
{
    private readonly IPayrollRepository _payrollRepository;
    private readonly ITenantResolutionService _tenantResolutionService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPayrollRunsListQueryHandler"/> class.
    /// </summary>
    public GetPayrollRunsListQueryHandler(
        IPayrollRepository payrollRepository,
        ITenantResolutionService tenantResolutionService,
        IMapper mapper)
    {
        _payrollRepository = payrollRepository;
        _tenantResolutionService = tenantResolutionService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<PayrollRunDto>>> Handle(GetPayrollRunsListQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);

        var runs = await _payrollRepository.GetPagedRunsAsync(request.PageNumber, request.PageSize, targetCompanyId, request.Status, ct);
        var totalCount = await _payrollRepository.GetRunsCountAsync(targetCompanyId, request.Status, ct);

        var dtos = _mapper.Map<IReadOnlyList<PayrollRunDto>>(runs);
        var paged = new PagedResponse<PayrollRunDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<PayrollRunDto>>.Success(paged);
    }
}
