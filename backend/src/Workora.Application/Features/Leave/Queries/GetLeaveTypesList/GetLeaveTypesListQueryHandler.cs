using AutoMapper;
using MediatR;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Queries.GetLeaveTypesList;

/// <summary>
/// Handler for <see cref="GetLeaveTypesListQuery"/>.
/// </summary>
public class GetLeaveTypesListQueryHandler : IRequestHandler<GetLeaveTypesListQuery, ApiResponse<IReadOnlyList<LeaveTypeDto>>>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetLeaveTypesListQueryHandler"/> class.
    /// </summary>
    public GetLeaveTypesListQueryHandler(ILeaveRequestRepository leaveRequestRepository, IMapper mapper)
    {
        _leaveRequestRepository = leaveRequestRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<LeaveTypeDto>>> Handle(GetLeaveTypesListQuery request, CancellationToken ct)
    {
        var types = await _leaveRequestRepository.GetLeaveTypesAsync(request.CompanyId, ct);
        var dtos = _mapper.Map<IReadOnlyList<LeaveTypeDto>>(types);
        return ApiResponse<IReadOnlyList<LeaveTypeDto>>.Success(dtos);
    }
}
