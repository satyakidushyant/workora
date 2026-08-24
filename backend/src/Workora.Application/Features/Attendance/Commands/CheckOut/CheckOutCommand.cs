using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Commands.CheckOut;

/// <summary>
/// Command to register the employee's check-out timestamp.
/// </summary>
public record CheckOutCommand(string? Remarks = null) : IRequest<ApiResponse<AttendanceRecordDto>>;

/// <summary>
/// Handler for <see cref="CheckOutCommand"/>.
/// </summary>
public class CheckOutCommandHandler : IRequestHandler<CheckOutCommand, ApiResponse<AttendanceRecordDto>>
{
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CheckOutCommandHandler"/> class.
    /// </summary>
    public CheckOutCommandHandler(
        IAttendanceRepository attendanceRepository,
        IEmployeeRepository employeeRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _attendanceRepository = attendanceRepository;
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<AttendanceRecordDto>> Handle(CheckOutCommand request, CancellationToken ct)
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
        if (existing == null || !existing.CheckInTime.HasValue)
        {
            return ApiResponse<AttendanceRecordDto>.Fail("You must check in first before checking out.");
        }

        existing.CheckOut(now, 8.0m);
        _attendanceRepository.Update(existing);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<AttendanceRecordDto>(existing);
        return ApiResponse<AttendanceRecordDto>.Success(dto, ResponseMessage.AttendanceCheckedOut.GetDescription());
    }
}
