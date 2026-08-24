using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Queries.GetTodayAttendanceStatus;

/// <summary>
/// Query to get the caller's check-in / check-out status for today.
/// </summary>
public record GetTodayAttendanceStatusQuery : IRequest<ApiResponse<AttendanceRecordDto?>>;

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
            return ApiResponse<AttendanceRecordDto?>.Fail("User context not found.");
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<AttendanceRecordDto?>.Fail("User not found.");
        }

        var employee = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
        if (employee == null)
        {
            return ApiResponse<AttendanceRecordDto?>.Fail("No employee linked to this account.");
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var record = await _attendanceRepository.GetByDateAsync(employee.Id, today, ct);
        var dto = record != null ? _mapper.Map<AttendanceRecordDto>(record) : null;

        return ApiResponse<AttendanceRecordDto?>.Success(dto);
    }
}
