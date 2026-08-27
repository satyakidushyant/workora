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
