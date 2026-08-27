using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Commands.ApproveAttendanceCorrection;

/// <summary>
/// Handler for <see cref="ApproveAttendanceCorrectionCommand"/>.
/// </summary>
public class ApproveAttendanceCorrectionCommandHandler : IRequestHandler<ApproveAttendanceCorrectionCommand, ApiResponse<bool>>
{
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="ApproveAttendanceCorrectionCommandHandler"/> class.
    /// </summary>
    public ApproveAttendanceCorrectionCommandHandler(
        IAttendanceRepository attendanceRepository,
        IEmployeeRepository employeeRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _attendanceRepository = attendanceRepository;
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(ApproveAttendanceCorrectionCommand request, CancellationToken ct)
    {
        var correction = await _attendanceRepository.GetCorrectionByIdAsync(request.Id, ct);
        if (correction == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.AttendanceCorrectionNotFound.GetDescription());
        }

        var approverEmployeeId = 0;
        if (_currentUserService.UserId.HasValue)
        {
            var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
            if (user != null)
            {
                var approverEmp = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
                if (approverEmp != null)
                {
                    approverEmployeeId = approverEmp.Id;
                }
            }
        }

        correction.Approve(approverEmployeeId, request.Remarks);

        if (correction.AttendanceRecord != null)
        {
            var newIn = correction.RequestedCheckInTime ?? correction.AttendanceRecord.CheckInTime;
            var newOut = correction.RequestedCheckOutTime ?? correction.AttendanceRecord.CheckOutTime;
            correction.AttendanceRecord.ApplyCorrection(newIn, newOut, AttendanceStatus.Present, 8.0m);
            _attendanceRepository.Update(correction.AttendanceRecord);
        }

        await _unitOfWork.SaveChangesAsync(ct);
        return ApiResponse<bool>.Success(true, ResponseMessage.AttendanceCorrectionApproved.GetDescription());
    }
}
