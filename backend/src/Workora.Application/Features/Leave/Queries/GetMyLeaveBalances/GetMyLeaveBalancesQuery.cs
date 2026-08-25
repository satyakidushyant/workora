using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Leave.Queries.GetMyLeaveBalances;

/// <summary>
/// Query to retrieve leave balances for the currently authenticated employee.
/// </summary>
public record GetMyLeaveBalancesQuery(int Year = 0) : IRequest<ApiResponse<IReadOnlyList<LeaveBalanceDto>>>;

/// <summary>
/// Handler for <see cref="GetMyLeaveBalancesQuery"/>.
/// </summary>
public class GetMyLeaveBalancesQueryHandler : IRequestHandler<GetMyLeaveBalancesQuery, ApiResponse<IReadOnlyList<LeaveBalanceDto>>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IGenericRepository<User> _userRepository;
    private readonly IGenericRepository<Employee> _employeeRepository;
    private readonly IGenericRepository<LeaveBalance> _balanceRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetMyLeaveBalancesQueryHandler"/> class.
    /// </summary>
    public GetMyLeaveBalancesQueryHandler(
        ICurrentUserService currentUserService,
        IGenericRepository<User> userRepository,
        IGenericRepository<Employee> employeeRepository,
        IGenericRepository<LeaveBalance> balanceRepository)
    {
        _currentUserService = currentUserService;
        _userRepository = userRepository;
        _employeeRepository = employeeRepository;
        _balanceRepository = balanceRepository;
    }

    /// <summary>
    /// Executes fetching caller's leave balances.
    /// </summary>
    public async Task<ApiResponse<IReadOnlyList<LeaveBalanceDto>>> Handle(GetMyLeaveBalancesQuery request, CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;
        int empId = 0;
        if (currentUserId.HasValue && int.TryParse(currentUserId.Value.ToString(), out int uId))
        {
            var emp = await _employeeRepository.GetFirstOrDefaultAsync(e => e.UserId == uId, cancellationToken);
            if (emp != null) empId = emp.Id;
        }

        var balances = _balanceRepository.GetQueryable()
            .Where(b => b.EmployeeId == empId)
            .ToList()
            .Select(b => new LeaveBalanceDto(
                b.Id,
                b.EmployeeId,
                b.LeaveTypeId,
                "Annual Leave",
                "AL",
                b.Year,
                b.AllocatedDays,
                b.UsedDays,
                b.PendingDays,
                b.AvailableDays))
            .ToList();

        return ApiResponse<IReadOnlyList<LeaveBalanceDto>>.Success(balances, "Caller leave balances retrieved successfully.");
    }
}
