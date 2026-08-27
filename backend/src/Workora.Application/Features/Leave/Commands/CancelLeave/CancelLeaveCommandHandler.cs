using AutoMapper;
using MediatR;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Commands.CancelLeave;

/// <summary>
/// Handler for <see cref="CancelLeaveCommand"/>.
/// </summary>
public class CancelLeaveCommandHandler : IRequestHandler<CancelLeaveCommand, ApiResponse<LeaveRequestDto>>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly ILeaveBalanceRepository _leaveBalanceRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CancelLeaveCommandHandler"/> class.
    /// </summary>
    public CancelLeaveCommandHandler(
        ILeaveRequestRepository leaveRequestRepository,
        ILeaveBalanceRepository leaveBalanceRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _leaveRequestRepository = leaveRequestRepository;
        _leaveBalanceRepository = leaveBalanceRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<LeaveRequestDto>> Handle(CancelLeaveCommand request, CancellationToken ct)
    {
        var leaveRequest = await _leaveRequestRepository.GetWithDetailsAsync(request.Id, ct);
        if (leaveRequest == null)
        {
            return ApiResponse<LeaveRequestDto>.Fail(ResponseMessage.LeaveRequestNotFound.GetDescription());
        }

        if (leaveRequest.Status == LeaveRequestStatus.Cancelled || leaveRequest.Status == LeaveRequestStatus.Rejected)
        {
            return ApiResponse<LeaveRequestDto>.Fail("This leave request is already closed.");
        }

        var wasApproved = leaveRequest.Status == LeaveRequestStatus.Approved;
        leaveRequest.Cancel();

        var year = leaveRequest.StartDate.Year;
        var balance = await _leaveBalanceRepository.GetBalanceAsync(leaveRequest.EmployeeId, leaveRequest.LeaveTypeId, year, ct);
        if (balance != null)
        {
            if (wasApproved)
            {
                // Refund used days back to balance
                balance.ApplyApproval(-leaveRequest.DaysCount);
            }
            else
            {
                balance.ReleaseDays(leaveRequest.DaysCount);
            }
        }

        _leaveRequestRepository.Update(leaveRequest);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<LeaveRequestDto>(leaveRequest);
        return ApiResponse<LeaveRequestDto>.Success(dto, ResponseMessage.LeaveCancelled.GetDescription());
    }
}
