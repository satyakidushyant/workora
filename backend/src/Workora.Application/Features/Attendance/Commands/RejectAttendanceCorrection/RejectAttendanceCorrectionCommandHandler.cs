using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Commands.RejectAttendanceCorrection;

/// <summary>
/// Handler for <see cref="RejectAttendanceCorrectionCommand"/>.
/// </summary>
public class RejectAttendanceCorrectionCommandHandler : IRequestHandler<RejectAttendanceCorrectionCommand, ApiResponse<bool>>
{
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="RejectAttendanceCorrectionCommandHandler"/> class.
    /// </summary>
    public RejectAttendanceCorrectionCommandHandler(
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
    public async Task<ApiResponse<bool>> Handle(RejectAttendanceCorrectionCommand request, CancellationToken ct)
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

        correction.Reject(approverEmployeeId, request.Remarks);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.AttendanceCorrectionRejected.GetDescription());
    }
}
