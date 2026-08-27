using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Commands.CheckIn;

/// <summary>
/// Handler for <see cref="CheckInCommand"/>.
/// </summary>
public class CheckInCommandHandler : IRequestHandler<CheckInCommand, ApiResponse<AttendanceRecordDto>>
{
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly IShiftRepository _shiftRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CheckInCommandHandler"/> class.
    /// </summary>
    public CheckInCommandHandler(
        IAttendanceRepository attendanceRepository,
        IEmployeeRepository employeeRepository,
        IUserRepository userRepository,
        IShiftRepository shiftRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _attendanceRepository = attendanceRepository;
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _shiftRepository = shiftRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<AttendanceRecordDto>> Handle(CheckInCommand request, CancellationToken ct)
    {
        if (_currentUserService.UserId == null)
        {
            return ApiResponse<AttendanceRecordDto>.Fail(ResponseMessage.UserContextUnavailable.GetDescription());
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<AttendanceRecordDto>.Fail(ResponseMessage.UserNotFound.GetDescription());
        }

        var employee = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
        if (employee == null)
        {
            return ApiResponse<AttendanceRecordDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var now = DateTimeOffset.UtcNow;
        var today = DateOnly.FromDateTime(now.DateTime);

        var existing = await _attendanceRepository.GetByDateAsync(employee.Id, today, ct);
        if (existing != null && existing.CheckInTime.HasValue)
        {
            return ApiResponse<AttendanceRecordDto>.Fail("You have already checked in today.");
        }

        var shiftAssignment = await _shiftRepository.GetActiveAssignmentAsync(employee.Id, today, ct);
        var status = AttendanceStatus.Present;

        if (shiftAssignment?.Shift != null)
        {
            var shiftStart = shiftAssignment.Shift.StartTime;
            var currentTimeOnly = TimeOnly.FromTimeSpan(now.TimeOfDay);
            var graceThreshold = shiftStart.AddMinutes(shiftAssignment.Shift.GracePeriodMinutes);

            if (currentTimeOnly > graceThreshold)
            {
                status = AttendanceStatus.Late;
            }
        }

        AttendanceRecord record;
        if (existing != null)
        {
            existing.CheckIn(now, status);
            _attendanceRepository.Update(existing);
            record = existing;
        }
        else
        {
            record = AttendanceRecord.Create(
                employee.Id,
                today,
                now,
                null,
                status,
                0,
                0,
                shiftAssignment?.ShiftId,
                request.Remarks);

            await _attendanceRepository.AddAsync(record, ct);
        }

        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<AttendanceRecordDto>(record);
        return ApiResponse<AttendanceRecordDto>.Success(dto, ResponseMessage.AttendanceCheckedIn.GetDescription());
    }
}
