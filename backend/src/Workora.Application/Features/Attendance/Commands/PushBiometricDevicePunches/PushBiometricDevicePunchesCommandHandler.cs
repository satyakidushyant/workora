using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Commands.PushBiometricDevicePunches;

/// <summary>
/// Handler for <see cref="PushBiometricDevicePunchesCommand"/>.
/// </summary>
public class PushBiometricDevicePunchesCommandHandler : IRequestHandler<PushBiometricDevicePunchesCommand, ApiResponse<int>>
{
    private readonly IGenericRepository<AttendanceRecord> _attendanceRepository;
    private readonly IGenericRepository<Employee> _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="PushBiometricDevicePunchesCommandHandler"/> class.
    /// </summary>
    public PushBiometricDevicePunchesCommandHandler(
        IGenericRepository<AttendanceRecord> attendanceRepository,
        IGenericRepository<Employee> employeeRepository,
        IUnitOfWork unitOfWork)
    {
        _attendanceRepository = attendanceRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Handles processing biometric punch items into daily attendance records.
    /// </summary>
    public async Task<ApiResponse<int>> Handle(PushBiometricDevicePunchesCommand request, CancellationToken cancellationToken)
    {
        int count = 0;
        foreach (var punch in request.Punches)
        {
            var emp = await _employeeRepository.GetFirstOrDefaultAsync(e => e.EmployeeCode == punch.EmployeeCode, cancellationToken);
            if (emp == null) continue;

            var punchDate = DateOnly.FromDateTime(punch.PunchTimestamp.DateTime);
            var record = await _attendanceRepository.GetFirstOrDefaultAsync(
                a => a.EmployeeId == emp.Id && a.AttendanceDate == punchDate, cancellationToken);

            if (record == null)
            {
                record = AttendanceRecord.Create(emp.Id, punchDate, punch.PunchTimestamp, null, AttendanceStatus.Present);
                await _attendanceRepository.AddAsync(record, cancellationToken);
            }

            count++;
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return ApiResponse<int>.Success(count, ResponseMessage.BiometricPunchesIngested.GetDescription());
    }
}
