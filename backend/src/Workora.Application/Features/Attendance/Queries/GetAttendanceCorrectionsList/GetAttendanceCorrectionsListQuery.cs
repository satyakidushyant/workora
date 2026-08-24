using AutoMapper;
using MediatR;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Queries.GetAttendanceCorrectionsList;

/// <summary>
/// Query to retrieve a paginated list of attendance correction requests.
/// </summary>
public record GetAttendanceCorrectionsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    CorrectionStatus? Status = null) : IRequest<ApiResponse<PagedResponse<AttendanceCorrectionDto>>>;

/// <summary>
/// Handler for <see cref="GetAttendanceCorrectionsListQuery"/>.
/// </summary>
public class GetAttendanceCorrectionsListQueryHandler : IRequestHandler<GetAttendanceCorrectionsListQuery, ApiResponse<PagedResponse<AttendanceCorrectionDto>>>
{
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetAttendanceCorrectionsListQueryHandler"/> class.
    /// </summary>
    public GetAttendanceCorrectionsListQueryHandler(IAttendanceRepository attendanceRepository, IMapper mapper)
    {
        _attendanceRepository = attendanceRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<AttendanceCorrectionDto>>> Handle(GetAttendanceCorrectionsListQuery request, CancellationToken ct)
    {
        var corrections = await _attendanceRepository.GetCorrectionsPagedAsync(request.PageNumber, request.PageSize, request.Status, ct);
        var totalCount = await _attendanceRepository.GetCorrectionsCountAsync(request.Status, ct);

        var dtos = _mapper.Map<IReadOnlyList<AttendanceCorrectionDto>>(corrections);
        var paged = new PagedResponse<AttendanceCorrectionDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<AttendanceCorrectionDto>>.Success(paged);
    }
}
