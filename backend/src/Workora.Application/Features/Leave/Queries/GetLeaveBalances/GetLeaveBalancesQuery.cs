using AutoMapper;
using MediatR;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Queries.GetLeaveBalances;

/// <summary>
/// Query to get leave balance quotas for an employee.
/// </summary>
public record GetLeaveBalancesQuery(
    int EmployeeId,
    int Year) : IRequest<ApiResponse<IReadOnlyList<LeaveBalanceDto>>>;

/// <summary>
/// Handler for <see cref="GetLeaveBalancesQuery"/>.
/// </summary>
public class GetLeaveBalancesQueryHandler : IRequestHandler<GetLeaveBalancesQuery, ApiResponse<IReadOnlyList<LeaveBalanceDto>>>
{
    private readonly ILeaveBalanceRepository _leaveBalanceRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetLeaveBalancesQueryHandler"/> class.
    /// </summary>
    public GetLeaveBalancesQueryHandler(ILeaveBalanceRepository leaveBalanceRepository, IMapper mapper)
    {
        _leaveBalanceRepository = leaveBalanceRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<LeaveBalanceDto>>> Handle(GetLeaveBalancesQuery request, CancellationToken ct)
    {
        var year = request.Year > 0 ? request.Year : DateTime.UtcNow.Year;
        var balances = await _leaveBalanceRepository.GetBalancesAsync(request.EmployeeId, year, ct);
        var dtos = _mapper.Map<IReadOnlyList<LeaveBalanceDto>>(balances);
        return ApiResponse<IReadOnlyList<LeaveBalanceDto>>.Success(dtos);
    }
}
