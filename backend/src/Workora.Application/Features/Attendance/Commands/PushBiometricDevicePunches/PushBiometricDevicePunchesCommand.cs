using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Attendance.Commands.PushBiometricDevicePunches;

/// <summary>
/// DTO representing a raw punch record from a hardware biometric machine.
/// </summary>
public record BiometricPunchItemDto(
    string EmployeeCode,
    DateTimeOffset PunchTimestamp,
    string PunchType,
    string? DeviceId);

/// <summary>
/// Command to ingest punch logs pushed from biometric hardware terminals.
/// </summary>
public record PushBiometricDevicePunchesCommand(List<BiometricPunchItemDto> Punches) : IRequest<ApiResponse<int>>;

/// <summary>
/// Validator for <see cref="PushBiometricDevicePunchesCommand"/>.
/// </summary>
public class PushBiometricDevicePunchesCommandValidator : AbstractValidator<PushBiometricDevicePunchesCommand>
{
    /// <summary>
    /// Initializes validation rules for PushBiometricDevicePunchesCommand.
    /// </summary>
    public PushBiometricDevicePunchesCommandValidator()
    {
        RuleFor(x => x.Punches).NotEmpty().WithMessage("Biometric punch batch cannot be empty.");
    }
}

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
        return ApiResponse<int>.Success(count, $"{count} biometric punches ingested successfully.");
    }
}
