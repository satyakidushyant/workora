using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Commands.ApplyLeave;

/// <summary>
/// Handler for <see cref="ApplyLeaveCommand"/>.
/// </summary>
public class ApplyLeaveCommandHandler : IRequestHandler<ApplyLeaveCommand, ApiResponse<LeaveRequestDto>>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly ILeaveBalanceRepository _leaveBalanceRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="ApplyLeaveCommandHandler"/> class.
    /// </summary>
    public ApplyLeaveCommandHandler(
        ILeaveRequestRepository leaveRequestRepository,
        ILeaveBalanceRepository leaveBalanceRepository,
        IEmployeeRepository employeeRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _leaveRequestRepository = leaveRequestRepository;
        _leaveBalanceRepository = leaveBalanceRepository;
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<LeaveRequestDto>> Handle(ApplyLeaveCommand request, CancellationToken ct)
    {
        if (_currentUserService.UserId == null)
        {
            return ApiResponse<LeaveRequestDto>.Fail(ResponseMessage.UserContextUnavailable.GetDescription());
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<LeaveRequestDto>.Fail(ResponseMessage.UserNotFound.GetDescription());
        }

        var employee = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
        if (employee == null)
        {
            return ApiResponse<LeaveRequestDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var leaveType = await _leaveRequestRepository.GetLeaveTypeByIdAsync(request.LeaveTypeId, ct);
        if (leaveType == null)
        {
            return ApiResponse<LeaveRequestDto>.Fail(ResponseMessage.LeaveTypeNotFound.GetDescription());
        }

        var hasOverlap = await _leaveRequestRepository.HasOverlappingApprovedLeaveAsync(employee.Id, request.StartDate, request.EndDate, null, ct);
        if (hasOverlap)
        {
            return ApiResponse<LeaveRequestDto>.Fail(ResponseMessage.LeaveAlreadyRequestedForRange.GetDescription());
        }

        var year = request.StartDate.Year;
        var balance = await _leaveBalanceRepository.GetBalanceAsync(employee.Id, request.LeaveTypeId, year, ct);

        if (!leaveType.AllowNegativeBalance)
        {
            var available = balance?.AvailableDays ?? leaveType.AnnualQuota;
            if (available < request.DaysCount)
            {
                return ApiResponse<LeaveRequestDto>.Fail(ResponseMessage.InsufficientLeaveBalance.GetDescription());
            }
        }

        if (balance == null)
        {
            balance = LeaveBalance.Create(employee.Id, request.LeaveTypeId, year, leaveType.AnnualQuota);
            await _leaveBalanceRepository.AddAsync(balance, ct);
        }

        balance.ReserveDays(request.DaysCount);

        var leaveRequest = LeaveRequest.Create(
            employee.Id,
            request.LeaveTypeId,
            request.StartDate,
            request.EndDate,
            request.DaysCount,
            request.Reason);

        await _leaveRequestRepository.AddAsync(leaveRequest, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var loaded = await _leaveRequestRepository.GetWithDetailsAsync(leaveRequest.Id, ct);
        var dto = _mapper.Map<LeaveRequestDto>(loaded ?? leaveRequest);
        return ApiResponse<LeaveRequestDto>.Success(dto, ResponseMessage.LeaveApplied.GetDescription());
    }
}
