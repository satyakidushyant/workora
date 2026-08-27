using FluentValidation;
using MediatR;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Commands.BulkImportAttendance;

/// <summary>
/// Handler for <see cref="BulkImportAttendanceCommand"/>.
/// </summary>
public class BulkImportAttendanceCommandHandler : IRequestHandler<BulkImportAttendanceCommand, ApiResponse<int>>
{
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="BulkImportAttendanceCommandHandler"/> class.
    /// </summary>
    public BulkImportAttendanceCommandHandler(
        IAttendanceRepository attendanceRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork)
    {
        _attendanceRepository = attendanceRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<int>> Handle(BulkImportAttendanceCommand request, CancellationToken ct)
    {
        var importedCount = 0;
        var newRecords = new List<AttendanceRecord>();

        foreach (var item in request.Records)
        {
            var employees = await _employeeRepository.GetPagedListAsync(1, 1, searchTerm: item.EmployeeCode, ct: ct);
            var employee = employees.FirstOrDefault(e => e.EmployeeCode.Equals(item.EmployeeCode, StringComparison.OrdinalIgnoreCase));
            if (employee == null) continue;

            var existing = await _attendanceRepository.GetByDateAsync(employee.Id, item.AttendanceDate, ct);
            if (existing != null)
            {
                if (item.CheckInTime.HasValue)
                {
                    existing.CheckIn(item.CheckInTime.Value, AttendanceStatus.Present);
                }
                if (item.CheckOutTime.HasValue)
                {
                    existing.CheckOut(item.CheckOutTime.Value, 8.0m);
                }
                _attendanceRepository.Update(existing);
            }
            else
            {
                var record = AttendanceRecord.Create(
                    employee.Id,
                    item.AttendanceDate,
                    item.CheckInTime,
                    item.CheckOutTime,
                    AttendanceStatus.Present,
                    0,
                    0,
                    null,
                    item.Remarks);

                if (item.CheckInTime.HasValue && item.CheckOutTime.HasValue)
                {
                    record.CheckOut(item.CheckOutTime.Value, 8.0m);
                }

                newRecords.Add(record);
            }
            importedCount++;
        }

        if (newRecords.Count > 0)
        {
            await _attendanceRepository.BulkAddAsync(newRecords, ct);
        }

        await _unitOfWork.SaveChangesAsync(ct);
        return ApiResponse<int>.Success(importedCount, $"{importedCount} attendance records imported successfully.");
    }
}
