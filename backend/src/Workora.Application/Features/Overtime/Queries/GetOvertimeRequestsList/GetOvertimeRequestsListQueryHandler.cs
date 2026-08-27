using AutoMapper;
using MediatR;
using Workora.Application.Features.Overtime.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.Queries.GetOvertimeRequestsList;

/// <summary>
/// Handler for <see cref="GetOvertimeRequestsListQuery"/>.
/// </summary>
public class GetOvertimeRequestsListQueryHandler : IRequestHandler<GetOvertimeRequestsListQuery, ApiResponse<PagedResponse<OvertimeRequestDto>>>
{
    private readonly IOvertimeRequestRepository _overtimeRequestRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetOvertimeRequestsListQueryHandler"/> class.
    /// </summary>
    public GetOvertimeRequestsListQueryHandler(IOvertimeRequestRepository overtimeRequestRepository, IMapper mapper)
    {
        _overtimeRequestRepository = overtimeRequestRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<OvertimeRequestDto>>> Handle(GetOvertimeRequestsListQuery request, CancellationToken ct)
    {
        var requests = await _overtimeRequestRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.EmployeeId,
            request.DepartmentId,
            request.Status,
            request.FromDate,
            request.ToDate,
            ct);

        var totalCount = await _overtimeRequestRepository.GetCountAsync(
            request.EmployeeId,
            request.DepartmentId,
            request.Status,
            request.FromDate,
            request.ToDate,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<OvertimeRequestDto>>(requests);
        var paged = new PagedResponse<OvertimeRequestDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<OvertimeRequestDto>>.Success(paged);
    }
}
