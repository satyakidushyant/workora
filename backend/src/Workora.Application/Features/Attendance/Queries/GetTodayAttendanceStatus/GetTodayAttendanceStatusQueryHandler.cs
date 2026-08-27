using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Queries.GetTodayAttendanceStatus;

/// <summary>
/// Handler for <see cref="GetTodayAttendanceStatusQuery"/>.
/// </summary>
public class GetTodayAttendanceStatusQueryHandler : IRequestHandler<GetTodayAttendanceStatusQuery, ApiResponse<AttendanceRecordDto?>>
{
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetTodayAttendanceStatusQueryHandler"/> class.
    /// </summary>
    public GetTodayAttendanceStatusQueryHandler(
        IAttendanceRepository attendanceRepository,
        IEmployeeRepository employeeRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _attendanceRepository = attendanceRepository;
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<AttendanceRecordDto?>> Handle(GetTodayAttendanceStatusQuery request, CancellationToken ct)
    {
        if (_currentUserService.UserId == null)
        {
            return ApiResponse<AttendanceRecordDto?>.Fail(ResponseMessage.UserContextUnavailable.GetDescription());
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<AttendanceRecordDto?>.Fail(ResponseMessage.UserNotFound.GetDescription());
        }

        var employee = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
        if (employee == null)
        {
            return ApiResponse<AttendanceRecordDto?>.Fail(ResponseMessage.NoEmployeeLinkedToUser.GetDescription());
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var record = await _attendanceRepository.GetByDateAsync(employee.Id, today, ct);
        var dto = record != null ? _mapper.Map<AttendanceRecordDto>(record) : null;

        return ApiResponse<AttendanceRecordDto?>.Success(dto);
    }
}
