using MediatR;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Queries.GetLeaveCalendar;

/// <summary>
/// Query to retrieve scheduled approved leaves for calendar visualization.
/// </summary>
public record GetLeaveCalendarQuery(
    DateOnly StartDate,
    DateOnly EndDate,
    int? DepartmentId = null) : IRequest<ApiResponse<IReadOnlyList<LeaveCalendarItemDto>>>;

/// <summary>
/// Handler for <see cref="GetLeaveCalendarQuery"/>.
/// </summary>
public class GetLeaveCalendarQueryHandler : IRequestHandler<GetLeaveCalendarQuery, ApiResponse<IReadOnlyList<LeaveCalendarItemDto>>>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetLeaveCalendarQueryHandler"/> class.
    /// </summary>
    public GetLeaveCalendarQueryHandler(ILeaveRequestRepository leaveRequestRepository)
    {
        _leaveRequestRepository = leaveRequestRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<LeaveCalendarItemDto>>> Handle(GetLeaveCalendarQuery request, CancellationToken ct)
    {
        var leaves = await _leaveRequestRepository.GetCalendarListAsync(request.StartDate, request.EndDate, request.DepartmentId, ct);

        var items = leaves.Select(l => new LeaveCalendarItemDto(
            l.Id,
            l.EmployeeId,
            l.Employee != null ? $"{l.Employee.FirstName} {l.Employee.LastName}".Trim() : string.Empty,
            l.LeaveType != null ? l.LeaveType.Name : string.Empty,
            l.StartDate,
            l.EndDate,
            l.DaysCount,
            l.Status
        )).ToList();

        return ApiResponse<IReadOnlyList<LeaveCalendarItemDto>>.Success(items);
    }
}
