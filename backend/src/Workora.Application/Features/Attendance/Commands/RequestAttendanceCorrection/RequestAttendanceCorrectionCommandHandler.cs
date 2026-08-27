using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Commands.RequestAttendanceCorrection;

/// <summary>
/// Handler for <see cref="RequestAttendanceCorrectionCommand"/>.
/// </summary>
public class RequestAttendanceCorrectionCommandHandler : IRequestHandler<RequestAttendanceCorrectionCommand, ApiResponse<bool>>
{
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="RequestAttendanceCorrectionCommandHandler"/> class.
    /// </summary>
    public RequestAttendanceCorrectionCommandHandler(
        IAttendanceRepository attendanceRepository,
        IUnitOfWork unitOfWork)
    {
        _attendanceRepository = attendanceRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(RequestAttendanceCorrectionCommand request, CancellationToken ct)
    {
        var record = await _attendanceRepository.GetByIdAsync(request.AttendanceRecordId, ct);
        if (record == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.AttendanceNotFound.GetDescription());
        }

        var correction = AttendanceCorrection.Create(
            request.AttendanceRecordId,
            request.RequestedCheckInTime,
            request.RequestedCheckOutTime,
            request.Reason);

        await _attendanceRepository.AddCorrectionAsync(correction, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.AttendanceCorrectionRequested.GetDescription());
    }
}
