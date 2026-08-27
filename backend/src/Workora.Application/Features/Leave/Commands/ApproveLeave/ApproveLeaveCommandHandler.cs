using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Commands.ApproveLeave;

/// <summary>
/// Handler for <see cref="ApproveLeaveCommand"/>.
/// </summary>
public class ApproveLeaveCommandHandler : IRequestHandler<ApproveLeaveCommand, ApiResponse<LeaveRequestDto>>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly ILeaveBalanceRepository _leaveBalanceRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="ApproveLeaveCommandHandler"/> class.
    /// </summary>
    public ApproveLeaveCommandHandler(
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
    public async Task<ApiResponse<LeaveRequestDto>> Handle(ApproveLeaveCommand request, CancellationToken ct)
    {
        var leaveRequest = await _leaveRequestRepository.GetWithDetailsAsync(request.Id, ct);
        if (leaveRequest == null)
        {
            return ApiResponse<LeaveRequestDto>.Fail(ResponseMessage.LeaveRequestNotFound.GetDescription());
        }

        if (leaveRequest.Status != LeaveRequestStatus.PendingManagerApproval &&
            leaveRequest.Status != LeaveRequestStatus.PendingHrApproval)
        {
            return ApiResponse<LeaveRequestDto>.Fail(ResponseMessage.LeaveOnlyPendingCanBeApproved.GetDescription());
        }

        var approverEmpId = 0;
        var role = "Manager";
        if (_currentUserService.UserId.HasValue)
        {
            var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
            if (user != null)
            {
                var emp = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
                if (emp != null) approverEmpId = emp.Id;
            }
        }

        var requiresSecondStage = leaveRequest.LeaveType?.RequiresHrApproval ?? false;
        leaveRequest.Approve(approverEmpId, role, requiresSecondStage, request.Comments);

        if (leaveRequest.Status == LeaveRequestStatus.Approved)
        {
            var year = leaveRequest.StartDate.Year;
            var balance = await _leaveBalanceRepository.GetBalanceAsync(leaveRequest.EmployeeId, leaveRequest.LeaveTypeId, year, ct);
            if (balance != null)
            {
                balance.ApplyApproval(leaveRequest.DaysCount);
            }
        }

        _leaveRequestRepository.Update(leaveRequest);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<LeaveRequestDto>(leaveRequest);
        return ApiResponse<LeaveRequestDto>.Success(dto, ResponseMessage.LeaveApproved.GetDescription());
    }
}
