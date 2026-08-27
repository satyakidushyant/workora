using AutoMapper;
using MediatR;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Queries.GetAttendanceHistory;

/// <summary>
/// Handler for <see cref="GetAttendanceHistoryQuery"/>.
/// </summary>
public class GetAttendanceHistoryQueryHandler : IRequestHandler<GetAttendanceHistoryQuery, ApiResponse<IReadOnlyList<AttendanceRecordDto>>>
{
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetAttendanceHistoryQueryHandler"/> class.
    /// </summary>
    public GetAttendanceHistoryQueryHandler(IAttendanceRepository attendanceRepository, IMapper mapper)
    {
        _attendanceRepository = attendanceRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<AttendanceRecordDto>>> Handle(GetAttendanceHistoryQuery request, CancellationToken ct)
    {
        var records = await _attendanceRepository.GetHistoryAsync(request.EmployeeId, request.StartDate, request.EndDate, ct);
        var dtos = _mapper.Map<IReadOnlyList<AttendanceRecordDto>>(records);
        return ApiResponse<IReadOnlyList<AttendanceRecordDto>>.Success(dtos);
    }
}
