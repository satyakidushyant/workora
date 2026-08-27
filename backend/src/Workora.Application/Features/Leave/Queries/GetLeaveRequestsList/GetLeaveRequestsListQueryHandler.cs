using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Queries.GetLeaveRequestsList;

/// <summary>
/// Handler for <see cref="GetLeaveRequestsListQuery"/>.
/// </summary>
public class GetLeaveRequestsListQueryHandler : IRequestHandler<GetLeaveRequestsListQuery, ApiResponse<PagedResponse<LeaveRequestDto>>>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly ITenantResolutionService _tenantResolutionService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetLeaveRequestsListQueryHandler"/> class.
    /// </summary>
    public GetLeaveRequestsListQueryHandler(
        ILeaveRequestRepository leaveRequestRepository,
        ITenantResolutionService tenantResolutionService,
        IMapper mapper)
    {
        _leaveRequestRepository = leaveRequestRepository;
        _tenantResolutionService = tenantResolutionService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<LeaveRequestDto>>> Handle(GetLeaveRequestsListQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);

        var requests = await _leaveRequestRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.EmployeeId,
            request.DepartmentId,
            request.Status,
            request.FromDate,
            request.ToDate,
            targetCompanyId,
            ct);

        var totalCount = await _leaveRequestRepository.GetCountAsync(
            request.EmployeeId,
            request.DepartmentId,
            request.Status,
            request.FromDate,
            request.ToDate,
            targetCompanyId,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<LeaveRequestDto>>(requests);
        var paged = new PagedResponse<LeaveRequestDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<LeaveRequestDto>>.Success(paged);
    }
}
